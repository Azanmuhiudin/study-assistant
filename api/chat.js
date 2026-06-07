const Anthropic = require('@anthropic-ai/sdk')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end()
  const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
  const { messages } = req.body
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You are a helpful, patient study tutor. Explain concepts clearly.',
      messages
    })
    res.json({ reply: msg.content[0].text })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}