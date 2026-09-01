# Architecture

## Purpose

Meta Breaker Lab analyzes a competitive Pokémon team against a weighted
metagame model and searches for measurable improvements. The architecture
prioritizes explainability, deterministic testing, and replaceable components.

## Current System

~~~mermaid
flowchart TD
    A["Smogon chaos archive"] --> B["Schema validator"]
    B --> C["Normalized snapshot"]
    C --> D["Threat model"]
    E["Curated candidate data"] --> F["Matchup evaluator"]
    D --> F
    G["User-selected team"] --> F
    F --> H["Weighted score"]
    G --> H
    H --> I["One-slot search"]
    I --> J["Explainable recommendation"]
~~~

## Component Responsibilities

### Metagame data

The importer downloads or reads a pinned Smogon chaos payload and validates the
upstream boundary with Zod. It then produces a compact, versioned JSON snapshot
containing:

- source period, format, cutoff, battle count, URL, timestamp, and SHA-256
- usage and raw count for the top 50 Pokémon
- the five highest-weighted moves, items, abilities, spreads, Tera types, and
  teammates for each Pokémon

The importer preserves machine identifiers and weighted values rather than
guessing display names or probabilities. The scoring engine currently consumes
only the top-15 usage values; common-set modeling is the next stage.

### Candidate knowledge

Stores each candidate's types, roles, notes, and current hard or soft matchup
classifications. Curated classifications are temporary model inputs, not ground
truth.

### Matchup evaluator

Scores one candidate into one threat:

1. Use a curated hard-check score when available
2. Otherwise use a curated soft-check score
3. Otherwise calculate a type-based pressure and resistance fallback

Team-level coverage uses the strongest answer plus a smaller backup bonus. This
rewards redundancy without allowing several weak answers to look like one
reliable check.

### Team evaluator

Calculates three features:

| Feature | Weight | Meaning |
| --- | ---: | --- |
| Weighted meta coverage | 55% | Answers to common threats, weighted by usage |
| Role completeness | 25% | Presence of eight required team functions |
| Defensive resilience | 20% | Weakness overload compared with resistances |

Incomplete teams receive an additional completeness multiplier.

### Replacement search

For a complete team, the engine tries every unused candidate in every slot. It
returns the highest-scoring replacement only when its improvement clears a
minimum threshold.

With six slots and n candidates, the current search performs approximately:

\[
6(n-6)
\]

team evaluations. This exhaustive baseline is simple and fast for the current
pool.

## Data Flow

~~~mermaid
sequenceDiagram
    participant U as User
    participant UI as Team builder
    participant E as Scoring engine
    participant S as Replacement search

    U->>UI: Select six Pokémon
    UI->>E: Send selected names
    E-->>UI: Score, roles, and threat rows
    UI->>S: Request best one-slot change
    S->>E: Evaluate candidate teams
    S-->>UI: Best measured improvement
    UI-->>U: Show evidence and apply option
~~~

## Testing Strategy

The engine is implemented as pure functions so it can be tested without a
browser. Current tests verify:

- Candidate names are unique
- Threat usage is ordered
- Imported snapshot identity and digest are present
- Chaos input is sorted and normalized deterministically
- Malformed upstream payloads fail at the importer boundary
- Empty teams return a zero score
- Complete teams produce answers for every tracked threat
- Incomplete teams receive a score penalty

Starter integration tests also verify rendered metadata and shared interface
behavior.

## Planned Evolution

~~~mermaid
flowchart LR
    A["Chaos JSON importer"] --> B["Set-level matchup model"]
    B --> C["Damage calculations"]
    C --> D["Archetype clustering"]
    D --> E["Learned matchup predictor"]
    E --> F["Evolutionary team search"]
~~~

Each stage should be compared with the previous deterministic baseline. A more
complex model is only useful when it produces a measurable improvement.

## Trust Boundaries

- Usage data describes popularity, not automatic competitive strength
- Weighted chaos fields are not automatically probabilities
- Curated checks are hypotheses and must be validated
- Type matchups do not capture moves, items, abilities, or player decisions
- A team score is not a battle win probability
- LLM-generated explanations must only reference structured engine output
