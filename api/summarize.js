const Anthropic = require('@anthropic-ai/sdk')

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end()
  const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })
  const { text } = req.body
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{ role: 'user', content: `Summarize these notes clearly. Use ## headers and - bullets. End with ## Key Takeaways.\n\n${text?.slice(0, 8000)}` }]
    })
    res.json({ summary: msg.content[0].text })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}