import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SignInButton, useAuth } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmptyState from "../components/EmptyState";
import Loader from "../components/loader";
import { apiFetch, authFetch } from "../lib/api";
import HoverRating from "../components/Rating";

function DetailField({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <dt className="text-sm font-medium text-gray-700">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
}

function StatusBadge({ type, item }) {
  if (type === "contracts") {
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item?.isCompleted ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
        {item?.isCompleted ? "Completed" : "Pending"}
      </span>
    );
  }

  if (type === "proposals") {
    if (item?.verdict === true) {
      return <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">✓ Accepted</span>;
    }

    if (item?.isRejected === true || item?.verdict === false) {
      return <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">✕ Rejected</span>;
    }

    return <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">⏳ Pending</span>;
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item?.isCompleted ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
      {item?.isCompleted ? "Completed" : "Pending"}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "Flexible";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Flexible" : date.toLocaleDateString();
}

function HistoryDetail() {
  const { type, scope, id } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [item, setItem] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [actionState, setActionState] = useState("idle");
  const [actionMessage, setActionMessage] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [completing, setCompleting] = useState(false);

  const normalizedType = (type || "").toLowerCase();
  const normalizedScope = (scope || "").toLowerCase();
  const title = useMemo(() => {
    if (normalizedType === "contracts") return "Contract detail";
    if (normalizedType === "proposals") return "Proposal detail";
    if (normalizedType === "projects") return "Project detail";
    return "History detail";
  }, [normalizedType]);

  useEffect(() => {
    async function loadHistoryItem() {
      if (!isLoaded) return;

      if (!id || !["contracts", "proposals", "projects"].includes(normalizedType) || !["by-me", "for-me"].includes(normalizedScope)) {
        setStatus("ready");
        setError("This history item could not be found.");
        return;
      }

      if (!isSignedIn) {
        setStatus("ready");
        setError("Please sign in to view your history details.");
        return;
      }

      setStatus("loading");
      setError("");

      try {
        let payload = null;

        if (normalizedType === "contracts") {
          const endpoint = normalizedScope === "for-me" ? "/contract/viewForMe" : "/contract/viewByMe";
          const data = await authFetch(`${endpoint}?id=${encodeURIComponent(id)}`, getToken);
          payload = data.contract;
        } else if (normalizedType === "proposals") {
          const endpoint = normalizedScope === "for-me" ? "/proposal/viewForMe" : "/proposal/viewByMe";
          const data = await authFetch(`${endpoint}?proposalId=${encodeURIComponent(id)}`, getToken);
          payload = data.proposal;
        } else {
          const data = await authFetch(`/project/view?projectId=${encodeURIComponent(id)}`, getToken);
          payload = data.project;
        }

        setItem(payload);
        setProjectData(null);

        if (payload?.projectId) {
          try {
            const projectResponse = await apiFetch(`/project/view?projectId=${encodeURIComponent(payload.projectId)}`);
            setProjectData(projectResponse.project || null);
          } catch (projectError) {
            setProjectData(null);
          }
        }

        setStatus("ready");
      } catch (err) {
        setItem(null);
        setProjectData(null);
        setError(err.message || "Could not load this history item.");
        setStatus("ready");
      }
    }

    loadHistoryItem();
  }, [getToken, id, isLoaded, isSignedIn, normalizedScope, normalizedType]);

  const detailFields = useMemo(() => {
    if (!item) return [];

    if (normalizedType === "projects") {
      return [
        ["Category", item.category || "General"],
        ["Budget", `Rs. ${item.price ?? 0}`],
        ["Deadline", formatDate(item.deadline)],
        ["Status", item.isCompleted ? "Completed" : "Pending"],
        ["Skills needed", (item.skills_needed || []).join(", ") || "No skills listed"],
      ];
    }

    if (normalizedType === "proposals") {
      return [
        ["Category", projectData?.category || "General"],
        ["Budget", `Rs. ${item.price ?? 0}`],
        ["Deadline", formatDate(item.deadline)],
        ["Status", item.verdict === true ? "Accepted" : item.verdict === false ? "Rejected" : "Pending"],
        ["Skills needed", (projectData?.skills_needed || []).join(", ") || "No skills listed"],
      ];
    }

    return [
      ["Budget", `Rs. ${item.price ?? 0}`],
      ["Deadline", formatDate(item.deadline)],
      ["Status", item.isCompleted ? "Completed" : "Pending"],
      ["Skills needed", (projectData?.skills_needed || []).join(", ") || "No skills listed"],
    ];
  }, [item, normalizedType, projectData]);

  async function handleAcceptProposal() {
    if (!item?._id) return;

    setActionState("submitting");
    setActionMessage("");

    try {
      await authFetch(`/proposal/acceptProposal?proposalId=${encodeURIComponent(item._id)}&proposalType=forProject`, getToken);
      setItem((current) => (current ? { ...current, verdict: true, isRejected: false } : current));
      setActionState("accepted");
      setActionMessage("Proposal accepted successfully.");
    } catch (err) {
      setActionState("error");
      setActionMessage(err.message || "Could not accept this proposal.");
    }
  }

  async function handleOpenChat() {
    if (!item?._id) return;

    try {
      const participantId = normalizedScope === "for-me"
        ? item.clientId
        : item.providerId;

      if (!participantId) {
        setActionMessage("No chat partner is available for this proposal yet.");
        setActionState("error");
        return;
      }

      const conversationResponse = await authFetch("/conversations", getToken, {
        method: "POST",
        body: JSON.stringify({ user2Id: participantId }),
      });

      const conversationId = conversationResponse?.data?._id || conversationResponse?.conversation?._id || conversationResponse?._id;
      if (conversationId) {
        navigate(`/chats/${conversationId}`);
      } else {
        setActionMessage("Could not open the chat right now.");
        setActionState("error");
      }
    } catch (err) {
      setActionState("error");
      setActionMessage(err.message || "Could not open the chat.");
    }
  }

  async function handleRejectProposal() {
    if (!item?._id) return;

    setActionState("submitting");
    setActionMessage("");

    try {
      await authFetch("/proposal/rejectProposal", getToken, {
        method: "POST",
        body: JSON.stringify({ proposalId: item._id }),
      });
      setItem((current) => (current ? { ...current, verdict: false, isRejected: true } : current));
      setActionState("rejected");
      setActionMessage("Proposal rejected successfully.");
    } catch (err) {
      setActionState("error");
      setActionMessage(err.message || "Could not reject this proposal.");
    }
  }

  async function handleMarkCompleted() {
    if (!item?._id) return;

    setCompleting(true);
    setActionMessage("");

    try {
      const endpoint = normalizedType === "contracts" ? "/contract/markCompleted" : "/project/markCompleted";
      const payloadKey = normalizedType === "contracts" ? "contractId" : "projectId";
      const response = await authFetch(endpoint, getToken, {
        method: "POST",
        body: JSON.stringify({ [payloadKey]: item._id }),
      });

      const updatedItem = response?.contract || response?.project || null;
      if (updatedItem) {
        setItem((current) => (current ? { ...current, ...updatedItem } : current));
      }

      if (response?.project?.isCompleted || response?.contract?.isCompleted) {
        setShowReviewModal(true);
      } else {
        setActionState("success");
        setActionMessage("Completion request recorded. The other party still needs to confirm.");
      }
    } catch (err) {
      setActionState("error");
      setActionMessage(err.message || "Could not update completion status.");
    } finally {
      setCompleting(false);
    }
  }

  async function handleSubmitReview() {
    if (!item?._id || reviewRating < 1) return;

    setActionState("submitting");
    setActionMessage("");

    try {
      const reviewerId = item.clientId || item.providerId;
      const reviewedId = normalizedScope === "for-me" ? item.clientId : item.providerId;
      const finalText = (reviewText || "").trim() || `Great experience with ${item.title || "this item"}.`;

      await authFetch("/review/submit", getToken, {
        method: "POST",
        body: JSON.stringify({
          reviewerId,
          reviewedId,
          review: finalText,
          rating: reviewRating,
        }),
      });

      setShowReviewModal(false);
      setReviewText("");
      setReviewRating(0);
      setActionState("success");
      setActionMessage("Thanks for your review.");
    } catch (err) {
      setActionState("error");
      setActionMessage(err.message || "Could not submit your review.");
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{title}</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{item?.title || "History item"}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/history" className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-700">
              Back to history
            </Link>
            <Link to={`/history/${normalizedType}`} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-700">
              Back to {normalizedType}
            </Link>
          </div>
        </div>

        {status === "loading" && (
          <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
            <Loader />
          </div>
        )}

        {status === "ready" && !item && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mx-auto max-w-md text-center">
              {isSignedIn ? <EmptyState /> : <div className="space-y-4"><p className="text-lg font-semibold text-gray-900">Sign in to view your history details</p><SignInButton mode="modal"><button type="button" className="rounded-full bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white">Sign in</button></SignInButton></div>}
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
          </div>
        )}

        {status === "ready" && item && (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">{normalizedType.slice(0, -1)}</p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">{item.title || "Untitled item"}</h2>
                </div>
                <StatusBadge type={normalizedType} item={item} />
              </div>

              <p className="mt-6 whitespace-pre-line text-base leading-7 text-gray-700">
                {item.description || "No description was provided for this item."}
              </p>

              {normalizedType === "proposals" && item?.verdict === true && (
                <div className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <button
                    type="button"
                    onClick={handleOpenChat}
                    className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Open chat
                  </button>
                </div>
              )}

              {normalizedType === "proposals" && normalizedScope === "for-me" && item?.verdict === null && item?.isRejected !== true && (
                <div className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <button
                    type="button"
                    onClick={handleAcceptProposal}
                    disabled={actionState === "submitting"}
                    className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                  >
                    {actionState === "submitting" ? "Working..." : "Accept proposal"}
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectProposal}
                    disabled={actionState === "submitting"}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                  >
                    {actionState === "submitting" ? "Working..." : "Reject proposal"}
                  </button>
                </div>
              )}

              {(normalizedType === "contracts" || normalizedType === "projects") && !item?.isCompleted && (
                <div className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <button
                    type="button"
                    onClick={handleMarkCompleted}
                    disabled={completing}
                    className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                  >
                    {completing ? "Working..." : "Mark completed"}
                  </button>
                </div>
              )}

              {actionMessage && (
                <p className={`mt-4 text-sm ${actionState === "error" ? "text-red-600" : "text-green-700"}`}>
                  {actionMessage}
                </p>
              )}

              {showReviewModal && (
                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Leave a rating and review</h3>
                  <p className="mt-2 text-sm text-gray-600">Your feedback helps the other person build trust.</p>
                  <div className="mt-4">
                    <HoverRating
                      value={reviewRating}
                      onChange={setReviewRating}
                      reviewText={reviewText}
                      onReviewTextChange={setReviewText}
                      defaultReview={`Great experience with ${item.title || "this item"}.`}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={reviewRating < 1 || actionState === "submitting"}
                      className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                      {actionState === "submitting" ? "Submitting..." : "Submit review"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-700"
                    >
                      Skip for now
                    </button>
                  </div>
                </div>
              )}

              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                {detailFields.map(([label, value]) => (
                  <DetailField key={label} label={label} value={value} />
                ))}
              </dl>
            </section>

            <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">History context</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li className="rounded-lg border border-gray-200 bg-white p-3">
                  <p className="font-medium text-gray-900">Type</p>
                  <p className="mt-1 capitalize">{normalizedType}</p>
                </li>
                <li className="rounded-lg border border-gray-200 bg-white p-3">
                  <p className="font-medium text-gray-900">Scope</p>
                  <p className="mt-1 capitalize">{normalizedScope.replace("-", " ")}</p>
                </li>
                <li className="rounded-lg border border-gray-200 bg-white p-3">
                  <p className="font-medium text-gray-900">Reference</p>
                  <p className="mt-1 break-all text-xs text-gray-600">{id}</p>
                </li>
              </ul>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default HistoryDetail;
