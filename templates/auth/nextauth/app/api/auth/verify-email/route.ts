import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken } from "@/lib/auth-utils";

/**
 * POST /api/auth/verify-email
 * Verify user email with token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Extract email from token (in a real implementation, you'd decode the token)
    // For now, we'll need to pass email separately or store it in the token
    const email = body.email;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required for verification" },
        { status: 400 }
      );
    }

    const isValid = await verifyEmailToken(token, email);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { message: "An error occurred during email verification" },
      { status: 500 }
    );
  }
}
