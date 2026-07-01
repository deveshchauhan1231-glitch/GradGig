import { useEffect, useMemo, useState } from "react";
import { SignInButton, useAuth } from "@clerk/react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import Loader from "../components/loader";
import { apiFetch, authFetch } from "../lib/api";
import { Toast_failure, Toast_success } from "../components/toasts";

function ProjectDetail() {
    const { getToken, isSignedIn } = useAuth();
    const { id: slug } = useParams();
    const [project, setProject] = useState(null);
    const [status, setStatus] = useState("loading");
    const [applyStatus, setApplyStatus] = useState("idle");
    const [toast, setToast] = useState(null);
    const [error, setError] = useState("");
    const projectId = useMemo(() => slug?.match(/[0-9a-fA-F]{24}/)?.[0] || "", [slug]);
    const title = project?.title || `${project?.category || "Project"} gig`;
    const description = project?.description || "No description provided.";
    const deadline = project?.deadline ? new Date(project.deadline).toLocaleDateString() : "Flexible";

    useEffect(() => {
        async function loadProject() {
            if (!projectId) {
                setStatus("ready");
                setError("Project not found");
                return;
            }

            setStatus("loading");
            setError("");

            try {
                const data = await apiFetch(`/project/view?projectId=${encodeURIComponent(projectId)}`);
                setProject(data.project);
                setStatus("ready");
            } catch (err) {
                setProject(null);
                setError(err.message);
                setStatus("ready");
            }
        }

        loadProject();
    }, [projectId]);

    useEffect(() => {
        if (!toast) return undefined;

        const timer = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(timer);
    }, [toast]);

    async function submitProposal() {
        if (!project) return;

        setApplyStatus("submitting");

        try {
            await authFetch("/proposal/submit", getToken, {
                method: "POST",
                body: JSON.stringify({
                    clientId: project.clientId,
                    projectId: project._id,
                    title: project.title,
                    description: project.description,
                    price: Number(project.price),
                    deadline: project.deadline,
                }),
            });

            setApplyStatus("idle");
            setToast({
                type: "success",
                title: "Proposal sent",
                message: "Your proposal has been submitted successfully.",
            });
        } catch (err) {
            setApplyStatus("idle");
            setToast({
                type: "error",
                title: "Could not apply",
                message: err.message || "Please try again in a few seconds.",
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
            <section className="bg-white lg:grid lg:place-content-center">
                {status === "loading" && (
                    <div className="flex min-h-[60vh] w-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                        <Loader />
                    </div>
                )}

                {status === "ready" && (error || !project) && (
                    <div className="flex min-h-[60vh] w-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                        <EmptyState />
                    </div>
                )}

                {status === "ready" && project && (
                    <>
                        <div className="mx-auto w-screen max-w-7xl px-4 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                            <div className="mx-auto max-w-prose text-center">
                                <p className="mb-3 text-sm font-medium uppercase text-purple-700">{project.category || "General"}</p>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {title}
                                </h1>
                            </div>

                            <span className="mt-30 flex items-center">
                                <span className="h-px flex-1 bg-gray-300"></span>
                                <span className="shrink-0 px-4 font-bold text-gray-900">Description below</span>
                                <span className="h-px flex-1 bg-gray-300"></span>
                            </span>

                            <p className="mx-15 mt-15 whitespace-pre-line text-xl font-bold">{description}</p>
                        </div>

                        <span className="mt-30 flex items-center">
                            <span className="h-px flex-1 bg-gray-300"></span>
                            <span className="shrink-0 px-4 font-bold text-gray-900">Price and Deadline</span>
                            <span className="h-px flex-1 bg-gray-300"></span>
                        </span>

                        <div className="mx-auto mb-10 mt-10 flex flex-wrap justify-center gap-10 px-4">
                            <span className="inline-flex items-center justify-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-purple-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                </svg>
                                <p className="text-sm whitespace-nowrap">{deadline}</p>
                            </span>

                            <span className="inline-flex items-center justify-center gap-1 rounded-full border border-purple-500 px-2.5 py-0.5 text-purple-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p className="text-sm whitespace-nowrap">Rs. {project.price ?? 0}</p>
                            </span>
                        </div>

                        <span className="mt-30 flex items-center">
                            <span className="h-px flex-1 bg-gray-300"></span>
                            <span className="shrink-0 px-4 font-bold text-gray-900">Skills needed</span>
                            <span className="h-px flex-1 bg-gray-300"></span>
                        </span>

                        <div className="mx-auto mb-20 mt-10 flex max-w-4xl flex-wrap justify-center gap-3 px-4">
                            {(project.skills_needed || []).map((skill) => (
                                <span
                                    key={skill}
                                    className="inline-flex items-center justify-center rounded-full border border-purple-500 px-2.5 py-0.5 text-purple-700"
                                >
                                    <p className="text-sm whitespace-nowrap">{skill}</p>
                                </span>
                            ))}
                        </div>
                        {isSignedIn ? (
                            <button
                                type="button"
                                onClick={submitProposal}
                                disabled={applyStatus === "submitting"}
                                className="mb-15 mx-auto inline-flex items-center gap-2 rounded-full border border-blue-800 bg-blue-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-900 focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-blue-300"
                            >
                                <span>{applyStatus === "submitting" ? "Applying..." : "Apply"}</span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-4 rtl:rotate-180"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                                    />
                                </svg>
                            </button>
                        ) : (
                            <SignInButton mode="modal">
                                <button
                                    type="button"
                                    className="mb-15 mx-auto inline-flex items-center gap-2 rounded-full border border-blue-800 bg-blue-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-900 focus-visible:ring-4 focus-visible:ring-indigo-200 focus-visible:outline-none"
                                >
                                    <span>Sign in to apply</span>
                                </button>
                            </SignInButton>
                        )}

                        
                    </>
                )}
            </section>
            <Footer />
        </>
    );
}

export default ProjectDetail;
