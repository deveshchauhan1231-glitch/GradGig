import { useEffect, useState } from "react";
import { SignInButton, useAuth } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authFetch } from "../lib/api";
import Loader from "../components/loader";


const initialProfile = {
    name: "",
    contact: "",
    age: "",
    gender: "other",
    college: "",
    location: "",
    skills: "",
    about: ""
};

function StudentProfile() {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [profile, setProfile] = useState(initialProfile);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function loadProfile() {
            if (!isLoaded || !isSignedIn) return;

            setStatus("loading");
            setMessage("");

            try {
                const data = await authFetch("/profile/view", getToken);
                const current = data.profile;
                setProfile({
                    name: current.name || "",
                    contact: current.contact || "",
                    age: current.age || "",
                    gender: current.gender || "other",
                    college: current.college || "",
                    location: current.location || "",
                    skills: (current.skills || []).join(", "),
                    about: current.about || ""
                });
                setStatus("idle");
            } catch (error) {
                setStatus("idle");
                if (error.message !== "Profile not found") {
                    setMessage(error.message);
                }
            }
        }

        loadProfile();
    }, [getToken, isLoaded, isSignedIn]);

    function updateField(event) {
        const { name, value } = event.target;
        setProfile((current) => ({ ...current, [name]: value }));
    }

    async function saveProfile(event) {
        event.preventDefault();
        setStatus("saving");
        setMessage("");

        const body = {
            name: profile.name,
            contact: profile.contact,
            age: Number(profile.age),
            gender: profile.gender,
            college: profile.college,
            location: profile.location,
            skills: profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
            about: profile.about
        };

        try {
            await authFetch("/profile/edit", getToken, {
                method: "PUT",
                body: JSON.stringify(body),
            });
            setStatus("idle");
            setMessage("Profile saved successfully.");
        } catch (error) {
            setStatus("idle");
            setMessage(error.message);
        }
    }

    return (
        <>
            <Navbar />
            <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <section className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_18rem] md:items-start">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Student Profile</h1>
                        <p className="mt-3 text-gray-700">
                            Keep your public student profile updated so clients can find your skills and contact details.
                        </p>
                    </div>

                    <div className="rounded-md border border-gray-300 bg-white p-4">
                        <h2 className="text-lg font-semibold text-gray-900">{profile.name || "Your name"}</h2>
                        <p className="mt-1 text-sm text-gray-700">{profile.college || "College"}</p>
                        <p className="mt-1 text-sm text-gray-600">{profile.location || "Location"}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill) => (
                                <span key={skill} className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {!isSignedIn && isLoaded ? (
                    <div className="mt-8 rounded-md border border-gray-300 bg-white p-6">
                        <p className="text-gray-700">Sign in to create or edit your student profile.</p>
                        <SignInButton mode="modal">
                            <button type="button" className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                                Sign in
                            </button>
                        </SignInButton>
                    </div>
                ) : status === "loading" ? (
                    <div className="mt-8 flex min-h-[40vh] items-center justify-center rounded-md border border-gray-300 bg-white p-6">
                        <Loader />
                    </div>
                ) : (
                    <form onSubmit={saveProfile} className="mt-8 grid gap-4 rounded-md border border-gray-300 bg-white p-6 md:grid-cols-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                            <input name="name" value={profile.name} onChange={updateField} required className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3" />
                        </label>

                        <label className="block text-sm font-medium text-gray-700 md:col-span-2">
                            About
                            <textarea name="about" value={profile.about} onChange={updateField} placeholder="Tell us about yourself..." className="mt-1 h-100 w-full rounded-lg border border-gray-300 px-3" />
                        </label>

                        <label className="block text-sm font-medium text-gray-700">
                            Contact
                            <input name="contact" value={profile.contact} onChange={updateField} className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3" />
                        </label>

                        <label className="block text-sm font-medium text-gray-700">
                            Age
                            <input type="number" name="age" min="18" value={profile.age} onChange={updateField} required className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3" />
                        </label>

                        <label className="block text-sm font-medium text-gray-700">
                            Gender
                            <select name="gender" value={profile.gender} onChange={updateField} required className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </label>

                        <label className="block text-sm font-medium text-gray-700">
                            College
                            <input name="college" value={profile.college} onChange={updateField} required className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3" />
                        </label>

                        <label className="block text-sm font-medium text-gray-700">
                            Location
                            <input name="location" value={profile.location} onChange={updateField} required className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3" />
                        </label>

                        <label className="block text-sm font-medium text-gray-700 md:col-span-2">
                            Skills
                            <input name="skills" value={profile.skills} onChange={updateField} placeholder="React, UI Design, Writing" className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3" />
                        </label>

                        <div className="flex items-center gap-3 md:col-span-2">
                            <button type="submit" disabled={status === "saving" || status === "loading"} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300">
                                {status === "saving" ? "Saving..." : "Save Profile"}
                            </button>
                            {message && <p className="text-sm text-gray-700">{message}</p>}
                        </div>
                    </form>
                )}
            </main>
            <Footer />
        </>
    );
}

export default StudentProfile;
