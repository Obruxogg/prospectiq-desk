import { createFileRoute } from "@tanstack/react-router";
import { IMAuthPage } from "@/components/im/auth-page";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Entrar — Instituto Mix" },
    { name: "description", content: "Acesse o sistema comercial do Instituto Mix." },
    { property: "og:title", content: "Entrar — Instituto Mix" },
    { property: "og:description", content: "Sistema de Gestão Comercial e CRM." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: IMAuthPage,
});
