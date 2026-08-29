import FreshGraduateResumeTemplateClient from "./FreshGraduateResumeTemplateClient";
import { buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("fresh-graduate-resume-template");

export default function FreshGraduateResumeTemplatePage() {
  return <FreshGraduateResumeTemplateClient />;
}
