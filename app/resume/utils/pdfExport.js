import { pdf, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const PALETTE_COLORS = {
  'color-1': '#de21a2',
  'color-2': '#5a21de',
  'color-3': '#01cf27',
  'color-4': '#de7921',
  'color-5': '#de2124',
  'color-6': '#585858',
};

const getHexColor = (hex, alpha = 1) => {
  const clean = (hex || '#1f2937').replace('#', '');
  const normalized = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  return { r, g, b, alpha };
};

const normalizeText = (value = '') => String(value).replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

const getValue = (resume, key, fallback = '') => {
  const value = resume?.[key];
  return value ?? fallback;
};

const buildSections = (resume) => {
  const personal = resume?.personal_infomation || {};
  const summaryText = normalizeText(resume?.summary?.summary || '');
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || resume?.resume_name || 'Resume';
  const contactLines = [
    [personal.email, personal.phone].filter(Boolean).join(' • '),
    [personal.city, personal.state, personal.country].filter(Boolean).join(', '),
    personal.website,
  ].filter(Boolean);

  const sections = [];
  if (summaryText) sections.push({ title: 'Summary', lines: [summaryText] });
  if (resume?.educations?.length) {
    sections.push({
      title: 'Education',
      lines: resume.educations.map((item) => `${item.degree || ''}${item.field_study ? ` in ${item.field_study}` : ''}`.trim() + (item.institute_name ? ` • ${item.institute_name}` : '') + (item.year ? ` • ${item.year}` : '')),
    });
  }
  if (resume?.work_experiences?.length) {
    sections.push({
      title: 'Experience',
      lines: resume.work_experiences.map((item) => `${item.job_title || ''}${item.company_name ? ` • ${item.company_name}` : ''}${item.start_year ? ` • ${item.start_year}` : ''}`.trim()),
    });
  }
  if (resume?.skills?.length) {
    sections.push({ title: 'Skills', lines: resume.skills.map((item) => `${item.skill_name || ''}${item.proficiency_level ? ` (${item.proficiency_level})` : ''}`.trim()) });
  }
  if (resume?.certificates?.length) {
    sections.push({ title: 'Certificates', lines: resume.certificates.map((item) => `${item.certificate_name || ''}${item.issuing_organization ? ` • ${item.issuing_organization}` : ''}`.trim()) });
  }
  if (resume?.languages?.length) {
    sections.push({ title: 'Languages', lines: resume.languages.map((item) => `${item.language || ''}${item.proficiency_level ? ` (${item.proficiency_level})` : ''}`.trim()) });
  }
  if (resume?.hobbies?.length) {
    sections.push({ title: 'Hobbies', lines: resume.hobbies.map((item) => item.hobbies || item).filter(Boolean) });
  }
  if (resume?.social_medias?.length) {
    sections.push({ title: 'Social', lines: resume.social_medias.map((item) => `${item.social_name || ''}${item.social_url ? ` • ${item.social_url}` : ''}`.trim()) });
  }

  return { fullName, contactLines, sections };
};

const getThemeConfig = (selectedTheme = 'ResumeTemplate1', palette = 'color-1') => {
  const accentColor = PALETTE_COLORS[palette] || '#1f2937';
  const themeKey = selectedTheme || 'ResumeTemplate1';
  const accent = getHexColor(accentColor);

  if (themeKey === 'ResumeTemplate2') {
    return { layout: 'template2', accent, accentHex: accentColor, titleSize: 24, sectionTitleSize: 12, bodySize: 10 };
  }
  if (themeKey === 'ResumeTemplate3') {
    return { layout: 'template3', accent, accentHex: accentColor, titleSize: 22, sectionTitleSize: 11, bodySize: 10 };
  }
  if (themeKey === 'ResumeTemplate4') {
    return { layout: 'template4', accent, accentHex: accentColor, titleSize: 22, sectionTitleSize: 11, bodySize: 10 };
  }
   if (themeKey === 'ResumeTemplate5') {
    return { layout: 'template5', accent, accentHex: accentColor, titleSize: 22, sectionTitleSize: 11, bodySize: 10 };
  }
  if (themeKey === 'ResumeTemplate6') {
    return { layout: 'template6', accent, accentHex: accentColor, titleSize: 22, sectionTitleSize: 11, bodySize: 10 };
  }
  return { layout: 'template1', accent, accentHex: accentColor, titleSize: 24, sectionTitleSize: 11, bodySize: 10 };
};

// Register common web fonts for better parity with the on-screen preview.
// Place font files under `public/front-assets/fonts/` (example paths below).
// If you don't have the font files, the PDF generator will fall back to built-in fonts.
try {
  Font.register({
    family: 'Poppins',
    fonts: [
      { src: '/front-assets/fonts/Poppins-Regular.ttf' },
      { src: '/front-assets/fonts/Poppins-Bold.ttf', fontWeight: '700' },
    ],
  });
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: '/front-assets/fonts/Roboto-Regular.ttf' },
      { src: '/front-assets/fonts/Roboto-Bold.ttf', fontWeight: '700' },
    ],
  });
} catch (e) {
  // ignore font registration errors in environments without the files
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    // Prefer Poppins if registered; fallback to Helvetica
    fontFamily: 'Poppins',
  },
  template1Page: { flexDirection: 'row', minHeight: '100%' },
  sidebar: { width: '34%', padding: 28, paddingTop: 36, color: '#ffffff' },
  main: { width: '66%', padding: 28, paddingTop: 32 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8, lineHeight: 1.05 },
  subtitle: { fontSize: 11, marginBottom: 6, color: '#4b5563' },
  sectionTitle: { fontSize: 13, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  bullet: { fontSize: 11, lineHeight: 1.45, marginBottom: 6, color: '#374151' },
  contactLine: { fontSize: 9, marginBottom: 6, color: '#ffffff' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 8 },
  card: { borderWidth: 1, borderColor: '#e5e7eb', padding: 10, borderRadius: 4, marginBottom: 8 },
  header: { marginBottom: 12 },
  headerName: { fontSize: 26, fontWeight: '700', marginBottom: 6, color: '#111827', lineHeight: 1.05 },
  headerMeta: { fontSize: 11, color: '#4b5563', marginBottom: 4 },
  sectionBlock: { marginBottom: 12 },
  pill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3, marginRight: 6, marginBottom: 6, backgroundColor: '#f3f4f6' },
});

const SectionBlock = ({ title, lines, accent, variant, color = '#374151' }) => (
  <View style={styles.sectionBlock}>
    {variant === 'template2' ? (
      <View>
        <Text style={[styles.sectionTitle, { color: accent }]}> {title} </Text>
        <View style={[styles.divider, { marginTop: 2, backgroundColor: accent }]} />
      </View>
    ) : variant === 'template3' ? (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <View style={[styles.pill, { backgroundColor: accent, width: 6, height: 10, borderRadius: 2, marginRight: 6 }]} />
        <Text style={[styles.sectionTitle, { color: accent }]}>{title}</Text>
      </View>
    ) : variant === 'template4' ? (
      <View style={[styles.card, { backgroundColor: '#f9fafb' }]}>
        <Text style={[styles.sectionTitle, { color: accent }]}>{title}</Text>
      </View>
    ) : (
      <Text style={[styles.sectionTitle, { color: accent }]}>{title}</Text>
    )}
    {lines.map((line, idx) => (
      <Text key={`${title}-${idx}`} style={[styles.bullet, { color }]}>{line}</Text>
    ))}
  </View>
);

const ResumePdfDocument = ({ resume, selectedTheme, palette, forceFallbackFont = false }) => {
  const theme = getThemeConfig(selectedTheme, palette);
  const accent = theme.accent;
  const accentHex = theme.accentHex;
  const { fullName, contactLines, sections } = buildSections(resume);
  const pageStyle = { ...styles.page, fontFamily: forceFallbackFont ? 'Helvetica' : styles.page.fontFamily };

  if (theme.layout === 'template2') {
    return (
      <Document>
        <Page size="A4" style={pageStyle}>
          <View style={{ padding: 28 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={[styles.headerName, { color: accentHex }]}>{fullName}</Text>
              {contactLines.map((line, idx) => (
                <Text key={`contact-${idx}`} style={styles.headerMeta}>{line}</Text>
              ))}
            </View>
            {sections.map((section, idx) => (
              <SectionBlock key={`${section.title}-${idx}`} title={section.title} lines={section.lines} accent={accentHex} variant="template2" />
            ))}
          </View>
        </Page>
      </Document>
    );
  }

  if (theme.layout === 'template3') {
    return (
      <Document>
        <Page size="A4" style={pageStyle}>
          <View style={{ padding: 26 }}>
            <View style={[styles.card, { backgroundColor: '#f8fafc' }] }>
              <Text style={[styles.headerName, { color: accentHex }]}>{fullName}</Text>
              {contactLines.map((line, idx) => (
                <Text key={`contact-${idx}`} style={styles.headerMeta}>{line}</Text>
              ))}
            </View>
            {sections.map((section, idx) => (
              <SectionBlock key={`${section.title}-${idx}`} title={section.title} lines={section.lines} accent={accentHex} variant="template3" />
            ))}
          </View>
        </Page>
      </Document>
    );
  }

  if (theme.layout === 'template4') {
    return (
      <Document>
        <Page size="A4" style={pageStyle}>
          <View style={{ padding: 24 }}>
            <View style={{ marginBottom: 12 }}>
              <Text style={[styles.headerName, { color: accentHex }]}>{fullName}</Text>
              {contactLines.map((line, idx) => (
                <Text key={`contact-${idx}`} style={styles.headerMeta}>{line}</Text>
              ))}
            </View>
            {sections.map((section, idx) => (
              <SectionBlock key={`${section.title}-${idx}`} title={section.title} lines={section.lines} accent={accentHex} variant="template4" />
            ))}
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        <View style={styles.template1Page}>
          <View style={[styles.sidebar, { backgroundColor: accentHex }] }>
            <Text style={styles.headerName}>{fullName}</Text>
            {contactLines.map((line, idx) => (
              <Text key={`contact-${idx}`} style={styles.contactLine}>{line}</Text>
            ))}
          </View>
          <View style={styles.main}>
            {sections.map((section, idx) => (
              <SectionBlock key={`${section.title}-${idx}`} title={section.title} lines={section.lines} accent={accentHex} variant="template1" />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        <View style={styles.template1Page}>
          <View style={[styles.sidebar, { backgroundColor: accentHex }] }>
            <Text style={styles.headerName}>{fullName}</Text>
            {contactLines.map((line, idx) => (
              <Text key={`contact-${idx}`} style={styles.contactLine}>{line}</Text>
            ))}
          </View>
          <View style={styles.main}>
            {sections.map((section, idx) => (
              <SectionBlock key={`${section.title}-${idx}`} title={section.title} lines={section.lines} accent={accentHex} variant="template1" />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const createThemeAwarePdf = async ({ resume, fileName = 'resume.pdf', selectedTheme, palette }) => {
  if (!resume) throw new Error('No resume data to export');

  // Try rendering with registered fonts; if that fails (e.g. 404 fetching ttf),
  // retry once using a built-in fallback font to ensure download still works.
  let blob;
  try {
    blob = await pdf(<ResumePdfDocument resume={resume} selectedTheme={selectedTheme} palette={palette} />).toBlob();
  } catch (err) {
    console.warn('PDF render failed with registered fonts, retrying with fallback font:', err && err.message ? err.message : err);
    try {
      blob = await pdf(
        <ResumePdfDocument resume={resume} selectedTheme={selectedTheme} palette={palette} forceFallbackFont={true} />
      ).toBlob();
    } catch (err2) {
      console.error('PDF render failed on fallback attempt:', err2);
      throw err2;
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
