import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/loader";
import ReportUserModal from "../components/ReportUserModal";
import { Toast_failure, Toast_success } from "../components/toasts";
import { authFetch } from "../lib/api";

function getDisplayName(user) {
  if (!user) return "Unknown user";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return fullName || user.email || "Unknown user";
}

function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function loadConversations() {
      try {
        setLoading(true);
        const data = await authFetch("/conversations", getToken);
        const list = Array.isArray(data?.data) ? data.data : [];
        setConversations(list);

        if (conversationId) {
          const match = list.find((item) => item._id === conversationId);
          if (match) {
            setActiveConversation(match);
          }
        } else if (list[0]) {
          setActiveConversation(list[0]);
          navigate(`/chats/${list[0]._id}`, { replace: true });
        }
      } catch (err) {
        setError(err.message || "Could not load chats");
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [conversationId, getToken, isLoaded, isSignedIn, navigate]);

  useEffect(() => {
    if (!activeConversation?._id) return;

    async function loadMessages() {
      try {
        const data = await authFetch(`/messages/${activeConversation._id}`, getToken);
        setMessages(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        setError(err.message || "Could not load messages");
      }
    }

    async function markConversationRead() {
      try {
        await authFetch(`/conversations/${activeConversation._id}/read`, getToken, {
          method: "POST",
        });
      } catch {
        // Ignore read-state update failures so the chat screen still works.
      }
    }

    loadMessages();
    markConversationRead();
  }, [activeConversation?._id, getToken]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const activeParticipant = useMemo(() => activeConversation?.participant || null, [activeConversation]);

  async function handleSend() {
    if (!draft.trim() || !activeConversation?._id) return;

    setSending(true);
    setError("");

    try {
      const payload = await authFetch("/messages", getToken, {
        method: "POST",
        body: JSON.stringify({
          conversationId: activeConversation._id,
          content: draft.trim(),
          receiverId: activeParticipant?._id,
        }),
      });

      const newMessage = payload?.data;
      if (newMessage) {
        setMessages((current) => [...current, newMessage]);
        setDraft("");
      }
    } catch (err) {
      setError(err.message || "Could not send message");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Chats</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Your messages</h1>
          </div>
          <Link to="/history" className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:text-blue-700">
            Back to history
          </Link>
        </div>

        {!isLoaded ? (
          <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8">
            <Loader />
          </div>
        ) : !isSignedIn ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-900">Please sign in to use chats.</p>
          </div>
        ) : (
          <div className="grid min-h-[70vh] gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b border-gray-200 bg-gray-50 p-4 lg:border-b-0 lg:border-r">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              <div className="mt-4 space-y-2">
                {loading && <div className="flex justify-center py-8"><Loader /></div>}
                {!loading && conversations.map((conversation) => {
                  const participant = conversation.participant;
                  const isActive = activeConversation?._id === conversation._id;
                  return (
                    <button
                      key={conversation._id}
                      type="button"
                      onClick={() => navigate(`/chats/${conversation._id}`)}
                      className={`w-full rounded-xl border p-3 text-left transition ${isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300"}`}
                    >
                      <p className="font-semibold text-gray-900">{getDisplayName(participant)}</p>
                      <p className="mt-1 truncate text-sm text-gray-600">{conversation.lastMessage?.content || "Start a conversation"}</p>
                    </button>
                  );
                })}
                {!loading && !conversations.length && <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">No chats yet.</p>}
              </div>
            </aside>

            <section className="flex flex-col">
              {activeConversation ? (
                <>
                  <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{getDisplayName(activeParticipant)}</h2>
                      <p className="text-sm text-gray-600">Conversation started through proposal activity</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReportOpen(true)}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:border-red-400 hover:bg-red-50"
                    >
                      Report user
                    </button>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
                    {messages.map((message) => {
                      const isMine = message.senderId?._id ? message.senderId._id.toString() === userId?.toString() : false;
                      return (
                        <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMine ? "bg-blue-700 text-white" : "bg-white text-gray-800"}`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`mt-1 text-[11px] ${isMine ? "text-blue-100" : "text-gray-500"}`}>{new Date(message.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={endRef} />
                  </div>

                  <div className="border-t border-gray-200 p-4">
                    {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
                    <div className="flex gap-2">
                      <input
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleSend();
                          }
                        }}
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Type your message"
                      />
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={sending || !draft.trim()}
                        className="rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
                      >
                        {sending ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-gray-600">
                  Select a conversation to start chatting.
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
      <ReportUserModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportedUserName={getDisplayName(activeParticipant)}
        reportedUserId={activeParticipant?._id}
        onSuccess={() => setToast({ type: "success", title: "Report sent", message: "The report has been submitted successfully." })}
        onError={(message) => setToast({ type: "failure", title: "Report failed", message })}
      />
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] w-full max-w-sm">
          {toast.type === "success" ? (
            <Toast_success title={toast.title} message={toast.message} />
          ) : (
            <Toast_failure title={toast.title} message={toast.message} />
          )}
        </div>
      )}
    </>
  );
}

export default ChatPage;
