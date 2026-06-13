import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)', 'sans-serif'],
      },
    },
  },
} satisfies Config;
