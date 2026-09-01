"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  Beaker,
  Check,
  ChevronRight,
  CircleAlert,
  Database,
  FlaskConical,
  Info,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  analyze,
  BULKY_TEAM,
  DEFAULT_TEAM,
  POKEMON,
  REQUIRED_ROLES,
  TYPE_COLORS,
  type PokemonType,
} from "./meta-engine";

function scoreTone(score: number) {
  if (score >= 80) {
    return {
      label: "Prepared",
      text: "text-lime-300",
      bar: "[&_[data-slot=progress-indicator]]:bg-lime-400",
    };
  }
  if (score >= 62) {
    return {
      label: "Playable",
      text: "text-amber-300",
      bar: "[&_[data-slot=progress-indicator]]:bg-amber-400",
    };
  }
  return {
    label: "Exposed",
    text: "text-rose-300",
    bar: "[&_[data-slot=progress-indicator]]:bg-rose-400",
  };
}

function TypePill({ type }: { type: PokemonType }) {
  return (
    <span
      className="rounded-full border px-2 py-0.5 text-[0.72rem] font-semibold text-white"
      style={{
        borderColor: TYPE_COLORS[type] + "88",
        backgroundColor: TYPE_COLORS[type] + "2f",
      }}
    >
      {type}
    </span>
  );
}

export default function Home() {
  const [team, setTeam] = useState(DEFAULT_TEAM);
  const metrics = useMemo(() => analyze(team), [team]);
  const tone = scoreTone(metrics.overall);

  const recommendation = useMemo(() => {
    if (team.length < 6) return null;
    let best: {
      add: (typeof POKEMON)[number];
      remove: string;
      score: number;
    } | null = null;

    for (const candidate of POKEMON) {
      if (team.includes(candidate.name)) continue;
      for (const current of team) {
        const nextTeam = team.map((name) =>
          name === current ? candidate.name : name,
        );
        const score = analyze(nextTeam).overall;
        if (!best || score > best.score) {
          best = { add: candidate, remove: current, score };
        }
      }
    }

    return best && best.score > metrics.overall + 0.2
      ? { ...best, delta: best.score - metrics.overall }
      : null;
  }, [team, metrics.overall]);

  function updateSlot(index: number, value: string) {
    setTeam((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  }

  return (
    <main className="min-h-screen text-slate-100">
      <header className="border-b border-white/10 bg-[#090d18]/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl border border-lime-300/30 bg-lime-300/10 text-lime-300 shadow-[0_0_24px_rgba(190,242,100,0.12)]">
              <FlaskConical className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                Meta Breaker Lab
              </h1>
              <p className="text-sm text-slate-400">
                Explainable Smogon OU team analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
            <span className="size-2 rounded-full bg-lime-300 shadow-[0_0_10px_#bef264]" />
            July 2026 · 1695 ladder · 654,262 battles
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(390px,0.82fr)_minmax(520px,1.45fr)] lg:px-8">
        <section className="rounded-2xl border border-white/10 bg-[#101625]/90 shadow-2xl shadow-black/20">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
                  Input
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Build your six
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTeam([])}
                className="text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <RotateCcw aria-hidden="true" /> Clear
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTeam(DEFAULT_TEAM)}
                className="border-white/10 bg-white/5 hover:bg-white/10"
              >
                Sample balance
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTeam(BULKY_TEAM)}
                className="border-white/10 bg-white/5 hover:bg-white/10"
              >
                Bulky balance
              </Button>
            </div>
          </div>

          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => {
              const selected = team[index];
              const pokemon = POKEMON.find((item) => item.name === selected);
              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-black/15 p-3"
                >
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Slot {index + 1}
                  </label>
                  <Select
                    value={selected ?? ""}
                    onValueChange={(value) => updateSlot(index, value)}
                  >
                    <SelectTrigger className="h-11 w-full border-white/10 bg-white/[0.04] text-base shadow-none focus:ring-lime-300/20">
                      <SelectValue placeholder="Choose Pokémon" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="border-slate-700 bg-slate-950 text-slate-100"
                    >
                      {POKEMON.map((option) => (
                        <SelectItem
                          key={option.name}
                          value={option.name}
                          disabled={
                            team.includes(option.name) &&
                            option.name !== selected
                          }
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {pokemon ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {pokemon.types.map((type) => (
                        <TypePill key={type} type={type} />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">Empty slot</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/10 p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <Target className="size-4 text-lime-300" /> Team roles
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {REQUIRED_ROLES.map((role) => {
                const present = metrics.presentRoles.has(role);
                return (
                  <Badge
                    key={role}
                    variant="outline"
                    className={
                      present
                        ? "border-lime-300/25 bg-lime-300/10 text-lime-200"
                        : "border-white/10 bg-white/[0.03] text-slate-500"
                    }
                  >
                    {present && <Check className="size-3" />} {role}
                  </Badge>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
            <article className="relative overflow-hidden rounded-2xl border border-lime-300/20 bg-[#111a26] p-6 shadow-[0_0_60px_rgba(190,242,100,0.06)]">
              <div className="absolute -right-12 -top-12 size-40 rounded-full bg-lime-300/10 blur-3xl" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
                  Anti-meta score
                </p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-7xl font-semibold tracking-[-0.08em] text-white">
                    {Math.round(metrics.overall)}
                  </span>
                  <span className="mb-2 text-lg text-slate-500">/ 100</span>
                </div>
                <p className={"mt-2 text-lg font-semibold " + tone.text}>
                  {team.length < 6 ? team.length + "/6 selected" : tone.label}
                </p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                  A weighted proxy for meta answers, required roles, and
                  defensive redundancy—not a predicted win rate.
                </p>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#101625]/90 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Score decomposition
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    What the model sees
                  </h2>
                </div>
                <Info className="size-5 text-slate-500" aria-hidden="true" />
              </div>
              <div className="mt-5 space-y-5">
                {[
                  {
                    label: "Weighted meta coverage",
                    value: metrics.metaCoverage,
                    weight: "55% weight",
                    color:
                      "[&_[data-slot=progress-indicator]]:bg-lime-400",
                  },
                  {
                    label: "Role completeness",
                    value: metrics.roleScore,
                    weight: "25% weight",
                    color:
                      "[&_[data-slot=progress-indicator]]:bg-cyan-400",
                  },
                  {
                    label: "Defensive resilience",
                    value: metrics.resilience,
                    weight: "20% weight",
                    color:
                      "[&_[data-slot=progress-indicator]]:bg-violet-400",
                  },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-300">{metric.label}</span>
                      <span className="font-mono text-slate-200">
                        {Math.round(metric.value)}{" "}
                        <span className="text-xs text-slate-500">
                          · {metric.weight}
                        </span>
                      </span>
                    </div>
                    <Progress
                      value={metric.value}
                      className={"h-2 bg-white/5 " + metric.color}
                    />
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="rounded-2xl border border-white/10 bg-[#101625]/90">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Matchup matrix
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  Top ladder threats
                </h2>
              </div>
              <Badge
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-slate-400"
              >
                Usage-weighted
              </Badge>
            </div>
            <div className="divide-y divide-white/[0.07]">
              {metrics.threatRows.slice(0, 10).map((threat, index) => {
                const rowTone = scoreTone(threat.coverage * 100);
                return (
                  <div
                    key={threat.name}
                    className="grid gap-3 p-4 transition-colors hover:bg-white/[0.025] sm:grid-cols-[minmax(180px,0.8fr)_minmax(220px,1.25fr)_100px] sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 font-mono text-xs text-slate-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-medium text-slate-100">
                          {threat.name}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {threat.types.map((type) => (
                            <TypePill key={type} type={type} />
                          ))}
                          <span className="ml-1 text-xs text-slate-500">
                            {threat.usage.toFixed(1)}% usage
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {threat.best ? (
                        <>
                          <p className="text-sm text-slate-300">
                            <span className="text-slate-500">
                              Best answer:
                            </span>{" "}
                            {threat.best.pokemon.name}
                          </p>
                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                            {threat.best.pokemon.note}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-slate-600">
                          Add team members to evaluate
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className={rowTone.text}>
                          {Math.round(threat.coverage * 100)}%
                        </span>
                        {threat.coverage >= 0.8 ? (
                          <ShieldCheck className="size-4 text-lime-300" />
                        ) : (
                          <CircleAlert className="size-4 text-amber-300" />
                        )}
                      </div>
                      <Progress
                        value={threat.coverage * 100}
                        className={"h-1.5 bg-white/5 " + rowTone.bar}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>

          <div className="grid gap-4 xl:grid-cols-2">
            <article className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] p-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-cyan-300/10 p-2 text-cyan-300">
                  <Sparkles className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Best next experiment
                  </p>
                  {recommendation ? (
                    <>
                      <h3 className="mt-2 text-lg font-semibold">
                        Test {recommendation.add.name} over{" "}
                        {recommendation.remove}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        The deterministic search estimates a{" "}
                        <span className="text-cyan-200">
                          +{recommendation.delta.toFixed(1)} point
                        </span>{" "}
                        improvement. Treat this as a hypothesis to test.
                      </p>
                      <Button
                        className="mt-4 bg-cyan-300 text-slate-950 hover:bg-cyan-200"
                        size="sm"
                        onClick={() =>
                          setTeam(
                            team.map((name) =>
                              name === recommendation.remove
                                ? recommendation.add.name
                                : name,
                            ),
                          )
                        }
                      >
                        Apply swap <ArrowRightLeft />
                      </Button>
                    </>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Complete a six-Pokémon team to run the one-slot
                      replacement search.
                    </p>
                  )}
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-[#101625]/90 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-300/10 p-2 text-violet-300">
                  <Beaker className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                    Missing structure
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    {metrics.missingRoles.length
                      ? metrics.missingRoles.length + " role gaps"
                      : "All core roles represented"}
                  </h3>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {metrics.missingRoles.length ? (
                  metrics.missingRoles.map((role) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className="border-amber-300/20 bg-amber-300/5 text-amber-200"
                    >
                      {role}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-slate-400">
                    Role coverage is complete. The next gains likely come from
                    set details and playtesting.
                  </p>
                )}
              </div>
            </article>
          </div>

          <article className="rounded-2xl border border-white/10 bg-[#0c111d]/90 p-5 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
                  Lab notes · Milestone 1
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Why this is explainable AI
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Every result can be traced to data and a formula. An LLM can
                  explain these results later, but it should not invent them.
                </p>
              </div>
              <ol className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Database,
                    title: "1. Observe",
                    copy: "Weight threats by real 1695-ladder usage.",
                  },
                  {
                    icon: Zap,
                    title: "2. Score",
                    copy: "Combine direct checks, typing, and team roles.",
                  },
                  {
                    icon: ArrowRightLeft,
                    title: "3. Search",
                    copy: "Try every one-slot swap and keep improvements.",
                  },
                ].map((step) => (
                  <li
                    key={step.title}
                    className="rounded-xl border border-white/10 bg-white/[0.025] p-4"
                  >
                    <step.icon className="size-5 text-lime-300" />
                    <h3 className="mt-3 font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {step.copy}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5 text-sm text-slate-500">
              Next: ingest Smogon chaos JSON, model common sets, then score
              move-level matchups.
              <ChevronRight className="size-4 shrink-0 text-lime-300" />
            </div>
          </article>
        </section>
      </div>

      <footer className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 pb-8 pt-2 text-xs text-slate-600 sm:px-6 lg:px-8">
        <p>
          Unofficial fan project. Pokémon names belong to their respective
          owners.
        </p>
        <p>Data: Smogon July 2026 Gen 9 OU, 1695 cutoff</p>
      </footer>
    </main>
  );
}
