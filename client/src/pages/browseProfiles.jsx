import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../lib/api";
import Loader from "../components/loader";
import EmptyState from "../components/EmptyState";

function ProfileCard({ profile }) {
    const fallbackImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <article className="rounded-md border border-gray-300 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
                    <p className="mt-1 text-sm text-gray-700">{profile.college}</p>
                    <p className="mt-1 text-sm text-gray-600">{profile.location}</p>
                </div>

                <img
                    src={profile.image || fallbackImage}
                    alt={profile.name || "Student profile"}
                    className="size-16 shrink-0 rounded-full border border-gray-200 object-cover"
                    onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                    }}
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {(profile.skills || []).map((skill) => (
                    <span key={skill} className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {skill}
                    </span>
                ))}
            </div>

            <dl className="mt-6 flex flex-wrap gap-4 text-sm text-gray-700">
                <div>
                    <dt className="font-medium">Rating</dt>
                    <dd>{profile.rating ?? 0}/5</dd>
                </div>
                <div>
                    <dt className="font-medium">Contact</dt>
                    <dd>{profile.contact}</dd>
                </div>
            </dl>

            <Link
                to={`/profile-view/${profile.userId || profile._id}`}
                className="mt-5 inline-flex items-center text-sm font-semibold text-blue-700 transition hover:text-blue-900"
            >
                View profile →
            </Link>
        </article>
    );
}

function BrowseProfiles() {
    const [profiles, setProfiles] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProfiles() {
            setStatus("loading");
            setError("");

            try {
                const data = await apiFetch("/profile/allProfiles");
                setProfiles(data.profiles || []);
                setStatus("ready");
            } catch (err) {
                setProfiles([]);
                setError(err.message === "No profiles found" ? <div className="flex min-h-[60vh] items-center justify-center"><EmptyState /></div> : err.message);
                setStatus("ready");
            }
        }

        loadProfiles();
    }, []);

    return (
        <>
            <Navbar />
            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-blue-800">Browse Student Talent</h1>

                {error && <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

                <section className="mt-6 grid gap-4 md:grid-cols-2">
                    {status === "loading" && <div className="col-span-full flex min-h-[60vh] items-center justify-center">
      <Loader />
    </div>}
                    {status === "ready" && profiles.map((profile) => (
                        <ProfileCard key={profile._id} profile={profile} />
                    ))}
                    {status === "ready" && !profiles.length && (
                        <div className="col-span-full flex min-h-[60vh] w-full items-center justify-center"><EmptyState /></div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default BrowseProfiles;
