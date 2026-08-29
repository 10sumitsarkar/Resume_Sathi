import AccountingResumeTemplateClient from "./AccountingResumeTemplateClient";
import { buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("accounting-resume-template");

export default function AccountingResumeTemplatePage() {
  return <AccountingResumeTemplateClient />;
}
