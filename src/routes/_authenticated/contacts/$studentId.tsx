import { createFileRoute } from "@tanstack/react-router";
import { StudentDetailPage } from "@/components/im/students/student-detail";

export const Route = createFileRoute("/_authenticated/contacts/$studentId")({
  head: () => ({ meta: [{ title: "Aluno — Instituto Mix" }] }),
  component: StudentDetailPage,
});
