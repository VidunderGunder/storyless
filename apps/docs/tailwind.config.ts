import { type Config } from "tailwindcss";
import theme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
     ...theme
    },
  },
  plugins: [],
} satisfies Config;
