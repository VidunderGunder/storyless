import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "~/styles/utils";

type NavigationProps = {
  // props
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

export function Navigation({ className, ...props }: NavigationProps) {
  const { isSignedIn } = useAuth();

  return (
    <div className={cn("navbar", className)} {...props}>
      <div className="flex-1 gap-2">
        <Link
          href="https://github.com/VidunderGunder/storyless"
          className="btn btn-ghost text-xl"
        >
          <span className="hidden sm:flex">GitHub</span>
        </Link>
        <Link
          href="https://github.com/VidunderGunder/storyless/tree/main/apps/feasy#readme"
          className="btn btn-ghost text-xl"
        >
          <span className="hidden sm:flex">Docs</span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        {isSignedIn ? (
          <div className="mr-3">
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
              <span className="hidden sm:flex">Sign In</span>
            </button>
          </SignInButton>
        )}
        {/* <div className="dropdown dropdown-end">
          <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
            <div className="w-10 rounded-full">
              <Image
                alt="Tailwind CSS Navbar component"
                src="/avatar.jpg"
                width={40}
                height={40}
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
