import { createFileRoute } from "@tanstack/react-router";
import { OfferBuilderPage } from "@/components/im/offer/offer-builder";

export const Route = createFileRoute("/_authenticated/simulation")({
  head: () => ({ meta: [{ title: "Nova Simulação — Instituto Mix" }] }),
  component: OfferBuilderPage,
});
