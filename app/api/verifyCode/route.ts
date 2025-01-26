import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
  
   
    const { username, code } = await req.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await prisma.user.findFirst({
      where: {
        username: decodedUsername,
        verifyCode: code,
        verifyCodeExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid verification code or code has expired.",
        }),
        { status: 400 }
      );
    }

    
    await prisma.user.update({
      where: {
        username: decodedUsername,
      },
      data: {
        isVerified: true,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Account verified successfully.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying account:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      }),
      { status: 500 }
    );
  }
}
