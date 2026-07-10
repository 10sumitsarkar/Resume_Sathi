import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PALETTE_COLORS, safeText, resolveProfileImage, formatDateRange } from './pdfHelpers';
import { IconEmail, IconPhone, IconLocation, IconGlobe, getSocialIcon } from './PdfCommon';

/**
 * ResumeTemplate3Pdf — "Serene Centered"
 * Single-column, fully centered layout on a soft tinted background.
 * Name + contact row centered up top, then full-width sections each
 * introduced by a centered uppercase title flanked by thin accent
 * rules. Skills render as a two-column grid of name + level pill.
 * Reuses the same data shape / helpers as the other templates.
 */

// Convert a hex color (#rrggbb or #rgb) to an rgba() string with the given alpha.
const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== 'string') return `rgba(99,102,241,${alpha})`;
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return `rgba(99,102,241,${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    fontFamily: 'Poppins',
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 40,
    paddingRight: 40,
  },

  // ---------- Header ----------
  photoWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  profileFallback: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 11,
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactItem: {
    fontSize: 9,
    color: '#374151',
  },
  contactSep: {
    fontSize: 9,
    color: '#9ca3af',
    marginLeft: 8,
    marginRight: 8,
  },

  // ---------- Section title ----------
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitleLine: {
    flexGrow: 1,
    height: 0.75,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginLeft: 10,
    marginRight: 10,
  },
  section: {
    marginBottom: 2,
  },

  // ---------- Summary ----------
  bodyText: {
    fontSize: 9.5,
    lineHeight: 1.6,
    color: '#374151',
    textAlign: 'justify',
  },

  // ---------- Skills grid ----------
  skillsGrid: {
    flexDirection: 'row',
  },
  skillsCol: {
    width: '50%',
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 10,
  },
  skillName: {
    fontSize: 9.5,
    color: '#1f2937',
  },
  pill: {
    fontSize: 7.5,
    fontWeight: '600',
    borderRadius: 8,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
  },

  // ---------- Experience / Education entries ----------
  entryBlock: {
    marginBottom: 12,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#111827',
  },
  entryDate: {
    fontSize: 9,
    fontWeight: '700',
  },
  entryLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  entryLocation: {
    fontSize: 9,
    fontStyle: 'italic',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingRight: 6,
  },
  bulletMark: {
    fontSize: 9,
    marginRight: 6,
    color: '#374151',
  },
  bulletText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#374151',
    flex: 1,
  },

  // ---------- Languages ----------
  languageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  languageItem: {
    fontSize: 9.5,
    color: '#1f2937',
    marginRight: 22,
    marginBottom: 4,
  },
  languageLabel: {
    fontWeight: '700',
  },

  // ---------- Certificates / other generic list rows ----------
  simpleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

const ResumeTemplate3Pdf = ({ resume, palette = 'color-1', forceFallbackFont = false, fontFamily = 'Poppins' }) => {
  const accentColor = PALETTE_COLORS[palette] || PALETTE_COLORS['color-1'];
  const bgColor = hexToRgba(accentColor, 0.16);
  const pillBg = hexToRgba(accentColor, 0.18);

  const personal = resume.personal_infomation || {};
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || resume.resume_name || 'Your Name';
  const jobTitle = safeText(personal.experience || personal.job_title);
  const profileSrc = resolveProfileImage(personal.photo);
  const initials = [personal.firstName, personal.lastName].filter(Boolean).map(x => x[0]).join('').slice(0, 2).toUpperCase();

  const pageStyle = { ...styles.page, fontFamily: forceFallbackFont ? 'Helvetica' : (fontFamily || 'Poppins'), backgroundColor: bgColor };

  const contactItems = [
    personal.email ? { type: 'email', label: safeText(personal.email) } : null,
    personal.phone ? { type: 'phone', label: safeText(personal.phone) } : null,
    [personal.city, personal.state, personal.country].filter(Boolean).length > 0
      ? { type: 'location', label: [personal.city, personal.state, personal.country].filter(Boolean).join(', ') }
      : null,
    personal.website ? { type: 'globe', label: safeText(personal.website) } : null,
  ].filter(Boolean);

  const socialItems = resume.social_medias?.map((social) => ({
    social_name: social.social_name || 'Other',
    social_url: safeText(social.social_url),
  })) || [];

  const SectionTitle = ({ children }) => (
    <View style={styles.sectionTitleRow}>
      <View style={{ ...styles.sectionTitleLine, backgroundColor: accentColor }} />
      <Text style={{ ...styles.sectionTitle, color: accentColor }}>{children}</Text>
      <View style={{ ...styles.sectionTitleLine, backgroundColor: accentColor }} />
    </View>
  );

  // Split skills into two roughly-even columns for the grid layout.
  const skills = resume.skills || [];
  const half = Math.ceil(skills.length / 2);
  const skillsColA = skills.slice(0, half);
  const skillsColB = skills.slice(half);

  const renderSkillRow = (skill, idx) => (
    <View key={idx} style={styles.skillRow}>
      <Text style={styles.skillName}>{safeText(skill.skill_name)}</Text>
      {skill.proficiency_level && (
        <Text style={{ ...styles.pill, backgroundColor: pillBg, color: accentColor }}>
          {safeText(skill.proficiency_level)}
        </Text>
      )}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ---------- HEADER ---------- */}
        {profileSrc && (
          <View style={styles.photoWrap}>
            <Image style={styles.profileImage} src={profileSrc} />
          </View>
        )}
        {!profileSrc && initials && (
          <View style={styles.photoWrap}>
            <View style={{ ...styles.profileFallback, backgroundColor: accentColor }}>
              <Text style={styles.profileInitials}>{initials}</Text>
            </View>
          </View>
        )}
        <Text style={{ ...styles.name, color: accentColor }}>{fullName}</Text>
        {jobTitle && <Text style={styles.jobTitle}>{jobTitle}</Text>}
        {contactItems.length > 0 && (
          <View style={styles.contactRow}>
            {contactItems.map((item, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                <View style={{ width: 14, height: 14, marginRight: 6, alignItems: 'center', justifyContent: 'center' }}>
                  {item.type === 'email' ? <IconEmail color={accentColor} /> : item.type === 'phone' ? <IconPhone color={accentColor} /> : item.type === 'location' ? <IconLocation color={accentColor} /> : <IconGlobe color={accentColor} />}
                </View>
                <Text style={{ ...styles.contactItem, color: accentColor }}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ---------- SUMMARY ---------- */}
        {resume.summary && resume.summary.summary && (
          <View style={styles.section}>
            <SectionTitle>Summary</SectionTitle>
            <Text style={styles.bodyText}>{safeText(resume.summary.summary)}</Text>
          </View>
        )}

        {/* ---------- SKILLS ---------- */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Skills</SectionTitle>
            <View style={styles.skillsGrid}>
              <View style={styles.skillsCol}>
                {skillsColA.map((skill, idx) => renderSkillRow(skill, `a-${idx}`))}
              </View>
              <View style={styles.skillsCol}>
                {skillsColB.map((skill, idx) => renderSkillRow(skill, `b-${idx}`))}
              </View>
            </View>
          </View>
        )}

        {/* ---------- EXPERIENCE ---------- */}
        {resume.work_experiences && resume.work_experiences.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Experience</SectionTitle>
            {resume.work_experiences.map((work, idx) => (
              <View key={idx} style={styles.entryBlock}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{safeText(work.job_title)}</Text>
                  <Text style={{ ...styles.entryDate, color: accentColor }}>
                    {formatDateRange(work.start_month, work.start_year, work.end_month, work.end_year)}
                  </Text>
                </View>
                {(work.company_name || work.location) && (
                  <View style={styles.entryLocationRow}>
                    <Text style={{ ...styles.entryLocation, color: accentColor }}>
                      {[safeText(work.company_name), safeText(work.location)].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                )}
                {work.description &&
                  safeText(work.description)
                    .split(/\r?\n/)
                    .filter((line) => line.trim().length > 0)
                    .map((line, lIdx) => (
                      <View key={lIdx} style={styles.bulletRow}>
                        <Text style={styles.bulletMark}>•</Text>
                        <Text style={styles.bulletText}>{line.replace(/^[-•]\s*/, '')}</Text>
                      </View>
                    ))}
              </View>
            ))}
          </View>
        )}

        {/* ---------- EDUCATION ---------- */}
        {resume.educations && resume.educations.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Education and Training</SectionTitle>
            {resume.educations.map((edu, idx) => (
              <View key={idx} style={styles.entryBlock}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>
                    {safeText(edu.degree)}{edu.field_study ? ` in ${safeText(edu.field_study)}` : ''}
                  </Text>
                  <Text style={{ ...styles.entryDate, color: accentColor }}>
                    {formatDateRange(edu.date, edu.year, '', '')}
                  </Text>
                </View>
                {(edu.institute_name || edu.location) && (
                  <View style={styles.entryLocationRow}>
                    <Text style={{ ...styles.entryLocation, color: accentColor }}>
                      {[safeText(edu.institute_name), safeText(edu.location)].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ---------- INTERNSHIPS ---------- */}
        {resume.any_internships && resume.any_internships.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Internships</SectionTitle>
            {resume.any_internships.map((intern, idx) => (
              <View key={idx} style={styles.entryBlock}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>{safeText(intern.job_title)}</Text>
                  <Text style={{ ...styles.entryDate, color: accentColor }}>
                    {formatDateRange(intern.start_month, intern.start_year, intern.end_month, intern.end_year)}
                  </Text>
                </View>
                {(intern.company_name || intern.location) && (
                  <View style={styles.entryLocationRow}>
                    <Text style={{ ...styles.entryLocation, color: accentColor }}>
                      {[safeText(intern.company_name), safeText(intern.location)].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ---------- CERTIFICATES ---------- */}
        {resume.certificates && resume.certificates.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Certificates</SectionTitle>
            {resume.certificates.map((cert, idx) => (
              <View key={idx} style={styles.simpleRow}>
                <Text style={styles.entryTitle}>{safeText(cert.certificate_name)}</Text>
                <Text style={{ fontSize: 9, color: accentColor, fontWeight: '700' }}>
                  {[safeText(cert.issuing_organization), safeText(cert.issue_date)].filter(Boolean).join('  ·  ')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {socialItems.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Social Media</SectionTitle>
            <View style={styles.contactRow}>
              {socialItems.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <View style={{ width: 14, height: 14, marginRight: 6, alignItems: 'center', justifyContent: 'center' }}>
                    {getSocialIcon(item.social_name, accentColor)}
                  </View>
                  <Text style={{ ...styles.contactItem, color: accentColor }}>{item.social_url}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ---------- LANGUAGES ---------- */}
        {resume.languages && resume.languages.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Languages</SectionTitle>
            <View style={styles.languageRow}>
              {resume.languages.map((lang, idx) => (
                <Text key={idx} style={styles.languageItem}>
                  <Text style={styles.languageLabel}>{safeText(lang.language)}: </Text>
                  {safeText(lang.proficiency_level)}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* ---------- HOBBIES ---------- */}
        {resume.hobbies && resume.hobbies.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Hobbies</SectionTitle>
            <View style={styles.languageRow}>
              {resume.hobbies.map((hobby, idx) => (
                <Text key={idx} style={styles.languageItem}>{safeText(hobby.hobbies || hobby)}</Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate3Pdf;