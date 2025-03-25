import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import postcssPlugin from '@tailwindcss/postcss';

export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
