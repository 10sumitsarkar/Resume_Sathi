import React from 'react';
import { View, Text, Image, StyleSheet, Svg, Path, Polygon, Circle, Line, Rect } from '@react-pdf/renderer';
import { resolveProfileImage } from './pdfHelpers';

const styles = StyleSheet.create({
  sectionTitleRow: {
    marginBottom: 15,
  },
  sectionTitleText: {
    fontSize: 11.5,
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

  iconWrapper: {
    width: 14,
    height: 14,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactItem: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#ffffff',
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
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#ffffff',
    marginBottom: 8,
  },
  sidebarText: {
    fontSize: 10,
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
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  timelineMeta: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  timelineLocation: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  timelineDescription: {
    fontSize: 10,
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
    fontSize: 24,
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

export const IconEmail = ({ color = '#ffffff' }) => (
  <Svg width="13" height="13" viewBox="0 0 24 24" fill={color}>
    <Path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </Svg>
);
export const IconPhone = ({ color = '#ffffff' }) => (
  <Svg width="13" height="13" viewBox="0 0 24 24" fill={color}>
    <Path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
  </Svg>
);
export const IconLocation = ({ color = '#ffffff' }) => (
  <Svg width="13" height="13" viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </Svg>
);
export const IconGlobe = ({ color = '#ffffff' }) => (
  <Svg width="13" height="13" viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14A7.82 7.82 0 014 12c0-.68.09-1.35.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.008 8.008 0 015.07 16zm2.95-8H5.07a8.008 8.008 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.008 8.008 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.17.65.26 1.32.26 2s-.09 1.35-.26 2h-3.38z" />
  </Svg>
);
export const IconTick = ({ color = '#ffffff', size = 13, stroke = 1.6 }) => (
  <Svg width={size} height={size} viewBox="0 0 13 13" fill="none">
    <Path d="M2.5 7.5 L5.5 10.5 L10.5 3.5" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SocialIcons = {
  Facebook: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></Svg>),
  Twitter: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></Svg>),
  LinkedIn: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><Circle cx="4" cy="4" r="2"/></Svg>),
  Instagram: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><Rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><Circle cx="12" cy="12" r="4"/><Circle cx="17.5" cy="6.5" r="1.5" fill={color} stroke="none"/></Svg>),
  GitHub: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24"  fill={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><Path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></Svg>),
  Behance: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.2.561 1.884 1.477 2.26.584.23 1.354.26 1.968.07l.204-.07c.538-.196.849-.49 1.012-.939H23.726zM15.997 14h4.867c-.063-1.363-.583-2.19-2.22-2.19-1.52 0-2.395.822-2.647 2.19zM7.27 10.887c1.028 0 2.041-.318 2.041-1.487 0-1.168-.953-1.457-1.981-1.457H4v2.944h3.27zM4 13v3.395h3.48c1.196 0 2.18-.437 2.18-1.726 0-1.29-1.066-1.67-2.18-1.67H4zM0 5h8.51c2.02 0 4.514.898 4.514 3.683 0 1.562-.826 2.456-2.02 3.027C12.52 12.213 13.5 13.3 13.5 15.38 13.5 18.49 11.134 19 8.882 19H0V5z"/></Svg>),
  Dribbble: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><Circle cx="12" cy="12" r="10"/><Path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></Svg>),
  YouTube: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><Polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></Svg>),
  WhatsApp: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><Path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.135 1.535 5.874L.057 23.75a.75.75 0 00.917.918l5.97-1.487A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.666-.523-5.184-1.432l-.372-.22-3.84.957.975-3.763-.242-.386A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></Svg>),
  Telegram: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></Svg>),
  StackOverflow: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H16.85v-2.137H6.111v2.137zm.259-4.852l10.48 2.189.451-2.07-10.478-2.187-.453 2.068zm1.359-5.056l9.705 4.53.903-1.95-9.706-4.53-.902 1.95zm2.715-4.785l8.217 6.855 1.359-1.62-8.216-6.853-1.36 1.618zM15.751 0l-1.746 1.294 6.405 8.604 1.746-1.294L15.751 0z"/></Svg>),
  Medium: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></Svg>),
  Reddit: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 a 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></Svg>),
  Pinterest: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></Svg>),
  Other: ({ color = '#ffffff' }) => (<Svg width="14" height="14" viewBox="0 0 24 24" fill={color}><Path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14A7.82 7.82 0 014 12c0-.68.09-1.35.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.81 2h2.95c.32 1.25.78 2.45 1.38 3.56A8.008 8.008 0 015.07 16zm2.95-8H5.07a8.008 8.008 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.008 8.008 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.17.65.26 1.32.26 2s-.09 1.35-.26 2h-3.38z"/></Svg>),
};
export const getSocialIcon = (name, color) => { const Icon = SocialIcons[name] || SocialIcons.Other; return <Icon color={color} />; };

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





