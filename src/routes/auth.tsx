import { createFileRoute } from "@tanstack/react-router";
import { CommercialApp } from "@/components/commercial-app";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar | Nexo Comercial" },
    { name: "description", content: "Acesse a plataforma comercial de cursos profissionalizantes." },
    { property: "og:title", content: "Entrar | Nexo Comercial" },
    { property: "og:description", content: "Acesso à gestão comercial de cursos profissionalizantes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: CommercialApp,
});
