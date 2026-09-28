import React from "react";
import { siteUrl } from "@/lib/site";

export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Abdula Daner",
    givenName: "Abdula",
    familyName: "Daner",
    alternateName: [
      "Daner Abdula",
      "Abdula Daner Developer",
      "Abdula Daner Full-Stack Developer",
      "Abdula Daner Tech Builder",
    ],
    jobTitle: "Full-Stack Developer & Tech Builder",
    url: siteUrl,
    email: "mailto:abduladaner70@gmail.com",
    telephone: "+40756333392",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Constanța",
      addressRegion: "Constanța",
      addressCountry: "RO",
    },
    sameAs: [
      "https://github.com/takadaner",
      "https://www.linkedin.com/in/daner-abdula-816425188/",
    ],
    knowsAbout: [
      "Web Development",
      "Full-Stack Software Engineering",
      "Next.js",
      "React",
      "TypeScript",
      "Python",
      "FastAPI",
      "AI Automations",
      "WhatsApp Bots (Meta Cloud API)",
      "Hotel SaaS Suite",
      "3D Architectural Renders",
    ],
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profile`,
    url: siteUrl,
    name: "Abdula Daner — Official Personal Portfolio & Services",
    description:
      "Official website and portfolio of Abdula Daner, Full-Stack Developer & Tech Builder specializing in web development, AI automations, and hotel software.",
    mainEntity: {
      "@id": `${siteUrl}/#person`,
    },
    inLanguage: ["ro-RO", "en-US"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Abdula Daner",
    alternateName: ["Abdula Daner Portfolio", "Abdula Daner Website"],
    url: siteUrl,
    description:
      "Aplicații web moderne, automatizări AI și soluții software de Abdula Daner — Full-Stack Developer.",
    inLanguage: ["ro-RO", "en-US"],
    author: {
      "@id": `${siteUrl}/#person`,
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#service`,
    name: "Abdula Daner — Web Development & AI Automations",
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    telephone: "+40756333392",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Constanța",
      addressCountry: "RO",
    },
    priceRange: "$$",
    provider: {
      "@id": `${siteUrl}/#person`,
    },
    offers: [
      {
        "@type": "Offer",
        name: "Dezvoltare Web / Web Development",
        description: "High-performance web applications built with Next.js, React, and TypeScript.",
      },
      {
        "@type": "Offer",
        name: "AI & Automatizări / AI Automations",
        description: "WhatsApp bots, Claude AI virtual assistants, and workflow automations.",
      },
      {
        "@type": "Offer",
        name: "Hotel SaaS Suite",
        description: "Digital compendium, automated guest reviews, and hospitality software.",
      },
    ],
  };

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "SiteNavigationElement",
        position: 1,
        name: "Servicii / Services",
        description: "Web development, AI automations, and hotel software solutions",
        url: `${siteUrl}/services`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 2,
        name: "Proiecte / Projects",
        description: "Portfolio of web applications, SaaS products, and 3D visualizations",
        url: `${siteUrl}/projects`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 3,
        name: "Despre Mine / About Me",
        description: "Background, technical skills, and experience of Abdula Daner",
        url: `${siteUrl}/about`,
      },
      {
        "@type": "SiteNavigationElement",
        position: 4,
        name: "Contact",
        description: "Get in touch with Abdula Daner for project inquiries",
        url: `${siteUrl}/contact`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }}
      />
    </>
  );
}
