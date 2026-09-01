import React from "react";
import { Document, Page, View, Text, StyleSheet, Svg, Path, Circle } from "@react-pdf/renderer";
import {
  PALETTE_COLORS,
  safeText,
  safeTextInline,
  formatDateRange,
  formatEducationDateRange,
  formatSingleDate,
  formatPhoneDisplay,
} from "./pdfHelpers";
import { IconEmail, IconPhone, IconLocation, IconGlobe, getSocialIcon } from "./PdfCommon";

/**
 * ResumeTemplate9Pdf — "Sidebar Badge" (no photo)
 * A dark navy sidebar (derived from the accent color) carries the
 * name, a letter-spaced role tag, contact rows in circular icon
 * badges, skills as labeled progress bars, and a checklist-style
 * Hobbies list — with a decorative dot grid low in the sidebar.
 * The white content column gives every section a circular icon badge
 * + heading + connector line ending in a dot. Work Experience,
 * Education, Certifications and Internships share one entry pattern
 * (title left / date right, org in accent italic, bullets or
 * description below); Certifications additionally get a quoted
 * highlight block. Languages show a 5-dot proficiency rating.
 */

// ---------- Color engine: derive shades from one accent hex ----------
const hexToRgbObj = (hex) => {
  if (!hex || typeof hex !== "string") return { r: 30, g: 64, b: 128 };
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return { r: 30, g: 64, b: 128 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};
const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(v)));
const mixColor = (hex, mixHex, weight) => {
  const c1 = hexToRgbObj(hex);
  const c2 = hexToRgbObj(mixHex);
  const r = clamp255(c1.r + (c2.r - c1.r) * weight);
  const g = clamp255(c1.g + (c2.g - c1.g) * weight);
  const b = clamp255(c1.b + (c2.b - c1.b) * weight);
  return `rgb(${r},${g},${b})`;
};
const darken = (hex, amount) => mixColor(hex, "#000000", amount);

const skillLevelToPercent = (level) => {
  const l = (level || "").toLowerCase();
  if (l.includes("master")) return 100;
  if (l.includes("expert")) return 92;
  if (l.includes("advanced")) return 82;
  if (l.includes("proficient")) return 70;
  if (l.includes("intermediate")) return 55;
  if (l.includes("beginner") || l.includes("basic")) return 32;
  return 65;
};
const proficiencyToDots = (level) => {
  const l = (level || "").toLowerCase();
  if (l.includes("native") || l.includes("master")) return 5;
  if (l.includes("fluent") || l.includes("expert") || l.includes("advanced")) return 4;
  if (l.includes("proficient") || l.includes("professional")) return 3;
  if (l.includes("intermediate") || l.includes("conversational")) return 2;
  if (l.includes("beginner") || l.includes("basic")) return 1;
  return 3;
};

/* ─── Small local section-badge icons (kept local so other templates are unaffected) ─── */
const IconPerson = ({ color = "#ffffff" }) => (
  <Svg width="11" height="11" viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="8" r="4" />
    <Path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8v1H4v-1z" />
  </Svg>
);
const IconBriefcase = ({ color = "#ffffff" }) => (
  <Svg width="11" height="11" viewBox="0 0 24 24" fill={color}>
    <Path d="M9 4a2 2 0 00-2 2v1H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3V6a2 2 0 00-2-2H9zm0 3V6h6v1H9zM4 9h16v9H4V9z" />
  </Svg>
);
const IconCap = ({ color = "#ffffff" }) => (
  <Svg width="11" height="11" viewBox="0 0 24 24" fill={color}>
    <Path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 12.18v3.6L12 19l7-3.22v-3.6l-7 3.82-7-3.82z" />
  </Svg>
);
const IconAward = ({ color = "#ffffff" }) => (
  <Svg width="11" height="11" viewBox="0 0 24 24" fill={color}>
    <Circle cx="12" cy="9" r="6" />
    <Path d="M9 14.5L7 21l5-2.5L17 21l-2-6.5" fill={color} />
  </Svg>
);
const IconLanguage = ({ color = "#ffffff" }) => (
  <Svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 5h9M8 3v2M11 5c-1 3-3 6-6 8M6 9c1.5 1.6 3.4 2.7 5 3" />
    <Path d="M14 21l4-9 4 9M15.5 18h5" />
  </Svg>
);
const IconLink = ({ color = "#ffffff" }) => (
  <Svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 15l6-6M8 12l-2 2a3 3 0 004 4l2-2M16 12l2-2a3 3 0 00-4-4l-2 2" />
  </Svg>
);
const IconCheck = ({ color = "#ffffff" }) => (
  <Svg width="7.5" height="7.5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 12l6 6L20 6" />
  </Svg>
);
const IconQuote = ({ color = "#7a8bb5" }) => (
  <Svg width="12" height="10.5" viewBox="0 0 32 24" fill={color}>
    <Path d="M0 24V14.564Q0 9.03 2.58 5.272 5.161 1.514 10.256 0l1.694 3.15q-3.15 1.29-4.6 3.15-1.452 1.86-1.612 4.6h5.402V24H0zm16.94 0V14.564q0-5.535 2.58-9.292Q22.1 1.514 27.196 0l1.694 3.15q-3.15 1.29-4.6 3.15-1.452 1.86-1.612 4.6h5.402V24H16.94z" />
  </Svg>
);

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Poppins",
    backgroundColor: "#ffffff",
  },

  // ---------- Sidebar ----------
  sidebar: {
    width: 196,
    paddingTop: 33,
    paddingBottom: 25,
    paddingLeft: 22,
    paddingRight: 19,
    position: "relative",
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 1.08,
    letterSpacing: 0.2,
    wordBreak: "break-all",
  },
  roleTag: {
    fontSize: 9,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginTop: 7,
    wordBreak: "break-all",
  },
  nameUnderline: {
    height: 1.5,
    width: 48,
    marginTop: 7,
    marginBottom: 19,
  },

  contactBlock: {
    marginBottom: 19,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contactBadge: {
    width: 19,
    height: 19,
    borderRadius: 9.5,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
    flexShrink: 0,
  },
  contactText: {
    fontSize: 8.5,
    color: "#ffffff",
    flex: 1,
    lineHeight: 1.35,
    wordBreak: "break-all",
  },

  sidebarSectionTitle: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.75,
    marginBottom: 10,
  },
  sidebarBlock: {
    marginBottom: 19,
  },

  skillBlock: {
    marginBottom: 10,
  },
  skillName: {
    fontSize: 8.5,
    color: "#ffffff",
    marginBottom: 4.5,
    wordBreak: "break-all",
  },
  skillBarTrack: {
    height: 3.7,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  skillBarFill: {
    height: 3.7,
    borderRadius: 2,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkBadge: {
    width: 13.5,
    height: 13.5,
    borderRadius: 6.75,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7.5,
    flexShrink: 0,
  },
  checkText: {
    fontSize: 8.5,
    color: "#ffffff",
    flex: 1,
    wordBreak: "break-all",
  },

  dotGrid: {
    position: "absolute",
    bottom: 19,
    left: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    width: 104,
  },
  dotGridDot: {
    width: 2.2,
    height: 2.2,
    borderRadius: 1.1,
    margin: 3,
  },

  // ---------- Content ----------
  content: {
    flex: 1,
    paddingTop: 33,
    paddingBottom: 33,
    paddingLeft: 30,
    paddingRight: 28,
    minWidth: 0,
  },
  contentSection: {
    marginBottom: 21,
  },
  sectionHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13.5,
  },
  sectionIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
    flexShrink: 0,
  },
  sectionHeadText: {
    fontSize: 11.5,
    fontWeight: "800",
    letterSpacing: 0.45,
    marginRight: 9,
    flexShrink: 0,
  },
  sectionHeadLine: {
    flex: 1,
    height: 0.75,
  },
  sectionHeadDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    marginLeft: -0.75,
    flexShrink: 0,
  },

  bodyText: {
    fontSize: 9.5,
    lineHeight: 1.7,
    color: "#3a3a3a",
    wordBreak: "break-all",
  },

  entryBlock: {
    marginBottom: 15,
  },
  entryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 9,
    wordBreak: "break-all",
  },
  entryDateText: {
    fontSize: 8.5,
    fontWeight: "600",
    flexShrink: 0,
    textAlign: "right",
  },
  entrySubLine: {
    fontSize: 9.5,
    fontStyle: "italic",
    marginTop: 2,
    marginBottom: 6,
    wordBreak: "break-all",
    color: "#666666",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bulletMark: {
    fontSize: 9.5,
    marginRight: 4.5,
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 9.5,
    lineHeight: 1.65,
    color: "#3a3a3a",
    flex: 1,
    wordBreak: "break-all",
  },

  quoteBlock: {
    flexDirection: "row",
    backgroundColor: "#eef1f8",
    borderLeftWidth: 2.25,
    borderRadius: 3,
    padding: 10.5,
    marginTop: 6,
  },
  quoteIconWrap: {
    marginRight: 7.5,
    marginTop: 1.5,
    flexShrink: 0,
  },
  quoteText: {
    fontSize: 9.5,
    lineHeight: 1.6,
    color: "#333333",
    fontStyle: "italic",
    flex: 1,
    wordBreak: "break-all",
  },

  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  languageName: {
    fontSize: 9.5,
    fontWeight: "600",
    color: "#232323",
    flex: 1,
    marginRight: 8,
    wordBreak: "break-all",
  },
  dotsRow: {
    flexDirection: "row",
    flexShrink: 0,
  },
  ratingDot: {
    width: 6.7,
    height: 6.7,
    borderRadius: 3.35,
    marginLeft: 4.5,
  },

  socialLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6.5,
  },
  socialIconWrap: {
    width: 10,
    height: 10,
    marginRight: 6,
    marginTop: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  socialText: {
    fontSize: 9.5,
    color: "#3a3a3a",
    flex: 1,
    wordBreak: "break-all",
  },
});

const ResumeTemplate9Pdf = ({ resume, palette = "color-1", forceFallbackFont = false, fontFamily = "Poppins" }) => {
  const accentColor = PALETTE_COLORS[palette] || PALETTE_COLORS["color-1"];
  const sidebarBg = darken(accentColor, 0.55);

  const personal = resume.personal_infomation || {};
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(" ") || resume.resume_name || "Your Name";
  const roleTag = safeText(personal.experience || personal.job_title);

  // FIX: spread styles.page (which has flexDirection: "row") so the
  // sidebar and content columns render side-by-side instead of stacking.
  // Previously this object only contained fontFamily, silently dropping
  // flexDirection/backgroundColor from styles.page.
  const pageStyle = {
    ...styles.page,
    fontFamily: forceFallbackFont ? "Helvetica" : fontFamily || "Poppins",
  };

  const contactItems = [
    personal.email ? { type: "email", label: safeText(personal.email) } : null,
    personal.phone ? { type: "phone", label: formatPhoneDisplay(personal.phone, personal.country_code) } : null,
    [personal.address, personal.city, personal.state].filter(Boolean).length > 0
      ? { type: "location", label: [personal.address, personal.city, personal.state].filter(Boolean).join(", ") }
      : null,
    personal.website ? { type: "globe", label: safeText(personal.website) } : null,
  ].filter(Boolean);

  const skills = resume.skills || [];
  const hobbies = resume.hobbies || [];
  const languages = resume.languages || [];
  const socialItems = resume.social_medias || [];
  const educations = resume.educations || [];
  const certificates = resume.certificates || [];
  const workExperiences = resume.work_experiences || [];
  const internships = resume.any_internships || [];

  const SectionHead = ({ icon, children }) => (
    <View style={styles.sectionHeadRow}>
      <View style={{ ...styles.sectionIconBadge, backgroundColor: accentColor }}>{icon}</View>
      <Text style={{ ...styles.sectionHeadText, color: sidebarBg }}>{children}</Text>
      <View style={{ ...styles.sectionHeadLine, backgroundColor: accentColor, opacity: 0.4 }} />
      <View style={{ ...styles.sectionHeadDot, backgroundColor: accentColor }} />
    </View>
  );

  const Entry = ({ title, subLine, dateLabel, description, bullets }) => (
    <View style={styles.entryBlock}>
      <View style={styles.entryTopRow}>
        <Text style={styles.entryTitle}>{title}</Text>
        {dateLabel ? <Text style={{ ...styles.entryDateText, color: accentColor }}>{dateLabel}</Text> : null}
      </View>
      {subLine ? <Text style={styles.entrySubLine}>{subLine}</Text> : null}\n
      {(description || (bullets && bullets.length > 0)) ? (
        <View style={{ ...styles.quoteBlock, borderLeftColor: accentColor }}>
          <View style={styles.quoteIconWrap}>
            <IconQuote color={accentColor} />
          </View>
          <View style={{ flex: 1 }}>
            {description ? <Text style={styles.quoteText}>{description}</Text> : null}
            {bullets && bullets.length > 0
              ? bullets.map((line, i) => (
                  <View key={i} style={{ ...styles.bulletRow, marginBottom: i === bullets.length - 1 ? 0 : 3 }}>
                    <Text style={{ ...styles.bulletMark, color: accentColor }}>•</Text>
                    <Text style={styles.quoteText}>{line.replace(/^[-•]\s*/, "")}</Text>
                  </View>
                ))
              : null}
          </View>
        </View>
      ) : null}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ---------- SIDEBAR ---------- */}
        <View style={{ ...styles.sidebar, backgroundColor: sidebarBg }}>
          <Text style={styles.name}>{fullName}</Text>
          {roleTag ? <Text style={styles.roleTag}>{roleTag}</Text> : null}
          <View style={{ ...styles.nameUnderline, backgroundColor: accentColor }} />

          {contactItems.length > 0 && (
            <View style={styles.contactBlock}>
              {contactItems.map((item, idx) => (
                <View key={idx} style={styles.contactRow}>
                  <View style={{ ...styles.contactBadge, backgroundColor: accentColor }}>
                    {item.type === "email" ? (
                      <IconEmail color="#ffffff" />
                    ) : item.type === "phone" ? (
                      <IconPhone color="#ffffff" />
                    ) : item.type === "location" ? (
                      <IconLocation color="#ffffff" />
                    ) : (
                      <IconGlobe color="#ffffff" />
                    )}
                  </View>
                  <Text style={styles.contactText}>{item.label}</Text>
                </View>
              ))}
            </View>
          )}

          {skills.length > 0 && (
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarSectionTitle}>Skills</Text>
              {skills.map((skill, idx) => (
                <View key={idx} style={styles.skillBlock}>
                  <Text style={styles.skillName}>{safeText(skill.skill_name)}</Text>
                  <View style={styles.skillBarTrack}>
                    <View style={{ ...styles.skillBarFill, width: `${skillLevelToPercent(skill.proficiency_level)}%`, backgroundColor: accentColor }} />
                  </View>
                </View>
              ))}
            </View>
          )}

          {hobbies.length > 0 && (
            <View style={styles.sidebarBlock}>
              <Text style={styles.sidebarSectionTitle}>Hobbies</Text>
              {hobbies.map((hobby, idx) => (
                <View key={idx} style={styles.checkRow}>
                  <View style={{ ...styles.checkBadge, backgroundColor: accentColor }}>
                    <IconCheck color="#ffffff" />
                  </View>
                  <Text style={styles.checkText}>{safeText(hobby.hobbies || hobby)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* decorative dot grid */}
          <View style={styles.dotGrid}>
            {Array.from({ length: 40 }).map((_, i) => (
              <View key={i} style={{ ...styles.dotGridDot, backgroundColor: accentColor, opacity: 0.5 }} />
            ))}
          </View>
        </View>

        {/* ---------- CONTENT ---------- */}
        <View style={styles.content}>
          {resume.summary && resume.summary.summary && (
            <View style={styles.contentSection}>
              <SectionHead icon={<IconPerson color="#ffffff" />}>Summary</SectionHead>
              <Text style={styles.bodyText}>{safeTextInline(resume.summary.summary)}</Text>
            </View>
          )}

          {workExperiences.length > 0 && (
            <View style={styles.contentSection}>
              <SectionHead icon={<IconBriefcase color="#ffffff" />}>Work Experience</SectionHead>
              {workExperiences.map((work, idx) => (
                <Entry
                  key={idx}
                  title={safeText(work.job_title)}
                  subLine={[safeText(work.company_name), safeText(work.location)].filter(Boolean).join(" — ")}
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

          {educations.length > 0 && (
            <View style={styles.contentSection}>
              <SectionHead icon={<IconCap color="#ffffff" />}>Education</SectionHead>
              {educations.map((edu, idx) => (
                <Entry
                  key={idx}
                  title={`${safeText(edu.degree)}${edu.field_study ? ` in ${safeText(edu.field_study)}` : ""}`}
                  subLine={[safeText(edu.institute_name), safeText(edu.location)].filter(Boolean).join(" — ")}
                  dateLabel={!edu.date || !edu.year ? "Still Studying" : formatEducationDateRange(edu.date, edu.year)}
                />
              ))}
            </View>
          )}

          {certificates.length > 0 && (
            <View style={styles.contentSection}>
              <SectionHead icon={<IconAward color="#ffffff" />}>Certifications</SectionHead>
              {certificates.map((cert, idx) => (
                <View key={idx} style={styles.entryBlock}>
                  <View style={styles.entryTopRow}>
                    <Text style={styles.entryTitle}>{safeText(cert.certificate_name)}</Text>
                    {cert.issue_date ? (
                      <Text style={{ ...styles.entryDateText, color: accentColor }}>{formatSingleDate(cert.issue_date)}</Text>
                    ) : null}
                  </View>
                  {cert.issuing_organization ? (
                    <Text style={{ ...styles.entrySubLine, color: accentColor }}>{safeText(cert.issuing_organization)}</Text>
                  ) : null}
                  {cert.description ? (
                    <View style={{ ...styles.quoteBlock, borderLeftColor: accentColor }}>
                      <View style={styles.quoteIconWrap}>
                        <IconQuote color={accentColor} />
                      </View>
                      <Text style={styles.quoteText}>{safeText(cert.description)}</Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          {internships.length > 0 && (
            <View style={styles.contentSection}>
              <SectionHead icon={<IconBriefcase color="#ffffff" />}>Internships</SectionHead>
              {internships.map((intern, idx) => (
                <Entry
                  key={idx}
                  title={safeText(intern.job_title)}
                  subLine={[safeText(intern.company_name), safeText(intern.location)].filter(Boolean).join(" — ")}
                  dateLabel={formatDateRange(intern.start_month, intern.start_year, intern.end_month, intern.end_year)}
                />
              ))}
            </View>
          )}

          {languages.length > 0 && (
            <View style={styles.contentSection}>
              <SectionHead icon={<IconLanguage color="#ffffff" />}>Languages</SectionHead>
              {languages.map((lang, idx) => {
                const dots = proficiencyToDots(lang.proficiency_level);
                return (
                  <View key={idx} style={styles.languageRow}>
                    <Text style={styles.languageName}>{safeText(lang.language)}</Text>
                    <View style={styles.dotsRow}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <View
                          key={n}
                          style={{
                            ...styles.ratingDot,
                            backgroundColor: n <= dots ? accentColor : "#ffffff",
                            borderWidth: n <= dots ? 0 : 1,
                            borderColor: accentColor,
                          }}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {socialItems.length > 0 && (
            <View style={styles.contentSection}>
              <SectionHead icon={<IconLink color="#ffffff" />}>Social Media</SectionHead>
              {socialItems.map((item, idx) => (
                <View key={idx} style={styles.socialLine}>
                  <View style={styles.socialIconWrap}>{getSocialIcon(item.social_name, accentColor)}</View>
                  <Text style={styles.socialText}>
                    {safeText(item.social_name)}: {safeText(item.social_url)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default ResumeTemplate9Pdf;
