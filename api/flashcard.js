const Anthropic = require('@anthropic-ai/sdk')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end()
  const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
  const { text } = req.body
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{ role: 'user', content: `Create 8 flashcards from this text. Return ONLY a JSON array. Each object: {"front":"question","back":"answer"}\n\n${text?.slice(0, 6000)}` }]
    })
    const raw = msg.content[0].text.replace(/```json|```/g, '').trim()
    res.json({ flashcards: JSON.parse(raw) })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}