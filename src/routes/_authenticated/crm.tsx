import { createFileRoute } from "@tanstack/react-router";
import { CRMPage } from "@/components/im/crm/kanban-board";

export const Route = createFileRoute("/_authenticated/crm")({
  head: () => ({ meta: [{ title: "CRM — Instituto Mix" }] }),
  component: CRMPage,
});
