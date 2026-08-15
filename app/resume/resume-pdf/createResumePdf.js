import React from 'react';
import { pdf } from '@react-pdf/renderer';
import ResumeTemplate1Pdf from './ResumeTemplate1Pdf';
import ResumeTemplate2Pdf from './ResumeTemplate2Pdf';
import ResumeTemplate3Pdf from './ResumeTemplate3Pdf';
import ResumeTemplate4Pdf from './ResumeTemplate4Pdf';
import ResumeTemplate5Pdf from './ResumeTemplate5Pdf';
import ResumeTemplate6Pdf from './ResumeTemplate6Pdf';
import ResumeTemplate7Pdf from './ResumeTemplate7Pdf';
import ResumeTemplate8Pdf from './ResumeTemplate8Pdf';
import ResumeTemplate9Pdf from './ResumeTemplate9Pdf';


import { getSiteBase } from "../../lib/apiConfig";
import { registerAvailableFonts, resolveProfileImage } from './pdfHelpers';

const PDF_TEMPLATE_MAP = {
  ResumeTemplate1: ResumeTemplate1Pdf,
  ResumeTemplate2: ResumeTemplate2Pdf,
  ResumeTemplate3: ResumeTemplate3Pdf,
  ResumeTemplate4: ResumeTemplate4Pdf,
  ResumeTemplate5: ResumeTemplate5Pdf,
  ResumeTemplate6: ResumeTemplate6Pdf,
  ResumeTemplate7: ResumeTemplate7Pdf,
  ResumeTemplate8: ResumeTemplate8Pdf,
  ResumeTemplate9: ResumeTemplate9Pdf,
};

const sanitizeFileName = (fileName) => {
  return (fileName || 'resume')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

const imageToBase64 = async (imageUrl) => {
  if (!imageUrl) return null;
  
  // If already a data URI, return it as-is
  if (typeof imageUrl === 'string' && imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  try {
    let url = imageUrl;
    if (imageUrl.startsWith('/')) {
      url = `${typeof window !== 'undefined' ? window.location.origin : getSiteBase()}${imageUrl}`;
    }
    
    const response = await fetch(url, { 
      method: 'GET',
      headers: { 'Accept': 'image/*' }
    });
    if (!response.ok) return null;
    
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

const processResumeImages = async (resume) => {
  if (!resume?.personal_infomation?.photo) {
    return resume;
  }

  const processedResume = { ...resume };
  processedResume.personal_infomation = { ...resume.personal_infomation };

  const photoUrl = resolveProfileImage(resume.personal_infomation.photo);
  if (photoUrl) {
    try {
      const base64Image = await imageToBase64(photoUrl);
      if (base64Image) {
        processedResume.personal_infomation.photo = base64Image;
      }
    } catch (error) {
      console.error('Failed to convert photo to base64:', error);
    }
  }

  return processedResume;
};

const mapFontStyleToFamily = (style) => {
  if (!style) return 'Poppins';
  const s = String(style).toLowerCase();
  if (s.includes('poppins')) return 'Poppins';
  if (s.includes('roboto')) return 'Roboto';
  if (s.includes('montserrat')) return 'Montserrat';
  if (s.includes('open') || s.includes('sans')) return 'Open Sans';
  if (s.includes('arial')) return 'Helvetica';
  return 'Poppins';
};

export const createResumePdf = async ({ resume, fileName, selectedTheme, palette, selectedFont }) => {
  if (!resume || typeof resume !== 'object') {
    throw new Error('Resume data is required to generate the PDF.');
  }

  const templateKey = selectedTheme || 'ResumeTemplate1';
  const SelectedPdfTemplate = PDF_TEMPLATE_MAP[templateKey] || ResumeTemplate1Pdf;

  const downloadName = `${sanitizeFileName(fileName || resume.resume_name || 'resume')}.pdf`;
  const fontFamily = mapFontStyleToFamily(selectedFont || resume?.configuration?.font_style);

  let blob;
  const fontsRegistered = await registerAvailableFonts();

  // Process images to base64
  const processedResume = await processResumeImages(resume);

  try {
    blob = await pdf(<SelectedPdfTemplate resume={processedResume} palette={palette} fontFamily={fontFamily} />).toBlob();
  } catch (err) {
    console.warn('PDF render failed with custom fonts, retrying with fallback font.', err);
    try {
      blob = await pdf(<SelectedPdfTemplate resume={processedResume} palette={palette} forceFallbackFont={true} fontFamily={fontFamily} />).toBlob();
    } catch (err2) {
      console.error('Fallback PDF render failed.', err2);
      throw new Error('PDF generation failed after retry. Please try again or use a different browser.');
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = downloadName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
