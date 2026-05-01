// @ts-check

const { themes: prismThemes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Notas Técnicas',
  tagline: 'Frontend · Ciberseguridad · Criptografía · SEO',
  favicon: 'img/favicon.ico',
  url: 'https://saisho137.github.io',
  baseUrl: '/Notes/',
  organizationName: 'Saisho137',
  projectName: 'Notes',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownImages: 'warn',
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: { defaultLocale: 'es', locales: ['es'] },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/logo.svg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Notas Técnicas',
        logo: { alt: 'Logo', src: 'img/logo.svg' },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Notas',
          },
          {
            href: 'https://github.com/Saisho137/Notes',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Secciones',
            items: [
              { label: 'Frontend', to: '/docs/frontend/' },
              { label: 'Ciberseguridad', to: '/docs/ciberseguridad/' },
              { label: 'Criptografía', to: '/docs/criptografia/' },
              { label: 'SEO', to: '/docs/seo/' },
            ],
          },
          {
            title: 'Más',
            items: [
              { label: 'GitHub', href: 'https://github.com/Saisho137/Notes' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Santiago Betancur. Construido con Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'typescript', 'javascript'],
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
    }),
};

module.exports = config;
