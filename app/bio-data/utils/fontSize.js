export const getResumeCustomizationClasses = (configuration = {}) => {
  return [
    configuration.color_palette || '',
    configuration.font_style || '',
  ].filter(Boolean).join(' ');
};
