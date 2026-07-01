import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const studentSteps = [
  {
    num: "01",
    title: "Create your profile",
    desc: "Add your college, skills, contact details, and the kind of work you want to take up.",
    points: ["College profile", "Skill tags", "Public talent card"],
  },
  {
    num: "02",
    title: "Find gigs that fit",
    desc: "Browse real projects by budget, deadline, category, and skills needed.",
    points: ["Browse projects", "Filter by budget", "Check deadlines"],
  },
  {
    num: "03",
    title: "Apply directly",
    desc: "Send a proposal from the project page and let the client review your interest.",
    points: ["One-click apply", "Clear scope", "Direct proposal"],
  },
  {
    num: "04",
    title: "Work and build proof",
    desc: "Deliver the project, agree on payment directly, and build a stronger portfolio.",
    points: ["Deliver work", "Build history", "Grow credibility"],
  },
];

const clientSteps = [
  {
    num: "01",
    title: "Post a gig",
    desc: "Describe the work, add a title, set the budget, deadline, category, and skills needed.",
    points: ["Simple form", "Budget upfront", "Skill requirements"],
  },
  {
    num: "02",
    title: "Review proposals",
    desc: "Students apply to your project, and you can compare their fit before moving ahead.",
    points: ["Student interest", "Proposal history", "Easy comparison"],
  },
  {
    num: "03",
    title: "Accept the right person",
    desc: "Accept a proposal to create a contract and assign the project to that student.",
    points: ["Create contract", "Assign provider", "Track ownership"],
  },
  {
    num: "04",
    title: "Receive the work",
    desc: "Coordinate directly with the student and handle payment outside GradGig however you agree.",
    points: ["Direct terms", "No middleman", "Leave feedback"],
  },
];

const highlights = [
  { label: "No platform payment", value: "Pay directly" },
  { label: "Built for student work", value: "Fast setup" },
  { label: "Simple records", value: "Projects, proposals, contracts" },
];

function StepCard({ step }) {
  return (
    <article className="rounded-md border border-gray-300 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-md bg-gray-800 px-3 py-1 text-sm font-semibold text-white">{step.num}</span>
        <div className="h-px flex-1 bg-gray-200 mt-4"></div>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-gray-900">{step.title}</h3>
      <p className="mt-3 text-sm leading-6 text-gray-700">{step.desc}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {step.points.map((point) => (
          <span key={point} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {point}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function About() {
  const [tab, setTab] = useState("student");
  const steps = tab === "student" ? studentSteps : clientSteps;

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-8">
              <span className="inline-flex rounded-full bg-gray-800 px-4 py-1.5 text-sm font-semibold text-white">
                How it works
              </span>

              <h1 className="mt-5 text-4xl font-bold text-gray-900 sm:text-5xl">
                Start simple. Keep the work moving.
              </h1>

              <p className="mt-5 text-base leading-7 text-gray-700 sm:text-lg">
                GradGig keeps the flow clear: post or find work, apply or accept, then coordinate directly.
              </p>

              <div className="mt-6 inline-flex rounded-full border border-gray-300 bg-white p-1 shadow-sm">
                {["student", "client"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTab(item)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                      tab === item ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item === "student" ? "For students" : "For clients"}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid gap-3">
                {highlights.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-3">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-semibold text-blue-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((step) => (
                <StepCard key={step.num} step={step} />
              ))}
            </div>
          </div>

          <section className="mt-10 rounded-md border border-blue-100 bg-blue-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">GradGig does not process payments.</h2>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                The platform helps students and clients discover each other. Scope, delivery, and payment terms stay between both sides.
              </p>
            </div>

            <a
              href="/find-gig"
              className="mt-5 inline-flex rounded-md border border-blue-800 bg-blue-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:mt-0"
            >
              Browse gigs
            </a>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
}
