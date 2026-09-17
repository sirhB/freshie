import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isStudio = req.nextUrl.pathname.startsWith("/studio");
  if (isStudio && !req.auth) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/studio/:path*"],
};
