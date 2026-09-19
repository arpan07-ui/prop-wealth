import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
  jsonLd?: Record<string, any>;
}

const DEFAULT_TITLE = 'PROPxWEALTH | Buy, Earn & Spend Wealth Tokens - Top Prop Trading Firms';
const DEFAULT_DESCRIPTION = 'Compare top proprietary trading firms with PROPxWEALTH. Get exclusive evaluation discounts, earn Wealth Tokens on challenges, and access verified payout proofs.';
const DEFAULT_KEYWORDS = 'prop trading firms, best prop firms 2026, funded trader accounts, buy wealth tokens, prop firm discounts, forex prop firms, futures funding, crypto prop trading, funded trading evaluation';
const DEFAULT_OG_IMAGE = 'https://propxwealth.com/wealth-logo.png';
const SITE_NAME = 'PROPxWEALTH';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Page Title
    const fullTitle = title 
      ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`)
      : DEFAULT_TITLE;
    document.title = fullTitle;

    // Helper to create or update meta tag
    const setMetaTag = (selector: string, attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    setMetaTag('meta[name="robots"]', 'name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('meta[name="author"]', 'name', 'author', SITE_NAME);

    // 3. OpenGraph Tags (Facebook, LinkedIn, Discord)
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    const currentUrl = canonical || window.location.href;
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', '@PROPxWEALTH');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 5. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // 6. JSON-LD Structured Data Schema
    const scriptId = 'propxwealth-structured-data';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    const schemaData = jsonLd || {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': SITE_NAME,
      'url': window.location.origin,
      'description': description,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${window.location.origin}/firms?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemaData);

  }, [title, description, keywords, canonical, ogImage, ogType, noIndex, jsonLd]);

  return null;
};

export default SEO;
