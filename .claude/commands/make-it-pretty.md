---
description: Add interactive widgets, charts, quizzes, and checklists to a blog post to make it engaging and fun to read. Run this every time a new post is added or an existing post is updated.
---

# Make it Pretty

You are enhancing a blog post to be visually rich, interactive, and engaging. Your job is to add cool widgets and interactive elements that make the content fun to read — not just informative.

## Available Components

These Astro components exist in `src/components/` and can be imported into any MDX post:

| Component | What it does | When to use |
|-----------|-------------|-------------|
| `StatsRow` | Responsive grid of key metrics with gradient text | Opening section — hook the reader with data |
| `BarChart` | Animated horizontal bar chart (scroll-triggered) | Scoring, comparisons, rankings |
| `PullQuote` | Large stylized blockquote | Highlight a surprising or important statement |
| `InsightBox` | Colored callout (tip/warning/insight/data) | Actionable advice, warnings, data callouts |
| `ExpertQuote` | Quote with expert avatar and attribution | Authority/credibility moments |
| `TakeawaysBox` | Dark box with bullet list of key takeaways | End of post — summary |
| `VersusCards` | Three-column A vs B comparison | Head-to-head comparisons |
| `DecisionQuiz` | Multi-question interactive quiz with scored results | Decision-support, engagement, "should I do X?" |
| `InteractiveChecklist` | Persistent checklist with localStorage + progress bar | Actionable frameworks, evaluation criteria |
| `Sources` | Numbered reference links | Citations at the bottom |

## Step 1: Apply future search findings (if available)

Before adding widgets, check if a future_search has been run for this post. If research data exists, **weave the findings into the article prose first**:

1. **Original data framing** — add specific claims backed by research (e.g., "We analysed 50 profiles and found...")
2. **Entity disambiguation** — if the research flagged naming confusion, clarify in the text
3. **SERP gap exploitation** — strengthen sections where competitors are weak based on the research
4. **Stats and claims** — update or add data points from live SERP findings
5. **Competitor weaknesses** — address gaps that no other ranking page covers
6. **Freshness signals** — add "Last verified" dates and quarterly review notes for volatile data

This is the most important step. Widgets enhance presentation, but the prose improvements are what drive ranking and authority.

## Step 2: Add interactive widgets

### Rules

1. **Read the full blog post first** before making changes
2. **Every post MUST have at minimum**: StatsRow, BarChart, PullQuote, InsightBox, ExpertQuote, TakeawaysBox
3. **Add a DecisionQuiz** whenever the post involves a decision (hiring, choosing, evaluating, comparing). Make the questions genuinely useful — not fluff
4. **Add an InteractiveChecklist** whenever the post has a framework, evaluation criteria, or step-by-step process the reader should follow
5. **Don't duplicate** — if a component already exists and covers the content well, leave it. Enhance or replace only if you can make it meaningfully better
6. **Placement matters** — space widgets throughout the post to break up prose. Don't cluster them all at the top or bottom
7. **Content quality** — widget content must be substantive and specific to the topic. No generic filler
8. **Import only what you use** — add imports at the top of the MDX file for any new components

## After you finish

**IMPORTANT: Always run QA after making changes.** Start the dev server if not running, then execute the Playwright blog QA tests to verify nothing is broken:

```
npm run dev & sleep 5 && npx playwright test tests/blog-qa.spec.ts
```

Fix any failures before considering the task done.

## Input

The user will specify which blog post to enhance, either by:
- File path (e.g., `src/content/posts/some-post.mdx`)
- Blog URL slug (e.g., `/blog/some-post/`)
- Or just saying "this post" if one was recently discussed

If no post is specified, ask which post to enhance.
