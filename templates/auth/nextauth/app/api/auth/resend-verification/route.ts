import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createEmailVerificationToken,
  checkRateLimit,
} from "@/lib/auth-utils";

/**
 * POST /api/auth/resend-verification
 * Resend email verification link
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Rate limiting
    if (checkRateLimit(`resend:${email}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        {
          message:
            "Too many requests. Please wait 15 minutes before trying again.",
        },
        { status: 429 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json(
        { message: "If an account exists, a verification email has been sent." },
        { status: 200 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email is already verified" },
        { status: 400 }
      );
    }

    // Create new verification token
    const verificationToken = await createEmailVerificationToken(
      user.id,
      user.email
    );

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, verificationToken);
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;
    console.log(`Verification URL: ${verificationUrl}`);

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "An error occurred while resending verification email" },
      { status: 500 }
    );
  }
}
