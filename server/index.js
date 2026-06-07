require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { PdfReader } = require('pdfreader')
const Anthropic = require('@anthropic-ai/sdk').default

const app = express()
const client = new Anthropic()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

app.use(cors())
app.use(express.json())

// Helper: extract text from PDF buffer
function extractPdfText(buffer) {
  return new Promise((resolve, reject) => {
    let text = ''
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) reject(err)
      else if (!item) resolve(text)
      else if (item.text) text += item.text + ' '
    })
  })
}

// ─── SUMMARIZE ────────────────────────────────────────────────
app.post('/summarize', upload.single('pdf'), async (req, res) => {
  try {
    let text = ''
    if (req.file) {
      text = await extractPdfText(req.file.buffer)
      if (!text.trim()) return res.status(400).json({ error: 'Could not extract text from this PDF.' })
    } else {
      text = req.body.text
      if (!text?.trim()) return res.status(400).json({ error: 'No text provided' })
    }
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `You are a study assistant. Summarize the following notes clearly.
Use ## for section headers and - for bullet points.
At the end add a ## Key Takeaways section with 3-5 bullet points.

Notes:
${text.slice(0, 8000)}`
      }]
    })
    res.json({ summary: msg.content[0].text })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ─── CHAT ─────────────────────────────────────────────────────
app.post('/chat', async (req, res) => {
  const { messages } = req.body
  if (!messages?.length) return res.status(400).json({ error: 'No messages provided' })
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You are a helpful, patient study tutor. Explain concepts clearly using simple language and examples. Walk through problems step by step.',
      messages
    })
    res.json({ reply: msg.content[0].text })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// ─── QUIZ ─────────────────────────────────────────────────────
app.post('/quiz', async (req, res) => {
  const { topic, numQuestions = 5 } = req.body
  if (!topic?.trim()) return res.status(400).json({ error: 'No topic provided' })
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Generate exactly ${numQuestions} multiple-choice quiz questions about "${topic}".
Return ONLY a valid JSON array, no explanation, no markdown, no backticks.
Each object must have: "question", "options" (object with keys a/b/c/d), "answer" (one of a/b/c/d).
Example: [{"question":"What is X?","options":{"a":"...","b":"...","c":"...","d":"..."},"answer":"b"}]`
      }]
    })
    const raw = msg.content[0].text.replace(/```json|```/g, '').trim()
    res.json({ quiz: JSON.parse(raw) })
  } catch (e) {
    res.status(500).json({ error: 'Quiz generation failed: ' + e.message })
  }
})

// ─── START ────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
// ─── FLASHCARDS ───────────────────────────────────────────────
app.post('/flashcards', async (req, res) => {
  const { text } = req.body
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' })
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `You are a study assistant. Create exactly 8 flashcards from the following text.
Return ONLY a valid JSON array, no explanation, no markdown, no backticks.
Each object must have:
- "front": a clear question or term (max 15 words)
- "back": a concise answer or definition (max 40 words)

Text:
${text.slice(0, 6000)}`
      }]
    })
    const raw = msg.content[0].text.replace(/```json|```/g, '').trim()
    res.json({ flashcards: JSON.parse(raw) })
  } catch (e) {
    res.status(500).json({ error: 'Failed to generate flashcards: ' + e.message })
  }
})
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))