# Development Log

This log records what was built, what was learned, important decisions, and the
next experiment. Entries focus on engineering reasoning rather than repeating
the commit history.

## September 10, 2026 — Milestone 9: Minimum Speed EV Optimizer

### Goal

Find the smallest effective Speed EV investment that allows a candidate Pokémon to exceed a target raw Speed benchmark.

### What I Built

* Added `findMinimumSpeedEv` as a bounded optimization function
* Evaluated Speed EV investments from 0 through 252
* Increased the search by four EVs at a time
* Returned immediately when the first positive Speed margin was found
* Returned zero EVs when the candidate already exceeded the threat without investment
* Treated a raw-Speed tie as insufficient because the optimization goal is to exceed the benchmark
* Returned maximum-investment evidence when the benchmark could not be exceeded
* Reused `calculateSpeedStat` and `compareRawSpeed` instead of duplicating their calculations or validation
* Modeled attainable and unattainable results with a TypeScript discriminated union
* Added tests for successful, unattainable, boundary, validation, and immutability behavior

### What I Learned

* Searching EV investments in ascending order guarantees that the first successful value is the minimum tested investment
* Every four Speed EVs increases the EV contribution used by the stat formula by one
* The final Speed stat may not increase every four EVs because level and nature introduce additional rounding
* A valid optimization can produce no solution without indicating that the input was invalid
* An unattainable result should contain evidence explaining what happened at maximum investment
* A discriminated union connects related properties and prevents contradictory result states
* A loop’s initial condition determines whether its body runs at all
* Reusing smaller trusted functions makes a larger optimizer easier to verify and maintain

### Challenges

* The first implementation checked for success only inside a `while` loop
* When the candidate was already faster at zero EVs, the loop condition was false and the loop ran zero times
* This caused a valid zero-EV solution to be incorrectly reported as unattainable
* The issue was a skipped loop rather than an infinite loop
* Refactoring to a bounded `for` loop allowed zero EVs and every later investment to follow the same calculation path
* The first refactor left the old zero-EV calculation above the new loop, creating unused and shadowed variables
* Removing the obsolete calculation made the bounded loop the single source of truth
* The original result type allowed impossible combinations such as `attainable: true` with `requiredSpeedEv: null`

### Engineering Decisions

#### Search effective EV investments in ascending order

The optimizer evaluates:

`0, 4, 8, ... 252`

Starting at zero prevents unnecessary investment when the candidate already clears the benchmark. Searching in ascending order means the first successful value is the smallest effective investment considered by the system.

#### Require a positive Speed margin

The candidate must have a raw Speed strictly greater than the threat. A tie does not satisfy the optimization objective because it does not establish a raw-Speed advantage.

This does not claim that the candidate will move first in battle. Priority, battle effects, and Speed-tie resolution remain outside this layer.

#### Return an explicit unattainable result

An unattainable benchmark is a valid optimization outcome rather than an exception. The inputs may all be valid even when the candidate cannot become faster at 252 Speed EVs.

The result therefore includes the candidate’s maximum raw Speed and its signed margin against the threat. This gives callers evidence they can display or use in later analysis.

#### Use a discriminated union

When `attainable` is `true`, `requiredSpeedEv` must be a number. When `attainable` is `false`, `requiredSpeedEv` must be `null`.

This prevents contradictory states at compile time and makes the result safer for other parts of the application to consume.

#### Preserve validation ownership

The optimizer does not duplicate validation rules from its dependencies. `calculateSpeedStat` validates Base Speed, IVs, level, EVs, and the nature modifier. `compareRawSpeed` validates the calculated candidate Speed and target threat Speed.

The optimizer is responsible only for search order, termination, and result construction.

### Validation

* Six focused minimum-Speed-EV tests pass
* All 54 repository tests pass
* The production build completes successfully
* Lint and whitespace checks pass
* Pull request #23 was reviewed and squash-merged
* Issue #22 closed automatically

### How This Helps the Anti-Meta Score

PokeMeta can now determine the least raw Speed investment needed to exceed a specific metagame benchmark.

Instead of automatically recommending 252 Speed EVs, the system can preserve unused EVs for offensive power or defensive bulk. The returned values also provide an auditable explanation of the recommendation, including the required investment, resulting Speed, and signed margin.

This is a targeted optimization result, not a predicted battle win rate. It currently excludes priority, items, abilities, weather, Tailwind, paralysis, stat stages, Trick Room, and other battle-context effects.

### Next Milestone

Resolve a Pokémon name into canonical species data, including typing and base stats. This will remove the need to enter Base Speed manually and establish the data foundation required for type-aware and damage-aware matchup analysis.

## September 10, 2026 — Milestone 8: Raw Speed Comparison

### Goal

Compare a candidate Pokémon's raw Speed with a metagame threat and report whether the candidate is faster, slower, or tied.

### What I Built

* Added `compareRawSpeed` as a deterministic raw-Speed comparison function
* Added `faster`, `slower`, and `tied` outcomes
* Calculated a signed Speed margin using `candidateSpeed - threatSpeed`
* Added runtime validation requiring both Speed values to be positive whole numbers
* Added role-specific validation errors for candidate and threat inputs
* Returned both input values, the comparison outcome, and the signed margin
* Added tests for every outcome, invalid inputs, the lowest valid boundary, and input immutability

### What I Learned

* A signed margin communicates both which Pokémon is faster and the size of the difference
* A positive margin favors the candidate, a negative margin favors the threat, and zero represents a raw-Speed tie
* Raw Speed does not guarantee move order because battle conditions and other mechanics can change which Pokémon acts first
* Speed ties require separate resolution and should not be presented as either Pokémon being faster
* Role-specific error messages make it easier to identify which input caused a failure
* Tests should cover every conditional branch even when the implementation appears straightforward
* A pure function does not mutate its input, making it safer to reuse across many matchup calculations

### Challenges

* The initial implementation covered all three outcomes, but only the `faster` branch had a test
* Runtime validation was added through the TDD red-green process: the new validation tests failed first and passed after the checks were implemented
* Replacing the implementation accidentally appended a second copy of the helper function
* Node reported that `assertPositiveWholeNumber` had already been declared, which helped identify the duplicate
* Because the file had already been staged, it needed to be staged again after the corrected version was saved

### Engineering Decisions

#### Use a candidate-centric signed margin

The comparison calculates:

`speedMargin = candidateSpeed - threatSpeed`

This preserves more information than an absolute difference. A margin of `2` means the candidate is two points faster, while a margin of `-15` means it is fifteen points slower.

The direction and magnitude can both be used by future AMS calculations and explanations.

#### Compare raw Speed without claiming move order

The function reports only the relationship between two raw Speed values. It does not claim which Pokémon will act first.

Move priority, items, abilities, weather, Tailwind, paralysis, stat stages, Trick Room, and Speed-tie resolution require battle context and belong in later layers.

#### Validate each role separately

Candidate and threat Speed values are validated independently. Their error messages identify the role that received invalid data instead of returning a generic Speed error.

This will make debugging easier and allow a future interface to explain exactly which Pokémon or set needs correction.

#### Preserve input immutability

The comparison reads the input object and returns a new result without modifying the original values.

This pure-function design makes the comparator predictable and safe to reuse while evaluating many candidate-versus-threat matchups.

### Validation

* Seven focused raw-Speed comparison tests pass
* All 48 repository tests pass
* The production build completes successfully
* Lint and whitespace checks pass
* Pull request #20 was reviewed and squash-merged
* Issue #19 closed automatically

### How This Helps the Anti-Meta Score

The engine can now determine whether a candidate clears the raw Speed benchmark of a highly used metagame threat and report the exact surplus or deficit.

This creates a measurable component of matchup effectiveness without presenting it as a predicted win rate.

The signed margin can eventually support EV optimization. The engine could search for the smallest Speed investment that produces a positive margin against an important threat, then allocate the remaining EVs to bulk or offensive stats.

### Next Milestone

Find the minimum Speed EV investment needed for a candidate to exceed a target raw Speed benchmark. The result should report the required EV investment, resulting Speed, and Speed margin, or explain when the target cannot be exceeded.

## September 10, 2026 — Milestones 6–7: Nature Resolution and Explainable Speed Integration

### Goal

Convert Smogon nature names and EV spread identifiers into trustworthy raw
Speed benchmarks that can be explained and used in future matchup analysis.

### What I Built

* Added `getSpeedNatureModifier` to translate all 25 canonical Pokémon natures
  into their Speed modifiers
* Returns `1.1` for Speed-increasing natures, `0.9` for Speed-decreasing
  natures, and `1` for confirmed Speed-neutral natures
* Rejects unknown or malformed nature names instead of silently treating them
  as neutral
* Added `calculateSmogonSpreadSpeed` to connect the spread parser, nature
  resolver, and Speed calculator
* Returns the parsed nature, nature modifier, Speed EV investment, and
  calculated Speed as an explainable result
* Preserves validation errors from the module responsible for each rule

### What I Learned

* Speed IVs should remain explicit because some competitive sets intentionally
  use values other than 31, especially sets designed to be slower
* Level should remain explicit because different competitive formats may use
  different levels
* An integration layer translates between module interfaces without duplicating
  their internal logic
* `input.speedIv` contains the value used by the integration API, while `iv` is
  the property name required by `calculateSpeedStat`
* The spread parser returns the Speed EV investment as `parsed.evs.spe`, so the
  integration layer converts it into the calculator's `ev` input
* Runtime ES module imports require complete file paths such as
  `./speed-stat.ts`
* Type-only imports are removed before execution, so they do not produce the
  same runtime module-resolution requirements
* An integration function should allow validation errors to propagate when it
  cannot recover from them

### Challenges

* The first implementation passed `speedIv` and `speedEv` as properties to
  `calculateSpeedStat`, even though the calculator expects `iv` and `ev`
* I initially tried to read `parsed.speedEv`, but the parser stores that value
  inside `parsed.evs.spe`
* Node could not resolve the integration module's runtime imports until the
  `.ts` extensions were included
* Linting did not detect the module-resolution problem because static-analysis
  tools and Node's runtime resolver perform different checks

### Engineering Decisions

#### Keep format-dependent values explicit

The integration requires Base Speed, Speed IV, and level as inputs. Base Speed
and Speed IV are not included in the Smogon spread identifier, and level can
vary by format. Avoiding hidden defaults prevents the system from calculating a
valid-looking Speed value from incorrect assumptions.

#### Preserve validation ownership

The integration does not repeat or replace validation from its dependencies.
The spread parser owns spread structure and EV validation, the nature resolver
owns canonical nature names, and the Speed calculator owns Base Speed, IV,
level, and modifier validation.

When one of those modules rejects an input, its original error is allowed to
propagate. A future user-interface layer can catch the error and decide how to
display it.

#### Return an explainable result

The integration returns structured information instead of only returning a
number. For example, a result can show that a Jolly nature produced a `1.1`
modifier, the spread contained 252 Speed EVs, and the final raw Speed was 169.

This makes the calculation easier to audit and gives future AMS explanations
the evidence needed to justify a Speed recommendation.

### Validation

* Four focused nature-resolver tests pass
* Three focused spread-Speed integration tests pass
* All 41 repository tests pass
* The production build completes successfully
* Lint and whitespace checks pass
* Pull requests #15 and #17 were reviewed and squash-merged
* Issues #14 and #16 closed automatically

### How This Helps the Anti-Meta Score

The engine can now derive a traceable raw Speed benchmark from a common Smogon
spread. This allows candidate sets to be compared against highly used
metagame threats and helps identify the investment needed to reach a particular
Speed tier.

The result measures one part of matchup effectiveness. It does not represent a
predicted win rate and does not yet account for items, abilities, weather,
Tailwind, paralysis, stat stages, or Trick Room.

### Next Milestone

Compare a candidate's raw Speed benchmark against a metagame threat and report
whether the candidate is faster, slower, or tied, along with the numerical
difference.

## September 9, 2026 — Milestone 5: Validated Speed Stat Calculator

### Goal

Calculate trustworthy unmodified Speed values that can eventually be used to
compare competitive Pokémon sets against metagame threats.

### What I Built

* Added a typed Speed-calculation input containing Base Speed, IVs, EVs, level,
  and a nature modifier
* Implemented the Pokémon Speed formula with the correct intermediate rounding
* Converted every complete four EVs into one stat point
* Supported increasing, neutral, and decreasing nature modifiers
* Added runtime validation for every input
* Added tests using Garchomp and Regieleki Speed benchmarks
* Added tests for EV rounding, nature modifiers, invalid inputs, and legal
  boundaries

### What I Learned

* TypeScript types are removed at runtime and cannot validate imported JSON,
  JavaScript calls, API responses, or user input
* Runtime validation is still required at system boundaries even when a function
  has strongly typed parameters
* Range validation and enumeration validation represent different rules
* Incomplete groups of four EVs do not contribute a stat point
* Tests should cover valid boundaries as well as invalid values
* A parser may report where it finally failed rather than where the original
  syntax mistake occurred

### Challenges

* An extra closing brace ended the calculation function early and left part of
  the implementation at the top level
* Node reported the final brace even though the structural mistake occurred
  earlier in the file
* The first benchmark tests did not prove that incomplete EV groups were rounded
  correctly
* The test suite needed a level-99 case to distinguish the correct EV-rounding
  order from a plausible incorrect implementation

### Engineering Decisions

#### Calculate unmodified Speed separately

The calculator handles only Base Speed, IVs, EVs, level, and nature. Items,
abilities, stat stages, status, weather, and Tailwind require battle context and
will belong to a later effective-Speed layer.

Trick Room belongs to action-order logic because it changes which Pokémon moves
first without changing the underlying Speed stat.

#### Keep Base Speed adaptable

Base Speed must be a positive whole number, but the calculator does not hardcode
Regieleki's current Base Speed as a permanent maximum. This keeps the function
usable with future Pokémon and custom formats.

#### Validate at runtime

The function validates values even though it uses TypeScript. External data can
bypass compile-time types, so runtime checks prevent invalid values from silently
producing misleading matchup results.

### Validation

* Ten focused Speed-calculator tests pass
* All 34 repository tests pass
* The production build completes successfully
* Lint and whitespace checks pass
* Pull request #12 was reviewed and squash-merged
* Issue #10 closed automatically

### How This Helps the Anti-Meta Score

Calculated Speed allows the engine to compare a candidate set with important
metagame threats and determine whether it reaches the required Speed tier. This
supports role and matchup-effectiveness analysis without presenting the result
as a predicted win rate.

### Next Milestone

Resolve nature names such as Timid, Jolly, Brave, and Quiet into Speed modifiers,
then connect parsed Smogon spreads to the Speed calculator.

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
