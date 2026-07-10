import { Font } from '@react-pdf/renderer';

export const PALETTE_COLORS = {
  'color-1': '#de21a2',
  'color-2': '#5a21de',
  'color-3': '#01cf27',
  'color-4': '#de7921',
  'color-5': '#de2124',
  'color-6': '#585858',
};

const LOCAL_FONTS = {
  Poppins: [
    { src: '/front-assets/fonts/Poppins-Regular.ttf' },
    { src: '/front-assets/fonts/Poppins-Bold.ttf', fontWeight: '700' },
  ],
  Roboto: [
    { src: '/front-assets/fonts/Roboto-Regular.ttf' },
    { src: '/front-assets/fonts/Roboto-Bold.ttf', fontWeight: '700' },
  ],
  Montserrat: [
    { src: '/front-assets/fonts/Montserrat-Regular.ttf' },
    { src: '/front-assets/fonts/Montserrat-Bold.ttf', fontWeight: '700' },
  ],
  'Open Sans': [
    { src: '/front-assets/fonts/OpenSans-Regular.ttf' },
    { src: '/front-assets/fonts/OpenSans-Bold.ttf', fontWeight: '700' },
  ],
};

const isAbsoluteUrl = (value) => typeof value === 'string' && /^(https?:)?\/\//i.test(value);

export const resolveAssetUrl = (value) => {
  if (!value || typeof value !== 'string') return null;
  if (isAbsoluteUrl(value)) {
    if (value.startsWith('//')) return `${window.location.protocol}${value}`;
    return value;
  }
  if (value.startsWith('/')) {
    return `${window.location.origin}${value}`;
  }
  return value;
};

const urlExists = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

export const registerAvailableFonts = async () => {
  if (typeof window === 'undefined' || typeof fetch !== 'function') {
    return false;
  }

  let registeredOne = false;

  for (const [family, fonts] of Object.entries(LOCAL_FONTS)) {
    const availableFonts = [];

    for (const font of fonts) {
      const resolvedSrc = resolveAssetUrl(font.src);
      if (!resolvedSrc) continue;
      if (await urlExists(resolvedSrc)) {
        availableFonts.push({ ...font, src: resolvedSrc });
      }
    }

    if (availableFonts.length > 0) {
      try {
        Font.register({ family, fonts: availableFonts });
        registeredOne = true;
      } catch (error) {
        // ignore failed registration for this family
      }
    }
  }

  return registeredOne;
};

export const safeText = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  return String(value).trim();
};

export const getFullName = (personal = {}, resumeName = '') => {
  const first = safeText(personal.firstName);
  const last = safeText(personal.lastName);
  return [first, last].filter(Boolean).join(' ') || safeText(resumeName) || 'Resume';
};

export const resolveProfileImage = (photo) => {
  if (!photo || typeof photo !== 'string') return null;
  const trimmed = photo.trim();
  if (trimmed.length === 0) return null;
  // If already a data URI, return as-is
  if (trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (isAbsoluteUrl(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return `${typeof window !== 'undefined' ? window.location.origin : ''}${trimmed}`;
  }
  return `https://${trimmed}`;
};

export const imageToBase64 = async (imageUrl) => {
  if (!imageUrl) return null;
  
  // If already a data URI, return it as-is
  if (typeof imageUrl === 'string' && imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  try {
    // Ensure we have an absolute URL
    let url = imageUrl;
    if (imageUrl.startsWith('/')) {
      url = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}${imageUrl}`;
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

export const formatDateRange = (startMonth, startYear, endMonth, endYear) => {
  const start = [safeText(startMonth), safeText(startYear)].filter(Boolean).join(' ');
  const end = !endMonth && !endYear ? 'Present' : [safeText(endMonth), safeText(endYear)].filter(Boolean).join(' ');
  if (start && end) return `${start} — ${end}`;
  if (start) return start;
  if (end) return end;
  return '';
};
