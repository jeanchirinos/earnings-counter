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

const client = new Anthropic()

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 8192,
  thinking: { type: 'adaptive' },
  system: `You are a senior software engineer reviewing a Vue 3 + TypeScript project (Pinia, Tailwind v4, Vitest).
Analyze the git diff and provide clear, actionable feedback.

Focus on:
- Correctness issues and bugs
- Security vulnerabilities
- Performance problems
- Consistency with existing code style
- Missing error handling or edge cases
- TypeScript type safety

Format: Markdown. Start with a one-paragraph summary.
Group findings by severity:
- 🔴 **Critical** — bugs, security issues, breaks functionality
- 🟡 **Warning** — potential problems worth fixing
- 🟢 **Suggestion** — improvements, style consistency

Only include sections that have findings. If the change looks good, say so briefly.`,
  messages: [
    {
      role: 'user',
      content: `Review this pull request:\n\n\`\`\`diff\n${diff}\n\`\`\``,
    },
  ],
})

const review = response.content
  .filter((block) => block.type === 'text')
  .map((block) => block.text)
  .join('\n\n')

writeFileSync(outputPath, `## 🤖 Claude Code Review\n\n${review}`)
