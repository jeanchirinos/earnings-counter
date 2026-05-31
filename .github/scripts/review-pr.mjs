import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync } from 'fs'

const MAX_DIFF_CHARS = 100_000

const diffPath = process.env.PR_DIFF_PATH
const outputPath = process.env.REVIEW_OUTPUT_PATH

let diff = readFileSync(diffPath, 'utf8')

if (!diff.trim()) {
  writeFileSync(outputPath, '_No code changes to review._')
  process.exit(0)
}

if (diff.length > MAX_DIFF_CHARS) {
  diff = diff.slice(0, MAX_DIFF_CHARS) + '\n\n... (diff truncated — too large)'
}

const systemPrompt = `You are a senior software engineer reviewing a Vue 3 + TypeScript project (Pinia, Tailwind v4, Vitest).

Review the diff for real problems only. Be ruthlessly concise.

WHAT TO FLAG:
- 🔴 Actual bugs, broken logic, security holes, data loss risks
- 🟡 Likely problems under real conditions (race conditions, unhandled edge cases)
- 🟢 Meaningful improvements only (not style preferences)

DO NOT flag:
- Missing documentation or README updates
- Missing tests (unless the change breaks existing ones)
- "Add validation" unless the missing validation causes a real bug
- Style, naming, or formatting opinions
- Hypothetical future problems
- Things already handled by the framework or runtime

OUTPUT FORMAT — one line per finding, nothing else:
🔴 \`file:line\` — problem. Fix: solution.
🟡 \`file:line\` — problem. Fix: solution.
🟢 \`file:line\` — problem. Fix: solution.

Rules:
- Max 5 findings total. Fewer is better.
- No intro paragraph. No conclusion. No headers. No bullet nesting.
- If there are no real issues: respond with exactly "✅ Looks good."
- Each finding must be one line only.`

const userMessage = `Review this pull request:\n\n\`\`\`diff\n${diff}\n\`\`\``

async function reviewWithClaude() {
  const client = new Anthropic()

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    thinking: { type: 'enabled', budget_tokens: 5000 },
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const reviewText = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n\n')

  return { reviewText, provider: 'Claude' }
}

async function reviewWithGitHubModels() {
  const response = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 8192,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`GitHub Models API error ${response.status}: ${errorBody}`)
  }

  const data = await response.json()
  const reviewText = data.choices[0].message.content

  return { reviewText, provider: 'GPT-4o (GitHub Models)' }
}

const useClaudeApi = Boolean(process.env.ANTHROPIC_API_KEY?.trim())

try {
  const { reviewText, provider } = useClaudeApi
    ? await reviewWithClaude()
    : await reviewWithGitHubModels()

  writeFileSync(outputPath, `## 🤖 AI Code Review (${provider})\n\n${reviewText}`)
} catch (error) {
  writeFileSync(outputPath, `## 🤖 AI Code Review\n\n⚠️ Review failed: ${error.message}`)
  process.exit(1)
}
