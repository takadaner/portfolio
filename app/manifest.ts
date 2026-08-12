import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Abdula Daner — Full-Stack Developer & Tech Builder",
    short_name: "Abdula Daner",
    description:
      "Aplicații web moderne, automatizări AI și soluții software de Abdula Daner.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
