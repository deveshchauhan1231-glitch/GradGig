import { useEffect, useState } from "react";
import { authFetch } from "../lib/api";
import { useAuth } from "@clerk/react";

function ReportUserModal({ isOpen, onClose, reportedUserName, reportedUserId, onSuccess, onError }) {
  const { getToken } = useAuth();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!reportedUserId || !reason.trim()) return;

    setSubmitting(true);

    try {
      await authFetch("/report/submit", getToken, {
        method: "POST",
        body: JSON.stringify({
          reportedId: reportedUserId,
          reason: reason.trim(),
        }),
      });

      onSuccess?.();
      onClose?.();
    } catch (error) {
      onError?.(error.message || "Could not submit the report");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Report user</p>
            <h3 className="mt-2 text-xl font-bold text-gray-900">Report {reportedUserName || "this user"}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Reason</label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={5}
              placeholder="Tell us what happened..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {submitting ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportUserModal;
