import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  PALETTE_COLORS,
  safeText,
  safeTextInline,
  resolveProfileImage,
  formatDateRange,
  formatEducationDateRange,
  formatSingleDate,
  formatPhoneDisplay,
} from "./pdfHelpers";
import {
  IconEmail,
  IconPhone,
  IconLocation,
  IconGlobe,
  getSocialIcon,
} from "./PdfCommon";

/**
 * ResumeTemplate3Pdf - "Executive Panel"
 * Full-width dark header band (photo, name, tag, contact row) on top.
 * Below it, a light sidebar (skills with level bars, languages, social,
 * hobbies) and a white content column (profile + work / intern /
 * education / certification entries, each marked by a ring icon with
 * title left / date right).
 *
 * Every entry keeps the title and date from ever colliding: the title
 * sits in a flex-growing column that wraps onto a second line for long
 * text, while the date renders as a fixed-width, non-shrinking pill on
 * the right — so long job titles, degree names, or certificate names
 * never run into the date. Company/institute/issuer names live on
 * their own italic sub-line instead of being appended to the title,
 * which is what was causing the long merged/overflowing strings.
 *
 * Headings, underlines, ring-icons, bullet marks, skill-bar fills and
 * date pills are derived from the single `accentColor` (driven by the
 * `palette` prop). Body text, descriptions, sub-lines and header icons
 * use fixed neutral colors so the page doesn't turn entirely accent-tinted.
 */

// ---------- Color engine: derive tints/shades from one hex color ----------
const hexToRgbObj = (hex) => {
  if (!hex || typeof hex !== "string") return { r: 99, g: 102, b: 241 };
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return { r: 99, g: 102, b: 241 };
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
// amount 0..1 - how far toward white/black to blend the accent color.
const lighten = (hex, amount) => mixColor(hex, "#ffffff", amount);
const darken = (hex, amount) => mixColor(hex, "#000000", amount);

// Rough word-to-percentage mapping for the skill level bar fill.
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
    flexDirection: "column",
    fontFamily: "Poppins",
  },

  // ---------- Header ----------
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 32,
  },
  headerPhotoWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderStyle: "solid",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.85)",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 22,
    flexShrink: 0,
  },
  headerPhotoImage: {
    width: 78,
    height: 78,
    objectFit: "cover",
  },
  avatarHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 13,
  },
  avatarBody: {
    width: 50,
    height: 30,
    borderRadius: 25,
    marginTop: 5,
  },
  headerInfo: {
    flexDirection: "column",
    flex: 1,
    minWidth: 0,
  },
  headerName: {
    fontSize: 21,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  headerTag: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 2.4,
    marginBottom: 12,
    fontWeight: "600",
  },
  headerContactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 6,
  },
  headerContactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  headerContactText: {
    fontSize: 9.5,
    marginLeft: 6,
  },

  // ---------- Body row ----------
  bodyRow: {
    flexDirection: "row",
    flexGrow: 1,
  },

  // ---------- Sidebar ----------
  sidebar: {
    width: 220,
    paddingTop: 30,
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  sidebarSection: {
    marginBottom: 22,
  },
  sidebarHeading: {
    fontSize: 11.5,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  sidebarUnderline: {
    height: 2,
    width: 26,
    borderRadius: 1,
    marginBottom: 15,
  },
  skillBlock: {
    marginBottom: 13,
  },
  skillName: {
    fontSize: 10,
    fontWeight: "600",
    marginBottom: 5,
  },
  skillBarTrack: {
    height: 4,
    borderRadius: 2,
  },
  skillBarFill: {
    height: 4,
    borderRadius: 2,
  },
  bulletLine: {
    flexDirection: "row",
    marginBottom: 9,
  },
  bulletMark: {
    fontSize: 9,
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 10,
    lineHeight: 1.45,
    flex: 1,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  socialText: {
    fontSize: 10,
    marginLeft: 7,
    flex: 1,
  },

  // ---------- Content ----------
  content: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 30,
    paddingHorizontal: 26,
    paddingBottom: 30,
  },
  contentSection: {
    marginBottom: 22,
  },
  contentHeading: {
    fontSize: 12.5,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 7,
  },
  contentUnderline: {
    height: 2.5,
    width: 32,
    borderRadius: 50,
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 10.5,
    lineHeight: 1.65,
    textAlign: "justify",
  },

  entryBlock: {
    marginBottom: 16,
  },
  entryRow: {
    flexDirection: "row",
  },
  entryRail: {
    width: 21,
    alignItems: "center",
    flexShrink: 0,
  },
  ringIconOuter: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 1.4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  ringIconInner: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
  },
  entryRailLine: {
    flexGrow: 1,
    width: 1.4,
    marginTop: 4,
  },
  entryContent: {
    flex: 1,
    minWidth: 0,
  },
  // Title/date row: title lives in a flex-growing, min-width:0 column so
  // long text wraps instead of pushing into the date; the date is a
  // fixed, non-shrinking pill so it never gets crushed or overlapped.
  entryTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitleCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  entryTitle: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 1.3,
  },
  entryDatePill: {
    fontSize: 8.5,
    fontWeight: "600",
    flexShrink: 0,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 1,
  },
  entrySubLine: {
    fontSize: 10,
    fontStyle: "italic",
    marginTop: 4,
  },
  entryDescription: {
    fontSize: 10,
    lineHeight: 1.6,
    marginTop: 8,
    marginBottom: 0,
  },
});

const BULLET = String.fromCharCode(8226);

const ResumeTemplate3Pdf = ({
  resume,
  palette = "color-1",
  forceFallbackFont = false,
  fontFamily = "Poppins",
}) => {
  const accentColor = PALETTE_COLORS[palette] || PALETTE_COLORS["color-1"];

  // ---------- Theme ----------
  // Accent-derived: headings, underlines, ring-icons, bullet marks, skill-bar
  // fill, date pills. Neutral (fixed): body text, descriptions, sub-lines,
  // header icons/text - so the page doesn't end up entirely accent-tinted.
  const theme = {
    headerBg: darken(accentColor, 0.8),
    headerTagText: lighten(accentColor, 0.72),
    headerContactText: "#f2f2f2",
    headerIconColor: "#ffffff",

    sidebarBg: lighten(accentColor, 0.94),
    sidebarHeading: accentColor,
    sidebarUnderline: lighten(accentColor, 0.5),
    skillName: "#2b2b2b",
    skillBarTrack: lighten(accentColor, 0.75),
    bulletMark: accentColor,
    bulletText: "#3a3a3a",
    socialIcon: accentColor,
    socialText: "#3a3a3a",

    bodyText: "#3a3a3a",
    entryTitle: "#1a1a1a",
    entryDatePillBg: lighten(accentColor, 0.88),
    entryDatePillText: darken(accentColor, 0.25),
    entrySubLine: "#5a5a5a",
    entryDescription: "#3a3a3a",
  };

  const personal = resume.personal_infomation || {};
  const fullName =
    [personal.firstName, personal.lastName].filter(Boolean).join(" ") ||
    resume.resume_name ||
    "Your Name";
  const jobLevel = safeText(personal.experience || personal.job_title);
  const profileSrc = resolveProfileImage(personal.photo);

  const pageStyle = {
    ...styles.page,
    fontFamily: forceFallbackFont ? "Helvetica" : fontFamily || "Poppins",
  };

  const contactItems = [
    [personal.address, personal.city, personal.state].filter(Boolean).length > 0
      ? {
          type: "location",
          label: [personal.address, personal.city, personal.state].filter(Boolean).join(", "),
        }
      : null,
    personal.phone ? { type: "phone", label: formatPhoneDisplay(personal.phone, personal.country_code) } : null,
    personal.email ? { type: "email", label: safeText(personal.email) } : null,
    personal.website
      ? { type: "globe", label: safeText(personal.website) }
      : null,
  ].filter(Boolean);

  const skills = resume.skills || [];
  const languages = resume.languages || [];
  const hobbies = resume.hobbies || [];
  const socialItems = resume.social_medias || [];

  const SidebarHeading = ({ children }) => (
    <>
      <Text style={{ ...styles.sidebarHeading, color: theme.sidebarHeading }}>
        {children}
      </Text>
      <View
        style={{
          ...styles.sidebarUnderline,
          backgroundColor: theme.sidebarUnderline,
        }}
      />
    </>
  );

  const ContentHeading = ({ children }) => (
    <>
      <Text style={{ ...styles.contentHeading, color: accentColor }}>
        {children}
      </Text>
      <View
        style={{ ...styles.contentUnderline, backgroundColor: accentColor }}
      />
    </>
  );

  // title = the single bold headline (job title / degree / certificate name
  // ONLY — never concatenated with the company/institute/issuer, which is
  // what caused the overflow). subLine = company/institute/issuer + extra
  // context, rendered italic on its own line underneath.
  const Entry = ({ title, dateLine, subLine, description, isLast }) => (
    <View style={styles.entryBlock}>
      <View style={styles.entryRow}>
        <View style={styles.entryRail}>
          <View style={{ ...styles.ringIconOuter, borderColor: accentColor }}>
            <View
              style={{ ...styles.ringIconInner, backgroundColor: accentColor }}
            />
          </View>
          {!isLast && (
            <View
              style={{ ...styles.entryRailLine, backgroundColor: accentColor, opacity: 0.35 }}
            />
          )}
        </View>
        <View style={styles.entryContent}>
          <View style={styles.entryTitleRow}>
            <View style={styles.entryTitleCol}>
              <Text style={{ ...styles.entryTitle, color: theme.entryTitle }}>
                {title}
              </Text>
            </View>
            {dateLine ? (
              <Text
                style={{
                  ...styles.entryDatePill,
                  backgroundColor: theme.entryDatePillBg,
                  color: theme.entryDatePillText,
                }}
              >
                {dateLine}
              </Text>
            ) : null}
          </View>
          {subLine ? (
            <Text style={{ ...styles.entrySubLine, color: theme.entrySubLine }}>
              {subLine}
            </Text>
          ) : null}
          {description ? (
            <Text
              style={{
                ...styles.entryDescription,
                color: theme.entryDescription,
              }}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ---------- HEADER ---------- */}
        <View style={{ ...styles.header, backgroundColor: theme.headerBg }}>
          {profileSrc && (
            <View style={styles.headerPhotoWrap}>
              <Image style={styles.headerPhotoImage} src={profileSrc} />
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{fullName}</Text>
            {jobLevel && (
              <Text style={{ ...styles.headerTag, color: theme.headerTagText }}>
                {jobLevel}
              </Text>
            )}
            {contactItems.length > 0 && (
              <View style={styles.headerContactRow}>
                {contactItems.map((item, idx) => (
                  <View key={idx} style={styles.headerContactItem}>
                    {item.type === "location" ? (
                      <IconLocation color={theme.headerIconColor} />
                    ) : item.type === "phone" ? (
                      <IconPhone color={theme.headerIconColor} />
                    ) : item.type === "email" ? (
                      <IconEmail color={theme.headerIconColor} />
                    ) : (
                      <IconGlobe color={theme.headerIconColor} />
                    )}
                    <Text
                      style={{
                        ...styles.headerContactText,
                        color: theme.headerContactText,
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* ---------- BODY ---------- */}
        <View style={styles.bodyRow}>
          {/* ---------- SIDEBAR ---------- */}
          <View style={{ ...styles.sidebar, backgroundColor: theme.sidebarBg }}>
            {skills.length > 0 && (
              <View style={styles.sidebarSection}>
                <SidebarHeading>Skills</SidebarHeading>
                {skills.map((skill, idx) => (
                  <View key={idx} style={styles.skillBlock}>
                    <Text
                      style={{ ...styles.skillName, color: theme.skillName }}
                    >
                      {safeText(skill.skill_name)}
                      {skill.proficiency_level
                        ? ` (${safeText(skill.proficiency_level)})`
                        : ""}
                    </Text>
                    <View
                      style={{
                        ...styles.skillBarTrack,
                        backgroundColor: theme.skillBarTrack,
                      }}
                    >
                      <View
                        style={{
                          ...styles.skillBarFill,
                          width: `${skillLevelToPercent(skill.proficiency_level)}%`,
                          backgroundColor: accentColor,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {languages.length > 0 && (
              <View style={styles.sidebarSection}>
                <SidebarHeading>Languages</SidebarHeading>
                {languages.map((lang, idx) => (
                  <View key={idx} style={styles.bulletLine}>
                    <Text
                      style={{ ...styles.bulletMark, color: theme.bulletMark }}
                    >
                      {BULLET}
                    </Text>
                    <Text
                      style={{ ...styles.bulletText, color: theme.bulletText }}
                    >
                      {safeText(lang.language)}:{" "}
                      {safeText(lang.proficiency_level)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {socialItems.length > 0 && (
              <View style={styles.sidebarSection}>
                <SidebarHeading>Social</SidebarHeading>
                {socialItems.map((item, idx) => (
                  <View key={idx} style={styles.socialRow}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 1,
                        flexShrink: 0,
                      }}
                    >
                      {getSocialIcon(item.social_name, theme.socialIcon)}
                    </View>
                    <Text
                      style={{ ...styles.socialText, color: theme.socialText }}
                    >
                      {safeText(item.social_name)}: {safeText(item.social_url)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {hobbies.length > 0 && (
              <View style={styles.sidebarSection}>
                <SidebarHeading>Hobbies</SidebarHeading>
                {hobbies.map((hobby, idx) => (
                  <View key={idx} style={styles.bulletLine}>
                    <Text
                      style={{ ...styles.bulletMark, color: theme.bulletMark }}
                    >
                      {BULLET}
                    </Text>
                    <Text
                      style={{ ...styles.bulletText, color: theme.bulletText }}
                    >
                      {safeText(hobby.hobbies || hobby)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* ---------- CONTENT ---------- */}
          <View style={styles.content}>
            {resume.summary && resume.summary.summary && (
              <View style={styles.contentSection}>
                <ContentHeading>Profile</ContentHeading>
                <Text style={{ ...styles.bodyText, color: theme.bodyText }}>
                  {safeTextInline(resume.summary.summary)}
                </Text>
              </View>
            )}

            {resume.work_experiences && resume.work_experiences.length > 0 && (
              <View style={styles.contentSection}>
                <ContentHeading>Work Experience</ContentHeading>
                {resume.work_experiences.map((work, idx) => (
                  <Entry
                    key={idx}
                    title={safeText(work.job_title)}
                    dateLine={formatDateRange(
                      work.start_month,
                      work.start_year,
                      work.end_month,
                      work.end_year,
                    )}
                    subLine={[
                      safeText(work.company_name),
                      safeText(work.location),
                      work.employment_type ? safeText(work.employment_type) : "",
                    ]
                      .filter(Boolean)
                      .join(" — ")}
                    description={
                      work.description ? safeText(work.description) : ""
                    }
                    isLast={idx === resume.work_experiences.length - 1}
                  />
                ))}
              </View>
            )}

            {resume.any_internships && resume.any_internships.length > 0 && (
              <View style={styles.contentSection}>
                <ContentHeading>Internships</ContentHeading>
                {resume.any_internships.map((intern, idx) => (
                  <Entry
                    key={idx}
                    title={safeText(intern.job_title)}
                    dateLine={formatDateRange(
                      intern.start_month,
                      intern.start_year,
                      intern.end_month,
                      intern.end_year,
                    )}
                    subLine={[
                      safeText(intern.company_name),
                      safeText(intern.location),
                      intern.employment_type ? safeText(intern.employment_type) : "",
                    ]
                      .filter(Boolean)
                      .join(" — ")}
                    isLast={idx === resume.any_internships.length - 1}
                  />
                ))}
              </View>
            )}

            {resume.educations && resume.educations.length > 0 && (
              <View style={styles.contentSection}>
                <ContentHeading>Education</ContentHeading>
                {resume.educations.map((edu, idx) => (
                  <Entry
                    key={idx}
                    title={`${safeText(edu.degree)}${edu.field_study ? ` in ${safeText(edu.field_study)}` : ""}`}
                    dateLine={formatEducationDateRange(edu.date, edu.year)}
                    subLine={[
                      safeText(edu.institute_name),
                      safeText(edu.location),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    isLast={idx === resume.educations.length - 1}
                  />
                ))}
              </View>
            )}

            {resume.certificates && resume.certificates.length > 0 && (
              <View style={styles.contentSection}>
                <ContentHeading>Certifications</ContentHeading>
                {resume.certificates.map((cert, idx) => (
                  <Entry
                    key={idx}
                    title={safeText(cert.certificate_name)}
                    dateLine={formatSingleDate(cert.issue_date)}
                    subLine={safeText(cert.issuing_organization)}
                    description={
                      cert.description ? safeText(cert.description) : ""
                    }
                    isLast={idx === resume.certificates.length - 1}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ResumeTemplate3Pdf;