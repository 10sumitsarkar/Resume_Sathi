import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Link,
} from "@react-pdf/renderer";
import {
  PALETTE_COLORS,
  safeText,
  resolveProfileImage,
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
 * ResumeTemplate5Pdf — "Gradient Rows"
 * Full-page soft diagonal gradient background (green -> lavender).
 * Header: square photo + big name + role tag.
 * Every section is a two-column ROW: a narrow left label/date column
 * and a wider right content column (Contact/About, Experience,
 * Internships, Education, Certifications, Skills, Languages, Social,
 * Hobbies), matching the reference design 1:1.
 */

// Fallback gradient stops if palette has no gradientFrom/gradientTo defined
const DEFAULT_GRADIENT_FROM = "#dfe9dc";
const DEFAULT_GRADIENT_TO = "#cfd3ef";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Poppins",
    paddingTop: 35,
    paddingBottom: 35,
    paddingLeft: 35,
    paddingRight: 35,
  },
  bgLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // ---------- Header ----------
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  photoBox: {
    width: 72,
    height: 72,
    borderRadius: 4,
    borderWidth: 1,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#ffffff",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  photoFallbackText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 22,
  },
  headerTextWrap: {
    flexGrow: 1,
  },
  nameText: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  roleText: {
    fontSize: 12,
    color: "#4b5563",
    marginTop: 2,
  },

  // ---------- Row layout (label col + content col) ----------
  row: {
    flexDirection: "row",
    marginBottom: 18,
  },
  rowLabelCol: {
    width: "35%",
    paddingRight: 12,
  },
  rowContentCol: {
    width: "65%",
  },
  block: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginBottom: 16,
  },

  // Contact
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactIconWrap: {
    width: 12,
    height: 12,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: {
    fontSize: 8.5,
    color: "#333333",
    flex: 1,
    lineHeight: 1.3,
  },

  bodyText: {
    fontSize: 9,
    lineHeight: 1.6,
    color: "#374151",
  },

  // Entry (experience / internships / education / certifications)
  entryDate: {
    fontSize: 9.5,
    fontWeight: "700",
  },
  entryOrg: {
    fontSize: 8.5,
    color: "#6b7280",
    marginTop: 2,
  },
  entryTitle: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  entrySub: {
    fontSize: 9,
    color: "#555555",
    fontStyle: "italic",
    marginBottom: 4,
  },
  entryDesc: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: "#374151",
  },

  // Skills / Languages / Hobbies (flowing bullet lists)
  bulletGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
    marginBottom: 8,
  },
  bulletDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 6,
  },
  bulletText: {
    fontSize: 9,
    color: "#374151",
  },

  // Social
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  socialIconWrap: {
    width: 13,
    height: 13,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    fontSize: 9,
    color: "#374151",
  },
  socialLink: {
    fontSize: 9,
    color: "#374151",
    textDecoration: "underline",
  },
});

const ResumeTemplate5Pdf = ({
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
  const profileSrc = resolveProfileImage(personal.photo);
  const initials =
    (personal.firstName?.[0] || "") + (personal.lastName?.[0] || "");

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

  const workExperiences = resume.work_experiences || [];
  const internships = resume.any_internships || [];
  const educations = resume.educations || [];
  const certificates = resume.certificates || [];
  const skills = resume.skills || [];
  const languages = resume.languages || [];
  const socialItems = resume.social_medias || [];
  const hobbies = resume.hobbies || [];

  const SectionTitle = ({ children }) => (
    <Text style={{ ...styles.sectionTitle, color: accentColor }}>
      {children}
    </Text>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ---------- BACKGROUND GRADIENT ---------- */}
        <View style={styles.bgLayer} fixed>
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 595 842"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient
                id="pageGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#fff" />
                <Stop offset="100%" stopColor="#fff" />
              </LinearGradient>
            </Defs>
            <Rect
              x="0"
              y="0"
              width="595"
              height="842"
              fill="url(#pageGradient)"
            />
          </Svg>
        </View>

        {/* ---------- HEADER ---------- */}
        <View style={styles.headerRow}>
          <View style={{ ...styles.photoBox, borderColor: accentColor }}>
            {profileSrc ? (
              <Image style={styles.profileImage} src={profileSrc} />
            ) : (
              <Text style={{ ...styles.photoFallbackText, color: accentColor }}>
                {initials || "NA"}
              </Text>
            )}
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={{ ...styles.nameText, color: accentColor }}>
              {fullName.toUpperCase()}
            </Text>
            {jobLevel ? <Text style={styles.roleText}>{jobLevel}</Text> : null}
          </View>
        </View>

        {/* ---------- CONTACT / ABOUT ---------- */}
        {(contactItems.length > 0 ||
          (resume.summary && resume.summary.summary)) && (
          <View style={styles.row}>
            <View style={styles.rowLabelCol}>
              <SectionTitle>Contact</SectionTitle>
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
            <View style={styles.rowContentCol}>
              {resume.summary && resume.summary.summary ? (
                <>
                  <SectionTitle>About Me</SectionTitle>
                  <Text style={styles.bodyText}>
                    {safeText(resume.summary.summary)}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        )}

        {/* ---------- EXPERIENCE ---------- */}
        {workExperiences.length > 0 && (
          <View style={styles.block}>
            <SectionTitle>Experience</SectionTitle>
            <View style={styles.divider} />
            {workExperiences.map((work, idx) => (
              <View key={idx} style={styles.row}>
                <View style={styles.rowLabelCol}>
                  <Text style={{ ...styles.entryDate, color: accentColor }}>
                    {formatDateRange(
                      work.start_month,
                      work.start_year,
                      work.end_month,
                      work.end_year,
                    )}
                  </Text>
                  <Text style={styles.entryOrg}>
                    {safeText(work.company_name)}
                  </Text>
                </View>
                <View style={styles.rowContentCol}>
                  <Text style={styles.entryTitle}>
                    {safeText(work.job_title)}
                  </Text>
                  {work.location || work.employee_type ? (
                    <Text style={styles.entrySub}>
                      {[safeText(work.location), safeText(work.employee_type)]
                        .filter(Boolean)
                        .join(" • ")}
                    </Text>
                  ) : null}
                  {work.description ? (
                    <Text style={styles.entryDesc}>
                      {safeText(work.description)}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ---------- INTERNSHIPS ---------- */}
        {internships.length > 0 && (
          <View style={styles.block}>
            <SectionTitle>Internships</SectionTitle>
            <View style={styles.divider} />
            {internships.map((intern, idx) => (
              <View key={idx} style={styles.row}>
                <View style={styles.rowLabelCol}>
                  <Text style={{ ...styles.entryDate, color: accentColor }}>
                    {formatDateRange(
                      intern.start_month,
                      intern.start_year,
                      intern.end_month,
                      intern.end_year,
                    )}
                  </Text>
                  <Text style={styles.entryOrg}>
                    {safeText(intern.company_name)}
                  </Text>
                </View>
                <View style={styles.rowContentCol}>
                  <Text style={styles.entryTitle}>
                    {safeText(intern.job_title)}
                  </Text>
                  {intern.location || intern.employee_type ? (
                    <Text style={styles.entrySub}>
                      {[
                        safeText(intern.location),
                        safeText(intern.employee_type),
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ---------- EDUCATION ---------- */}
        {educations.length > 0 && (
          <View style={styles.block}>
            <SectionTitle>Education</SectionTitle>
            <View style={styles.divider} />
            {educations.map((edu, idx) => (
              <View key={idx} style={styles.row}>
                <View style={styles.rowLabelCol}>
                  <Text style={{ ...styles.entryDate, color: accentColor }}>
                    {!edu.date || !edu.year
                      ? "Still Studying"
                      : `${safeText(edu.date)} ${safeText(edu.year)}`}
                  </Text>
                  <Text style={styles.entryOrg}>
                    {safeText(edu.institute_name)}
                  </Text>
                </View>
                <View style={styles.rowContentCol}>
                  <Text style={styles.entryTitle}>
                    {safeText(edu.degree)}
                    {edu.field_study ? ` - ${safeText(edu.field_study)}` : ""}
                  </Text>
                  {edu.location ? (
                    <Text style={styles.entryDesc}>
                      {safeText(edu.location)}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ---------- CERTIFICATIONS ---------- */}
        {certificates.length > 0 && (
          <View style={styles.block}>
            <SectionTitle>Certifications</SectionTitle>
            <View style={styles.divider} />
            {certificates.map((cert, idx) => (
              <View key={idx} style={styles.row}>
                <View style={styles.rowLabelCol}>
                  {cert.issue_date ? (
                    <Text style={{ ...styles.entryDate, color: accentColor }}>
                      {formatSingleDate(cert.issue_date)}
                    </Text>
                  ) : null}
                  {cert.issuing_organization ? (
                    <Text style={styles.entryOrg}>
                      {safeText(cert.issuing_organization)}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.rowContentCol}>
                  <Text style={styles.entryTitle}>
                    {safeText(cert.certificate_name)}
                  </Text>
                  {cert.description ? (
                    <Text style={styles.entryDesc}>
                      {safeText(cert.description)}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ---------- SKILLS ---------- */}
        {skills.length > 0 && (
          <View style={styles.block}>
            <SectionTitle>Skills</SectionTitle>
            <View style={styles.divider} />
            <View style={styles.bulletGrid}>
              {skills.map((skill, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <View
                    style={{
                      ...styles.bulletDot,
                      backgroundColor: accentColor,
                    }}
                  />
                  <Text style={styles.bulletText}>
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

        {/* ---------- LANGUAGES ---------- */}
        {languages.length > 0 && (
          <View style={styles.block}>
            <SectionTitle>Languages</SectionTitle>
            <View style={styles.divider} />
            <View style={styles.bulletGrid}>
              {languages.map((lang, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <View
                    style={{
                      ...styles.bulletDot,
                      backgroundColor: accentColor,
                    }}
                  />
                  <Text style={styles.bulletText}>
                    {safeText(lang.language)}
                    {lang.proficiency_level
                      ? ` — ${safeText(lang.proficiency_level)}`
                      : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ---------- SOCIAL ---------- */}
        {socialItems.length > 0 && (
          <View style={styles.block}>
            <SectionTitle>Social</SectionTitle>
            <View style={styles.divider} />
            {socialItems.map((social, idx) => {
              const rawUrl = safeText(social.social_url);
              const url = rawUrl.startsWith("http")
                ? rawUrl
                : `https://${rawUrl}`;
              return (
                <View key={idx} style={styles.socialItem}>
                  <View style={styles.socialIconWrap}>
                    {getSocialIcon(social.social_name, accentColor)}
                  </View>
                  <Text style={styles.socialText}>
                    {safeText(social.social_name)} -{" "}
                  </Text>
                  <Link src={url} style={styles.socialLink}>
                    {url}
                  </Link>
                </View>
              );
            })}
          </View>
        )}

        {/* ---------- HOBBIES ---------- */}
        {hobbies.length > 0 && (
          <View style={styles.block}>
            <SectionTitle>Hobbies</SectionTitle>
            <View style={styles.divider} />
            <View style={styles.bulletGrid}>
              {hobbies.map((h, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <View
                    style={{
                      ...styles.bulletDot,
                      backgroundColor: accentColor,
                    }}
                  />
                  <Text style={styles.bulletText}>{safeText(h.hobbies)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumeTemplate5Pdf;
