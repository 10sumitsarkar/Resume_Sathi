import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { PALETTE_COLORS, safeText, safeTextInline, formatDateRange, formatEducationDateRange, formatSingleDate } from "./pdfHelpers";
import { IconEmail, IconPhone, IconLocation, IconGlobe, getSocialIcon } from "./PdfCommon";

/**
 * ResumeTemplate8Pdf — "Momentum" (no photo)
 * A bold full-width accent-color banner carries the name/role/contact
 * row in reversed (white) type — a strong first impression instead of
 * the usual plain header. Every section title is a small solid-accent
 * "tab" label rather than a plain heading + rule. Experience,
 * Education, Certifications and Internships render as a timeline: a
 * thin accent line with a small circular marker per entry — the
 * marker column carries no text, so a parser simply skips it and
 * reads the entry content in normal top-to-bottom order. Skills and
 * Hobbies render as outlined chips; Languages show a 5-dot
 * proficiency rating next to the language name.
 *
 * Section order: Summary -> Skills -> Work Experience -> Education ->
 * Certifications -> Internships -> Languages -> Hobbies -> Social Media
 */

const proficiencyToDots = (level) => {
  const l = (level || "").toLowerCase();
  if (l.includes("native") || l.includes("master")) return 5;
  if (l.includes("fluent") || l.includes("expert") || l.includes("advanced")) return 4;
  if (l.includes("proficient") || l.includes("professional")) return 3;
  if (l.includes("intermediate") || l.includes("conversational")) return 2;
  if (l.includes("beginner") || l.includes("basic") || l.includes("elementary")) return 1;
  return 3;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Poppins",
    paddingBottom: 40,
    color: "#232323",
    backgroundColor: "#ffffff",
  },

  // ---------- Banner header ----------
  banner: {
    paddingTop: 34,
    paddingBottom: 24,
    paddingLeft: 50,
    paddingRight: 50,
  },
  bannerAccentStrip: {
    height: 6,
  },
  name: {
    fontSize: 27,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  role: {
    fontSize: 11.5,
    fontWeight: "500",
    color: "#ffffff",
    opacity: 0.9,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginTop: 5,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 6,
    columnGap: 18,
  },
  contactItemWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIconWrap: {
    width: 11,
    height: 11,
    marginRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: {
    fontSize: 9,
    color: "#ffffff",
    opacity: 0.95,
  },

  // ---------- Body ----------
  body: {
    paddingTop: 22,
    paddingLeft: 50,
    paddingRight: 50,
  },
  section: {
    marginBottom: 20,
  },
  sectionTab: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 3,
    marginBottom: 11,
  },
  sectionTabText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  bodyText: {
    fontSize: 10,
    lineHeight: 1.65,
    color: "#3a3a3a",
  },

  // ---------- Skills / Hobbies chips ----------
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    fontSize: 8.5,
    fontWeight: "600",
    borderRadius: 11,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 7,
    marginBottom: 7,
  },
  hobbyChip: {
    fontSize: 8.5,
    fontWeight: "500",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    color: "#555555",
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 7,
    marginBottom: 7,
  },

  // ---------- Timeline entries ----------
  timelineRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineRail: {
    width: 16,
    alignItems: "center",
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 3,
  },
  timelineLine: {
    flexGrow: 1,
    width: 1.4,
    marginTop: 3,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 6,
  },
  entryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  entryDatePill: {
    fontSize: 8,
    fontWeight: "700",
    borderRadius: 3,
    paddingVertical: 2.5,
    paddingHorizontal: 8,
    whiteSpace: "nowrap",
  },
  entrySub: {
    fontSize: 9.5,
    color: "#5a5a5a",
    marginTop: 2,
    marginBottom: 6,
    fontStyle: "italic",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bulletMark: {
    fontSize: 9,
    marginRight: 6,
  },
  bulletText: {
    fontSize: 9.5,
    lineHeight: 1.55,
    color: "#3a3a3a",
    flex: 1,
  },

  // ---------- Languages ----------
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
    paddingRight: 4,
  },
  languageName: {
    fontSize: 10.5,
    color: "#232323",
    fontWeight: "600",
  },
  dotsRow: {
    flexDirection: "row",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginLeft: 4,
  },

  // ---------- Social ----------
  socialLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  socialIconWrap: {
    width: 11,
    height: 11,
    marginRight: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    fontSize: 9.5,
    color: "#3a3a3a",
  },
});

const ResumeTemplate8Pdf = ({ resume, palette = "color-1", forceFallbackFont = false, fontFamily = "Poppins" }) => {
  const accentColor = PALETTE_COLORS[palette] || PALETTE_COLORS["color-1"];

  const personal = resume.personal_infomation || {};
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(" ") || resume.resume_name || "Your Name";
  const jobTitle = safeText(personal.experience || personal.job_title);

  const pageStyle = { ...styles.page, fontFamily: forceFallbackFont ? "Helvetica" : fontFamily || "Poppins" };

  const contactItems = [
    personal.email ? { type: "email", label: safeText(personal.email) } : null,
    personal.phone ? { type: "phone", label: safeText(personal.phone) } : null,
    [personal.address, personal.city, personal.state, personal.country].filter(Boolean).length > 0
      ? { type: "location", label: [personal.address, personal.city, personal.state, personal.country].filter(Boolean).join(", ") }
      : null,
    personal.website ? { type: "globe", label: safeText(personal.website) } : null,
  ].filter(Boolean);

  const skills = resume.skills || [];
  const languages = resume.languages || [];
  const hobbies = resume.hobbies || [];
  const socialItems = resume.social_medias || [];
  const educations = resume.educations || [];
  const certificates = resume.certificates || [];
  const workExperiences = resume.work_experiences || [];
  const internships = resume.any_internships || [];

  const SectionTab = ({ children }) => (
    <View style={{ ...styles.sectionTab, backgroundColor: accentColor }}>
      <Text style={styles.sectionTabText}>{children}</Text>
    </View>
  );

  const TimelineEntry = ({ title, subLine, dateLabel, description, bullets, isLast }) => (
    <View style={styles.timelineRow}>
      <View style={styles.timelineRail}>
        <View style={{ ...styles.timelineDot, backgroundColor: accentColor }} />
        {!isLast && <View style={{ ...styles.timelineLine, backgroundColor: "#e4e4e4" }} />}
      </View>
      <View style={styles.timelineContent}>
        <View style={styles.entryTop}>
          <Text style={styles.entryTitle}>{title}</Text>
          {dateLabel ? (
            <Text style={{ ...styles.entryDatePill, backgroundColor: `${accentColor}1a`, color: accentColor }}>
              {dateLabel}
            </Text>
          ) : null}
        </View>
        {subLine ? <Text style={styles.entrySub}>{subLine}</Text> : null}
        {description ? <Text style={styles.bodyText}>{description}</Text> : null}
        {bullets && bullets.length > 0
          ? bullets.map((line, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={{ ...styles.bulletMark, color: accentColor }}>•</Text>
                <Text style={styles.bulletText}>{line.replace(/^[-•]\s*/, "")}</Text>
              </View>
            ))
          : null}
      </View>
    </View>
  );

  const renderTimelineSection = (title, items, mapFn) => (
    <View style={styles.section}>
      <SectionTab>{title}</SectionTab>
      {items.map((item, idx) => {
        const props = mapFn(item);
        return <TimelineEntry key={idx} {...props} isLast={idx === items.length - 1} />;
      })}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* ---------- BANNER HEADER ---------- */}
        <View style={{ ...styles.banner, backgroundColor: accentColor }}>
          <Text style={styles.name}>{fullName}</Text>
          {jobTitle ? <Text style={styles.role}>{jobTitle}</Text> : null}
          {contactItems.length > 0 && (
            <View style={styles.contactRow}>
              {contactItems.map((item, idx) => (
                <View key={idx} style={styles.contactItemWrap}>
                  <View style={styles.contactIconWrap}>
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
        </View>
        <View style={{ ...styles.bannerAccentStrip, backgroundColor: "#1a1a1a", opacity: 0.12 }} />

        {/* ---------- BODY ---------- */}
        <View style={styles.body}>
          {/* SUMMARY */}
          {resume.summary && resume.summary.summary && (
            <View style={styles.section}>
              <SectionTab>Summary</SectionTab>
              <Text style={styles.bodyText}>{safeTextInline(resume.summary.summary)}</Text>
            </View>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <View style={styles.section}>
              <SectionTab>Skills</SectionTab>
              <View style={styles.chipsRow}>
                {skills.map((skill, idx) => (
                  <Text
                    key={idx}
                    style={{ ...styles.chip, borderColor: accentColor, color: accentColor, backgroundColor: `${accentColor}12` }}
                  >
                    {safeText(skill.skill_name)}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* WORK EXPERIENCE */}
          {workExperiences.length > 0 &&
            renderTimelineSection("Work Experience", workExperiences, (work) => ({
              title: safeText(work.job_title),
              subLine: [safeText(work.company_name), safeText(work.location)].filter(Boolean).join(" — "),
              dateLabel: formatDateRange(work.start_month, work.start_year, work.end_month, work.end_year),
              bullets: work.description
                ? safeText(work.description).split(/\r?\n/).filter((line) => line.trim().length > 0)
                : null,
            }))}

          {/* EDUCATION */}
          {educations.length > 0 &&
            renderTimelineSection("Education", educations, (edu) => ({
              title: `${safeText(edu.degree)}${edu.field_study ? ` in ${safeText(edu.field_study)}` : ""}`,
              subLine: [safeText(edu.institute_name), safeText(edu.location)].filter(Boolean).join(" — "),
              dateLabel: !edu.date || !edu.year ? "Still Studying" : formatEducationDateRange(edu.date, edu.year),
            }))}

          {/* CERTIFICATIONS */}
          {certificates.length > 0 &&
            renderTimelineSection("Certifications", certificates, (cert) => ({
              title: safeText(cert.certificate_name),
              subLine: safeText(cert.issuing_organization),
              dateLabel: formatSingleDate(cert.issue_date),
              description: cert.description ? safeText(cert.description) : null,
            }))}

          {/* INTERNSHIPS */}
          {internships.length > 0 &&
            renderTimelineSection("Internships", internships, (intern) => ({
              title: safeText(intern.job_title),
              subLine: [safeText(intern.company_name), safeText(intern.location)].filter(Boolean).join(" — "),
              dateLabel: formatDateRange(intern.start_month, intern.start_year, intern.end_month, intern.end_year),
            }))}

          {/* LANGUAGES */}
          {languages.length > 0 && (
            <View style={styles.section}>
              <SectionTab>Languages</SectionTab>
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
                            ...styles.dot,
                            backgroundColor: n <= dots ? accentColor : "#e6e6e6",
                          }}
                        />
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* HOBBIES */}
          {hobbies.length > 0 && (
            <View style={styles.section}>
              <SectionTab>Hobbies</SectionTab>
              <View style={styles.chipsRow}>
                {hobbies.map((hobby, idx) => (
                  <Text key={idx} style={styles.hobbyChip}>
                    {safeText(hobby.hobbies || hobby)}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* SOCIAL MEDIA */}
          {socialItems.length > 0 && (
            <View style={styles.section}>
              <SectionTab>Social Media</SectionTab>
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

export default ResumeTemplate8Pdf;
