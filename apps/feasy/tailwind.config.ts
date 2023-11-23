import { type Config } from "tailwindcss";
import daisyui, { type Config as DaisyUIConfig } from "daisyui";
import typography from "@tailwindcss/typography";

export default {
  content: ["./src/**/*.tsx"],
  theme: {},
  plugins: [typography, daisyui],
  daisyui: {
    darkTheme: "night",
    themes: [
      // "emerald",
      "night",
    ],
  },
} satisfies Config & { daisyui: DaisyUIConfig };
