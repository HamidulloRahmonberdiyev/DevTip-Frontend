/**
 * Texnologiya logolari uchun CDN (Simple Icons) mapping.
 * Slug bo'yicha logo URL qaytariladi; topilmasa null.
 */
const BASE = 'https://cdn.simpleicons.org';

const SLUG_TO_ICON = {
  javascript: 'javascript',
  js: 'javascript',
  react: 'react',
  vue: 'vue.js',
  vuejs: 'vue.js',
  css: 'css3',
  css3: 'css3',
  html: 'html5',
  html5: 'html5',
  php: 'php',
  python: 'python',
  node: 'nodedotjs',
  nodejs: 'nodedotjs',
  typescript: 'typescript',
  ts: 'typescript',
  git: 'git',
  laravel: 'laravel',
  algorithms: 'thealgorithms',
  thealgorithms: 'thealgorithms',
  docker: 'docker',
  mysql: 'mysql',
  postgresql: 'postgresql',
  mongodb: 'mongodb',
  redis: 'redis',
  graphql: 'graphql',
  next: 'nextdotjs',
  nextjs: 'nextdotjs',
  nuxt: 'nuxtdotjs',
  svelte: 'svelte',
  angular: 'angular',
  tailwind: 'tailwindcss',
  tailwindcss: 'tailwindcss',
  bootstrap: 'bootstrap',
  redux: 'redux',
  vite: 'vite',
  webpack: 'webpack',
  django: 'django',
  flask: 'flask',
  spring: 'spring',
  express: 'express',
  ruby: 'ruby',
  rails: 'rubyonrails',
  java: 'java',
  kotlin: 'kotlin',
  swift: 'swift',
  flutter: 'flutter',
  dart: 'dart',
};

const DEFAULT_COLORS = {
  javascript: '#F7DF1E',
  react: '#61DAFB',
  vue: '#42B883',
  css3: '#264DE4',
  html5: '#E34F26',
  php: '#777BB4',
  python: '#3776AB',
  nodedotjs: '#339933',
  typescript: '#3178C6',
  git: '#F05032',
  laravel: '#FF2D20',
  thealgorithms: '#00BCB4',
};

export function getTechLogoUrl(technology) {
  const slug = String(technology?.slug ?? technology?.name ?? technology?.id ?? '')
    .toLowerCase()
    .replace(/\s+/g, '');
  const iconName = SLUG_TO_ICON[slug];
  if (!iconName) return null;
  const color = technology?.color ?? DEFAULT_COLORS[iconName] ?? 'currentColor';
  const hex = color.startsWith('#') ? color.slice(1) : color;
  return `${BASE}/${iconName}/${hex}`;
}
