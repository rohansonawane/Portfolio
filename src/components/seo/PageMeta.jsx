import { Helmet } from 'react-helmet-async';
import { SITE_URL as SITE } from '../../config/site';

export default function PageMeta({
  title,
  description,
  path = '',
  image = '/assets/notebook-arcade/images/logo.png',
  type = 'website'
}) {
  const url = `${SITE}${path}`;
  const fullTitle = title.includes('RohanVerse') ? title : `${title} | RohanVerse`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE}${image}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={`${SITE}${image}`} />
    </Helmet>
  );
}
