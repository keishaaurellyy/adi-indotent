import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    css: {
      // Pass PostCSS config inline so Vite stops searching the filesystem for
      // one. Without this it walks up past backend/ and picks up the Next.js
      // postcss.config.mjs at the repo root, whose @tailwindcss/postcss plugin
      // does not exist in backend/node_modules — the admin build then fails.
      postcss: { plugins: [] },
    },
  });
};
