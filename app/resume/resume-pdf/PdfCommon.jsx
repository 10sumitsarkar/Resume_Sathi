import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { resolveProfileImage } from './pdfHelpers';

const styles = StyleSheet.create({
  sectionTitleRow: {
    marginBottom: 15,
  },
  sectionTitleText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionDivider: {
    width: 40,
    height: 2,
    borderRadius: 1,
    marginTop: 4,
  },
  contactRow: {
    marginTop: 12,
  },
  contactItem: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#ffffff',
    marginBottom: 4,
  },
  contactItemDark: {
    color: '#333333',
  },
  sidebarSection: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.36)',
  },
  sidebarSectionNoBorder: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#ffffff',
    marginBottom: 8,
  },
  sidebarText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#ffffff',
    marginBottom: 6,
  },
  sidebarTextDark: {
    color: '#333333',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  timelineMarker: {
    width: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  timelineMeta: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  timelineLocation: {
    fontSize: 9,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  timelineDescription: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#111827',
  },
  profileImageWrapperCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    marginBottom: 14,
  },
  profileImageWrapperSquare: {
    width: 100,
    height: 100,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    marginBottom: 14,
  },
  profileImage: {
    width: 100,
    height: 100,
    objectFit: 'cover',
  },
  profileFallback: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  profileFallbackCircle: {
    borderRadius: 50,
  },
  profileFallbackSquare: {
    borderRadius: 0,
  },
  profileFallbackText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
});

// showDivider: false matches the original HTML template, which has no
// underline bar beneath section titles (CSS: .title { margin-bottom: 15px })
export const PdfSectionTitle = ({ title, accent, dark = false, showDivider = true }) => (
  <View style={styles.sectionTitleRow}>
    <Text style={[styles.sectionTitleText, dark ? styles.sidebarText : {}, { color: accent }]}>{title}</Text>
    {showDivider ? <View style={[styles.sectionDivider, { backgroundColor: accent }]} /> : null}
  </View>
);

export const PdfContactRow = ({ items = [], dark = false }) => (
  <View style={styles.contactRow}>
    {items.map((item, index) => (
      <Text key={index} style={[styles.contactItem, dark ? styles.contactItemDark : {}]}>{item}</Text>
    ))}
  </View>
);

// bordered: true adds the thin divider line the HTML template uses between
// .resume_item blocks in the sidebar (CSS: border-bottom: 2px solid #ffffff5c)
export const PdfSidebarSection = ({ title, children, accent, bordered = true }) => (
  <View style={[styles.sidebarSection, !bordered ? styles.sidebarSectionNoBorder : {}]}>
    <Text style={[styles.sidebarSectionTitle, { color: accent }]}>{title}</Text>
    {children}
  </View>
);

export const PdfTimelineItem = ({ title, subtitle, location, period, description, accent, showLine = true }) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineMarker}>
      <View style={[styles.timelineDot, { borderColor: accent }]} />
      {showLine ? <View style={[styles.timelineLine, { backgroundColor: accent }]} /> : null}
    </View>
    <View style={styles.timelineContent}>
      <Text style={styles.timelineTitle}>{title}</Text>
      {subtitle ? <Text style={styles.timelineMeta}>{subtitle}</Text> : null}
      {location ? <Text style={styles.timelineLocation}>{location}</Text> : null}
      {period ? <Text style={styles.timelineMeta}>{period}</Text> : null}
      {description ? <Text style={styles.timelineDescription}>{description}</Text> : null}
    </View>
  </View>
);

// shape: 'square' matches the HTML template's .resume-photo (plain object-fit
// cover, no border-radius). 'circle' is kept for other templates.
export const PdfProfileImage = ({ src, initials, shape = 'circle', size = 100 }) => {
  const resolved = resolveProfileImage(src);
  const isSquare = shape === 'square';
  const wrapperStyle = isSquare ? styles.profileImageWrapperSquare : styles.profileImageWrapperCircle;
  const fallbackShape = isSquare ? styles.profileFallbackSquare : styles.profileFallbackCircle;
  const dynamicSize = { width: size, height: size };

  if (!resolved) {
    return (
      <View style={[styles.profileFallback, fallbackShape, dynamicSize]}>
        <Text style={styles.profileFallbackText}>{initials || 'NA'}</Text>
      </View>
    );
  }

  return (
    <View style={[wrapperStyle, dynamicSize]}>
      <Image style={[styles.profileImage, dynamicSize]} src={resolved} />
    </View>
  );
};