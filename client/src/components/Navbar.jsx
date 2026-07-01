import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Show, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/react'
import { authFetch } from '../lib/api'

function Navbar() {
    const location = useLocation();
    const { getToken, isSignedIn } = useAuth();
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        async function loadUnreadState() {
            if (!isSignedIn) {
                setHasUnread(false);
                return;
            }

            try {
                const data = await authFetch('/conversations', getToken);
                const list = Array.isArray(data?.data) ? data.data : [];
                setHasUnread(list.some((conversation) => conversation.unreadForMe));
            } catch {
                setHasUnread(false);
            }
        }

        loadUnreadState();
    }, [getToken, isSignedIn, location.pathname]);

    return (
        <header className="bg-white dark:bg-gray-800">
            <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
                <Link className="block text-white-900" to="/">
                    <span className="sr-only">Home</span>
                    <svg className=" size-8" viewBox="0 0 400 400" role="img" xmlns="http://www.w3.org/2000/svg">



                        <rect x="20" y="20" width="360" height="360" rx="80" fill="#0d1540" />


                        <rect x="70" y="220" width="60" height="120" rx="16" fill="#ffffff" opacity="0.35" />
                        <rect x="170" y="160" width="60" height="180" rx="16" fill="#ffffff" opacity="0.65" />
                        <rect x="270" y="110" width="60" height="230" rx="16" fill="#3d52e6" />


                        <polygon points="300,42 360,72 300,96 240,72" fill="#ffffff" />

                        <polygon points="240,72 300,96 360,72 360,82 300,106 240,82" fill="#b0bce8" opacity="0.6" />

                        <circle cx="354" cy="70" r="7" fill="#3d52e6" />
                        <line x1="354" y1="77" x2="364" y2="104" stroke="#3d52e6" stroke-width="5" stroke-linecap="round" />
                        <rect x="357" y="102" width="14" height="7" rx="2" fill="#3d52e6" />

                    </svg>
                </Link>

                <div className="flex flex-1 items-center justify-end md:justify-between">
                    <nav aria-label="Global" className="hidden md:block">
                        <ul className="flex items-center gap-6 text-sm">
                            <li>
                                <Link className="text-gray-100 transition hover:text-gray-500/75" to="/about">About</Link>
                            </li>
                            <li>
                                <Link className="text-gray-100 transition hover:text-gray-500/75" to="/post-gig">Post Gig</Link>
                            </li>
                            <li>
                                <Link className="text-gray-100 transition hover:text-gray-500/75" to="/find-gig">Browse Gigs</Link>
                            </li>
                            <li>
                                <Link className="text-gray-100 transition hover:text-gray-500/75" to="/browse-profiles">Browse Profiles</Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Show when="signed-out">
                            <div className="sm:flex sm:gap-4">
                                <SignInButton className="cursor-pointer text-gray-100 transition hover:text-gray-500/75" />
                                <SignUpButton className="cursor-pointer text-gray-100 transition hover:text-gray-500/75" />
                            </div>

                        </Show>
                        <Show when="signed-in">
                            <UserButton />
                            <Link to="/history" className="text-gray-100 transition hover:text-gray-500/75">Activity</Link>
                            <Link to="/chats" className="relative">
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

                        <button className="block rounded-sm bg-gray-100 p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden">
                            <span className="sr-only">Toggle menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar