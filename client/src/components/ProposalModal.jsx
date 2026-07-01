import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  deadline: "",
};

function ProposalModal({ isOpen, onClose, profile, onSubmit, submitting }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;

    setForm({
      title: profile?.name ? `Proposal for ${profile.name}` : "",
      description: "",
      price: "",
      deadline: "",
    });
  }, [isOpen, profile]);

  if (!isOpen) return null;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      deadline: form.deadline,
    });
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Send proposal</h3>
            <p className="mt-1 text-sm text-gray-600">
              Share your offer details with {profile?.name || "this student"}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close proposal form"
          >
            ✕
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500"
              placeholder="Proposal title"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={updateField}
              required
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500"
              placeholder="Describe the work and your approach"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={updateField}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Deadline</label>
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={updateField}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {submitting ? "Sending..." : "Send proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProposalModal;
