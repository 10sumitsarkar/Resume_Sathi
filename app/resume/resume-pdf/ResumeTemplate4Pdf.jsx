import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import {
  PALETTE_COLORS,
  safeText,
  formatDateRange,
  formatSingleDate,
} from "./pdfHelpers";
import { IconTick, getSocialIcon } from "./PdfCommon";

/**
 * ResumeTemplate4Pdf — "Classic Divider"
 * Left-aligned single-column layout. Red accent section headings each
 * followed by a thin accent-colored underline, with a neutral dark
 * divider line separating one section block from the next. Entries show
 * bold title + bold date on the same row, italic sub-line below.
 * Languages / Activities / Social are merged into one "Additional
 * Information" section as label + flowing text lines.
 */

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    fontFamily: "Poppins",
    paddingTop: 35,
    paddingBottom: 35,
    paddingLeft: 35,
    paddingRight: 35,
  },

  // ---------- Header ----------
  name: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  contactLine: {
    fontSize: 9.5,
    color: "#4b5563",
    marginBottom: 14,
  },
  headerRule: {
    height: 1.5,
    marginBottom: 18,
  },

  // ---------- Section framework ----------
  sectionDivider: {
    height: 1.5,
    marginTop: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionUnderline: {
    height: 1.5,
    marginTop: 6,
    marginBottom: 15,
  },
  section: {
    marginBottom: 4,
  },

  // ---------- Summary ----------
  bodyText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#374151",
    textAlign: "justify",
  },

  // ---------- Experience / Education / Certificate entries ----------
  entryBlock: {
    marginBottom: 14,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#111827",
  },
  entryDate: {
    fontSize: 10,
    fontWeight: "700",
    color: "#111827",
  },
  entrySubLine: {
    fontSize: 9.5,
    fontStyle: "italic",
    color: "#6b7280",
    marginBottom: 6,
  },
  entryDescription: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: "#374151",
    marginTop: 2,
  },
  entryDescriptionItalic: {
    fontSize: 9.5,
    lineHeight: 1.5,
    fontStyle: "italic",
    color: "#6b7280",
    marginTop: 2,
  },

  // ---------- Skills ----------
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 22,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 9.5,
    color: "#1f2937",
    marginLeft: 5,
  },

  // ---------- Additional info ----------
  infoLine: {
    fontSize: 9.5,
    lineHeight: 1.6,
    color: "#374151",
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: "700",
    color: "#111827",
    fontSize: 10,
  },
  socialColumn: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 6,
  },
  socialItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialItemText: {
    fontSize: 9.5,
    color: "#374151",
    marginLeft: 5,
  },
  socialItemLabel: {
    fontWeight: "700",
    color: "#111827",
  },
});

const ResumeTemplate4Pdf = ({
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

  const contactParts = [
    [personal.city, personal.state].filter(Boolean).join(", "),
    personal.phone,
    personal.email,
    personal.website,
  ]
    .filter(Boolean)
    .map(safeText);

  const skills = resume.skills || [];
  const languages = resume.languages || [];
  const hobbies = resume.hobbies || [];
  const socialItems = resume.social_medias || [];

  const languagesLine = languages
    .map(
      (lang) =>
        `${safeText(lang.language)}: ${safeText(lang.proficiency_level)}`,
    )
    .filter(Boolean)
    .join(", ");
  const hobbiesLine = hobbies
    .map((h) => safeText(h.hobbies || h))
    .filter(Boolean)
    .join(", ");
  const socialLine = socialItems
    .map((s) => safeText(s.social_url))
    .filter(Boolean)
    .join(", ");

  const SectionTitle = ({ children, topDivider = true }) => (
    <>
      {topDivider && (
        <View
          style={{ ...styles.sectionDivider, backgroundColor: accentColor }}
        />
      )}
      <Text style={{ ...styles.sectionTitle, color: accentColor }}>
        {children}
      </Text>
      <View
        style={{ ...styles.sectionUnderline, backgroundColor: accentColor }}
      />
    </>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ---------- HEADER ---------- */}
        <Text style={{ ...styles.name, color: accentColor }}>{fullName}</Text>
        {jobLevel && <Text style={styles.jobTitle}>{jobLevel}</Text>}
        {contactParts.length > 0 && (
          <Text style={styles.contactLine}>{contactParts.join(" | ")}</Text>
        )}

        {/* ---------- SUMMARY ---------- */}
        {resume.summary && resume.summary.summary && (
          <View style={styles.section}>
            <SectionTitle topDivider={true}>Summary</SectionTitle>
            <Text style={styles.bodyText}>
              {safeText(resume.summary.summary)}
            </Text>
          </View>
        )}

        {/* ---------- PROFESSIONAL EXPERIENCE ---------- */}
        {resume.work_experiences && resume.work_experiences.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Professional Experience</SectionTitle>
            {resume.work_experiences.map((work, idx) => (
              <View key={idx} style={styles.entryBlock}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>
                    {[safeText(work.job_title), safeText(work.company_name)]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                  <Text style={styles.entryDate}>
                    {formatDateRange(
                      work.start_month,
                      work.start_year,
                      work.end_month,
                      work.end_year,
                    )}
                  </Text>
                </View>
                {work.location && (
                  <Text style={styles.entrySubLine}>
                    {safeText(work.location)}
                  </Text>
                )}
                {work.description &&
                  safeText(work.description)
                    .split(/\r?\n/)
                    .filter((line) => line.trim().length > 0)
                    .map((line, lIdx) => (
                      <Text key={lIdx} style={styles.entryDescription}>
                        {line.replace(/^[-•]\s*/, "")}
                      </Text>
                    ))}
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
                  <Text style={styles.entryTitle}>
                    {[safeText(intern.job_title), safeText(intern.company_name)]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                  <Text style={styles.entryDate}>
                    {formatDateRange(
                      intern.start_month,
                      intern.start_year,
                      intern.end_month,
                      intern.end_year,
                    )}
                  </Text>
                </View>
                {intern.location && (
                  <Text style={styles.entrySubLine}>
                    {safeText(intern.location)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ---------- EDUCATION ---------- */}
        {resume.educations && resume.educations.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Education</SectionTitle>
            {resume.educations.map((edu, idx) => (
              <View key={idx} style={styles.entryBlock}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>
                    {safeText(edu.degree)}
                    {edu.field_study ? ` in ${safeText(edu.field_study)}` : ""}
                  </Text>
                  <Text style={styles.entryDate}>
                    {formatDateRange(edu.date, edu.year, "", "")}
                  </Text>
                </View>
                {(edu.institute_name || edu.location) && (
                  <Text style={styles.entrySubLine}>
                    {[safeText(edu.institute_name), safeText(edu.location)]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
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
              <View key={idx} style={styles.entryBlock}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryTitle}>
                    {safeText(cert.certificate_name)}
                  </Text>
                  <Text style={styles.entryDate}>
                    {formatSingleDate(cert.issue_date)}
                  </Text>
                </View>
                {cert.issuing_organization && (
                  <Text style={styles.entrySubLine}>
                    {safeText(cert.issuing_organization)}
                  </Text>
                )}
                {cert.description && (
                  <Text style={styles.entryDescriptionItalic}>
                    {safeText(cert.description)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ---------- TECHNICAL SKILLS ---------- */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Technical Skills</SectionTitle>
            <View style={styles.skillsWrap}>
              {skills.map((skill, idx) => (
                <View key={idx} style={styles.skillItem}>
                  <IconTick color={accentColor} />
                  <Text style={styles.skillText}>
                    {safeText(skill.skill_name)}
                    {skill.proficiency_level
                      ? ` (${safeText(skill.proficiency_level)})`
                      : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ---------- ADDITIONAL INFORMATION ---------- */}
        {(languagesLine || hobbiesLine || socialItems.length > 0) && (
          <View style={styles.section}>
            <SectionTitle>Additional Information</SectionTitle>
            {languagesLine && (
              <Text style={styles.infoLine}>
                <Text style={styles.infoLabel}>Languages: </Text>
                {languagesLine}
              </Text>
            )}
            {hobbiesLine && (
              <Text style={styles.infoLine}>
                <Text style={styles.infoLabel}>Activities: </Text>
                {hobbiesLine}
              </Text>
            )}
            {socialItems.length > 0 && (
              <View style={{ flexDirection: "column", gap: 10 }}>
                <Text style={styles.infoLabel}>Social:</Text>
                <View style={styles.socialColumn}>
                  {socialItems.map((item, idx) => (
                    <View key={idx} style={styles.socialItemRow}>
                      <View
                        style={{
                          width: 12,
                          height: 12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getSocialIcon(item.social_name, accentColor)}
                      </View>
                      <Text style={styles.socialItemText}>
                        <Text style={styles.socialItemLabel}>
                          {safeText(item.social_name)}:{" "}
                        </Text>
                        {safeText(item.social_url)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate4Pdf;
