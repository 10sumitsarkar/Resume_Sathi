import SalesResumeTemplateClient from "./SalesResumeTemplateClient";
import { buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("sales-resume-template");

export default function SalesResumeTemplatePage() {
  return <SalesResumeTemplateClient />;
}
