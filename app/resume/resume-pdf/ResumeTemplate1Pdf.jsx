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
} from "./pdfHelpers";
import {
  IconEmail,
  IconPhone,
  IconLocation,
  IconGlobe,
  getSocialIcon,
} from "./PdfCommon";
/**
 * ResumeTemplate1Pdf - "Sidebar Timeline"
 * Two-column layout: a full-height colored sidebar (photo/initials,
 * name, contact icon-badges, skills, social links) on the left, and a
 * white content column on the right where each entry (education,
 * certification, internship, experience) is introduced by a small
 * accent-colored timeline dot with a connecting vertical line.
 */

const hexToRgba = (hex, alpha) => {
  if (!hex || typeof hex !== "string") return `rgba(204,0,0,${alpha})`;
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const num = parseInt(h, 16);
  if (Number.isNaN(num)) return `rgba(204,0,0,${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Poppins",
  },

  // ---------- Sidebar ----------
  sidebar: {
    width: 195,
    minHeight: "100%",
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  photoWrap: {
    alignItems: "start",
    marginBottom: 16,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 100,
    height: 100,
    objectFit: "cover",
  },
  avatarHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginTop: 14,
  },
  avatarBody: {
    width: 66,
    height: 38,
    borderRadius: 33,
    marginTop: 6,
  },
  sidebarName: {
    fontSize: 14.5,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.4,
    marginBottom: 3,
  },
  sidebarTag: {
    fontSize: 10.5,
    color: "#ffffff",
    marginBottom: 18,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactBadge: {
    width: 16,
    height: 16,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  contactText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "500",
    flex: 1,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.45)",
    marginTop: 6,
    marginBottom: 18,
  },
  sidebarSectionTitle: {
    fontSize: 11.2,
    fontWeight: "800",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  skillItem: {
    fontSize: 10.5,
    color: "#ffffff",
    marginBottom: 8,
    lineHeight: 1.4,
  },
  socialItem: {
    fontSize: 10.5,
    color: "#ffffff",
    marginBottom: 11,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
  },

  // ---------- Content ----------
  content: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
  },
  contentSection: {
    marginBottom: 4,
  },
  contentSectionTitle: {
    fontSize: 11.5,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#374151",
    textAlign: "justify",
    marginBottom: 22,
  },

  // ---------- Timeline entry ----------
  timelineRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineRail: {
    width: 16,
    alignItems: "center",
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  timelineLine: {
    flexGrow: 1,
    width: 1.5,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 8,
  },
  entryTitle: {
    fontSize: 10.5,
    fontWeight: "700",
    color: "#111827",
    marginTop: 5,
  },
  entrySubLine: {
    fontSize: 10.5,
    fontStyle: "italic",
    color: "#6b7280",
    marginTop: 5,
  },
  entryDate: {
    fontSize: 9.2,
    color: "#374151",
    marginTop: 5,
  },
  entryDescription: {
    fontSize: 10.5,
    lineHeight: 1.55,
    color: "#374151",
    marginTop: 10,
  },

  languageItem: {
    fontSize: 11,
    color: "#374151",
    marginBottom: 10,
  },
  languageLabel: {
    fontWeight: "700",
    color: "#111827",
  },
});

const formatToDateLine = (a, b, c, d) =>
  formatDateRange(a, b, c, d).replace(/\s*-\s*/g, " to ");

const formatEducationDateLine = (a, b) => formatEducationDateRange(a, b);

const ResumeTemplate1Pdf = ({
  resume,
  palette = "color-1",
  forceFallbackFont = false,
  fontFamily = "Poppins",
}) => {
  const accentColor = PALETTE_COLORS[palette] || PALETTE_COLORS["color-1"];
  const shapeColor = "rgba(0,0,0,0.35)";

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
    [personal.address, personal.city, personal.state, personal.country].filter(Boolean).length > 0
      ? {
          type: "location",
          label: [personal.address, personal.city, personal.state, personal.country].filter(Boolean).join(", "),
        }
      : null,
    personal.phone ? { type: "phone", label: safeText(personal.phone) } : null,
    personal.email ? { type: "email", label: safeText(personal.email) } : null,
    personal.website
      ? { type: "globe", label: safeText(personal.website) }
      : null,
  ].filter(Boolean);

  const skills = resume.skills || [];
  const languages = resume.languages || [];
  const hobbies = resume.hobbies || [];
  const socialItems = resume.social_medias || [];

  const TimelineEntry = ({ title, subLine, dateLine, description, isLast }) => (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <View style={{ ...styles.timelineDot, backgroundColor: accentColor }} />
        {!isLast && (
          <View
            style={{ ...styles.timelineLine, backgroundColor: accentColor }}
          />
        )}
      </View>
      <View style={styles.timelineContent}>
        <Text style={styles.entryTitle}>{title}</Text>
        {subLine ? <Text style={styles.entrySubLine}>{subLine}</Text> : null}
        {dateLine ? <Text style={styles.entryDate}>{dateLine}</Text> : null}
        {description ? (
          <Text style={styles.entryDescription}>{description}</Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ---------- SIDEBAR ---------- */}
        <View style={{ ...styles.sidebar, backgroundColor: accentColor }}>
          {profileSrc && (
            <View style={styles.photoWrap}>
              <View
                style={{
                  ...styles.photoCircle,
                  backgroundColor: hexToRgba(accentColor, 1),
                }}
              >
                <Image style={styles.profileImage} src={profileSrc} />
              </View>
            </View>
          )}

          <Text style={styles.sidebarName}>{fullName}</Text>
          {jobLevel && <Text style={styles.sidebarTag}>({jobLevel})</Text>}

          {contactItems.map((item, idx) => (
            <View key={idx} style={styles.contactRow}>
              <View style={styles.contactBadge}>
                {item.type === "location" ? (
                  <IconLocation color="#ffffff" />
                ) : item.type === "phone" ? (
                  <IconPhone color="#ffffff" />
                ) : item.type === "email" ? (
                  <IconEmail color="#ffffff" />
                ) : (
                  <IconGlobe color="#ffffff" />
                )}
              </View>
              <Text style={styles.contactText}>{item.label}</Text>
            </View>
          ))}

          {skills.length > 0 && (
            <>
              <View style={styles.sidebarDivider} />
              <Text style={styles.sidebarSectionTitle}>Skills</Text>
              {skills.map((skill, idx) => (
                <Text key={idx} style={styles.skillItem}>
                  {safeText(skill.skill_name)}
                  {skill.proficiency_level
                    ? ` (${safeText(skill.proficiency_level)})`
                    : ""}
                </Text>
              ))}
            </>
          )}

          {socialItems.length > 0 && (
            <>
              <View style={styles.sidebarDivider} />
              <Text style={styles.sidebarSectionTitle}>Social Links</Text>
              {socialItems.map((item, idx) => (
                <View key={idx} style={styles.socialRow}>
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      marginRight: 6,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {getSocialIcon(item.social_name, "#ffffff")}
                  </View>
                  <Text style={{ ...styles.socialItem, marginBottom: 0 }}>
                    <Text style={{ fontWeight: 500 }}>
                      {safeText(item.social_name)}
                    </Text>
                    : {safeText(item.social_url)}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* ---------- CONTENT ---------- */}
        <View style={styles.content}>
          {resume.summary && resume.summary.summary && (
            <View style={styles.contentSection}>
              <Text
                style={{ ...styles.contentSectionTitle, color: accentColor }}
              >
                About Me
              </Text>
              <Text style={styles.bodyText}>
                {safeTextInline(resume.summary.summary)}
              </Text>
            </View>
          )}

          {resume.educations && resume.educations.length > 0 && (
            <View style={styles.contentSection}>
              <Text
                style={{ ...styles.contentSectionTitle, color: accentColor }}
              >
                Education
              </Text>
              {resume.educations.map((edu, idx) => (
                <TimelineEntry
                  key={idx}
                  title={`${safeText(edu.degree)}${edu.field_study ? ` in ${safeText(edu.field_study)}` : ""}${edu.institute_name ? ` (${safeText(edu.institute_name)})` : ""}`}
                  subLine={[
                    safeText(edu.location),
                    formatEducationDateLine(edu.date, edu.year),
                  ]
                    .filter(Boolean)
                    .join(" - ")}
                />
              ))}
            </View>
          )}

          {resume.certificates && resume.certificates.length > 0 && (
            <View style={styles.contentSection}>
              <Text
                style={{ ...styles.contentSectionTitle, color: accentColor }}
              >
                Certification
              </Text>
              {resume.certificates.map((cert, idx) => (
                <TimelineEntry
                  key={idx}
                  title={[
                    safeText(cert.certificate_name),
                    cert.issuing_organization
                      ? `from ${safeText(cert.issuing_organization)}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  dateLine={formatSingleDate(cert.issue_date)}
                  description={
                    cert.description ? safeText(cert.description) : ""
                  }
                />
              ))}
            </View>
          )}

          {resume.any_internships && resume.any_internships.length > 0 && (
            <View style={styles.contentSection}>
              <Text
                style={{ ...styles.contentSectionTitle, color: accentColor }}
              >
                Internships
              </Text>
              {resume.any_internships.map((intern, idx) => (
                <TimelineEntry
                  key={idx}
                  title={[
                    safeText(intern.job_title),
                    intern.company_name
                      ? `in ${safeText(intern.company_name)}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  subLine={safeText(intern.location)}
                  dateLine={formatToDateLine(
                    intern.start_month,
                    intern.start_year,
                    intern.end_month,
                    intern.end_year,
                  )}
                />
              ))}
            </View>
          )}

          {resume.work_experiences && resume.work_experiences.length > 0 && (
            <View style={styles.contentSection}>
              <Text
                style={{ ...styles.contentSectionTitle, color: accentColor }}
              >
                Work Experience
              </Text>
              {resume.work_experiences.map((work, idx) => (
                <TimelineEntry
                  key={idx}
                  title={[
                    safeText(work.job_title),
                    work.company_name
                      ? `in ${safeText(work.company_name)}`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  subLine={safeText(work.location)}
                  dateLine={formatToDateLine(
                    work.start_month,
                    work.start_year,
                    work.end_month,
                    work.end_year,
                  )}
                  description={
                    work.description ? safeText(work.description) : ""
                  }
                />
              ))}
            </View>
          )}

          {languages.length > 0 && (
            <View style={styles.contentSection}>
              <Text
                style={{ ...styles.contentSectionTitle, color: accentColor }}
              >
                Languages
              </Text>
              {languages.map((lang, idx) => (
                <Text key={idx} style={styles.languageItem}>
                  <Text style={styles.languageLabel}>
                    {safeText(lang.language)}:{" "}
                  </Text>
                  {safeText(lang.proficiency_level)}
                </Text>
              ))}
            </View>
          )}

          {hobbies.length > 0 && (
            <View style={styles.contentSection}>
              <Text
                style={{ ...styles.contentSectionTitle, color: accentColor }}
              >
                Hobbies
              </Text>
              <Text style={styles.languageItem}>
                {hobbies
                  .map((h) => safeText(h.hobbies || h))
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default ResumeTemplate1Pdf;









