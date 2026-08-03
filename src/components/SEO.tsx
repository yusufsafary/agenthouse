import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogImageAlt?: string
  ogType?: string
  noindex?: boolean
  keywords?: string
  articlePublishedTime?: string
  articleModifiedTime?: string
  structuredData?: object | object[]
  breadcrumbs?: Array<{ name: string; url: string }>
}

const BASE_URL = 'https://agenthouse.fun'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`
const DEFAULT_OG_IMAGE_ALT = 'AGENTHOUSE — AI Agent Audit Tool. Score, optimize, and fix your agent traces.'
const SITE_NAME = 'AGENTHOUSE'
const TWITTER_HANDLE = '@agenthouseapp'

export default function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = DEFAULT_OG_IMAGE_ALT,
  ogType = 'website',
  noindex = false,
  keywords,
  articlePublishedTime,
  articleModifiedTime,
  structuredData,
  breadcrumbs,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined

  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: BASE_URL,
          },
          ...breadcrumbs.map((b, i) => ({
            '@type': 'ListItem',
            position: i + 2,
            name: b.name,
            item: `${BASE_URL}${b.url}`,
          })),
        ],
      }
    : null

  const schemas = [
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ]

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      }
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={SITE_NAME} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogImageAlt} />

      {/* Article-specific Open Graph */}
      {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
      {articleModifiedTime && <meta property="article:modified_time" content={articleModifiedTime} />}
      {ogType === 'article' && <meta property="article:author" content={BASE_URL} />}

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* Structured Data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
