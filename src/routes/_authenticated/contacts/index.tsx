import { createFileRoute } from "@tanstack/react-router";
import { ContactsPage } from "@/components/im/students/student-list";

export const Route = createFileRoute("/_authenticated/contacts/")({
  head: () => ({ meta: [{ title: "Contatos — Instituto Mix" }] }),
  component: ContactsPage,
});
