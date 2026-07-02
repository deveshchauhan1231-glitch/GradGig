import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/react";
import { authFetch } from "../lib/api";

function Navbar() {
  const location = useLocation();
  const { getToken, isSignedIn } = useAuth();

  const [hasUnread, setHasUnread] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function loadUnreadState() {
      if (!isSignedIn) {
        setHasUnread(false);
        return;
      }

      try {
        const data = await authFetch("/conversations", getToken);
        const list = Array.isArray(data?.data) ? data.data : [];
        setHasUnread(list.some((conversation) => conversation.unreadForMe));
      } catch {
        setHasUnread(false);
      }
    }

    loadUnreadState();

    // Close mobile menu whenever the route changes
    setMobileOpen(false);
  }, [getToken, isSignedIn, location.pathname]);

  return (
    <header className="bg-white dark:bg-gray-800 relative">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link className="block" to="/">
          <span className="sr-only">Home</span>

          <svg
            className="size-8"
            viewBox="0 0 400 400"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="20"
              y="20"
              width="360"
              height="360"
              rx="80"
              fill="#0d1540"
            />

            <rect
              x="70"
              y="220"
              width="60"
              height="120"
              rx="16"
              fill="#ffffff"
              opacity="0.35"
            />
            <rect
              x="170"
              y="160"
              width="60"
              height="180"
              rx="16"
              fill="#ffffff"
              opacity="0.65"
            />
            <rect
              x="270"
              y="110"
              width="60"
              height="230"
              rx="16"
              fill="#3d52e6"
            />

            <polygon
              points="300,42 360,72 300,96 240,72"
              fill="#ffffff"
            />
            <polygon
              points="240,72 300,96 360,72 360,82 300,106 240,82"
              fill="#b0bce8"
              opacity="0.6"
            />

            <circle cx="354" cy="70" r="7" fill="#3d52e6" />
            <line
              x1="354"
              y1="77"
              x2="364"
              y2="104"
              stroke="#3d52e6"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <rect
              x="357"
              y="102"
              width="14"
              height="7"
              rx="2"
              fill="#3d52e6"
            />
          </svg>
        </Link>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          {/* Desktop Nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link
                  className="text-gray-100 transition hover:text-gray-500"
                  to="/about"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-100 transition hover:text-gray-500"
                  to="/post-gig"
                >
                  Post Gig
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-100 transition hover:text-gray-500"
                  to="/find-gig"
                >
                  Browse Gigs
                </Link>
              </li>

              <li>
                <Link
                  className="text-gray-100 transition hover:text-gray-500"
                  to="/browse-profiles"
                >
                  Browse Profiles
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <div className="hidden sm:flex sm:gap-4">
                <SignInButton className="cursor-pointer text-gray-100 hover:text-gray-500" />
                <SignUpButton className="cursor-pointer text-gray-100 hover:text-gray-500" />
              </div>
            </Show>

            <Show when="signed-in">
              <UserButton />

              <Link
                to="/history"
                className="hidden md:block text-gray-100 hover:text-gray-500"
              >
                Activity
              </Link>

              <Link
                to="/chats"
                className="relative hidden md:block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="size-6"
                >
                  <path d="M4.913 2.658A48.394 48.394 0 0 1 12 2.25c2.392 0 4.744.175 7.043.513 1.584.233 2.707 1.626 2.707 3.228v6.018c0 1.602-1.123 2.995-2.707 3.228a48.294 48.294 0 0 1-5.83.498 1.14 1.14 0 0 0-.778.332L8.25 20.25v-3.227a48.1 48.1 0 0 1-3.293-.369C3.373 16.42 2.25 15.026 2.25 13.426V7.408c0-1.602 1.123-2.995 2.663-3.75ZM8.25 9.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm3.75 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm3.75 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
                </svg>

                {hasUnread && (
                  <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-800" />
                )}
              </Link>
            </Show>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="block rounded bg-gray-100 p-2 text-gray-700 md:hidden"
            >
              {mobileOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col px-4 py-4 space-y-4">
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="text-gray-100"
            >
              About
            </Link>

            <Link
              to="/post-gig"
              onClick={() => setMobileOpen(false)}
              className="text-gray-100"
            >
              Post Gig
            </Link>

            <Link
              to="/find-gig"
              onClick={() => setMobileOpen(false)}
              className="text-gray-100"
            >
              Browse Gigs
            </Link>

            <Link
              to="/browse-profiles"
              onClick={() => setMobileOpen(false)}
              className="text-gray-100"
            >
              Browse Profiles
            </Link>

            <Show when="signed-in">
              <Link
                to="/history"
                onClick={() => setMobileOpen(false)}
                className="text-gray-100"
              >
                Activity
              </Link>

              <Link
                to="/chats"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-gray-100"
              >
                Chats
                {hasUnread && (
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                )}
              </Link>
            </Show>

            <Show when="signed-out">
              <div className="flex flex-col items-start gap-3 ">
                <SignInButton className="cursor-pointer text-gray-100 " />
                <SignUpButton className="cursor-pointer text-gray-100" />
              </div>
            </Show>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;