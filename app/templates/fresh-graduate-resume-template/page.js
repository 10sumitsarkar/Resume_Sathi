import FreshGraduateResumeTemplateClient from "./FreshGraduateResumeTemplateClient";
import { TemplateSeoScript, buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("fresh-graduate-resume-template");

export default function FreshGraduateResumeTemplatePage() {
  return (
    <>
      <TemplateSeoScript slug="fresh-graduate-resume-template" />
      <FreshGraduateResumeTemplateClient />
    </>
  );
}
