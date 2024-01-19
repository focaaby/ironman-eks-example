// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '那些文件沒有告訴你的 AWS EKS - 解析 Kubernetes 背後的奧秘 | 王茂林',
  tagline: '解析 Kubernetes 背後的奧秘',
  // favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://www.eksbook.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'focaaby', // Usually your GitHub org/user name.
  projectName: 'ironman-eks-example', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // showReadingTime: true,
          editUrl: 'https://github.com/focaaby/ironman-eks-example/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-XP9WC5C6TM',
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      // image: 'img/docusaurus-social-card.jpg',
      metadata: [
        {name: 'keywords', content: 'eks, aws, kubernetes, k8s, 鐵人賽'},
        {name: 'description', content: '《那些文件沒告訴你的AWS EKS》源自iThome鐵人賽14屆DevOps組優選，從建立EKS起深入AWS引用原生Kubernetes功能的原理，並涵蓋Linux及網路知識。每章提供逐步除錯驗證，實作中學習除錯概念。本書為深入理解AWS EKS提供實踐指南，揭示文件未涵蓋的重要內容。'},
        {property: 'og:type', content: 'website'},
        {property: 'og:url', content: 'https://eksbook.com/'},
        {property: 'og:title', content: '那些文件沒有告訴你的 AWS EKS - 解析 Kubernetes 背後的奧秘 | 王茂林'},
        {property: 'og:description', content: '《那些文件沒告訴你的AWS EKS》源自iThome鐵人賽14屆DevOps組優選，從建立EKS起深入AWS引用原生Kubernetes功能的原理，並涵蓋Linux及網路知識。每章提供逐步除錯驗證，實作中學習除錯概念。本書為深入理解AWS EKS提供實踐指南，揭示文件未涵蓋的重要內容。'},
        // {property: 'og:image', content: 'https://metatags.io/images/meta-tags.png'},
        {name: 'twitter:url', content: 'https://eksbook.com/'},
        {name: 'twitter:title', content: '那些文件沒有告訴你的 AWS EKS - 解析 Kubernetes 背後的奧秘 | 王茂林'},
        {name: 'twitter:description', content: '《那些文件沒告訴你的AWS EKS》源自iThome鐵人賽14屆DevOps組優選，從建立EKS起深入AWS引用原生Kubernetes功能的原理，並涵蓋Linux及網路知識。每章提供逐步除錯驗證，實作中學習除錯概念。本書為深入理解AWS EKS提供實踐指南，揭示文件未涵蓋的重要內容。'},
        // {name: 'twitter:image', content: 'https://metatags.io/images/meta-tags.png'},
      ],
      navbar: {
        title: '那些文件沒有告訴你的 AWS EKS',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'days',
            position: 'left',
            label: '鐵人賽系列文章',
          },
          {
            type: 'doc',
            docId: 'example/index',
            position: 'left',
            label: '實驗範例',
          },
          {
            href: 'https://github.com/focaaby/ironman-eks-example',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      docs: {
        sidebar: {
          autoCollapseCategories: false,
        },
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: '2022 鐵人賽系列文',
                to: '/days/01',
              },
              {
                label: '建立環境步驟及記錄檔',
                to: '/example/ch02',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                href: 'https://focaaby.com/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/focaaby/ironman-eks-example',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en" target="_blank">BY-SA 4.0.</a> Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
