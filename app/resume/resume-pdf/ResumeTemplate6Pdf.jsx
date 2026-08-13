import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import {
  PALETTE_COLORS,
  safeText,
  formatDateRange,
  formatSingleDate,
} from "./pdfHelpers";
import {
  IconEmail,
  IconPhone,
  IconLocation,
  IconGlobe,
  getSocialIcon,
} from "./PdfCommon";

/**
 * ResumeTemplate6Pdf - "Minimal Ledger" (v2)
 * Full-width black-on-white header (two-line big name + role tag),
 * a full-width "About Me" block (no rule beneath it), then a
 * two-column body:
 *   LEFT  - Contact Info, Skills (flat list, no sub-headings),
 *           Languages (name + proficiency text + level bar),
 *           Social Media (colored brand icons), Hobbies
 *   RIGHT - Education, Certifications, Work Experience, Internships
 * Every contact/social icon renders in the resume's accent color.
 * Thin horizontal rules sit under every section heading except
 * "About Me", matching the reference's ruled-paper look.
 */

const skillLevelToPercent = (level) => {
  const l = (level || "").toLowerCase();
  if (l.includes("master")) return 100;
  if (l.includes("expert")) return 92;
  if (l.includes("advanced")) return 80;
  if (l.includes("proficient")) return 68;
  if (l.includes("intermediate")) return 55;
  if (l.includes("beginner") || l.includes("novice") || l.includes("basic"))
    return 30;
  return 60;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Poppins",
    paddingTop: 35,
    paddingBottom: 35,
    paddingLeft: 35,
    paddingRight: 35,
    color: "#1a1a1a",
  },

  // ---------- Header ----------
  nameText: {
    fontSize: 23,
    fontWeight: "800",
    textTransform: "uppercase",
    lineHeight: 1.08,
    letterSpacing: 0.3,
  },
  headerRule: {
    height: 1,
    backgroundColor: "#c9c9c9",
    marginTop: 10,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 10.8,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#3a3a3a",
    marginBottom: 8,
  },
  headerRuleBottom: {
    height: 1,
    backgroundColor: "#c9c9c9",
    marginBottom: 20,
  },

  // ---------- Section heading ----------
  sectionHeading: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  sectionRule: {
    height: 1,
    backgroundColor: "#c9c9c9",
    marginBottom: 12,
  },
  aboutSection: {
    marginBottom: 22,
  },
  aboutText: {
    fontSize: 12.5,
    lineHeight: 1.6,
    color: "#333333",
  },

  // ---------- Body columns ----------
  bodyRow: {
    flexDirection: "row",
  },
  leftCol: {
    width: "40%",
    paddingRight: 18,
  },
  rightCol: {
    width: "60%",
  },
  colSection: {
    marginBottom: 2,
  },

  // Contact
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },
  contactIconWrap: {
    width: 13,
    height: 13,
    marginRight: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: {
    fontSize: 12,
    color: "#333333",
    flex: 1,
    lineHeight: 1.35,
  },

  // Skills (flat list - no sub-headings)
  bulletLine: {
    flexDirection: "row",
    marginBottom: 6,
  },
  bulletMark: {
    fontSize: 12,
    marginRight: 5,
    color: "#1a1a1a",
  },
  bulletText: {
    fontSize: 12,
    lineHeight: 1.4,
    color: "#333333",
    flex: 1,
  },

  // Languages
  languageBlock: {
    marginBottom: 11,
  },
  languageTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  languageName: {
    fontSize: 12.5,
    color: "#1a1a1a",
    fontWeight: "600",
  },
  languageLevel: {
    fontSize: 10.5,
    color: "#6b6b6b",
  },
  languageBarTrack: {
    height: 6,
    backgroundColor: "#e2e2e2",
    borderRadius: 1,
  },
  languageBarFill: {
    height: 6,
    borderRadius: 1,
  },

  // Social media
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },
  socialIconWrap: {
    width: 13,
    height: 13,
    marginRight: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    fontSize: 12,
    color: "#333333",
    flex: 1,
  },

  // Hobbies
  hobbiesText: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "#333333",
  },

  // Right-col entries (Education / Certifications / Work Experience / Internships)
  entryBlock: {
    marginBottom: 16,
  },
  entryMeta: {
    fontSize: 11.5,
    color: "#8a8a8a",
    marginBottom: 3,
  },
  entryTitle: {
    fontSize: 10.8,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  entryDescription: {
    fontSize: 12,
    lineHeight: 1.55,
    color: "#333333",
  },
});

const BULLET = String.fromCharCode(8226);

const ResumeTemplate6Pdf = ({
  resume,
  palette = "color-1",
  forceFallbackFont = false,
  fontFamily = "Poppins",
}) => {
  const accentColor = PALETTE_COLORS[palette] || PALETTE_COLORS["color-1"];

  const personal = resume.personal_infomation || {};
  const fullName =
    [personal.firstName, personal.lastName].filter(Boolean).join(" ") ||
    resume.resume_name ||
    "Your Name";
  const jobLevel = safeText(personal.experience || personal.job_title);

  const pageStyle = {
    ...styles.page,
    fontFamily: forceFallbackFont ? "Helvetica" : fontFamily || "Poppins",
  };

  const contactItems = [
    personal.phone ? { type: "phone", label: safeText(personal.phone) } : null,
    personal.email ? { type: "email", label: safeText(personal.email) } : null,
    [personal.city, personal.state, personal.country].filter(Boolean).length > 0
      ? {
          type: "location",
          label: [personal.city, personal.state, personal.country]
            .filter(Boolean)
            .join(", "),
        }
      : null,
    personal.website
      ? { type: "globe", label: safeText(personal.website) }
      : null,
  ].filter(Boolean);

  const skills = resume.skills || [];
  const languages = resume.languages || [];
  const socialItems = resume.social_medias || [];
  const hobbies = resume.hobbies || [];
  const educations = resume.educations || [];
  const certificates = resume.certificates || [];
  const workExperiences = resume.work_experiences || [];
  const internships = resume.any_internships || [];

  const SectionHeading = ({ children, noRule = false }) => (
    <>
      <Text style={styles.sectionHeading}>{children}</Text>
      {!noRule && <View style={styles.sectionRule} />}
    </>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ---------- HEADER ---------- */}
        <Text style={styles.nameText}>{fullName}</Text>
        <View style={styles.headerRule} />
        {jobLevel ? <Text style={styles.roleText}>{jobLevel}</Text> : null}
        <View style={styles.headerRuleBottom} />

        {/* ---------- ABOUT ME (no rule beneath) ---------- */}
        {resume.summary && resume.summary.summary && (
          <View style={styles.aboutSection}>
            <SectionHeading noRule>About Me</SectionHeading>
            <Text style={styles.aboutText}>
              {safeText(resume.summary.summary)}
            </Text>
          </View>
        )}

        {/* ---------- BODY: two columns ---------- */}
        <View style={styles.bodyRow}>
          {/* ---------- LEFT COLUMN ---------- */}
          <View style={styles.leftCol}>
            {contactItems.length > 0 && (
              <View style={styles.colSection}>
                <SectionHeading>Contact Info</SectionHeading>
                {contactItems.map((item, idx) => (
                  <View key={idx} style={styles.contactItem}>
                    <View style={styles.contactIconWrap}>
                      {item.type === "phone" ? (
                        <IconPhone color={accentColor} />
                      ) : item.type === "email" ? (
                        <IconEmail color={accentColor} />
                      ) : item.type === "location" ? (
                        <IconLocation color={accentColor} />
                      ) : (
                        <IconGlobe color={accentColor} />
                      )}
                    </View>
                    <Text style={styles.contactText}>{item.label}</Text>
                  </View>
                ))}
              </View>
            )}

            {skills.length > 0 && (
              <View style={styles.colSection}>
                <SectionHeading>Skills</SectionHeading>
                {skills.map((skill, idx) => (
                  <View key={idx} style={styles.bulletLine}>
                    <Text style={{ ...styles.bulletMark, color: accentColor }}>
                      {BULLET}
                    </Text>
                    <Text style={styles.bulletText}>
                      {safeText(skill.skill_name)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {languages.length > 0 && (
              <View style={styles.colSection}>
                <SectionHeading>Languages</SectionHeading>
                {languages.map((lang, idx) => (
                  <View key={idx} style={styles.languageBlock}>
                    <View style={styles.languageTopRow}>
                      <Text style={styles.languageName}>
                        {safeText(lang.language)}
                      </Text>
                      <Text style={styles.languageLevel}>
                        {safeText(lang.proficiency_level)}
                      </Text>
                    </View>
                    <View style={styles.languageBarTrack}>
                      <View
                        style={{
                          ...styles.languageBarFill,
                          width: `${skillLevelToPercent(lang.proficiency_level)}%`,
                          backgroundColor: accentColor,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {socialItems.length > 0 && (
              <View style={styles.colSection}>
                <SectionHeading>Social Media</SectionHeading>
                {socialItems.map((item, idx) => (
                  <View key={idx} style={styles.socialItem}>
                    <View style={styles.socialIconWrap}>
                      {getSocialIcon(item.social_name, accentColor)}
                    </View>
                    <Text style={styles.socialText}>
                      {safeText(item.social_url)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {hobbies.length > 0 && (
              <View style={styles.colSection}>
                <SectionHeading>Hobbies</SectionHeading>
                <Text style={styles.hobbiesText}>
                  {hobbies
                    .map((h) => safeText(h.hobbies || h))
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
            )}
          </View>

          {/* ---------- RIGHT COLUMN ---------- */}
          <View style={styles.rightCol}>
            {educations.length > 0 && (
              <View style={styles.colSection}>
                <SectionHeading>Education</SectionHeading>
                {educations.map((edu, idx) => (
                  <View key={idx} style={styles.entryBlock}>
                    <Text style={styles.entryMeta}>
                      {safeText(edu.institute_name)}
                      {edu.institute_name ? " | " : ""}
                      {!edu.date || !edu.year
                        ? "Ongoing"
                        : `${safeText(edu.date)}-${safeText(edu.year)}`}
                    </Text>
                    <Text style={styles.entryTitle}>
                      {safeText(edu.degree)}
                      {edu.field_study ? ` ${safeText(edu.field_study)}` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {certificates.length > 0 && (
              <View style={styles.colSection}>
                <SectionHeading>Certifications</SectionHeading>
                {certificates.map((cert, idx) => (
                  <View key={idx} style={styles.entryBlock}>
                    <Text style={styles.entryMeta}>
                      {safeText(cert.issuing_organization)}
                      {cert.issuing_organization ? " | " : ""}
                      {formatSingleDate(cert.issue_date)}
                    </Text>
                    <Text style={styles.entryTitle}>
                      {safeText(cert.certificate_name)}
                    </Text>
                    {cert.description ? (
                      <Text style={styles.entryDescription}>
                        {safeText(cert.description)}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}

            {workExperiences.length > 0 && (
              <View style={styles.colSection}>
                <SectionHeading>Work Experience</SectionHeading>
                {workExperiences.map((work, idx) => (
                  <View key={idx} style={styles.entryBlock}>
                    <Text style={styles.entryMeta}>
                      {safeText(work.company_name)}
                      {work.company_name ? " | " : ""}
                      {formatDateRange(
                        work.start_month,
                        work.start_year,
                        work.end_month,
                        work.end_year,
                      )}
                    </Text>
                    <Text style={styles.entryTitle}>
                      {safeText(work.job_title)}
                    </Text>
                    {work.description ? (
                      <Text style={styles.entryDescription}>
                        {safeText(work.description)}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}

            {internships.length > 0 && (
              <View style={styles.colSection}>
                <SectionHeading>Any Internship</SectionHeading>
                {internships.map((intern, idx) => (
                  <View key={idx} style={styles.entryBlock}>
                    <Text style={styles.entryMeta}>
                      {safeText(intern.company_name)}
                      {intern.company_name ? " | " : ""}
                      {formatDateRange(
                        intern.start_month,
                        intern.start_year,
                        intern.end_month,
                        intern.end_year,
                      )}
                    </Text>
                    <Text style={styles.entryTitle}>
                      {safeText(intern.job_title)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ResumeTemplate6Pdf;









