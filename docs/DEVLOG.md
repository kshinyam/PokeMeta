# Development Log

This log records what was built, what was learned, important decisions, and the
next experiment. Entries focus on engineering reasoning rather than repeating
the commit history.

## September 1, 2026 — Milestone 2: Reproducible Data Importer

### Goal

Replace hand-copied usage numbers with a validated, reproducible Smogon chaos
JSON pipeline.

### What I Built

- Added a command-line importer for pinned Smogon month, format, and cutoff
- Validated upstream metadata and Pokémon records with Zod
- Normalized the top 50 Pokémon by weighted usage
- Extracted moves, items, abilities, spreads, Tera types, and teammates
- Recorded source URL, publication timestamp, battle count, and SHA-256 digest
- Connected the scoring engine to the July 2026 1825-ladder snapshot
- Added fixture-based tests for sorting, normalization, and invalid input
- Updated the interface to display metadata from the dataset itself

### What I Learned

- External data should be validated at the boundary before the application
  trusts it
- Reproducibility requires pinning the source period, format, cutoff, and digest
- A normalized internal model protects the rest of the application from
  upstream schema changes
- Raw weighted fields should not be mislabeled as probabilities without proving
  their statistical meaning
- Tests can reveal environment coupling, such as an import alias supported by
  the browser build but not by Node's direct test runner

### Challenges

- The August 2026 archive was not yet available, so the importer pins the latest
  complete July dataset
- The full chaos file is several megabytes compressed, so the repository stores
  a compact generated snapshot and a tiny synthetic test fixture instead
- Smogon chaos JSON does not include Pokémon typing, so threat types remain a
  small explicit curated boundary for now

### Engineering Decisions

#### Store provenance with the normalized output

The generated snapshot carries enough metadata to identify and verify its
source. This makes recommendations auditable and prevents an unlabeled dataset
from silently changing model behavior.

#### Keep the importer deterministic

Records are sorted by usage and name, numeric values are rounded consistently,
and offline imports require an explicit timestamp. Re-running the same input
therefore produces the same output.

#### Do not commit the full upstream archive

The application needs a compact runtime snapshot, while tests need only a small
fixture that exercises the schema. The original source remains linked and
integrity-checked by SHA-256.

### Validation

- Importer fixture tests cover valid, malformed, and ambiguous inputs
- The engine verifies the expected snapshot identity and leading usage value
- Lint and the complete production regression suite pass

### Next Milestone

Turn the imported weighted fields into common, human-readable sets and use those
sets in move-level matchup evaluation.

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
