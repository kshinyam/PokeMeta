# Meta Breaker Lab

Meta Breaker Lab is an explainable competitive Pokémon team analyzer for
Smogon Generation 9 OU. It scores a six-Pokémon team against the current
metagame, identifies its weakest matchups, and searches for one-slot changes
that improve its estimated coverage.

The project intentionally starts with a deterministic, transparent model before
adding machine learning. Every recommendation can be traced to usage data,
matchup rules, team roles, and a documented formula.

## Working Deployment

[Open Meta Breaker Lab](https://meta-breaker-lab.hikarruu.chatgpt.site)

The current deployment is private while the project is under active
development.

## Current Features

- Interactive six-Pokémon Smogon OU team builder
- July 2026 usage-weighted metagame snapshot
- Analysis of the top 15 threats at the 1695 ladder cutoff
- Required-role detection for hazards, removal, speed, offense, pivoting,
  recovery, and win conditions
- Defensive resilience analysis across all 18 attacking types
- Exhaustive one-slot replacement search over the candidate pool
- Explainable matchup rows showing each team's best available answer
- Automated regression tests for data and scoring behavior

## Scoring Model

The current model uses:

~~~text
Anti-Meta Score =
  55% Weighted Meta Coverage
+ 25% Role Completeness
+ 20% Defensive Resilience
~~~

Incomplete teams also receive a completeness penalty.

This score is a team-building proxy, not a predicted win rate. The current
version does not simulate complete games or learn from battle outcomes.

## Why Explainability Comes First

An AI explanation is only trustworthy when the underlying recommendation has
evidence. Meta Breaker therefore separates:

1. **Observation** — what is common in the metagame?
2. **Evaluation** — how well does the selected team answer it?
3. **Search** — which measurable change improves the result?
4. **Explanation** — why did that change score better?

An LLM may later turn structured evidence into natural-language coaching, but
it will not be responsible for inventing the recommendation.

## Architecture

~~~mermaid
flowchart LR
    A["Smogon data"] --> B["Normalized meta model"]
    B --> C["Scoring engine"]
    D["Selected team"] --> C
    C --> E["Threat analysis"]
    C --> F["Replacement search"]
    E --> G["React interface"]
    F --> G
~~~

The dataset and scoring engine are separate from the interface so future
live-data and ML components can be introduced without rewriting the product.

More detail is available in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Data Source

The seed dataset uses Smogon's July 2026 Generation 9 OU statistics at the 1695
rating cutoff:

- <https://www.smogon.com/stats/2026-07/gen9ou-1695.txt>
- <https://www.smogon.com/stats/2026-07/chaos/gen9ou-1695.json.gz>

Pokémon names and related properties belong to their respective owners. This is
an unofficial fan project.

## Technology

- TypeScript
- React 19
- Next.js-compatible Vinext runtime
- Tailwind CSS
- Radix/Shadcn interface primitives
- Node test runner
- Cloudflare Workers-compatible deployment

## Local Development

### Requirements

- Node.js 22.13 or newer
- npm
- Bash-compatible environment

The current scripts target Linux. Windows users should run the project through
WSL.

~~~bash
npm run install:ci
npm run dev
~~~

Run the full build and regression suite with:

~~~bash
npm test
~~~

## Current Limitations

- Several hard and soft matchup classifications are currently curated
- Moves, items, abilities, EVs, natures, and Tera types are not modeled
- Type-based fallback scoring cannot represent every battle interaction
- The candidate pool is limited
- Recommendations are not yet validated against replay outcomes
- The application does not yet import Pokémon Showdown team text

These limitations are shown openly because distinguishing measured facts from
assumptions is part of the project's design.

## Roadmap

- [ ] Import and normalize Smogon chaos JSON automatically
- [ ] Extract common moves, items, abilities, Tera types, and spreads
- [ ] Support Pokémon Showdown team import and export
- [ ] Integrate move-level damage calculations
- [ ] Add automatic EV benchmark optimization
- [ ] Identify metagame archetypes from teammate relationships
- [ ] Validate scores against real battle outcomes
- [ ] Train a fast team-versus-team matchup model
- [ ] Explore battle simulation and self-play

Progress and engineering decisions are recorded in
[docs/DEVLOG.md](docs/DEVLOG.md).

## Development Workflow

Work is organized with GitHub Issues and short-lived branches:

~~~text
Issue → feature branch → focused commits → pull request → tests → merge
~~~

Commit examples:

~~~text
feat(data): import monthly Smogon statistics
feat(scoring): model common competitive sets
test(scoring): cover duplicate item constraints
docs(devlog): record chaos importer milestone
~~~

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.
