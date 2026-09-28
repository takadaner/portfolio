"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Bot, RotateCcw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import {
  getConciergeScenario,
  type ConciergeScenarioId,
} from "@/lib/night-concierge";

type Message = { role: "guest" | "concierge"; text: string };

const scenarioIds: ConciergeScenarioId[] = ["late-checkin", "breakfast", "local-guide"];

export default function NightConciergeDemo() {
  const { lang } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const ro = lang === "ro";

  function tryScenario(id: ConciergeScenarioId) {
    const scenario = getConciergeScenario(id, lang);
    if (!scenario) return;
    setMessages((current) => [
      ...current,
      { role: "guest", text: scenario.guestMessage },
      { role: "concierge", text: scenario.reply },
    ]);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#090c0d] px-5 pb-24 pt-28 text-[#eff4ef] sm:px-8 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(111,174,137,0.16),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white">
          <ArrowLeft size={16} /> {ro ? "Înapoi la proiecte" : "Back to projects"}
        </Link>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-16">
          <section>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-emerald-100/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-100/80">
              <Sparkles size={13} /> {ro ? "Concept independent · Demo" : "Independent concept · Demo"}
            </span>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-[1.03] tracking-tight sm:text-6xl">
              {ro ? <>O primire caldă,<br /><span className="text-emerald-200/75">la orice oră.</span></> : <>A warmer welcome,<br /><span className="text-emerald-200/75">at any hour.</span></>}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              {ro
                ? "Un concept de concierge digital pentru hoteluri mici: util, calm și atent la detaliile care fac un sejur să se simtă personal."
                : "A digital concierge concept for independent hotels: useful, calm, and thoughtful about the details that make a stay feel personal."}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Product design", "Hospitality", "Conversational UX", "Next.js"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55">{tag}</span>
              ))}
            </div>
            <p className="mt-8 max-w-lg border-l border-emerald-200/40 pl-4 text-sm leading-relaxed text-white/45">
              {ro
                ? "Notă: acesta este un prototip de interfață. Răspunsurile sunt simulate; nu sunt conectate un model AI, rezervări sau servicii hoteliere."
                : "Note: this is an interface prototype. Replies are simulated; no AI model, booking system, or hotel service is connected."}
            </p>
          </section>

          <section aria-label={ro ? "Demo de conversație" : "Conversation demo"} className="rounded-[2rem] border border-white/10 bg-[#111617]/90 p-4 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-2 pb-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-200/10 text-emerald-100"><Bot size={21} /></div>
                <div>
                  <div className="font-medium">{ro ? "Concierge de noapte" : "Night concierge"}</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-200/70"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />{ro ? "Aici pentru tine" : "Here for you"}</div>
                </div>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-white/35">01:42</span>
            </div>

            <div aria-live="polite" className="flex min-h-[280px] flex-col gap-4 py-6">
              {messages.length === 0 ? (
                <>
                  <div className="max-w-[86%] self-start rounded-2xl rounded-tl-sm bg-white/[0.07] px-4 py-3 text-sm leading-relaxed text-white/80">
                    {ro ? "Bună seara, sunt aici dacă ai nevoie de ceva. Cu ce te pot ajuta?" : "Good evening. I’m here if you need anything. How can I help?"}
                  </div>
                  <div className="mt-auto self-end text-[11px] text-white/30">{ro ? "Alege o întrebare ca să încerci demo-ul" : "Choose a prompt to try the demo"}</div>
                </>
              ) : messages.map((message, index) => (
                <div key={`${index}-${message.role}`} className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === "guest" ? "self-end rounded-tr-sm bg-emerald-100 text-[#17211a]" : "self-start rounded-tl-sm bg-white/[0.07] text-white/80"}`}>
                  {message.text}
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.08] pt-5">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">{ro ? "Încearcă un scenariu" : "Try a scenario"}</p>
              <div className="flex flex-wrap gap-2">
                {scenarioIds.map((id) => {
                  const scenario = getConciergeScenario(id, lang);
                  if (!scenario) return null;
                  return (
                    <button key={id} type="button" onClick={() => tryScenario(id)} className="rounded-full border border-white/10 px-3.5 py-2 text-left text-xs text-white/65 transition hover:border-emerald-200/35 hover:bg-emerald-100/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200">
                      {scenario.guestMessage}
                    </button>
                  );
                })}
                <button type="button" onClick={() => setMessages([])} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-white/35 transition hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200">
                  <RotateCcw size={12} /> {ro ? "Resetează" : "Reset"}
                </button>
              </div>
            </div>
          </section>
        </div>

        <Link href="/projects/hotel-saas-suite" className="mt-16 inline-flex items-center gap-2 text-sm text-emerald-100/70 transition hover:text-emerald-100">
          {ro ? "Explorează ideea Hotel SaaS Suite" : "Explore the Hotel SaaS Suite idea"}<ArrowUpRight size={15} />
        </Link>
      </div>
    </main>
  );
}
