// @ts-check
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

const repoUrl = 'https://github.com/Crsk/frow/packages/website/'

const config = {
  title: 'Not sure yet what is this about',
  tagline: '🍕  Topping the brainstorm pizza',
  favicon: 'img/favicon.ico',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  organizationName: 'Frow',
  projectName: 'frow',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic', /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: { sidebarPath: require.resolve('./sidebars.js'), editUrl: repoUrl },
        blog: { showReadingTime: true, editUrl: repoUrl },
        theme: { customCss: require.resolve('./src/css/custom.css') },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: { alt: 'Frow Logo', src: 'img/logo.svg' },
        items: [
          { href: 'https://github.com/Crsk/frow', label: 'GitHub', position: 'right' },
        ],
        hideOnScroll: false,
      },
      prism: { theme: darkCodeTheme, darkTheme: darkCodeTheme },
      colorMode: { defaultMode: 'dark', disableSwitch: true, respectPrefersColorScheme: false },
    }),
}

module.exports = config
