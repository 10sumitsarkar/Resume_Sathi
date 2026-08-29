import HrCoordinatorResumeTemplateClient from "./HrCoordinatorResumeTemplateClient";
import { TemplateSeoScript, buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("hr-coordinator-resume-template");

export default function HrCoordinatorResumeTemplatePage() {
  return (
    <>
      <TemplateSeoScript slug="hr-coordinator-resume-template" />
      <HrCoordinatorResumeTemplateClient />
    </>
  );
}
