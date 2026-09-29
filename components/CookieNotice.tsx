"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function CookieNotice() {
  const { lang } = useLanguage();
  const isEnglish = lang === "en";

  return (
    <article className="mx-auto max-w-content px-6 py-16 md:py-24">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-muted">
        {isEnglish ? "Privacy" : "Confidențialitate"}
      </p>
      <h1 className="mb-8 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
        {isEnglish ? "Cookies & performance" : "Cookie-uri și performanță"}
      </h1>

      <div className="max-w-3xl space-y-8 text-base leading-7 text-muted">
        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            {isEnglish ? "Language preference" : "Preferința de limbă"}
          </h2>
          <p>
            {isEnglish
              ? "The site stores your selected language in a first-party cookie named daner-language. It is used only to remember Romanian or English on later visits, lasts up to one year, and is not used for advertising. You can remove it in your browser settings; the site will then default to Romanian unless you choose a language in the URL."
              : "Site-ul salvează limba aleasă într-un cookie propriu numit daner-language. Este folosit doar pentru a reține româna sau engleza la vizitele următoare, are o durată de până la un an și nu este folosit pentru publicitate. Îl poți șterge din setările browserului; apoi site-ul va reveni la română, dacă nu alegi o limbă din URL."}
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            {isEnglish ? "Performance measurement" : "Măsurarea performanței"}
          </h2>
          <p>
            {isEnglish
              ? "The site includes Vercel Speed Insights. When enabled for the deployment, it reports aggregated website performance measurements (such as Core Web Vitals) to Vercel. Vercel states that Speed Insights does not use cookies or identify individual visitors. See Vercel’s privacy information for details."
              : "Site-ul include Vercel Speed Insights. Când este activat pentru deployment, acesta transmite către Vercel măsurători agregate despre performanța site-ului (precum Core Web Vitals). Vercel declară că Speed Insights nu folosește cookie-uri și nu identifică vizitatorii individuali. Consultă informațiile de confidențialitate Vercel pentru detalii."}
          </p>
          <a
            className="mt-3 inline-block text-foreground underline underline-offset-4"
            href="https://vercel.com/docs/speed-insights/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            {isEnglish ? "Vercel Speed Insights privacy policy" : "Politica de confidențialitate Vercel Speed Insights"}
          </a>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-medium text-foreground">
            {isEnglish ? "Contact form" : "Formularul de contact"}
          </h2>
          <p>
            {isEnglish
              ? "If you send a message through the contact form, the information you provide is processed to respond to your enquiry. A full privacy notice covering the data controller, legal basis, retention, recipients, and your rights must be published before the form is used for real enquiries."
              : "Dacă trimiți un mesaj prin formularul de contact, informațiile furnizate sunt prelucrate pentru a răspunde solicitării. Înainte de folosirea formularului pentru solicitări reale, trebuie publicată o informare completă despre operator, temeiul legal, păstrarea datelor, destinatari și drepturile tale."}
          </p>
        </section>
      </div>
    </article>
  );
}
