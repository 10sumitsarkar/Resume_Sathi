import OperationsExecutiveResumeTemplateClient from "./OperationsExecutiveResumeTemplateClient";
import { TemplateSeoScript, buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("operations-executive-resume-template");

export default function OperationsExecutiveResumeTemplatePage() {
  return (
    <>
      <TemplateSeoScript slug="operations-executive-resume-template" />
      <OperationsExecutiveResumeTemplateClient />
    </>
  );
}
