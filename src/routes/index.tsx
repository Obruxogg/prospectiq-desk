import { createFileRoute } from "@tanstack/react-router";
import { CommercialApp } from "@/components/commercial-app";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Nexo Comercial | Gestão de cursos" },
    { name: "description", content: "Plataforma interna para simulações, propostas e CRM de cursos profissionalizantes." },
    { property: "og:title", content: "Nexo Comercial" },
    { property: "og:description", content: "Gestão comercial de cursos profissionalizantes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: CommercialApp,
});
