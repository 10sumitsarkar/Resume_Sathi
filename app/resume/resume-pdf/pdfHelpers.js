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
    { src: '/front-assets/fonts/Poppins-Regular.ttf', fontWeight: 400, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Poppins-Medium.ttf', fontWeight: 500, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Poppins-SemiBold.ttf', fontWeight: 600, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Poppins-Bold.ttf', fontWeight: 700, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Poppins-Italic.ttf', fontStyle: 'italic', fontWeight: 400 },
    { src: '/front-assets/fonts/Poppins-BoldItalic.ttf', fontStyle: 'italic', fontWeight: 700 },
  ],
  Roboto: [
    { src: '/front-assets/fonts/Roboto-Regular.ttf', fontWeight: 400, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Roboto-Medium.ttf', fontWeight: 500, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Roboto-SemiBold.ttf', fontWeight: 600, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Roboto-Bold.ttf', fontWeight: 700, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Roboto-Italic.ttf', fontStyle: 'italic', fontWeight: 400 },
    { src: '/front-assets/fonts/Roboto-BoldItalic.ttf', fontStyle: 'italic', fontWeight: 700 },
  ],
  Montserrat: [
    { src: '/front-assets/fonts/Montserrat-Regular.ttf', fontWeight: 400, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Montserrat-Medium.ttf', fontWeight: 500, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Montserrat-SemiBold.ttf', fontWeight: 600, fontStyle: 'normal' },
    { src: '/front-assets/fonts/Montserrat-Bold.ttf', fontWeight: 700, fontStyle: 'normal' },
  ],
  'Open Sans': [
    { src: '/front-assets/fonts/OpenSans-Regular.ttf', fontWeight: 400, fontStyle: 'normal' },
    { src: '/front-assets/fonts/OpenSans-Medium.ttf', fontWeight: 500, fontStyle: 'normal' },
    { src: '/front-assets/fonts/OpenSans-SemiBold.ttf', fontWeight: 600, fontStyle: 'normal' },
    { src: '/front-assets/fonts/OpenSans-Bold.ttf', fontWeight: 700, fontStyle: 'normal' },
    { src: '/front-assets/fonts/OpenSans-Italic.ttf', fontStyle: 'italic', fontWeight: 400 },
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
        let fontsToRegister = availableFonts;
        const hasItalic = availableFonts.some((font) => font.fontStyle === 'italic');

        if (!hasItalic) {
          try {
            const googleFonts = await fetchGoogleFontsForFamily(family);
            if (googleFonts && googleFonts.length > 0) {
              const safeGoogleFonts = googleFonts.filter((font) => /\.(ttf|otf)$/i.test(font.src));
              if (safeGoogleFonts.length > 0) {
                fontsToRegister = availableFonts.concat(safeGoogleFonts);
              }
            }
          } catch (e) {
            // ignore remote fetch failures and keep local fonts only
          }
        }

        Font.register({ family, fonts: fontsToRegister });
        // Log what was registered for easier debugging in the client
        try {
          // eslint-disable-next-line no-console
          console.info('[pdfHelpers] Registered local fonts for', family, fontsToRegister.map(f => f.src));
        } catch (e) {}
        registeredOne = true;
      } catch (error) {
        // ignore failed registration for this family
      }
    } else {
      // Try registering from Google Fonts as a fallback (client-side);
      // only keep safe TTF/OTF URLs because @react-pdf may not support
      // browser-served WOFF/WOFF2 files in this environment.
      try {
        const gf = await fetchGoogleFontsForFamily(family);
        if (gf && gf.length > 0) {
          const safeGoogleFonts = gf.filter((font) => /\.(ttf|otf)$/i.test(font.src));
          if (safeGoogleFonts.length > 0) {
            Font.register({ family, fonts: safeGoogleFonts });
            try {
              // eslint-disable-next-line no-console
              console.info('[pdfHelpers] Registered remote Google fonts for', family, safeGoogleFonts.map(f => f.src));
            } catch (e) {}
            registeredOne = true;
          }
        }
      } catch (e) {
        // ignore fetch/register errors
      }
    }
  }

  return registeredOne;
};

// Fetch Google Fonts CSS for a family and extract font file URLs (weights 400/700 preferred).
const fetchGoogleFontsForFamily = async (family) => {
  try {
    // Request full weight + italic ranges so the fetched CSS includes all
    // available font files (normal + italic, 100-900).
    const familyQuery = encodeURIComponent(family.replace(/\s+/g, '+')) + ':ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900';
    const cssUrl = `https://fonts.googleapis.com/css2?family=${familyQuery}&display=swap`;
    const res = await fetch(cssUrl, { cache: 'no-store' });
    if (!res.ok) return [];
    const cssText = await res.text();

    // Extract all url(...) occurrences within each @font-face block and
    // capture their font-weight and font-style metadata.
    const faces = cssText.split('@font-face').map((s) => s.trim()).filter(Boolean);
    const fonts = [];
    for (const face of faces) {
      // find all URLs in the src declaration
      const urlMatches = Array.from(face.matchAll(/url\(([^)]+)\)/ig));
      if (!urlMatches.length) continue;
      const weightMatch = face.match(/font-weight:\s*(\d+)/i);
      const weight = weightMatch ? String(weightMatch[1]) : undefined;
      const isItalic = /font-style:\s*italic/i.test(face);
      for (const m of urlMatches) {
        const raw = m[1] || '';
        const url = raw.replace(/"|'/g, '').trim();
        if (!url) continue;
        const fontEntry = { src: url };
        if (weight) fontEntry.fontWeight = weight;
        if (isItalic) fontEntry.fontStyle = 'italic';
        fonts.push(fontEntry);
      }
    }

    // Deduplicate by src
    const unique = [];
    const seen = new Set();
    for (const f of fonts) {
      if (!seen.has(f.src)) {
        seen.add(f.src);
        unique.push(f);
      }
    }

    return unique;
  } catch (error) {
    return [];
  }
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
