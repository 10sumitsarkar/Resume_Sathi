import AccountingResumeTemplateClient from "./AccountingResumeTemplateClient";
import { TemplateSeoScript, buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("accounting-resume-template");

export default function AccountingResumeTemplatePage() {
  return (
    <>
      <TemplateSeoScript slug="accounting-resume-template" />
      <AccountingResumeTemplateClient />
    </>
  );
}
