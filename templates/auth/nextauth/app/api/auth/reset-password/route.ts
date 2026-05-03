import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createPasswordResetToken,
  resetPasswordWithToken,
  validatePassword,
  checkRateLimit,
} from "@/lib/auth-utils";

/**
 * POST /api/auth/reset-password
 * Request password reset link
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
    if (checkRateLimit(`reset:${email}`, 3, 15 * 60 * 1000)) {
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
        {
          message: "If an account exists, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    // Create password reset token
    const resetToken = await createPasswordResetToken(user.id, user.email);

    // TODO: Send password reset email
    // await sendPasswordResetEmail(user.email, resetToken);
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    console.log(`Password reset URL: ${resetUrl}`);

    return NextResponse.json(
      { message: "Password reset link sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/reset-password
 * Reset password with token
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { message: passwordValidation.message },
        { status: 400 }
      );
    }

    // Get user ID from token (in production, decode token properly)
    const resetTokenRecord = await prisma.passwordResetToken.findFirst({
      where: { token },
    });

    if (!resetTokenRecord) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Reset password
    const success = await resetPasswordWithToken(
      token,
      resetTokenRecord.userId,
      password
    );

    if (!success) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "An error occurred while resetting your password" },
      { status: 500 }
    );
  }
}
