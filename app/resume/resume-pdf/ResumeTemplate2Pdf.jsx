import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Svg,
  Path,
  Line,
  Polygon,
} from "@react-pdf/renderer";
import {
  PALETTE_COLORS,
  safeText,
  safeTextInline,
  resolveProfileImage,
  formatDateRange,
  formatEducationDateRange,
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

/**
 * ResumeTemplate2Pdf - "Serene Centered" (Premium)
 * Single-column, fully centered layout on a soft tinted background.
 * Circular photo/initials badge with an accent ring, name + contact
 * row centered up top, then full-width sections each introduced by a
 * centered uppercase title flanked by thin accent rules on both sides.
 * Skills render as a two-column grid of name + level pill.
 * Reuses the same data shape / helpers as the other templates.
 *
 * Section order: Summary -> Skills -> Experience -> Education ->
 * Internships -> Certificates -> Languages -> Social Media -> Hobbies
 */

// Convert a hex color (#rrggbb or #rgb) to an rgba() string with the given alpha.
const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== "string") return `rgba(99,102,241,${alpha})`;
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return `rgba(99,102,241,${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

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
  photoWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  photoRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  profileImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  profileFallback: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitials: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  nameRule: {
    width: 46,
    height: 2.5,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 10.8,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 2.2,
    fontWeight: "600",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 10,
    columnGap: 2,
    marginBottom: 4,
  },
  contactItemWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactSeparator: {
    width: 1,
    height: 14,
    backgroundColor: "#d1d5db",
    marginHorizontal: 7,
  },
  contactItem: {
    fontSize: 11,
    color: "#374151",
  },

  // ---------- Section title ----------
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  sectionTitleLine: {
    flexGrow: 1,
    height: 0.75,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2.6,
    marginLeft: 12,
    marginRight: 12,
  },
  section: {
    marginBottom: 2,
  },

  // ---------- Social ----------
  socialRow: {
    flexDirection: "column",
    marginBottom: 4,
    gap: 9,
  },
  socialItemWrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  socialItem: {
    fontSize: 11,
    color: "#374151",
  },
  socialLabel: {
    fontWeight: "700",
  },

  // ---------- Summary ----------
  bodyText: {
    fontSize: 12,
    lineHeight: 1.65,
    color: "#3f4653",
    textAlign: "justify",
  },

  // ---------- Skills grid ----------
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
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 15,
    paddingRight: 15,
  },
  skillName: {
    flex: 1,
    minWidth: 0,
    fontSize: 10.5,
    color: "#1f2937",
    fontWeight: "400",
    marginRight: 8,
  },
  pill: {
    flexShrink: 0,
    fontSize: 9,
    fontWeight: "500",
    borderRadius: 9,
    paddingTop: 3.5,
    paddingBottom: 3.5,
    paddingLeft: 9,
    paddingRight: 9,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  // ---------- Experience / Education entries ----------
  entryBlock: {
    marginBottom: 13,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 10.8,
    fontWeight: "600",
    color: "#111827",
  },
  entryDate: {
    fontSize: 9.2,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  entryLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 5,
  },
  entryLocation: {
    fontSize: 11,
    fontStyle: "italic",
    fontWeight: "500",
    color: "#000000",
  },
  entrySub: {
    fontSize: 10,
    lineHeight: 1.55,
    color: "#4b5563",
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3.5,
    paddingRight: 6,
  },
  bulletMark: {
    fontSize: 11,
    marginRight: 6,
    color: "#374151",
  },
  bulletText: {
    fontSize: 11,
    lineHeight: 1.55,
    color: "#3f4653",
    flex: 1,
  },

  // ---------- Languages ----------
  languageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
    gap: 12,
  },
  languageView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  languageItem: {
    fontSize: 11,
    color: "#1f2937",
  },
  languageLabel: {
    fontWeight: "700",
  },

  // ---------- Certificates / other generic list rows ----------
  simpleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },
});

const BULLET = String.fromCharCode(8226);

const ResumeTemplate2Pdf = ({
  resume,
  palette = "color-1",
  forceFallbackFont = false,
  fontFamily = "Poppins",
}) => {
  const accentColor = PALETTE_COLORS[palette] || PALETTE_COLORS["color-1"];
  const bgColor = "#ffffff";
  const textColor = "#374151";
  const pillBg = hexToRgba(accentColor, 0.1);
  //   const ringBg = hexToRgba(accentColor, 0.14);

  const personal = resume.personal_infomation || {};
  const fullName =
    [personal.firstName, personal.lastName].filter(Boolean).join(" ") ||
    resume.resume_name ||
    "Your Name";
  const jobTitle = safeText(personal.experience || personal.job_title);
  //   const profileSrc = resolveProfileImage(personal.photo);
  //   const initials = [personal.firstName, personal.lastName].filter(Boolean).map(x => x[0]).join('').slice(0, 2).toUpperCase();

  const pageStyle = {
    ...styles.page,
    fontFamily: forceFallbackFont ? "Helvetica" : fontFamily || "Poppins",
    backgroundColor: bgColor,
  };

  const contactItems = [
    personal.email ? { type: "email", label: safeText(personal.email) } : null,
    personal.phone ? { type: "phone", label: safeText(personal.phone) } : null,
    [personal.address, personal.city, personal.state, personal.country].filter(Boolean).length > 0
      ? {
          type: "location",
          label: [personal.address, personal.city, personal.state, personal.country]
            .filter(Boolean)
            .join(", "),
        }
      : null,
    personal.website
      ? { type: "globe", label: safeText(personal.website) }
      : null,
  ].filter(Boolean);

  const socialItems =
    resume.social_medias?.map((social) => ({
      social_name: social.social_name || "Other",
      social_url: safeText(social.social_url),
    })) || [];

  const SectionTitle = ({ children }) => (
    <View style={styles.sectionTitleRow}>
      <View
        style={{ ...styles.sectionTitleLine, backgroundColor: accentColor }}
      />
      <Text style={{ ...styles.sectionTitle, color: accentColor }}>
        {children}
      </Text>
      <View
        style={{ ...styles.sectionTitleLine, backgroundColor: accentColor }}
      />
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
        <Text
          style={{
            ...styles.pill,
            backgroundColor: pillBg,
            color: accentColor,
          }}
        >
          {safeText(skill.proficiency_level)}
        </Text>
      )}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ---------- HEADER ---------- */}
        {/* {profileSrc && (
          <View style={styles.photoWrap}>
            <View style={{ ...styles.photoRing, backgroundColor: ringBg }}>
              <Image style={styles.profileImage} src={profileSrc} />
            </View>
          </View>
        )}
        {!profileSrc && initials && (
          <View style={styles.photoWrap}>
            <View style={{ ...styles.photoRing, backgroundColor: ringBg }}>
              <View style={{ ...styles.profileFallback, backgroundColor: accentColor }}>
                <Text style={styles.profileInitials}>{initials}</Text>
              </View>
            </View>
          </View>
        )} */}

        <Text style={{ ...styles.name, color: "#111827" }}>{fullName}</Text>
        <View style={{ ...styles.nameRule, backgroundColor: accentColor }} />
        {jobTitle && <Text style={styles.jobTitle}>{jobTitle}</Text>}
        {contactItems.length > 0 && (
          <View style={styles.contactRow}>
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <View style={styles.contactSeparator} />}
                <View style={styles.contactItemWrap}>
                  <View
                    style={{
                      width: 13,
                      height: 13,
                      marginRight: 5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
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
                  <Text style={{ ...styles.contactItem, color: textColor }}>
                    {item.label}
                  </Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        )}

        {/* ---------- SUMMARY ---------- */}
        {resume.summary && resume.summary.summary && (
          <View style={styles.section}>
            <SectionTitle>Summary</SectionTitle>
            <Text style={styles.bodyText}>
              {safeTextInline(resume.summary.summary)}
            </Text>
          </View>
        )}

        {/* ---------- SKILLS ---------- */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Skills</SectionTitle>
            <View style={styles.skillsGrid}>
              <View style={styles.skillsCol}>
                {skillsColA.map((skill, idx) =>
                  renderSkillRow(skill, `a-${idx}`),
                )}
              </View>
              <View style={styles.skillsCol}>
                {skillsColB.map((skill, idx) =>
                  renderSkillRow(skill, `b-${idx}`),
                )}
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
                  <Text style={styles.entryTitle}>
                    {safeText(work.job_title)}
                  </Text>
                  <Text style={{ ...styles.entryDate, color: accentColor }}>
                    {formatDateRange(
                      work.start_month,
                      work.start_year,
                      work.end_month,
                      work.end_year,
                    )}
                  </Text>
                </View>
                {(work.company_name || work.location) && (
                  <View style={styles.entryLocationRow}>
                    <Text style={{ ...styles.entryLocation }}>
                      {[safeText(work.company_name), safeText(work.location)]
                        .filter(Boolean)
                        .join(", ")}
                    </Text>
                  </View>
                )}
                {work.description &&
                  safeText(work.description)
                    .split(/\r?\n/)
                    .filter((line) => line.trim().length > 0)
                    .map((line, lIdx) => (
                      <View key={lIdx} style={styles.bulletRow}>
                        <Text style={styles.bulletMark}>{BULLET}</Text>
                        <Text style={styles.bulletText}>
                          {line.replace(/^-+\s*/, "")}
                        </Text>
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
                    {safeText(edu.degree)}
                    {edu.field_study ? ` in ${safeText(edu.field_study)}` : ""}
                  </Text>
                  <Text style={{ ...styles.entryDate, color: accentColor }}>
                    {formatEducationDateRange(edu.date, edu.year)}
                  </Text>
                </View>
                {(edu.institute_name || edu.location) && (
                  <View style={styles.entryLocationRow}>
                    <Text style={{ ...styles.entryLocation }}>
                      {[safeText(edu.institute_name), safeText(edu.location)]
                        .filter(Boolean)
                        .join(", ")}
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
                  <Text style={styles.entryTitle}>
                    {safeText(intern.job_title)}
                  </Text>
                  <Text style={{ ...styles.entryDate, color: accentColor }}>
                    {formatDateRange(
                      intern.start_month,
                      intern.start_year,
                      intern.end_month,
                      intern.end_year,
                    )}
                  </Text>
                </View>
                {(intern.company_name || intern.location) && (
                  <View style={styles.entryLocationRow}>
                    <Text style={{ ...styles.entryLocation }}>
                      {[
                        safeText(intern.company_name),
                        safeText(intern.location),
                      ]
                        .filter(Boolean)
                        .join(", ")}
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
              <View key={idx} style={{ marginBottom: 10 }}>
                <View style={styles.simpleRow}>
                  <Text style={styles.entryTitle}>
                    {safeText(cert.certificate_name)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: accentColor,
                      fontWeight: "700",
                    }}
                  >
                    {[
                      safeText(cert.issuing_organization),
                      formatSingleDate(cert.issue_date),
                    ]
                      .filter(Boolean)
                      .join("  /  ")}
                  </Text>
                </View>
                {cert.description && (
                  <Text style={styles.entrySub}>
                    {safeText(cert.description)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ---------- LANGUAGES ---------- */}
        {resume.languages && resume.languages.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Languages</SectionTitle>
            <View style={styles.languageRow}>
              {resume.languages.map((lang, idx) => (
                <view key={idx} style={styles.languageView}>
                  <IconTick color={accentColor} />
                  <Text style={styles.languageItem}>
                    <Text
                      style={{ ...styles.languageLabel, color: accentColor }}
                    >
                      {safeText(lang.language)}:{" "}
                    </Text>
                    {safeText(lang.proficiency_level)}
                  </Text>
                </view>
              ))}
            </View>
          </View>
        )}

        {/* ---------- SOCIAL MEDIA ---------- */}
        {socialItems.length > 0 && (
          <View style={styles.section}>
            <SectionTitle>Social Media</SectionTitle>
            <View style={styles.socialRow}>
              {socialItems.map((item, idx) => (
                <View key={idx} style={styles.socialItemWrap}>
                  <View
                    style={{
                      width: 13,
                      height: 13,
                      marginRight: 5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getSocialIcon(item.social_name, accentColor)}
                  </View>
                  <Text style={{ ...styles.socialItem, color: textColor }}>
                    <Text style={{ ...styles.socialLabel, color: "#111827" }}>
                      {item.social_name}:{" "}
                    </Text>
                    {item.social_url}
                  </Text>
                </View>
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
                <Text key={idx} style={styles.languageItem}>
                  {safeText(hobby.hobbies || hobby)}
                </Text>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate2Pdf;









