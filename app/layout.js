import './globals.css';
import './admin.css';
import AuthProvider from '@/components/AuthProvider';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  try {
    const dbConnect = (await import('@/lib/mongodb')).default;
    await dbConnect();
    const SiteSettings = (await import('@/models/SiteSettings')).default;
    const settings = await SiteSettings.findOne({}).lean();
    if (settings) {
      return {
        title: settings.seoTitle || 'سيارتي | أفخم معرض سيارات في المملكة',
        description: settings.seoDescription || 'سيارتي - وجهتك الأولى لشراء أفخم السيارات الجديدة والمستعملة.',
        keywords: settings.seoKeywords,
      };
    }
  } catch (e) {
    // fallback
  }

  return {
    title: 'سيارتي | أفخم معرض سيارات في المملكة',
    description: 'سيارتي - وجهتك الأولى لشراء أفخم السيارات الجديدة والمستعملة. نقدم لك تشكيلة واسعة من أرقى العلامات التجارية مع خدمة عملاء استثنائية وأسعار منافسة.',
    keywords: 'سيارات, سيارات فاخرة, معرض سيارات, سيارتي, بيع سيارات, سيارات جديدة, سيارات مستعملة',
  };
}

export default async function RootLayout({ children }) {
  let settings = {};
  
  try {
    const dbConnect = (await import('@/lib/mongodb')).default;
    await dbConnect();
    const SiteSettings = (await import('@/models/SiteSettings')).default;
    settings = await SiteSettings.findOne({}).lean() || {};
  } catch (e) {
    console.error('Error fetching settings for layout:', e);
  }

  const primaryColor = settings.primaryColor || '#C8A456';
  const secondaryColor = settings.secondaryColor || '#0a0a0f';
  const fontFamily = settings.fontFamily || 'Cairo';

  // Construct font url depending on selection
  let fontUrl = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap';
  if (fontFamily === 'Tajawal') {
    fontUrl = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap';
  } else if (fontFamily === 'Almarai') {
    fontUrl = 'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap';
  } else if (fontFamily === 'Changa') {
    fontUrl = 'https://fonts.googleapis.com/css2?family=Changa:wght@300;400;500;600;700;800&display=swap';
  } else if (fontFamily === 'IBM Plex Sans Arabic') {
    fontUrl = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap';
  }

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href={fontUrl} />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --color-primary: ${primaryColor};
            --color-secondary: ${secondaryColor};
            --color-bg-dark: ${secondaryColor};
            --color-background: ${secondaryColor};
            --color-accent: ${settings.accentColor || '#1a73e8'};
            --color-text-primary: ${settings.textPrimaryColor || '#f0ece4'};
            --color-text-secondary: ${settings.textSecondaryColor || '#a0a0b0'};
            --gradient-gold: linear-gradient(135deg, ${primaryColor}, #fff, ${primaryColor});
            --font-ar: '${fontFamily}', sans-serif;
          }
          
          body {
            font-family: var(--font-ar);
            background-color: var(--color-background);
            color: var(--color-text-primary);
          }
        ` }} />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
