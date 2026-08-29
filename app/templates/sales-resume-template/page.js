import SalesResumeTemplateClient from "./SalesResumeTemplateClient";
import { TemplateSeoScript, buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("sales-resume-template");

export default function SalesResumeTemplatePage() {
  return (
    <>
      <TemplateSeoScript slug="sales-resume-template" />
      <SalesResumeTemplateClient />
    </>
  );
}
