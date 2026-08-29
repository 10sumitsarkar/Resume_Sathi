import UiDesignerResumeTemplateClient from "./UiDesignerResumeTemplateClient";
import { buildTemplateMetadata } from "../seoTemplates";

export const metadata = buildTemplateMetadata("ui-designer-resume-template");

export default function UiDesignerResumeTemplatePage() {
  return <UiDesignerResumeTemplateClient />;
}
