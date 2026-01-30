import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Deja pasar assets y auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // ✅ MODO DEV: permitir TODAS las APIs mientras se construye auth
  if (process.env.NODE_ENV !== "production" && pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // ✅ En producción aquí luego validaremos sesión/rol
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
