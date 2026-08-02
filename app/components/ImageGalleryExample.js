import Image from 'next/image';

const galleryImages = [
  {
    src: '/front-assets/images/blog-hero.webp',
    alt: 'Hero banner for ResumeSathi blog',
    width: 1200,
    height: 600,
  },
  {
    src: '/front-assets/images/resume-img/resume-1.webp',
    alt: 'Resume template example one',
    width: 800,
    height: 600,
  },
  {
    src: '/front-assets/images/resume-img/resume-2.webp',
    alt: 'Resume template example two',
    width: 800,
    height: 600,
  },
  {
    src: '/front-assets/images/resume-img/resume-3.webp',
    alt: 'Resume template example three',
    width: 800,
    height: 600,
  },
  {
    src: '/front-assets/images/resume-img/resume-4.webp',
    alt: 'Resume template example four',
    width: 800,
    height: 600,
  },
];

export default function ImageGalleryExample() {
  return (
    <section style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Image
          src={galleryImages[0].src}
          alt={galleryImages[0].alt}
          width={galleryImages[0].width}
          height={galleryImages[0].height}
          priority
          style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 12 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {galleryImages.slice(1).map((image, index) => (
          <div key={`${image.src}-${index}`}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 12 }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
