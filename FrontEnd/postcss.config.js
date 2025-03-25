import { createRequire } from "module"
const require = createRequire(import.meta.url)

import postcssPlugin from "@tailwindcss/postcss"
// import tailwindConfig from "./tailwind.config.js"

export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
