import UiDesignerResumeTemplateClient from "./UiDesignerResumeTemplateClient";
import { TemplateSeoScript, buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("ui-designer-resume-template");

export default function UiDesignerResumeTemplatePage() {
  return (
    <>
      <TemplateSeoScript slug="ui-designer-resume-template" />
      <UiDesignerResumeTemplateClient />
    </>
  );
}
