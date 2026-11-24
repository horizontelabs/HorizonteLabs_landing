import React, { useEffect } from 'react';
import { SITE_URL } from '../lib/siteConfig';

interface PageMetaProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>;
}

export const PageMeta: React.FC<PageMetaProps> = ({ title, description, path, jsonLd }) => {
  useEffect(() => {
    document.title = title;
    const canonicalHref = `${SITE_URL}${path === '/' ? '/' : path}`;

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, value: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalHref);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;

    const ldId = 'sustrato-route-jsonld';
    const existing = document.getElementById(ldId);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = ldId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(ldId)?.remove();
    };
  }, [title, description, path, jsonLd]);

  return null;
};
