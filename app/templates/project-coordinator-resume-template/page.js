import ProjectCoordinatorResumeTemplateClient from "./ProjectCoordinatorResumeTemplateClient";
import { TemplateSeoScript, buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("project-coordinator-resume-template");

export default function ProjectCoordinatorResumeTemplatePage() {
  return (
    <>
      <TemplateSeoScript slug="project-coordinator-resume-template" />
      <ProjectCoordinatorResumeTemplateClient />
    </>
  );
}
