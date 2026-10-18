import {
  BarChart3,
  Bell,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import { concepts } from "@/content/sq/concepts";
import { ConceptImage, type ConceptProps } from "./concept-ui";

const copy = concepts["panel-palestre"];
const img = (name: string) => `/projects/panel-palestre/${name}.jpg`;
const navIcons = [LayoutDashboard, Users, CalendarDays, CreditCard, BarChart3];
/** Illustrative weekly check-ins (bar heights, % of chart). */
const weekly = [55, 72, 64, 88, 70, 92, 40];

function NextClassCard({ sizes, eager, tall }: { sizes: string; eager?: boolean; tall?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${tall ? "h-full" : "h-48"}`}>
      <ConceptImage src={img("hero")} sizes={sizes} eager={eager} className="absolute inset-0" />
      <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-transparent" />
      <div className="absolute inset-y-0 left-0 flex flex-col justify-end p-6">
        <span className="w-fit rounded-full bg-[#c6f36d] px-3 py-1 text-xs font-semibold text-[#0b0f0d]">{copy.nextClass}</span>
        <span className="mt-3 font-concept-condensed text-4xl leading-none tracking-wide text-white uppercase">
          {copy.className}
        </span>
        <span className="mt-2 text-sm text-white/75">{copy.classTime}</span>
        <span className="mt-1 text-xs text-[#c6f36d]">{copy.spots}</span>
      </div>
    </div>
  );
}

function Schedule() {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#121815] p-5">
      <p className="text-sm font-semibold text-white">{copy.scheduleTitle}</p>
      <ul className="mt-4 grid gap-3">
        {copy.schedule.map(([time, name]) => (
          <li key={time} className="flex items-center gap-4 text-sm">
            <span className="w-12 text-white/60">{time}</span>
            <span className="h-8 w-1 rounded-full bg-[#c6f36d]/70" />
            <span className="text-white">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Kpis({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid gap-4 ${compact ? "grid-cols-3" : "grid-cols-3"}`}>
      {copy.kpis.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/8 bg-[#121815] p-4">
          <p className={`${compact ? "text-[calc(var(--u)*10)]" : "text-xs"} text-white/60`}>{label}</p>
          <p className={`mt-1 font-concept-condensed ${compact ? "text-3xl" : "text-5xl"} leading-none text-white`}>
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Gym management web app: dark dashboard, lime accent, condensed display type. */
export function GymConcept({ device, sizes, eager }: ConceptProps) {
  if (device === "mobile") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#0b0f0d] text-white">
        <header className="flex items-center justify-between px-5 pt-14 pb-4">
          <span>
            <span className="block text-xs text-white/60">{copy.sub}</span>
            <span className="block font-concept-condensed text-3xl tracking-wide uppercase">{copy.greeting}</span>
          </span>
          <span className="grid size-10 place-items-center rounded-full bg-[#c6f36d] text-sm font-semibold text-[#0b0f0d]">
            {copy.avatar}
          </span>
        </header>
        <div className="grid gap-4 px-4">
          <Kpis compact />
          <NextClassCard sizes={sizes} eager={eager} />
          <Schedule />
        </div>
        <nav className="absolute inset-x-0 bottom-0 grid grid-cols-4 border-t border-white/10 bg-[#0f1411] px-2 pt-3 pb-7 text-center text-[calc(var(--u)*11)] text-white/60">
          {copy.tabs.map((tab, i) => {
            const Icon = [LayoutDashboard, CalendarDays, Users, User][i] ?? User;
            return (
              <span key={tab} className={`flex flex-col items-center gap-1 ${i === 0 ? "text-[#c6f36d]" : ""}`}>
                <Icon className="size-5" />
                {tab}
              </span>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex bg-[#0b0f0d] text-white">
      <aside className="flex w-60 flex-col border-r border-white/8 bg-[#0f1411] px-5 py-7">
        <span className="px-2">
          <span className="block font-concept-condensed text-4xl leading-none tracking-wider text-[#c6f36d]">
            {copy.brand}
          </span>
          <span className="block text-xs tracking-[0.25em] text-white/60 uppercase">{copy.brandSub}</span>
        </span>
        <nav className="mt-10 grid gap-1.5">
          {copy.nav.map((item, i) => {
            const Icon = navIcons[i] ?? LayoutDashboard;
            return (
              <span
                key={item}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                  i === 0 ? "bg-[#c6f36d]/12 font-semibold text-[#c6f36d]" : "text-white/70"
                }`}
              >
                <Icon className="size-4.5" /> {item}
              </span>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 px-9 py-7">
        <div className="flex items-center justify-between gap-6">
          <span className="flex w-96 items-center gap-3 rounded-xl border border-white/8 bg-[#121815] px-4 py-3 text-sm text-white/50">
            <Search className="size-4" /> {copy.search}
          </span>
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-xl bg-[#c6f36d] px-5 py-3 text-sm font-semibold text-[#0b0f0d]">
              <Plus className="size-4" /> {copy.action}
            </span>
            <Bell className="size-5 text-white/70" />
            <span className="grid size-10 place-items-center rounded-full bg-[#1f2a24] text-sm font-semibold">{copy.avatar}</span>
          </span>
        </div>

        <p className="mt-8 font-concept-condensed text-5xl leading-none tracking-wide uppercase">{copy.greeting}</p>
        <p className="mt-2 text-sm text-white/60">{copy.sub}</p>

        <div className="mt-6">
          <Kpis />
        </div>

        <div className="mt-5 grid h-64 grid-cols-[1.5fr_1fr] gap-5">
          <NextClassCard sizes={sizes} eager={eager} tall />
          <Schedule />
        </div>

        <div className="mt-5 rounded-2xl border border-white/8 bg-[#121815] p-5">
          <p className="text-sm font-semibold">{copy.chartTitle}</p>
          <div className="mt-4 flex h-24 items-end gap-4">
            {weekly.map((height, i) => (
              <div key={i} className="flex h-full flex-1 flex-col items-center gap-2">
                {/* Definite-height track so the bar's percentage height resolves. */}
                <span className="flex w-full flex-1 items-end">
                  <span
                    className={`w-full rounded-t-md ${i === 5 ? "bg-[#c6f36d]" : "bg-[#c6f36d]/30"}`}
                    style={{ height: `${height}%` }}
                  />
                </span>
                <span className="text-xs text-white/60">{copy.days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
