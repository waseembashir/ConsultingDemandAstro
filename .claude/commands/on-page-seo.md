---
description: Run on-page SEO checks and internal linking on a blog post. Run this after make-it-pretty and before QA.
---

# On-Page SEO

You are running on-page SEO optimisation on a blog post (or all posts). This includes internal linking using a pillar/cluster framework, and basic on-page SEO hygiene.

## Pillar/Cluster Architecture

The site uses 5 pillar posts. Every post belongs to one cluster and should link to its pillar + 1-2 sibling posts. Pillars link down to their clusters.

| Cluster | Pillar Post | Category |
|---------|------------|----------|
| Hiring Hub | `how-to-hire-a-consultant` | Hiring Guides |
| Strategy Hub | `strategy-consulting-101` | Strategy |
| Marketing Hub | `marketing-branding-consultant` | Marketing Consulting |
| Operations Hub | `operations-consultant-guide` | Operations / Ops Consulting |
| Tech Hub | `when-to-hire-tech-consultant` | Tech Consulting / Technology |

### Cluster Membership

**Hiring Hub:** what-makes-a-good-consultant, consultant-day-rates-2024, can-you-trust-clutch-consulting, how-consulting-pricing-works-ai, business-consultant-vs-a-business-coach, pros-and-cons-of-consulting, consulting-benefits, what-does-a-dental-consultant-do, legal-consultants-vs-lawyers

**Strategy Hub:** strategy-vs-management-consulting, advisory-vs-consulting, audit-vs-consulting, strategist-vs-consultant, difference-between-agency-and-consultancy, business-consultant-vs-management-consultant, management-consultant-hiring-guide

**Marketing Hub:** small-business-branding-consultant, inbound-marketing-consulting, link-building-consulting, fractional-cmo-vs-full-time-cmo

**Operations Hub:** business-efficiency-consultant, quality-management-consulting, effective-remote-workspace-setup

**Tech Hub:** how-to-hire-an-ai-consultant, data-analyst-consultant, amazon-marketplace-consultant

## What to Do

### Step 1: Determine scope

- If the user specifies a post: run on that post only
- If the user says "all posts" or doesn't specify: run across all posts in `src/content/posts/`

### Step 2: Internal linking

For each post being processed:

1. **Read the full post** to understand existing internal links
2. **Identify which cluster** the post belongs to (by category/tags/content)
3. **Add 2-4 internal links** following these rules:
   - Link TO the pillar post for the cluster
   - Link TO 1-2 sibling posts in the same cluster
   - Add a cross-cluster link to the Hiring Hub pillar (`how-to-hire-a-consultant`) if contextually relevant — it's the site's authority centre
   - For pillar posts: link DOWN to 4-6 cluster posts

4. **Link placement rules:**
   - Place links within EXISTING prose — reword slightly if needed for natural flow
   - Use descriptive anchor text (not "click here" or "read more")
   - Don't add links in headings or inside component props (StatsRow, InsightBox body, etc.)
   - Don't cluster multiple links in the same paragraph
   - Space links throughout the post
   - Don't duplicate links already present in the file
   - Link format: `[anchor text](/blog/slug/)`

### Step 3: On-page SEO checks

For each post, verify:

1. **Title tag** — frontmatter `title` is under 60 characters, contains the primary keyword
2. **Meta description** — frontmatter `excerpt` is 120-160 characters, contains the primary keyword, has a call to action or value proposition
3. **H1** — only one H1 (set by the layout from `title`), no duplicate H1s in body
4. **Heading hierarchy** — H2s follow H1, H3s follow H2s, no skipped levels
5. **Keyword in first 100 words** — the primary keyword (derivable from slug/title) appears in the opening paragraph
6. **Internal links** — at least 3 internal links per post (added in Step 2)
7. **External links** — if Sources component is present, ensure links are valid
8. **Image alt text** — any images have descriptive alt attributes

Report any issues found and fix them.

### Step 4: New post cluster assignment

If processing a NEW post that isn't in any cluster above:
1. Determine which cluster it belongs to based on category and content
2. Add it to the appropriate cluster
3. Add internal links following the rules above
4. Update the pillar post to link to the new post

## After you finish

Do NOT run QA yourself — the user's workflow runs QA as a separate step after this skill.

## Input

The user will specify:
- A specific post (file path, slug, or "this post")
- "all posts" to run across the entire blog
- Or a new post that needs to be integrated into the cluster architecture

If no post is specified, ask which post or whether to run on all posts.
