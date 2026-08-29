import TeacherResumeTemplateClient from "./TeacherResumeTemplateClient";
import { buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("teacher-resume-template");

export default function TeacherResumeTemplatePage() {
  return <TeacherResumeTemplateClient />;
}
