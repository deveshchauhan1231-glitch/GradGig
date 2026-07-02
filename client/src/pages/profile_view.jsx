import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SignInButton, useAuth } from "@clerk/react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Loader from "../components/loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ProposalModal from "../components/ProposalModal.jsx";
import { apiFetch, authFetch } from "../lib/api.js";
import { Toast_failure, Toast_success } from "../components/toasts.jsx";

const fallbackImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function ProfileViewDetailed() {
    const { id } = useParams();
    const { getToken, isSignedIn } = useAuth();
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [submittingProposal, setSubmittingProposal] = useState(false);
    const [toast, setToast] = useState(null);

    const profileId = useMemo(() => id || "", [id]);

    useEffect(() => {
        async function loadProfile() {
            if (!profileId) {
                setStatus("ready");
                setError("Profile not found");
                return;
            }

            setStatus("loading");
            setError("");

            try {
                const data = await apiFetch(`/profile/view?id=${encodeURIComponent(profileId),getToken}`);
                setProfile(data.profile);
                setStatus("ready");
            } catch (err) {
                setProfile(null);
                setError(err.message || "Could not load profile");
                setStatus("ready");
            }
        }

        loadProfile();
    }, [profileId]);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(timer);
    }, [toast]);

    async function submitProposal(payload) {
        if (!profile || !isSignedIn) return;

        setSubmittingProposal(true);

        try {
            await authFetch("/proposal/submit", getToken, {
                method: "POST",
                body: JSON.stringify({
                    clientId: profile.userId,
                    title: payload.title,
                    description: payload.description,
                    price: Number(payload.price),
                    deadline: payload.deadline,
                }),
            });

            setSubmittingProposal(false);
            setShowProposalModal(false);
            setToast({
                type: "success",
                title: "Proposal sent",
                message: "Your proposal has been sent successfully.",
            });
        } catch (err) {
            setSubmittingProposal(false);
            setToast({
                type: "error",
                title: "Could not send proposal",
                message: err.message || "Please try again shortly.",
            });
        }
    }

    if (status === "loading") {
        return (
            <>
                <Navbar />
                <div className="flex min-h-[70vh] items-center justify-center px-4">
                    <Loader />
                </div>
                <Footer />
            </>
        );
    }

    if (status === "ready" && (!profile || error)) {
        return (
            <>
                <Navbar />
                <div className="flex min-h-[70vh] items-center justify-center px-4">
                    <EmptyState />
                </div>
                <Footer />
            </>
        );
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

            <section className="mb-15 overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center">
                <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                    <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                            {profile?.name || "Student profile"}
                        </h2>

                        <p className="mt-4 text-gray-600">
                            {profile?.about || "This student has not added a bio yet."}
                        </p>

                        {isSignedIn ? (
                            <button
                                type="button"
                                onClick={() => setShowProposalModal(true)}
                                className="mt-6 inline-flex rounded-sm bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                            >
                                Send Proposal
                            </button>
                        ) : (
                            <SignInButton mode="modal">
                                <button
                                    type="button"
                                    className="mt-6 inline-flex rounded-sm bg-emerald-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                                >
                                    Sign in to send proposal
                                </button>
                            </SignInButton>
                        )}
                    </div>
                </div>

                <img
                    alt={profile?.name || "Student profile"}
                    src={profile?.image || fallbackImage}
                    className="h-full w-full object-cover sm:h-[calc(100%-2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%-4rem)] md:rounded-ss-[60px]"
                    onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                    }}
                />
            </section>

            <div className="p-8 md:p-12 lg:px-16 lg:py-24">
                <dl className="-my-3 divide-y divide-gray-200 border-2 border-blue-900 text-sm *:even:bg-gray-50">
                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Name</dt>
                        <dd className="text-gray-700 sm:col-span-2">{profile?.name || "—"}</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">College/School</dt>
                        <dd className="text-gray-700 sm:col-span-2">{profile?.college || "—"}</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Location</dt>
                        <dd className="text-gray-700 sm:col-span-2">{profile?.location || "—"}</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Rating</dt>
                        <dd className="text-gray-700 sm:col-span-2">{profile?.rating ?? 0}/5</dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Skills</dt>
                        <dd className="text-gray-700 sm:col-span-2">
                            {(profile?.skills || []).length ? profile.skills.join(", ") : "No skills listed"}
                        </dd>
                    </div>

                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                        <dt className="font-medium text-gray-900">Gigs Completed Successfully</dt>
                        <dd className="text-gray-700 sm:col-span-2">{profile?.completedGigs ?? 0}</dd>
                    </div>
                </dl>
            </div>

            <ProposalModal
                isOpen={showProposalModal}
                onClose={() => setShowProposalModal(false)}
                profile={profile}
                onSubmit={submitProposal}
                submitting={submittingProposal}
            />

            <Footer />
        </>
    );
}

export default ProfileViewDetailed