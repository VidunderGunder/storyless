import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // "/" will be accessible to all users
  apiRoutes: ["/api/(.*)"],
  publicRoutes: ["/", "/#", "/api/(.*)", "/dashboard"],
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/(api|trpc)(.*)", // Allow API routes
  ],
};
