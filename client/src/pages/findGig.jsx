import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiFetch } from "../lib/api";
import Loader from "../components/loader";
import { useNavigate } from "react-router-dom";

function ProjectCard({ project }) {
const deadline = project.deadline
  ? new Date(project.deadline).toLocaleDateString("en-GB")
  : "Flexible";const navigate = useNavigate();
    return (
        <article className="rounded-md border border-gray-300 bg-white p-4 shadow-sm sm:p-6" onClick={() => navigate(`/project/${project._id}`)}>
            {console.log(project.id)}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-blue-700">{project.category || "General"}</p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                        {project.title || "Untitled gig"}
                    </h3>
                </div>
                <p className="shrink-0 rounded-md bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                    ₹ {project.price ?? 0}
                </p>
            </div>

            

            <div className="mt-4 flex flex-wrap gap-2">
                {(project.skills_needed || []).map((skill) => (
                    <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {skill}
                    </span>
                ))}
            </div>

            <p className="mt-5 text-xs text-gray-600">Deadline: {deadline}</p>
        </article>
    );
}

function FindGig() {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("600");
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    async function loadProjects(price = "") {
        setStatus("loading");
        setError("");

        try {
            const path = price ? `/project/filteredProjects?price=${encodeURIComponent(price)}` : "/project/allProjects";
            const data = await apiFetch(path);
            setProjects(data.projects || []);
            setStatus("ready");
        } catch (err) {
            setProjects([]);
            setError(err.message === "No projects found" ? "" : err.message);
            setStatus("ready");
        }
    }

    useEffect(() => {
        loadProjects();
    }, []);

    const visibleProjects = useMemo(() => {
        const query = search.trim().toLowerCase();
        const min = minPrice === "" ? null : Number(minPrice);

        return projects.filter((project) => {
            const text = [
                project.description,
                project.title,
                project.category,
                ...(project.skills_needed || []),
            ].join(" ").toLowerCase();

            const matchesSearch = !query || text.includes(query);
            const matchesMin = min === null || Number(project.price) >= min;

            return matchesSearch && matchesMin;
        });
    }, [projects, search, minPrice]);

    function handleSearch(event) {
        event.preventDefault();
        loadProjects(maxPrice);
    }

    return (
        <>
            <Navbar />
            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-blue-800">Find Opportunities</h1>

                <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-3 border-b border-gray-300 pb-6 lg:flex-row lg:items-end">
                    <div className="flex gap-3">
                        <label className="w-28">
                            <span className="text-sm font-medium text-gray-700">Min</span>
                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(event) => setMinPrice(event.target.value)}
                                className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-2 text-sm"
                            />
                        </label>

                        <label className="w-28">
                            <span className="text-sm font-medium text-gray-700">Max</span>
                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(event) => setMaxPrice(event.target.value)}
                                className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-2 text-sm"
                            />
                        </label>
                    </div>

                    <div className="relative min-w-0 flex-1">
                        <label htmlFor="Search" className="sr-only">Search for gigs</label>
                        <input
                            type="text"
                            placeholder="Search for gigs"
                            id="Search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 pr-11 text-sm"
                        />
                        <button
                            type="submit"
                            aria-label="Search"
                            className="absolute inset-y-0 right-2 my-auto grid size-8 place-content-center rounded-full text-gray-700 transition-colors hover:bg-gray-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </button>
                    </div>
                </form>

                {error && <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

                <section className="mt-6 grid gap-4 md:grid-cols-2">
                    {status === "loading" && <div className="col-span-full flex min-h-[60vh] items-center justify-center">
      <Loader />
    </div>}
                    {status === "ready" && visibleProjects.map((project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                    {status === "ready" && !visibleProjects.length && (
                        <p className="text-gray-700">No gigs found.</p>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default FindGig;
