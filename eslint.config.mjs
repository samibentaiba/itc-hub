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

  // :point_down: Custom overrides for warnings in your editor
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "argsIgnorePattern": "^_" }
      ],
      "no-unused-vars": "off", // prevent duplicate reports
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "react-hooks/exhaustive-deps": "warn"
    },
    overrides: [
    {
      files: ["scripts/**/*.ts", "**/*.test.ts"],
      rules: {
        "no-console": "off" // Disable for test/script files
      }
    }
  ]
  },
];

export default eslintConfig;