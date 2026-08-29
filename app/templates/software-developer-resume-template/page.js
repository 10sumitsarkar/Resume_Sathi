import SoftwareDeveloperResumeTemplateClient from "./SoftwareDeveloperResumeTemplateClient";
import { TemplateSeoScript, buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("software-developer-resume-template");

export default function SoftwareDeveloperResumeTemplatePage() {
  return (
    <>
      <TemplateSeoScript slug="software-developer-resume-template" />
      <SoftwareDeveloperResumeTemplateClient />
    </>
  );
}
