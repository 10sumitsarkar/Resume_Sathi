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
  IconTick,
} from "./PdfCommon";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    fontFamily: "Poppins",
    paddingTop: 35,
    paddingBottom: 35,
    paddingLeft: 35,
    paddingRight: 35,
    backgroundColor: "#fffefd",
    color: "#262625",
  },
  bottomStrip: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 8,
  },

  // ---------- Header ----------
  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    lineHeight: 1.08,
  },
  nameRule: {
    height: 2.5,
    backgroundColor: "#1a1a1a",
    marginTop: 12,
    marginBottom: 9,
  },
  role: {
    fontSize: 10.5,
    letterSpacing: 3.2,
    textTransform: "uppercase",
    color: "#55524d",
    marginBottom: 9,
  },
  roleRule: {
    height: 1,
    backgroundColor: "#cfc9bd",
    marginBottom: 13,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 7,
    columnGap: 20,
  },
  contactItemWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIconWrap: {
    width: 12,
    height: 12,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  contactItem: {
    fontSize: 10.5,
    color: "#4a4a48",
  },

  // ---------- Section ----------
  section: {
    marginTop: 22,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2.2,
  },
  sectionRule: {
    height: 1,
    backgroundColor: "#d8d2c5",
    marginTop: 7,
    marginBottom: 14,
  },

  // ---------- Profile / Summary (blockquote) ----------
  profileWrap: {
    flexDirection: "row",
    marginTop: 7,
  },
  profileBar: {
    width: 3,
    marginRight: 15,
  },
  bodyText: {
    fontSize: 11.5,
    lineHeight: 1.75,
    color: "#3a3936",
    fontStyle: "italic",
    flex: 1,
  },

  // ---------- Skills ----------
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillsCol: {
    width: "50%",
  },
  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    paddingVertical: 7,
    paddingRight: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e0d3",
  },
  skillName: {
    flex: 1,
    minWidth: 0,
    fontSize: 10.5,
    color: "#262625",
    marginRight: 8,
  },
  pill: {
    flexShrink: 0,
    fontSize: 8.5,
    fontWeight: "700",
    borderRadius: 3,
    borderWidth: 1,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  // ---------- Entries (Experience / Internships / Education / Certificates) ----------
  entryBlock: {
    marginBottom: 15,
  },
  entryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryHeading: {
    flex: 1,
  },
  entryTitle: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  entryCompany: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#55524d",
    marginTop: 2,
  },
  entryDate: {
    fontSize: 9.2,
    fontWeight: "700",
    whiteSpace: "nowrap",
    paddingTop: 2,
  },
  entryLocation: {
    fontSize: 10,
    color: "#8a8680",
    marginTop: 3,
  },
  entryDescription: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#3a3936",
    marginTop: 7,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 6,
    marginBottom: 0,
    paddingRight: 6,
  },
  bulletMark: {
    fontSize: 10,
    marginRight: 6,
  },
  bulletText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#3a3936",
    flex: 1,
  },

  // ---------- Languages ----------
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  languageItem: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingBottom: 8,
    marginBottom: 10,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d8d2c5",
  },
  languageName: {
    fontSize: 12.5,
    color: "#1a1a1a",
  },
  languageLevel: {
    fontSize: 9.5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#8a8680",
  },

  // ---------- Social ----------
  socialRow: {
    flexDirection: "column",
    gap: 8,
  },
  socialItemWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialItem: {
    fontSize: 10.5,
    color: "#3a3936",
  },
  socialLabel: {
    fontWeight: "700",
    color: "#1a1a1a",
  },

  // ---------- Hobbies ----------
  hobbiesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hobbyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 18,
    marginBottom: 4,
  },
  hobbyTick: {
    fontSize: 10,
    fontWeight: "700",
    marginRight: 5,
  },
  hobbyText: {
    fontSize: 10.5,
    color: "#333333",
  },
});

const BULLET = String.fromCharCode(8226);

const ResumeTemplate7Pdf = ({
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
  const jobTitle = safeText(personal.experience || personal.job_title);

  const pageStyle = {
    ...styles.page,
    fontFamily: forceFallbackFont ? "Helvetica" : fontFamily || "Poppins",
  };

  const contactItems = [
    personal.email ? { type: "email", label: safeText(personal.email) } : null,
    personal.phone ? { type: "phone", label: safeText(personal.phone) } : null,
    [personal.city, personal.state, personal.country].filter(Boolean).length > 0
      ? {
          type: "location",
          label: [personal.city, personal.state, personal.country].filter(Boolean).join(", "),
        }
      : null,
    personal.website ? { type: "globe", label: safeText(personal.website) } : null,
  ].filter(Boolean);

  const socialItems =
    resume.social_medias?.map((social) => ({
      social_name: social.social_name || "Other",
      social_url: safeText(social.social_url),
    })) || [];

  const SectionTitle = ({ children, noRule = false }) => (
    <View style={styles.section}>
      <Text style={{ ...styles.sectionTitle, color: accentColor }}>{children}</Text>
      {!noRule && <View style={styles.sectionRule} />}
    </View>
  );

  // Split skills into two roughly-even columns.
  const skills = resume.skills || [];
  const half = Math.ceil(skills.length / 2);
  const skillsColA = skills.slice(0, half);
  const skillsColB = skills.slice(half);

  const renderSkillRow = (skill, idx) => (
    <View key={idx} style={styles.skillRow}>
      <Text style={styles.skillName}>{safeText(skill.skill_name)}</Text>
      {skill.proficiency_level && (
        <Text style={{ ...styles.pill, borderColor: accentColor, color: accentColor }}>
          {safeText(skill.proficiency_level)}
        </Text>
      )}
    </View>
  );

  const Entry = ({ title, company, location, dateLabel, description, bullets }) => (
    <View style={styles.entryBlock}>
      <View style={styles.entryTop}>
        <View style={styles.entryHeading}>
          <Text style={styles.entryTitle}>{title}</Text>
          {company ? <Text style={styles.entryCompany}>{company}</Text> : null}
        </View>
        {dateLabel ? <Text style={{ ...styles.entryDate, color: accentColor }}>{dateLabel}</Text> : null}
      </View>
      {location ? <Text style={styles.entryLocation}>{location}</Text> : null}
      {description ? <Text style={styles.entryDescription}>{description}</Text> : null}
      {bullets && bullets.length > 0
        ? bullets.map((line, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={{ ...styles.bulletMark, color: accentColor }}>{BULLET}</Text>
              <Text style={styles.bulletText}>{line.replace(/^-+\s*/, "")}</Text>
            </View>
          ))
        : null}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        <View style={{ ...styles.bottomStrip, backgroundColor: accentColor, opacity: 0.85 }} fixed />

        {/* ---------- HEADER ---------- */}
        <Text style={styles.name}>{fullName}</Text>
        <View style={styles.nameRule} />
        {jobTitle ? <Text style={styles.role}>{jobTitle}</Text> : null}
        <View style={styles.roleRule} />
        {contactItems.length > 0 && (
          <View style={styles.contactRow}>
            {contactItems.map((item, idx) => (
              <View key={idx} style={styles.contactItemWrap}>
                <View style={styles.contactIconWrap}>
                  {item.type === "email" ? (
                    <IconEmail color={accentColor} />
                  ) : item.type === "phone" ? (
                    <IconPhone color={accentColor} />
                  ) : item.type === "location" ? (
                    <IconLocation color={accentColor} />
                  ) : (
                    <IconGlobe color={accentColor} />
                  )}
                </View>
                <Text style={styles.contactItem}>{item.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ---------- SUMMARY (blockquote) ---------- */}
        {resume.summary && resume.summary.summary && (
          <View style={styles.section}>
            <Text style={{ ...styles.sectionTitle, color: accentColor }}>Summary</Text>
            <View style={styles.profileWrap}>
              <View style={{ ...styles.profileBar, backgroundColor: accentColor }} />
              <Text style={styles.bodyText}>{safeText(resume.summary.summary)}</Text>
            </View>
          </View>
        )}

        {/* ---------- SKILLS ---------- */}
        {skills.length > 0 && (
          <View>
            <SectionTitle>Skills</SectionTitle>
            <View style={styles.skillsGrid}>
              <View style={styles.skillsCol}>{skillsColA.map((skill, idx) => renderSkillRow(skill, `a-${idx}`))}</View>
              <View style={styles.skillsCol}>{skillsColB.map((skill, idx) => renderSkillRow(skill, `b-${idx}`))}</View>
            </View>
          </View>
        )}

        {/* ---------- EXPERIENCE ---------- */}
        {resume.work_experiences && resume.work_experiences.length > 0 && (
          <View>
            <SectionTitle>Experience</SectionTitle>
            {resume.work_experiences.map((work, idx) => (
              <Entry
                key={idx}
                title={safeText(work.job_title)}
                company={[safeText(work.company_name), safeText(work.employee_type)].filter(Boolean).join(" / ")}
                location={safeText(work.location)}
                dateLabel={formatDateRange(work.start_month, work.start_year, work.end_month, work.end_year)}
                bullets={
                  work.description
                    ? safeText(work.description).split(/\r?\n/).filter((line) => line.trim().length > 0)
                    : null
                }
              />
            ))}
          </View>
        )}

        {/* ---------- INTERNSHIPS ---------- */}
        {resume.any_internships && resume.any_internships.length > 0 && (
          <View>
            <SectionTitle>Internships</SectionTitle>
            {resume.any_internships.map((intern, idx) => (
              <Entry
                key={idx}
                title={safeText(intern.job_title)}
                company={[safeText(intern.company_name), safeText(intern.employee_type)].filter(Boolean).join(" / ")}
                location={safeText(intern.location)}
                dateLabel={formatDateRange(intern.start_month, intern.start_year, intern.end_month, intern.end_year)}
              />
            ))}
          </View>
        )}

        {/* ---------- EDUCATION ---------- */}
        {resume.educations && resume.educations.length > 0 && (
          <View>
            <SectionTitle>Education and Training</SectionTitle>
            {resume.educations.map((edu, idx) => (
              <Entry
                key={idx}
                title={`${safeText(edu.degree)}${edu.field_study ? ` in ${safeText(edu.field_study)}` : ""}`}
                company={safeText(edu.institute_name)}
                location={safeText(edu.location)}
                dateLabel={!edu.date || !edu.year ? "Still Studying" : formatDateRange(edu.date, edu.year, "", "")}
              />
            ))}
          </View>
        )}

        {/* ---------- CERTIFICATES ---------- */}
        {resume.certificates && resume.certificates.length > 0 && (
          <View>
            <SectionTitle>Certificates</SectionTitle>
            {resume.certificates.map((cert, idx) => (
              <Entry
                key={idx}
                title={safeText(cert.certificate_name)}
                company={safeText(cert.issuing_organization)}
                dateLabel={formatSingleDate(cert.issue_date)}
                description={cert.description ? safeText(cert.description) : null}
              />
            ))}
          </View>
        )}

        {/* ---------- LANGUAGES ---------- */}
        {resume.languages && resume.languages.length > 0 && (
          <View>
            <SectionTitle>Languages</SectionTitle>
            <View style={styles.languageGrid}>
              {resume.languages.map((lang, idx) => (
                <View key={idx} style={styles.languageItem}>
                  <Text style={styles.languageName}>{safeText(lang.language)}</Text>
                  <Text style={styles.languageLevel}>{safeText(lang.proficiency_level)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ---------- SOCIAL MEDIA ---------- */}
        {socialItems.length > 0 && (
          <View>
            <SectionTitle>Social Media</SectionTitle>
            <View style={styles.socialRow}>
              {socialItems.map((item, idx) => (
                <View key={idx} style={styles.socialItemWrap}>
                  <View style={{ width: 12, height: 12, marginRight: 6, alignItems: "center", justifyContent: "center" }}>
                    {getSocialIcon(item.social_name, accentColor)}
                  </View>
                  <Text style={styles.socialItem}>
                    <Text style={styles.socialLabel}>{item.social_name}: </Text>
                    {item.social_url}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ---------- HOBBIES ---------- */}
        {resume.hobbies && resume.hobbies.length > 0 && (
          <View>
            <SectionTitle>Hobbies</SectionTitle>
            <View style={styles.hobbiesRow}>
              {resume.hobbies.map((hobby, idx) => (
                <View key={idx} style={styles.hobbyItem}>
                  <Text style={{ ...styles.hobbyTick, color: accentColor }}>{BULLET}</Text>
                  <Text style={styles.hobbyText}>{safeText(hobby.hobbies || hobby)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate7Pdf;









