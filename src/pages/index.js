import React from 'react';
import Link from '@docusaurus/Link';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './index.module.css';

const CATEGORIES = [
  {
    icon: '💻',
    title: 'Frontend',
    description: 'JavaScript, React, TypeScript y técnicas de entrevista técnica',
    href: '/docs/frontend/',
    color: styles.catFrontend,
    topics: [
      'JavaScript avanzado',
      'React Hooks y patrones',
      'TypeScript',
      'Preguntas de entrevista',
      'Coding Challenges',
    ],
  },
  {
    icon: '🔒',
    title: 'Ciberseguridad',
    description: 'CIA, CVE/CWE/CVSS, Zero Trust, OWASP y defensa en profundidad',
    href: '/docs/ciberseguridad/',
    color: styles.catSecurity,
    topics: [
      'Triada CIA',
      'Vulnerabilidades CVE/CWE/CVSS',
      'Zero Trust',
      'OWASP Top 10',
      'Defensa en profundidad',
    ],
  },
  {
    icon: '🔐',
    title: 'Criptografía',
    description: 'AES, RSA, ECC, TLS/SSL, funciones hash y PKI',
    href: '/docs/criptografia/',
    color: styles.catCrypto,
    topics: [
      'Cifrado simétrico AES',
      'Criptografía asimétrica RSA/ECC',
      'Protocolo TLS/SSL',
      'Funciones hash',
      'PKI y certificados',
    ],
  },
  {
    icon: '🌐',
    title: 'SEO',
    description: 'Core Web Vitals, Schema markup, robots.txt, sitemap y rendimiento web',
    href: '/docs/seo/',
    color: styles.catSeo,
    topics: [
      'Core Web Vitals',
      'Schema / JSON-LD',
      'robots.txt y sitemap',
      'SEO técnico',
      'Rendimiento web',
    ],
  },
];

function HeroBanner() {
  const { withBaseUrl } = useBaseUrlUtils();
  return (
    <div className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroBadge}>Notas personales</div>
        <h1 className={styles.heroTitle}>
          Notas <span>Técnicas</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Colección de apuntes sobre desarrollo frontend, ciberseguridad,
          criptografía y SEO. Material de referencia y preparación para
          entrevistas técnicas.
        </p>
        <div className={styles.heroButtons}>
          <Link
            className="button button--primary button--lg"
            to={withBaseUrl('/docs/frontend/')}
          >
            Explorar notas →
          </Link>
          <a
            className="button button--lg"
            href={withBaseUrl('/docs/ciberseguridad/')}
            style={{
              color: '#fff',
              background: 'rgba(255,255,255,0.1)',
              border: '1.5px solid rgba(255,255,255,0.35)',
            }}
          >
            Ciberseguridad
          </a>
        </div>
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>4</span>
            <span className={styles.statLabel}>Secciones</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>1500+</span>
            <span className={styles.statLabel}>Líneas por tema</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>JS·TS</span>
            <span className={styles.statLabel}>React</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>Prep</span>
            <span className={styles.statLabel}>Entrevistas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoriesSection() {
  const { withBaseUrl } = useBaseUrlUtils();
  return (
    <section className={clsx('container', styles.categoriesSection)}>
      <h2 className={styles.sectionTitle}>Secciones</h2>
      <p className={styles.sectionSubtitle}>
        Apuntes organizados por disciplina técnica
      </p>
      <div className={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <a
            key={cat.title}
            href={withBaseUrl(cat.href)}
            className={clsx(styles.categoryCard, cat.color)}
          >
            <div className={styles.categoryHeader}>
              <span className={styles.categoryIcon}>{cat.icon}</span>
              <span className={styles.categoryArrow}>→</span>
            </div>
            <div className={styles.categoryTitle}>{cat.title}</div>
            <p className={styles.categoryDesc}>{cat.description}</p>
            <ul className={styles.categoryTopics}>
              {cat.topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HeroBanner />
      <main>
        <CategoriesSection />
      </main>
    </Layout>
  );
}
