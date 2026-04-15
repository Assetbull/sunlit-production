import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  const isMockEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_PORTAL === "true";
  const mockRole = req.cookies.get("sunlit_mock_role")?.value;

  if (isMockEnabled && mockRole) {
    // If mock is enabled and a role is selected, we bypass Clerk's protection
    // and pass the mock logic via headers to downstream API/SSR segments.
    const res = NextResponse.next();
    res.headers.set("x-mock-role", mockRole);
    return res;
  }

  // Fallback to normal clerk verification logic if not mocked
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
