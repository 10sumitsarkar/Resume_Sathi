import TeacherResumeTemplateClient from "./TeacherResumeTemplateClient";
import { TemplateSeoScript, buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("teacher-resume-template");

export default function TeacherResumeTemplatePage() {
  return (
    <>
      <TemplateSeoScript slug="teacher-resume-template" />
      <TeacherResumeTemplateClient />
    </>
  );
}
