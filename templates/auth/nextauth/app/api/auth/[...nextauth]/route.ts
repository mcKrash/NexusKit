import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth.js API Route Handler
 *
 * This handles all authentication routes:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/:provider
 * - /api/auth/csrf
 * - /api/auth/session
 * - /api/auth/providers
 *
 * @see https://next-auth.js.org/configuration/options
 */

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
