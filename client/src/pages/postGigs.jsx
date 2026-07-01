import { useEffect, useState } from "react";
import { SignInButton, useAuth } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authFetch } from "../lib/api";
import Loader from "../components/loader";
import EmptyState from "../components/EmptyState";
import { Toast_failure, Toast_success } from "../components/toasts";

const initialForm = {
    title: "",
    description: "",
    category: "",
    price: "",
    deadline: "",
    skills: "",
};

function Postgigs() {
    const { getToken, isSignedIn } = useAuth();
    const [form, setForm] = useState(initialForm);
    const [status, setStatus] = useState("idle");
    const [toast, setToast] = useState(null);
    const skillBadges = form.skills.split(",").map((skill) => skill.trim()).filter(Boolean);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const hasDetails = Boolean(form.title.trim() || form.description.trim() || form.category);
    const detailsComplete = Boolean(form.description.trim() && form.category);
    const priceComplete = Boolean(form.price && form.deadline);
    const hasPreview = Boolean(hasDetails || form.price || form.deadline || skillBadges.length);
    const activeStep = detailsComplete ? (priceComplete ? 2 : 1) : 0;
    const progressWidth = `${((activeStep + 1) / 3) * 100}%`;
    const steps = ["Details", "Price", "Make Offer"];

    useEffect(() => {
        if (!toast) return undefined;

        const timer = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(timer);
    }, [toast]);

    function updateField(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    async function submitGig(event) {
        event.preventDefault();
        setStatus("submitting");
        

        if (!skillBadges.length) {
            setStatus("idle");
            setToast({
                type: "error",
                title: "Missing skills",
                message: "Add at least one skill before posting this gig.",
            });
            return;
        }

        const body = {
            title: form.title.trim(),
            description: form.description.trim(),
            deadline: form.deadline,
            price: Number(form.price),
            skills_needed: skillBadges,
            category: form.category,
        };

        try {
            await authFetch("/project/submit", getToken, {
                method: "POST",
                body: JSON.stringify(body),
            });

            setForm(initialForm);
            setStatus("idle");
            setToast({
                type: "success",
                title: "Gig posted",
                message: "Your gig has been posted successfully.",
            });
        } catch (error) {
            setStatus("idle");
            setToast({
                type: "error",
                title: "Could not post gig",
                message: error.message || "Please try again in a few seconds.",
            });
        }
    }

    return (
        <>
            <Navbar />
            {toast && (
                <div className="fixed right-4 top-20 z-[9999] w-[calc(100%-2rem)] max-w-sm">
                    {toast.type === "success" ? (
                        <Toast_success title={toast.title} message={toast.message} />
                    ) : (
                        <Toast_failure title={toast.title} message={toast.message} />
                    )}
                </div>
            )}
            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div>
                    <h2 className="sr-only">Steps</h2>
                    <div className="overflow-hidden rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-blue-500 transition-all duration-300" style={{ width: progressWidth }}></div>
                    </div>

                    <ol className="mt-4 grid grid-cols-3 text-sm font-medium text-gray-600">
                        {steps.map((step, index) => (
                            <li
                                key={step}
                                className={`flex items-center sm:gap-1.5 ${index === 0 ? "justify-start" : index === 1 ? "justify-center" : "justify-end"} ${index <= activeStep ? "text-blue-500" : ""}`}
                            >
                                <span className="hidden sm:inline">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                <form onSubmit={submitGig} className="mt-8 grid gap-5 lg:grid-cols-[1fr_22rem]">
                    <div>
                        <label htmlFor="gig-title" className="block text-lg text-black-700 mb-1">
                            Gig Title
                        </label>
                        <input
                            type="text"
                            placeholder="eg. Need a logo for my startup"
                            id="gig-title"
                            name="title"
                            value={form.title}
                            onChange={updateField}
                            className="w-full h-10 rounded-lg bg-white border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <label htmlFor="gig-desc" className="block text-lg text-black-700 mb-1 pt-4">
                            Gig Description
                        </label>
                        <textarea
                            placeholder="eg. I need a logo for my startup. I want it to be modern and minimalistic."
                            id="gig-desc"
                            name="description"
                            value={form.description}
                            onChange={updateField}
                            required
                            className="w-full h-64 rounded-lg bg-white border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <label htmlFor="gig-category" className="block text-lg text-black-700 mb-1 pt-4">
                            Category
                        </label>
                        <select
                            id="gig-category"
                            name="category"
                            value={form.category}
                            onChange={updateField}
                            required
                            className="w-full h-10 rounded-lg bg-white border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select a category</option>
                            <option value="design">Design</option>
                            <option value="development">Development</option>
                            <option value="marketing">Marketing</option>
                        </select>

                        <div className="grid gap-4 pt-4 sm:grid-cols-2">
                            <label htmlFor="gig-price" className="block text-lg text-black-700">
                                Gig Price
                                <input
                                    type="number"
                                    placeholder="eg. 500"
                                    id="gig-price"
                                    name="price"
                                    min="0"
                                    value={form.price}
                                    onChange={updateField}
                                    required
                                    className="mt-1 w-full h-10 rounded-lg bg-white border border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </label>

                            <label htmlFor="gig-deadline" className="block text-lg text-black-700">
                                Deadline
                                <input
                                    type="date"
                                    id="gig-deadline"
                                    name="deadline"
                                    min={tomorrow}
                                    value={form.deadline}
                                    onChange={updateField}
                                    required
                                    className="mt-1 w-full h-10 rounded-lg bg-white border border-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </label>
                        </div>

                        <label htmlFor="gig-skills" className="block text-lg text-black-700 mb-1 pt-4">
                            Skills Needed
                        </label>
                        <input
                            type="text"
                            placeholder="eg. React, Logo Design, Copywriting"
                            id="gig-skills"
                            name="skills"
                            value={form.skills}
                            onChange={updateField}
                            required
                            className="w-full h-10 rounded-lg bg-white border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="mt-2 flex flex-wrap gap-2">
                            {skillBadges.map((skill) => (
                                <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            {isSignedIn ? (
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="flex min-h-10 items-center gap-3 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                                >
                                    {status === "submitting" ? (
                                        <>
                                            <Loader />
                                            <span>Posting...</span>
                                        </>
                                    ) : "Post Gig"}
                                </button>
                            ) : (
                                <SignInButton mode="modal">
                                    <button type="button" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                                        Sign in to post
                                    </button>
                                </SignInButton>
                            )}
                        </div>
                    </div>

                    <aside className="rounded-md border border-gray-300 p-4 shadow-sm sm:p-6">
                        {hasPreview ? (
                            <>
                                <p className="text-sm font-medium text-blue-700">{form.category || "Category"}</p>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">
                                    {form.title || "Your gig preview"}
                                </h3>
                                <p className="mt-4 line-clamp-4 text-sm text-gray-700">
                                    {form.description || "Your description will appear here as you type."}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {skillBadges.length ? skillBadges.map((skill) => (
                                        <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            {skill}
                                        </span>
                                    )) : (
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                            Skills needed
                                        </span>
                                    )}
                                </div>
                                <dl className="mt-6 grid gap-3 text-sm text-gray-700">
                                    <div className="flex justify-between gap-3">
                                        <dt>Budget</dt>
                                        <dd>Rs. {form.price || "0"}</dd>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <dt>Deadline</dt>
                                        <dd>{form.deadline || "Not set"}</dd>
                                    </div>
                                </dl>
                            </>
                        ) : (
                            <div className="flex min-h-80 items-center justify-center">
                                <EmptyState />
                            </div>
                        )}
                    </aside>
                </form>
            </main>
            <Footer />
        </>
    );
}

export default Postgigs;
