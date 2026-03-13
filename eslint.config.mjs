import prettierRecommended from "eslint-plugin-prettier/recommended";

const browserGlobals = {
  Blob: "readonly",
  CustomEvent: "readonly",
  EventTarget: "readonly",
  File: "readonly",
  FileReader: "readonly",
  HTMLInputElement: "readonly",
  SpeechRecognition: "readonly",
  URL: "readonly",
  console: "readonly",
  document: "readonly",
  localStorage: "readonly",
  navigator: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  webkitSpeechRecognition: "readonly",
  window: "readonly"
};

export default [
  {
    ignores: ["dist/**", "build/**", "node_modules/**"]
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: browserGlobals
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ]
    }
  },
  prettierRecommended
];
