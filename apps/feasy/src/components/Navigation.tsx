import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { transparentNavbarAtom } from "~/state";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/styles/utils";
import { Icon } from "@iconify/react";
import { type ComponentPropsWithoutRef } from "react";

export const navHeightPx = 64;
export const navHeightTW = "h-16";
/**
 * For pages that have a navbar, we need to pad the top of the page
 */
export const padNavTW = "pt-16";

type NavigationProps = {
  // props
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

export function Navigation({ className, ...props }: NavigationProps) {
  const { isSignedIn } = useAuth();
  const transparent = useAtomValue(transparentNavbarAtom);

  return (
    <div
      className={cn(
        "navbar fixed z-10 transition-all delay-500 duration-1000",
        navHeightTW,
        transparent ? "bg-transparent" : "bg-base-100",
        className,
      )}
      {...props}
    >
      <div className="flex-1 gap-1">
        <NavLink
          icon="fluent-emoji-high-contrast:flamingo"
          href="/"
          className={cn("btn btn-ghost gap-2 text-xl")}
        >
          <span className="inline sm:hidden">
            <Icon icon="fluent-emoji-high-contrast:flamingo" />
          </span>
          <span className="hidden sm:inline">Home</span>
        </NavLink>
        <NavLink
          icon="bi:github"
          href="https://github.com/VidunderGunder/storyless"
          className="btn btn-ghost gap-2 text-xl"
        >
          GitHub
        </NavLink>
        <NavLink
          icon="icon-park-solid:doc-search"
          href="https://github.com/VidunderGunder/storyless/tree/main/apps/feasy#readme"
          className="btn btn-ghost text-xl"
        >
          Docs
        </NavLink>
        {/* {isSignedIn ? ( */}
        <NavLink
          icon="bi:toggles"
          href="/dashboard"
          className="btn btn-ghost text-xl"
        >
          Dashboard
        </NavLink>
        {/*) : null} */}
      </div>
      <div className="flex gap-1">
        {isSignedIn ? (
          <div className="mx-3">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: {
                    width: 40,
                    height: 40,
                  },
                },
              }}
            />
          </div>
        ) : (
          <SignInButton mode="modal">
            <button className="btn btn-ghost text-xl">
              <span className="inline sm:hidden">
                <Icon icon="mdi:user-heart" />
              </span>
              <span className="hidden sm:flex">Sign In</span>
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

const navLinkVariations = cva(["btn", "btn-ghost", "text-xl", "relative"], {
  variants: {
    disabled: { true: "opacity-50 hover:bg-transparent" },
  },
});

type NavLinkProps = {
  icon: string;
} & ComponentPropsWithoutRef<typeof Link> &
  VariantProps<typeof navLinkVariations>;

function NavLink({
  children,
  className,
  disabled,
  icon,
  href,
  ...props
}: NavLinkProps) {
  const { pathname } = useRouter();
  disabled = disabled ?? pathname === href;

  const urlString = typeof href === "string" ? href : href.pathname;
  const isExternal = urlString?.startsWith("http") ?? false;

  return (
    <Link
      className={cn(navLinkVariations({ className, disabled }))}
      href={href}
      {...props}
    >
      <span className="inline sm:hidden">
        <Icon icon={icon} />
      </span>
      <span className="hidden sm:inline">{children}</span>
      {isExternal ? (
        <span className="absolute right-2 top-1 text-[11px] opacity-100 sm:right-1 sm:top-2 sm:text-[13px]">
          <Icon icon="mingcute:arrow-up-fill" className="rotate-45" />
        </span>
      ) : null}
    </Link>
  );
}
