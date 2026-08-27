import React from "react";
import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const PALETTE_COLORS = {
  "color-1": "#9f036d",
  "color-2": "#3e1d53",
  "color-3": "#084c41",
  "color-4": "#87300d",
  "color-5": "#de2124",
  "color-6": "#585858",
};

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 10.5, color: "#1f2933" },
  sheet: { position: "relative", minHeight: "100%", padding: 0 },
  title: { textAlign: "center", fontSize: 20, fontWeight: 700, marginBottom: 22, padding: 10, border: "1 solid #d8dee8", backgroundColor: "#f8fafc" },
  variant8TitleRow: { flexDirection: "row", alignItems: "stretch", marginBottom: 22 },
  variant8TitleCutLeft: { width: 22, backgroundColor: "transparent", borderTopWidth: 21, borderTopColor: "transparent", borderRightWidth: 12, borderRightColor: "#334155", borderBottomWidth: 21, borderBottomColor: "transparent" },
  variant8TitleText: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: 700, padding: 10, color: "#ffffff", backgroundColor: "#334155" },
  variant8TitleCutRight: { width: 22, backgroundColor: "transparent", borderTopWidth: 21, borderTopColor: "#334155", borderRightWidth: 12, borderRightColor: "transparent", borderBottomWidth: 21, borderBottomColor: "#334155" },
  photo: { position: "absolute", right: 0, top: 76, width: 82, height: 98, objectFit: "cover", border: "1.5 solid #94a3b8" },
  topBand: { position: "absolute", top: 0, left: 0, right: 0, height: 96 },
  rows: { width: "78%" },
  row: { flexDirection: "row", marginBottom: 8, paddingBottom: 5, borderBottom: "0.6 solid #e2e8f0" },
  label: { width: 128, fontWeight: 700, textTransform: "uppercase" },
  colon: { width: 14, textAlign: "center", fontWeight: 700 },
  value: { flex: 1, fontWeight: 700, lineHeight: 1.35 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", marginBottom: 6, padding: "4 0 4 8", borderLeft: "3 solid #334155", backgroundColor: "#f8fafc" },
  table: { borderTop: "0.8 solid #d8dee8", borderLeft: "0.8 solid #d8dee8" },
  tr: { flexDirection: "row" },
  th: { fontWeight: 700 },
  td: { borderRight: "0.8 solid #d8dee8", borderBottom: "0.8 solid #d8dee8", padding: 5, textAlign: "center", minHeight: 22 },
  c1: { width: "27%" },
  c2: { width: "33%" },
  c3: { width: "22%" },
  c4: { width: "18%" },
  bulletRow: { flexDirection: "row", marginBottom: 5, paddingLeft: 16 },
  bullet: { width: 12 },
  bulletText: { flex: 1, lineHeight: 1.35 },
  declaration: { marginTop: 20 },
  declarationTitle: { fontSize: 12, fontWeight: 700, marginBottom: 10, padding: "4 0 4 8", borderLeft: "3 solid #334155", backgroundColor: "#f8fafc" },
  declarationText: { marginBottom: 8, lineHeight: 1.45 },
  signRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 40, fontWeight: 700 },
});

const formatName = (info) => [info.firstName, info.lastName].filter(Boolean).join(" ").trim() || "Your Name";
const formatDate = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-");
    return `${day}.${month}.${year}`;
  }
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
  }
  return value;
};
const examName = (edu) => edu.exam_name || [edu.degree, edu.field_study && `(${edu.field_study})`].filter(Boolean).join(" ");
const passingYear = (edu) => edu.passing_year || edu.year || [edu.date, edu.year].filter(Boolean).join(" ");

const getVariantStyles = (variant, accent) => {
  const base = {
    sheet: {},
    title: { color: accent, borderColor: "#d8dee8" },
    sectionTitle: { color: accent, borderLeftColor: accent },
    declarationTitle: { color: accent, borderLeftColor: accent },
    tableHeader: { color: accent, backgroundColor: "#f8fafc" },
    photo: { border: `1.5 solid ${accent}` },
  };

  if (variant === 2) return { ...base, sheet: { border: `3 solid ${accent}`, padding: 10 }, title: { ...base.title, backgroundColor: "#fff7fb" } };
  if (variant === 3) return { ...base, sheet: { borderLeft: `10 solid ${accent}`, paddingLeft: 12 }, title: { ...base.title, backgroundColor: "#ecfdf5" } };
  if (variant === 4) return {
    ...base,
    sheet: { backgroundColor: "#fffdf7", border: `1.2 solid ${accent}`, padding: 30 },
    title: { color: "#ffffff", backgroundColor: accent, borderColor: accent },
    sectionTitle: { color: accent, borderLeftWidth: 0, borderBottom: `1.2 solid ${accent}`, backgroundColor: "#fff3df" },
    declarationTitle: { color: accent, borderLeftWidth: 0, borderBottom: `1.2 solid ${accent}`, backgroundColor: "#fff3df" },
    tableHeader: { color: accent, backgroundColor: "#fff3df" },
  };
  if (variant === 5) return { ...base, sheet: { padding: 30, backgroundColor: "#ffffff" }, topBand: { backgroundColor: "#fff1f2", height: 148 }, title: { color: "#ffffff", backgroundColor: accent, borderColor: accent, fontSize: 22 }, sectionTitle: { ...base.sectionTitle, backgroundColor: "#fff1f2" } };
  if (variant === 6) return { ...base, sheet: { border: `1.5 solid ${accent}`, padding: 10 }, title: { ...base.title, backgroundColor: "#ffffff" } };
  if (variant === 7) return { ...base, sheet: { padding: 30, backgroundColor: "#ffffff" }, topBand: { backgroundColor: accent, height: 96 }, title: { color: "#ffffff", backgroundColor: accent, borderColor: accent }, tableHeader: { color: accent, backgroundColor: "#eef2ff" } };
  if (variant === 8) return {
    ...base,
    sheet: { backgroundColor: "#ffffff" },
    title: { color: "#ffffff", backgroundColor: accent, padding: 10, borderColor: accent },
    variant8TitleCutLeft: { borderRightColor: accent },
    variant8TitleText: { backgroundColor: accent },
    variant8TitleCutRight: { borderTopColor: accent, borderBottomColor: accent },
  };
  if (variant === 9) return {
    ...base,
    sheet: { border: `10 solid ${accent}`, padding: 20 },
    title: {
      color: accent,
      backgroundColor: "#ffffff",
      borderTop: `2 solid ${accent}`,
      borderBottom: `2 solid ${accent}`,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
  };
  return base;
};

export default function BiodataPdf({ resume, forceFallbackFont = false, fontFamily = "Helvetica", palette, variant = 1 }) {
  const info = resume?.personal_infomation || {};
  const accent = PALETTE_COLORS[palette || resume?.configuration?.color_palette] || PALETTE_COLORS["color-2"];
  const variantStyles = getVariantStyles(variant, accent);
  const pageStyle = {
    ...styles.page,
    padding: variant === 4 || variant === 5 || variant === 7 ? 0 : styles.page.padding,
    fontFamily: forceFallbackFont ? "Helvetica" : fontFamily || "Helvetica",
  };
  const rows = [
    ["NAME", formatName(info).toUpperCase()],
    ["FATHER'S NAME", info.father_name],
    ["MOTHER'S NAME", info.mother_name],
    ["DATE OF BIRTH", formatDate(info.date_of_birth)],
    ["PERMANENT ADDRESS", info.permanent_address || info.address],
    ["PRESENT ADDRESS", info.present_address],
    ["CASTE", info.caste],
    ["MARITAL STATUS", info.marital_status],
    ["SEX", info.sex],
    ["NATIONALITY", info.nationality],
    ["RELIGION", info.religion],
    ["LANGUAGES", info.languages],
  ].filter(([, value]) => value);
  const educations = resume?.educations || [];
  const works = resume?.work_experiences || [];
  const hobbies = resume?.hobbies || [];
  const renderTitle = () => {
    if (variant === 8) {
      return (
        <View style={styles.variant8TitleRow}>
          <View style={{ ...styles.variant8TitleCutLeft, ...variantStyles.variant8TitleCutLeft }} />
          <Text style={{ ...styles.variant8TitleText, ...variantStyles.variant8TitleText }}>BIO-DATA</Text>
          <View style={{ ...styles.variant8TitleCutRight, ...variantStyles.variant8TitleCutRight }} />
        </View>
      );
    }
    return <Text style={{ ...styles.title, ...variantStyles.title }}>BIO-DATA</Text>;
  };

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        <View style={{ ...styles.sheet, ...variantStyles.sheet }}>
          {variantStyles.topBand ? <View style={{ ...styles.topBand, ...variantStyles.topBand }} /> : null}
          {renderTitle()}
          {info.photo ? <Image style={{ ...styles.photo, ...variantStyles.photo }} src={info.photo} /> : null}
          <View style={styles.rows}>
            {rows.map(([label, value]) => (
              <View style={styles.row} key={label}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.value}>{String(value)}</Text>
              </View>
            ))}
          </View>
          {educations.length > 0 && (
            <View style={styles.section}>
              <Text style={{ ...styles.sectionTitle, ...variantStyles.sectionTitle }}>EDUCATIONAL QUALIFICATION</Text>
              <View style={styles.table}>
                <View style={styles.tr}>
                  <Text style={[styles.td, styles.th, styles.c1, variantStyles.tableHeader]}>Name of Exam</Text>
                  <Text style={[styles.td, styles.th, styles.c2, variantStyles.tableHeader]}>Board / University</Text>
                  <Text style={[styles.td, styles.th, styles.c3, variantStyles.tableHeader]}>Year of Passing</Text>
                  <Text style={[styles.td, styles.th, styles.c4, variantStyles.tableHeader]}>% of Marks</Text>
                </View>
                {educations.map((edu, index) => (
                  <View style={styles.tr} key={edu.edu_id || index}>
                    <Text style={[styles.td, styles.c1]}>{examName(edu)}</Text>
                    <Text style={[styles.td, styles.c2]}>{edu.board_university || edu.institute_name}</Text>
                    <Text style={[styles.td, styles.c3]}>{passingYear(edu)}</Text>
                    <Text style={[styles.td, styles.c4]}>{edu.marks}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {works.length > 0 && (
            <View style={styles.section}>
              <Text style={{ ...styles.sectionTitle, ...variantStyles.sectionTitle }}>WORK DETAILS</Text>
              {works.map((work, index) => (
                <View style={styles.bulletRow} key={work.workEperience_id || index}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{[work.job_title, work.company_name].filter(Boolean).join(" - ")}{work.description ? ` - ${work.description}` : ""}</Text>
                </View>
              ))}
            </View>
          )}
          {hobbies.length > 0 && (
            <View style={styles.section}>
              <Text style={{ ...styles.sectionTitle, ...variantStyles.sectionTitle }}>HOBBIES & INTERESTS</Text>
              {hobbies.map((hobby, index) => (
                <View style={styles.bulletRow} key={hobby.hobbie_id || index}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{hobby.hobbies || hobby}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.declaration}>
            <Text style={{ ...styles.declarationTitle, ...variantStyles.declarationTitle }}>DECLARATION</Text>
            <Text style={styles.declarationText}>I hereby declare that, the above information is true and correct to best of my knowledge.</Text>
            <Text style={styles.declarationText}>If above any information is false and incorrect that I have liable.</Text>
          </View>
          <View style={styles.signRow}>
            <Text>Date :</Text>
            <Text>Signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
