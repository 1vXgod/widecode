"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, Lock, MousePointer2, Pause, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import { showcaseStages, type ShowcaseCopy } from "@/types/content";

/** How long each stage stays on screen while auto-advancing. */
export const STAGE_DURATION_MS = 5000;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Interactive hero visual: a simulated browser that walks through how a site is
 * made (design → code → live). Auto-advances unless the visitor prefers reduced
 * motion, pauses on hover/focus, and stops once the visitor picks a stage.
 */
export function HeroShowcase({ copy }: { copy: ShowcaseCopy }) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const running = autoplay && !reducedMotion && !interacting;
  const last = showcaseStages.length - 1;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % showcaseStages.length), STAGE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [running, index]);

  function select(next: number, focus = false) {
    setIndex(next);
    setAutoplay(false);
    if (focus) tabRefs.current[next]?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const targets: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
  }

  const panelId = (stage: string) => `${baseId}-panel-${stage}`;
  const tabId = (stage: string) => `${baseId}-tab-${stage}`;

  return (
    <div
      className="relative"
      onPointerEnter={() => setInteracting(true)}
      onPointerLeave={() => setInteracting(false)}
      onFocus={() => setInteracting(true)}
      onBlur={onBlur}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-tr from-accent/30 via-transparent to-accent-2/25 blur-3xl"
      />

      <div className="overflow-hidden rounded-card border border-border-strong bg-surface shadow-2xl shadow-black/60">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </div>
          <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-xs text-fg-subtle">
            <Lock aria-hidden="true" className="size-3 shrink-0" />
            <span className="truncate">{copy.url}</span>
          </div>
          <div aria-hidden="true" className="w-10" />
        </div>

        {/* Viewport */}
        <div className="@container relative aspect-[4/3] bg-bg sm:aspect-[16/11]">
          {showcaseStages.map((stage, i) => {
            const active = i === index;
            return (
              <div
                key={stage}
                id={panelId(stage)}
                role="tabpanel"
                aria-labelledby={tabId(stage)}
                aria-hidden={!active}
                inert={!active}
                tabIndex={active ? 0 : -1}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500 ease-out-expo",
                  active ? "opacity-100" : "opacity-0",
                )}
              >
                {stage === "design" && <DesignPanel copy={copy} />}
                {stage === "code" && <CodePanel key={active ? "active" : "idle"} copy={copy} />}
                {stage === "live" && <LivePanel copy={copy} />}
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 border-t border-border p-2">
          <div role="tablist" aria-label={copy.label} className="grid flex-1 grid-cols-3 gap-1">
            {showcaseStages.map((stage, i) => {
              const active = i === index;
              return (
                <button
                  key={stage}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={tabId(stage)}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={panelId(stage)}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={onTabKeyDown}
                  className={cn(
                    "relative flex items-center justify-center gap-2 overflow-hidden rounded-lg px-2 py-2.5 text-sm font-medium transition-colors duration-200",
                    active ? "bg-white/[0.07] text-fg" : "text-fg-muted hover:bg-white/[0.04] hover:text-fg",
                  )}
                >
                  <span aria-hidden="true" className="hidden font-mono text-xs text-fg-subtle xs:inline">
                    0{i + 1}
                  </span>
                  {copy.tabs[stage]}
                  {active && running ? (
                    <span
                      key={index}
                      aria-hidden="true"
                      data-testid="showcase-progress"
                      className="absolute inset-x-3 bottom-1 h-0.5 origin-left animate-progress rounded-full bg-accent-text"
                      style={{ "--progress-duration": `${STAGE_DURATION_MS}ms` } as CSSProperties}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
          {reducedMotion ? null : (
            <button
              type="button"
              onClick={() => setAutoplay((value) => !value)}
              aria-label={autoplay ? copy.pause : copy.play}
              className="grid size-10 shrink-0 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
            >
              {autoplay ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function WireBox({ label, className, children }: { label?: string; className?: string; children?: ReactNode }) {
  return (
    <div
      className={cn(
        "relative rounded-[1.2cqw] border border-dashed border-accent-text/45 bg-accent/[0.05]",
        className,
      )}
    >
      {label ? (
        <span className="absolute -top-[1.3cqw] left-[1.6cqw] bg-surface px-[0.8cqw] font-mono text-[1.7cqw] leading-none text-accent-text">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}

function DesignPanel({ copy }: { copy: ShowcaseCopy }) {
  return (
    <div className="absolute inset-0 bg-surface p-[4cqw]">
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-60" />
      <div className="relative flex h-full flex-col gap-[3.2cqw]">
        <WireBox label={copy.wireframe.header} className="flex h-[9cqw] items-center justify-between px-[3cqw]">
          <span className="h-[2.6cqw] w-[13cqw] rounded-full bg-white/15" />
          <span className="flex gap-[1.6cqw]">
            <span className="h-[1.6cqw] w-[7cqw] rounded-full bg-white/10" />
            <span className="h-[1.6cqw] w-[7cqw] rounded-full bg-white/10" />
            <span className="h-[1.6cqw] w-[7cqw] rounded-full bg-white/10" />
          </span>
        </WireBox>

        <WireBox label={copy.wireframe.hero} className="flex flex-1 flex-col justify-center gap-[2cqw] px-[4cqw]">
          <span className="h-[3.6cqw] w-3/5 rounded-full bg-white/15" />
          <span className="h-[3.6cqw] w-2/5 rounded-full bg-white/15" />
          <span className="h-[1.6cqw] w-1/2 rounded-full bg-white/10" />
          <span className="mt-[1cqw] h-[5cqw] w-[18cqw] rounded-full border border-dashed border-accent-text/60" />
          {/* Selection handles, as in a design tool */}
          <span className="pointer-events-none absolute inset-[1.5cqw] rounded-[0.8cqw] border border-accent-text/70">
            <span className="absolute -top-[0.7cqw] -left-[0.7cqw] size-[1.4cqw] rounded-[0.3cqw] bg-accent-text" />
            <span className="absolute -top-[0.7cqw] -right-[0.7cqw] size-[1.4cqw] rounded-[0.3cqw] bg-accent-text" />
            <span className="absolute -bottom-[0.7cqw] -left-[0.7cqw] size-[1.4cqw] rounded-[0.3cqw] bg-accent-text" />
            <span className="absolute -right-[0.7cqw] -bottom-[0.7cqw] size-[1.4cqw] rounded-[0.3cqw] bg-accent-text" />
          </span>
          <MousePointer2
            aria-hidden="true"
            className="absolute right-[18%] bottom-[22%] size-[4cqw] fill-white text-bg"
          />
        </WireBox>

        <div className="grid h-[17cqw] grid-cols-3 gap-[2.6cqw]">
          <WireBox label={copy.wireframe.cards} />
          <WireBox />
          <WireBox />
        </div>
      </div>
    </div>
  );
}

function CodePanel({ copy }: { copy: ShowcaseCopy }) {
  const tag = "text-accent-2";
  const attr = "text-accent-text";
  const str = "text-success";
  const punct = "text-fg-subtle";

  const lines: ReactNode[] = [
    <>
      <span className={punct}>&lt;</span>
      <span className={tag}>Header</span>
      <span className={punct}>&gt;</span>
    </>,
    <>
      {"  "}
      <span className={punct}>&lt;</span>
      <span className={tag}>Logo</span> <span className={attr}>name</span>
      <span className={punct}>=</span>
      <span className={str}>&quot;{copy.mock.brand}&quot;</span> <span className={punct}>/&gt;</span>
    </>,
    <>
      {"  "}
      <span className={punct}>&lt;</span>
      <span className={tag}>Nav</span> <span className={attr}>links</span>
      <span className={punct}>={"{"}</span>3<span className={punct}>{"}"} /&gt;</span>
    </>,
    <>
      <span className={punct}>&lt;/</span>
      <span className={tag}>Header</span>
      <span className={punct}>&gt;</span>
    </>,
    <>
      <span className={punct}>&lt;</span>
      <span className={tag}>Hero</span> <span className={attr}>title</span>
      <span className={punct}>=</span>
      <span className={str}>&quot;{copy.mock.title}&quot;</span>
      <span className={punct}>&gt;</span>
    </>,
    <>
      {"  "}
      <span className={punct}>&lt;</span>
      <span className={tag}>Button</span>
      <span className={punct}>&gt;</span>
      {copy.mock.cta}
      <span className={punct}>&lt;/</span>
      <span className={tag}>Button</span>
      <span className={punct}>&gt;</span>
    </>,
    <>
      <span className={punct}>&lt;/</span>
      <span className={tag}>Hero</span>
      <span className={punct}>&gt;</span>
    </>,
    <>
      <span className={punct}>&lt;</span>
      <span className={tag}>Cards</span> <span className={attr}>items</span>
      <span className={punct}>={"{"}</span>3<span className={punct}>{"}"} /&gt;</span>
      <span className="ml-[0.4cqw] inline-block h-[3cqw] w-[0.6cqw] translate-y-[0.5cqw] animate-caret bg-accent-text" />
    </>,
  ];

  return (
    <div className="absolute inset-0 flex flex-col bg-[#0b0b11]">
      <div className="flex items-center gap-[2cqw] border-b border-border px-[3cqw] py-[1.6cqw]">
        <span className="rounded-[0.6cqw] bg-white/[0.06] px-[1.6cqw] py-[0.6cqw] font-mono text-[1.8cqw] text-fg-muted">
          page.tsx
        </span>
      </div>
      <pre className="flex-1 overflow-hidden px-[3cqw] py-[3cqw] font-mono text-[2.35cqw] leading-[1.9] text-fg">
        {lines.map((line, i) => (
          <span
            key={i}
            className="flex animate-fade-up whitespace-pre"
            style={{ animationDelay: `${i * 110}ms` }}
          >
            <span aria-hidden="true" className="mr-[3cqw] inline-block w-[3cqw] text-right text-fg-subtle/70">
              {i + 1}
            </span>
            <span>{line}</span>
          </span>
        ))}
      </pre>
    </div>
  );
}

function LivePanel({ copy }: { copy: ShowcaseCopy }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-br from-accent/30 via-bg to-accent-2/20" />
      <div aria-hidden="true" className="absolute -top-[20cqw] -right-[10cqw] size-[50cqw] rounded-full bg-accent/30 blur-[8cqw]" />

      <div className="relative flex h-full flex-col p-[4cqw]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-[1.4cqw] font-display text-[2.4cqw] font-semibold text-fg">
            <span className="size-[3cqw] rounded-[0.8cqw] bg-linear-to-br from-accent to-accent-2" />
            {copy.mock.brand}
          </span>
          <span className="flex gap-[2.4cqw] text-[1.9cqw] text-fg-muted">
            {copy.mock.nav.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </span>
        </div>

        <div className="mt-[7cqw] max-w-[70%]">
          <p className="font-display text-[6.2cqw] leading-[1.05] font-semibold tracking-tight text-fg">
            {copy.mock.title}
          </p>
          <p className="mt-[1.8cqw] text-[2.3cqw] text-fg-muted">{copy.mock.text}</p>
          <span className="mt-[3cqw] inline-block rounded-full bg-accent px-[3cqw] py-[1.4cqw] text-[2cqw] font-medium text-accent-fg">
            {copy.mock.cta}
          </span>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-[2.4cqw]">
          {copy.mock.cards.map((card) => (
            <div key={card} className="rounded-[1.4cqw] border border-border bg-white/[0.04] p-[2cqw] backdrop-blur">
              <span className="block size-[3.4cqw] rounded-[0.8cqw] bg-accent/40" />
              <span className="mt-[1.4cqw] block text-[1.9cqw] font-medium text-fg">{card}</span>
              <span className="mt-[1cqw] block h-[1cqw] w-4/5 rounded-full bg-white/10" />
            </div>
          ))}
        </div>

        <span className="absolute top-[13cqw] right-[4cqw] flex animate-float items-center gap-[1cqw] rounded-full border border-success/30 bg-success/10 px-[2cqw] py-[1cqw] text-[1.9cqw] font-medium text-success">
          <Check aria-hidden="true" className="size-[2.4cqw]" />
          {copy.mock.liveBadge}
        </span>
      </div>
    </div>
  );
}
