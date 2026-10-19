import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl:
    process.env.NEON_AUTH_BASE_URL ||
    "https://ep-divine-mouse-b3dn8cd1.neonauth.c-4.ap-southeast-1.aws.neon.tech/neondb/auth",
  cookies: {
    secret:
      process.env.NEON_AUTH_COOKIE_SECRET ||
      "9215fae7401c905389025e1df93c52a38db4f40f28a3013d28994a4c147715d3",
  },
});

