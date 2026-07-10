import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PALETTE_COLORS, safeText, resolveProfileImage, formatDateRange } from './pdfHelpers';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 18,
    fontFamily: 'Poppins',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    width: 80,
    height: 80,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f3f4f8',
  },
  photo: {
    width: 80,
    height: 80,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    color: '#4b5563',
    marginBottom: 6,
  },
  contact: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 2,
    color: '#111827',
  },
  bodyText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#333333',
    marginBottom: 4,
  },
  entryHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  entryDate: {
    fontSize: 9,
    color: '#4b5563',
  },
  entrySub: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 2,
    lineHeight: 1.3,
  },
  bulletList: {
    paddingLeft: 0,
  },
  bulletItem: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 2,
    lineHeight: 1.3,
    marginLeft: 8,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillItem: {
    width: '45%',
    fontSize: 9,
    color: '#333333',
    marginBottom: 4,
    lineHeight: 1.3,
  },
  additionalItem: {
    fontSize: 9,
    color: '#333333',
    marginBottom: 3,
    lineHeight: 1.3,
  },
});

const ResumeTemplate4Pdf = ({ resume, palette = 'color-1', forceFallbackFont = false }) => {
  const accentColor = PALETTE_COLORS[palette] || PALETTE_COLORS['color-1'];
  const personal = resume.personal_infomation || {};
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ') || resume.resume_name || 'Your Name';
  const jobTitle = safeText(personal.experience || personal.job_title);
  const profileSrc = resolveProfileImage(personal.photo);
  const initials = [personal.firstName, personal.lastName].filter(Boolean).map(x => x[0]).join('').slice(0, 2).toUpperCase();

  const contactParts = [];
  if (personal.city || personal.state || personal.country) {
    contactParts.push([personal.city, personal.state, personal.country].filter(Boolean).join(', '));
  }
  if (personal.phone) contactParts.push(personal.phone);
  if (personal.email) contactParts.push(personal.email);
  if (personal.website) contactParts.push(personal.website);

  const pageStyle = { ...styles.page, fontFamily: forceFallbackFont ? 'Helvetica' : 'Poppins' };

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* HEADER */}
        <View style={[styles.header, { borderBottomColor: accentColor }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.name, { color: accentColor }]}>{fullName}</Text>
            {jobTitle && <Text style={styles.jobTitle}>{jobTitle}</Text>}
            {contactParts.length > 0 && (
              <Text style={styles.contact}>
                {contactParts.join(' | ')}
              </Text>
            )}
          </View>
          {profileSrc && (
            <View style={styles.headerRight}>
              <Image style={styles.photo} src={profileSrc} />
            </View>
          )}
        </View>

        {/* SUMMARY */}
        {resume.summary && resume.summary.summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { borderBottomColor: accentColor }]}>Summary</Text>
            <Text style={styles.bodyText}>{safeText(resume.summary.summary)}</Text>
          </View>
        )}

        {/* PROFESSIONAL EXPERIENCE */}
        {resume.work_experiences && resume.work_experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { borderBottomColor: accentColor }]}>Professional Experience</Text>
            {resume.work_experiences.map((work, idx) => (
              <View key={idx} style={{ marginBottom: 6 }}>
                <View style={styles.entryHead}>
                  <Text style={styles.entryTitle}>{safeText(work.job_title)}, {safeText(work.company_name)}</Text>
                  <Text style={styles.entryDate}>{formatDateRange(work.start_month, work.start_year, work.end_month, work.end_year)}</Text>
                </View>
                {work.location && <Text style={styles.entrySub}>{safeText(work.location)}</Text>}
                {work.description && (
                  <View style={styles.bulletList}>
                    {work.description.split('\n').filter(Boolean).map((line, i) => (
                      <Text key={i} style={styles.bulletItem}>
                        • {line.trim().replace(/^[-•\s]+/, '')}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* INTERNSHIPS */}
        {resume.any_internships && resume.any_internships.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { borderBottomColor: accentColor }]}>Internships</Text>
            {resume.any_internships.map((intern, idx) => (
              <View key={idx} style={{ marginBottom: 4 }}>
                <View style={styles.entryHead}>
                  <Text style={styles.entryTitle}>{safeText(intern.job_title)}, {safeText(intern.company_name)}</Text>
                  <Text style={styles.entryDate}>{formatDateRange(intern.start_month, intern.start_year, intern.end_month, intern.end_year)}</Text>
                </View>
                {intern.location && <Text style={styles.entrySub}>{safeText(intern.location)}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {resume.educations && resume.educations.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { borderBottomColor: accentColor }]}>Education</Text>
            {resume.educations.map((edu, idx) => (
              <View key={idx} style={{ marginBottom: 4 }}>
                <View style={styles.entryHead}>
                  <Text style={styles.entryTitle}>{safeText(edu.degree)} in {safeText(edu.field_study)}</Text>
                  <Text style={styles.entryDate}>{formatDateRange(edu.date, edu.year, '', '')}</Text>
                </View>
                <Text style={styles.entrySub}>{safeText(edu.institute_name)}{edu.location ? `, ${safeText(edu.location)}` : ''}</Text>
              </View>
            ))}
          </View>
        )}

        {/* CERTIFICATES */}
        {resume.certificates && resume.certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { borderBottomColor: accentColor }]}>Certificates</Text>
            {resume.certificates.map((cert, idx) => (
              <View key={idx} style={{ marginBottom: 4 }}>
                <View style={styles.entryHead}>
                  <Text style={styles.entryTitle}>{safeText(cert.certificate_name)}</Text>
                  {cert.issue_date && <Text style={styles.entryDate}>{safeText(cert.issue_date)}</Text>}
                </View>
                {cert.issuing_organization && <Text style={styles.entrySub}>{safeText(cert.issuing_organization)}</Text>}
                {cert.description && <Text style={styles.entrySub}>{safeText(cert.description)}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* TECHNICAL SKILLS */}
        {resume.skills && resume.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { borderBottomColor: accentColor }]}>Technical Skills</Text>
            <View style={styles.skillsGrid}>
              {resume.skills.map((skill, idx) => (
                <Text key={idx} style={styles.skillItem}>
                  {safeText(skill.skill_name)}{skill.proficiency_level ? ` (${safeText(skill.proficiency_level)})` : ''}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* ADDITIONAL INFORMATION */}
        {(resume.languages?.length > 0 || resume.hobbies?.length > 0 || resume.social_medias?.length > 0) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { borderBottomColor: accentColor }]}>Additional Information</Text>
            {resume.languages && resume.languages.length > 0 && (
              <Text style={styles.additionalItem}>
                <Text style={{ fontWeight: '700' }}>Languages: </Text>
                {resume.languages.map(l => `${safeText(l.language)} (${safeText(l.proficiency_level)})`).join(', ')}
              </Text>
            )}
            {resume.hobbies && resume.hobbies.length > 0 && (
              <Text style={styles.additionalItem}>
                <Text style={{ fontWeight: '700' }}>Activities: </Text>
                {resume.hobbies.map(h => safeText(h.hobbies || h)).join(', ')}
              </Text>
            )}
            {resume.social_medias && resume.social_medias.length > 0 && (
              <Text style={styles.additionalItem}>
                <Text style={{ fontWeight: '700' }}>Social: </Text>
                {resume.social_medias.map(s => safeText(s.social_url)).join(', ')}
              </Text>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate4Pdf;
