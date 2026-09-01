# Development Log

This log records what was built, what was learned, important decisions, and the
next experiment. Entries focus on engineering reasoning rather than repeating
the commit history.

## September 1, 2026 — Milestone 1: Explainable Baseline

### Goal

Create the first working Smogon OU team-analysis engine and publish an
interactive vertical slice.

### What I Built

- Created an interactive six-Pokémon team builder
- Added July 2026 Smogon OU usage data from the 1695 ladder cutoff
- Modeled the top 15 metagame threats
- Created a weighted anti-meta scoring formula
- Added required-role and defensive-resilience analysis
- Implemented a search across every legal one-slot replacement in the
  candidate pool
- Added explainable threat rows that show the team's best available answer
- Added regression tests for dataset integrity and scoring behavior
- Published the first working deployment

### What I Learned

- How to separate domain data, business logic, and interface code
- Why a deterministic baseline is valuable before training a model
- How weighted scoring converts several imperfect signals into one ranking
- Why a model's name must match what it actually measures
- How regression tests preserve expected behavior while an algorithm evolves
- Why recommendations should be treated as testable hypotheses

### Engineering Decisions

#### Separate the engine from the interface

The metagame data and scoring functions live outside the React page. This keeps
the engine testable and allows the static dataset to be replaced by an importer
without redesigning the interface.

#### Do not call the score a win probability

The current model measures matchup coverage, team roles, and defensive
structure. It does not simulate games or learn from battle outcomes. Calling
the result a win probability would overstate the evidence, so the interface
uses the term **Anti-Meta Score**.

#### Use exhaustive search for the first optimizer

The initial search evaluates every candidate replacement for every team slot.
This is feasible with the current pool, easy to verify, and provides a baseline
that future genetic algorithms must outperform.

#### Keep the explanation downstream

The engine chooses a recommendation using structured evidence. A future LLM
will explain that evidence rather than decide which Pokémon should be used.

### Validation

- Production build completed successfully
- Nine automated tests passed
- Tests cover dataset uniqueness, usage ordering, empty teams, complete teams,
  incomplete-team penalties, rendered metadata, styling utilities, and
  interface component behavior

### Current Limitations

- Hard and soft checks are partly curated
- The fallback calculation uses typing rather than exact movesets
- EVs, items, abilities, Tera types, and speed benchmarks are not represented
- Scores have not been calibrated against battle outcomes

### Next Milestone

Build a Smogon chaos JSON importer that:

1. Loads a chosen monthly dataset
2. Validates its schema
3. Normalizes names and weighted usage
4. Extracts common moves, items, abilities, spreads, and teammates
5. Produces a compact application-ready snapshot
6. Includes fixture-based tests

## Entry Template

Copy this section for future entries:

~~~markdown
## YYYY-MM-DD — Milestone name

### Goal

What outcome was I trying to achieve?

### What I Built

- Concrete change

### What I Learned

- Technical or product lesson

### Challenges

- What went wrong or was uncertain?

### Engineering Decisions

- What did I choose, and why?

### Validation

- Tests, measurements, screenshots, or user feedback

### Next Milestone

- Smallest useful next step
~~~
