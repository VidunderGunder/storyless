import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: [
    "/",
    "/#",
    "/api/trpc/(.*)",
    "/sign-in",
    "/sign-up",
    "sign-out",
  ],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)", // Allow API routes
  ],
};
