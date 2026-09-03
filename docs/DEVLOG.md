# Development Log

This log records what was built, what was learned, important decisions, and the
next experiment. Entries focus on engineering reasoning rather than repeating
the commit history.

## September 3, 2026 — Milestone 4: Validated EV Spread Parser

### Goal

Convert Smogon spread identifiers into structured data that future speed and
damage calculations can use safely.

### What I Built

* Parsed Smogon identifiers containing a nature and six EV values
* Represented EVs as named HP, Attack, Defense, Special Attack, Special Defense,
  and Speed fields
* Required exactly one nature section and one EV section
* Rejected missing, blank, fractional, and non-numeric EV values
* Enforced the legal range of zero through 252 EVs per stat
* Enforced the total limit of 510 EVs
* Added focused tests for valid data, malformed formats, legal boundaries, and
  illegal values

### What I Learned

* A TypeScript tuple assertion does not validate array length at runtime
* External strings must be checked before their values are trusted
* JavaScript converts an empty string to zero with `Number("")`, so blank input
  needs an explicit validation rule
* Boundary tests should prove both sides of a rule: 510 EVs is valid, while a
  total above 510 is invalid
* Validation order determines which error users receive

### Challenges

* A parser that destructured `split(":")` silently ignored additional sections
* Early versions returned `undefined` fields instead of rejecting incomplete
  spreads
* Source code accidentally pasted into the terminal was interpreted as shell
  commands, reinforcing the separation between the editor and command line
* The feature branch initially inherited old squash-merged history and had to
  be rebased onto the current remote `main`

### Engineering Decisions

#### Keep EV values in a nested object

The parsed result separates the nature from a named `evs` object. This structure
is clearer than positional values and provides a useful boundary for future
Pokémon stat and damage-calculation code.

#### Validate the fixed string format manually

The spread identifier has a small, fixed grammar. Explicit checks keep the
behavior and error messages visible without introducing another schema for one
compact string.

### Validation

* Seven focused spread-parser tests pass
* All 24 repository tests pass
* The production build completes successfully
* Lint and staged whitespace checks pass

### Next Milestone

Combine parsed EVs with base stats, IVs, level, and nature modifiers to calculate
real Speed values and compare common metagame benchmarks.

## September 3, 2026 — Milestone 3: Common-Set Profiles

### Goal

Turn normalized Smogon weighted fields into deterministic baseline profiles for
move-level and set-level analysis.

### What I Built

* Selected the highest-weight ability and item for each Pokémon
* Selected the four highest-weight moves
* Selected the highest-weight spread and Tera type
* Added alphabetical tie-breaking for equal weights
* Returned explicit null values when optional categories are empty
* Preserved the imported source data by sorting copied arrays
* Added tests for selection, ties, missing options, and immutability

### What I Learned

* Stable output requires an explicit tie-breaking rule
* Array sorting mutates its input unless the array is copied first
* Passing tests may still contain callbacks or expressions that never execute
* Linting can expose false-positive tests and dead code
* Rebase and `--force-with-lease` can safely repair feature-branch history after
  a squash merge

### Challenges

* The first implementation applied alphabetical tie-breaking to single options
  but not to moves
* Two tests initially appeared to pass even though misplaced parentheses kept
  their assertion callbacks from running
* A shallow object copy could not detect mutation of nested arrays, so the test
  needed `structuredClone`

### Engineering Decisions

#### Describe the output as a marginal profile

Smogon provides independent weighted distributions for moves, items, abilities,
spreads, and Tera types. Selecting the most common value from each distribution
does not prove those choices appeared together on a real set.

#### Use one shared ordering rule

All weighted options use the same descending-weight and alphabetical-tie
comparator. This prevents categories from developing inconsistent selection
behavior.

### Validation

* Four focused common-profile tests pass
* All 17 repository tests pass
* The production build and lint checks pass
* The implementation does not mutate imported data

### Next Milestone

Parse Smogon EV spread identifiers into validated, structured values.

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
