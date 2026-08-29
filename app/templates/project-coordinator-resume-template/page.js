import ProjectCoordinatorResumeTemplateClient from "./ProjectCoordinatorResumeTemplateClient";
import { buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("project-coordinator-resume-template");

export default function ProjectCoordinatorResumeTemplatePage() {
  return <ProjectCoordinatorResumeTemplateClient />;
}
