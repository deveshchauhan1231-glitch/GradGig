import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/loader";
import EmptyState from "../components/EmptyState";
import { authFetch } from "../lib/api";

function SmallEmptyState(){
    return <div className="flex min-h-56 items-center justify-center scale-75"><EmptyState /></div>;
}

function StatusBadge({ completed }){
    return (
        <span className={`rounded-md px-3 py-1 text-xs font-semibold ${completed ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
            {completed ? "Completed" : "Pending"}
        </span>
    );
}

function ContractCard({ item, scope }){
    const deadline = item.deadline ? new Date(item.deadline).toLocaleDateString() : "Flexible";

    return (
        <Link to={`/history/contracts/${scope}/${item._id}`} className="block rounded-md border border-gray-300 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <h4 className="text-lg font-semibold text-gray-900">{item.title || "Untitled contract"}</h4>
                <StatusBadge completed={item.isCompleted} />
            </div>
            <p className="mt-2 w-fit rounded-md bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">Rs. {item.price ?? 0}</p>
            <p className="mt-3 line-clamp-3 text-sm text-gray-700">{item.description}</p>
            <p className="mt-5 text-xs text-gray-600">Deadline: {deadline}</p>
        </Link>
    );
}

function HistorySection({ title, scope, items, loading }){
    return (
        <section className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="mt-4 grid gap-4">
                {loading && <div className="flex min-h-40 items-center justify-center"><Loader /></div>}
                {!loading && items.map((item) => <ContractCard key={item._id} item={item} scope={scope} />)}
                {!loading && !items.length && <SmallEmptyState />}
            </div>
        </section>
    );
}

function ContractHistory(){
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [byMe, setByMe] = useState([]);
    const [forMe, setForMe] = useState([]);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        async function loadHistory(){
            if (!isLoaded) return;
            if (!isSignedIn) {
                setStatus("ready");
                return;
            }

            setStatus("loading");
            const [byMeResult, forMeResult] = await Promise.allSettled([
                authFetch("/contract/viewByMe", getToken),
                authFetch("/contract/viewForMe", getToken),
            ]);

            setByMe(byMeResult.status === "fulfilled" ? [].concat(byMeResult.value.contract || []) : []);
            setForMe(forMeResult.status === "fulfilled" ? [].concat(forMeResult.value.contract || []) : []);
            setStatus("ready");
        }

        loadHistory();
    }, [getToken, isLoaded, isSignedIn]);

    return(
        <>
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg text-center">
                    <h2 className="text-3xl/tight font-bold text-gray-900 sm:text-4xl">Contract History</h2>
                    <p className="mt-4 text-lg text-pretty text-gray-700">Review contract activity grouped by ownership.</p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <HistorySection title="By Me" scope="by-me" items={byMe} loading={status === "loading"} />
                    <HistorySection title="For Me" scope="for-me" items={forMe} loading={status === "loading"} />
                </div>
            </main>
            <Footer />
        </>
    )
}

export default ContractHistory;
