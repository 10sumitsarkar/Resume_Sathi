import OperationsExecutiveResumeTemplateClient from "./OperationsExecutiveResumeTemplateClient";
import { buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("operations-executive-resume-template");

export default function OperationsExecutiveResumeTemplatePage() {
  return <OperationsExecutiveResumeTemplateClient />;
}
