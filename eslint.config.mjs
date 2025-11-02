// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js defaults (includes TypeScript + React rules)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Base rules for all files
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { 
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "no-unused-vars": "off", // prevent duplicate reports
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react-hooks/exhaustive-deps": "warn"
    },
  },

  // ✅ Specific rules for scripts and tests
  {
    files: ["scripts/**/*.ts", "**/*.test.ts"],
    rules: {
      "no-console": "off"
    }
  },

  // ✅ Ignore prisma seed and mock files
  {
    files: ["prisma/**/*.ts"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off"
    }
  },

  // ✅ Completely ignore certain patterns
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**"
    ]
  }
];

export default eslintConfig;