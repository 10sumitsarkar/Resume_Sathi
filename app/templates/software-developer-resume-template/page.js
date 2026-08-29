import SoftwareDeveloperResumeTemplateClient from "./SoftwareDeveloperResumeTemplateClient";
import { buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("software-developer-resume-template");

export default function SoftwareDeveloperResumeTemplatePage() {
  return <SoftwareDeveloperResumeTemplateClient />;
}
