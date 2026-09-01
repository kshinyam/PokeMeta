# Contributing

Meta Breaker Lab uses a lightweight GitHub Flow process. The same workflow is
used for solo development so decisions and testing remain easy to review.

## Workflow

1. Create or select a GitHub Issue
2. Write clear acceptance criteria
3. Create a short-lived branch from **main**
4. Make small commits containing related changes
5. Add or update tests
6. Open a pull request
7. Complete the pull-request checklist
8. Merge only after the build and tests pass
9. Update the development log when the work represents a milestone

## Branch Names

~~~text
feat/smogon-importer
feat/showdown-team-import
fix/duplicate-team-slots
test/matchup-fixtures
docs/scoring-model
~~~

## Commit Messages

Use an imperative description with an optional category:

~~~text
feat(data): parse weighted usage
feat(scoring): evaluate common movesets
fix(builder): prevent duplicate Pokémon
test(importer): reject malformed chaos data
docs(devlog): record importer milestone
~~~

Do not combine unrelated refactoring, formatting, features, and bug fixes into
one commit.

## Pull Requests

Every pull request should explain:

- The problem being solved
- The chosen approach
- Important tradeoffs
- How the change was tested
- Any known limitations
- A screenshot when the interface changes

Link the pull request to its issue with **Closes #123** when appropriate.

## Definition of Done

- [ ] Acceptance criteria are satisfied
- [ ] New behavior has tests when practical
- [ ] Existing tests pass
- [ ] User-facing text is understandable
- [ ] Model claims match the available evidence
- [ ] Documentation reflects important architectural decisions
