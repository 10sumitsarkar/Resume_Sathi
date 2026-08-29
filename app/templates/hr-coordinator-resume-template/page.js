import HrCoordinatorResumeTemplateClient from "./HrCoordinatorResumeTemplateClient";
import { buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("hr-coordinator-resume-template");

export default function HrCoordinatorResumeTemplatePage() {
  return <HrCoordinatorResumeTemplateClient />;
}
