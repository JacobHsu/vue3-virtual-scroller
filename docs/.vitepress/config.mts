import { defineConfig } from 'vitepress'

const enSidebar = {
  '/guide/': [
    {
      text: 'Introduction',
      items: [
        { text: 'Getting Started', link: '/guide/' },
      ],
    },
    {
      text: 'Components',
      items: [
        { text: 'RecycleScroller', link: '/guide/recycle-scroller' },
        { text: 'DynamicScroller', link: '/guide/dynamic-scroller' },
        { text: 'DynamicScrollerItem', link: '/guide/dynamic-scroller-item' },
        { text: 'WindowScroller', link: '/guide/window-scroller' },
      ],
    },
    {
      text: 'Headless Composables',
      items: [
        { text: 'useRecycleScroller', link: '/guide/use-recycle-scroller' },
        { text: 'useDynamicScroller', link: '/guide/use-dynamic-scroller' },
        { text: 'useWindowScroller', link: '/guide/use-window-scroller' },
      ],
    },
    {
      text: 'Utilities',
      items: [
        { text: 'IdState', link: '/guide/id-state' },
      ],
    },
    { text: 'AI & Skills', link: '/guide/ai-skills' },
  ],
  '/demos/': [
    {
      text: 'Demos',
      items: [
        { text: 'Overview', link: '/demos/' },
        { text: 'RecycleScroller', link: '/demos/recycle-scroller' },
        { text: 'DynamicScroller', link: '/demos/dynamic-scroller' },
        { text: 'WindowScroller', link: '/demos/window-scroller' },
        { text: 'Chat Stream', link: '/demos/chat' },
        { text: 'Shift', link: '/demos/shift' },
        { text: 'Simple List', link: '/demos/simple-list' },
        { text: 'Headless Table', link: '/demos/headless-table' },
        { text: 'Horizontal', link: '/demos/horizontal' },
        { text: 'Grid', link: '/demos/grid' },
        { text: 'Test Chat', link: '/demos/test-chat' },
      ],
    },
  ],
}

const zhSidebar = {
  '/zh/guide/': [
    {
      text: '介紹',
      items: [
        { text: '快速開始', link: '/zh/guide/' },
      ],
    },
    {
      text: '元件',
      items: [
        { text: 'RecycleScroller', link: '/zh/guide/recycle-scroller' },
        { text: 'DynamicScroller', link: '/zh/guide/dynamic-scroller' },
        { text: 'DynamicScrollerItem', link: '/zh/guide/dynamic-scroller-item' },
        { text: 'WindowScroller', link: '/zh/guide/window-scroller' },
      ],
    },
    {
      text: 'Headless Composables',
      items: [
        { text: 'useRecycleScroller', link: '/zh/guide/use-recycle-scroller' },
        { text: 'useDynamicScroller', link: '/zh/guide/use-dynamic-scroller' },
        { text: 'useWindowScroller', link: '/zh/guide/use-window-scroller' },
      ],
    },
    {
      text: '工具',
      items: [
        { text: 'IdState', link: '/zh/guide/id-state' },
      ],
    },
    { text: 'AI 與 Skills', link: '/zh/guide/ai-skills' },
  ],
  '/zh/demos/': [
    {
      text: '展示範例',
      items: [
        { text: '總覽', link: '/zh/demos/' },
        { text: 'RecycleScroller', link: '/demos/recycle-scroller' },
        { text: 'DynamicScroller', link: '/demos/dynamic-scroller' },
        { text: 'WindowScroller', link: '/demos/window-scroller' },
        { text: '聊天串流', link: '/demos/chat' },
        { text: 'Shift（預置錨定）', link: '/demos/shift' },
        { text: '簡單清單', link: '/demos/simple-list' },
        { text: 'Headless 表格', link: '/demos/headless-table' },
        { text: '水平捲動', link: '/demos/horizontal' },
        { text: '格線', link: '/demos/grid' },
        { text: '測試聊天', link: '/demos/test-chat' },
      ],
    },
  ],
}

export default defineConfig({
  title: 'Vue Virtual Scroller',
  description: 'Virtual scrolling for large Vue lists and dynamic layouts.',

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    zh: {
      label: '中文',
      lang: 'zh-TW',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/' },
          { text: '展示範例', link: '/demos/' },
          {
            text: '連結',
            items: [
              { text: '線上展示', link: 'https://vue-virtual-scroller-demo.netlify.app/' },
              { text: 'GitHub', link: 'https://github.com/Akryum/vue-virtual-scroller' },
              { text: '更新日誌', link: 'https://github.com/Akryum/vue-virtual-scroller/blob/master/CHANGELOG.md' },
            ],
          },
        ],
        sidebar: zhSidebar,
        footer: {
          message: '以 MIT 授權發布。',
          copyright: 'Copyright Akryum',
        },
      },
    },
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Demos', link: '/demos/' },
      {
        text: 'Links',
        items: [
          { text: 'Live Demo', link: 'https://vue-virtual-scroller-demo.netlify.app/' },
          { text: 'GitHub', link: 'https://github.com/Akryum/vue-virtual-scroller' },
          { text: 'Changelog', link: 'https://github.com/Akryum/vue-virtual-scroller/blob/master/CHANGELOG.md' },
        ],
      },
    ],

    sidebar: enSidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Akryum/vue-virtual-scroller' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright Akryum',
    },

    search: {
      provider: 'local',
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],
})
