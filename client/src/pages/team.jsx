import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Team() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center py-16 px-6">
        {/* Profile */}
        <div className="max-w-xs text-center">
          <img
            src="/lead_img.png"
            alt="Devesh Chauhan"
            className="w-64 h-64 mx-auto rounded-full object-cover border-4 border-black shadow-lg"
          />

          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Devesh Chauhan
            </h2>

            <p className="mt-2 text-lg text-gray-600">
              Product Designer & Developer
            </p>
          </div>
        </div>

        {/* About Me */}
        {/* About Me */}
<div className="max-w-4xl mx-auto mt-16 text-center">
  <h1 className="text-4xl font-bold text-gray-900 mb-8">
    Meet the Developer
  </h1>

  <div className="space-y-6 text-lg leading-8 text-gray-700 px-4">
    <p>
      Hi, I'm Devesh Chauhan, the developer behind GradGig. I'm a full-stack
      developer with a strong interest in building products that solve real
      problems. I enjoy taking ideas from a simple concept to a fully
      functional application, handling everything from the user interface to
      the backend infrastructure.
    </p>

    <p>
      GradGig was born from a problem I noticed around me. Many talented
      students struggle to find meaningful opportunities to gain real-world
      experience, while businesses often find it difficult to connect with
      skilled and motivated student talent. I wanted to build a platform that
      could bridge that gap and create value for both.
    </p>

    <p>
      Every part of GradGig has been designed and developed by me. From the
      frontend and backend to the database design and deployment, this project
      represents countless hours of learning, experimenting, and improving.
      It continues to evolve with every feature and every piece of feedback I
      receive.
    </p>

    <p>
      Thank you for taking the time to explore GradGig. I hope it becomes a
      platform that helps students grow their careers and gives businesses an
      easier way to discover talented people ready to make an impact.
    </p>

    <p>
  If you'd like to contribute, collaborate, or simply get in touch, I'd love
  to hear from you.
</p>

<form
  action="#"
  className="mx-auto max-w-xl space-y-6 rounded-2xl border border-blue-500 bg-white p-8 shadow-lg transform transition-all duration-300 ease-out hover:scale-105"
>
  <div>
    <label
      htmlFor="name"
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      Full Name
    </label>

    <input
      id="name"
      type="text"
      placeholder="John Doe"
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
    />
  </div>

  <div>
    <label
      htmlFor="email"
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      Email Address
    </label>

    <input
      id="email"
      type="email"
      placeholder="john@example.com"
      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
    />
  </div>

  <div>
    <label
      htmlFor="message"
      className="mb-2 block text-sm font-medium text-gray-700"
    >
      Message
    </label>

    <textarea
      id="message"
      rows="5"
      placeholder="Tell us how you'd like to contribute or get in touch..."
      className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
    ></textarea>
  </div>

  <button
    type="submit"
    className="w-full rounded-lg bg-blue-800 px-6 py-3 font-semibold text-white transition duration-200 hover:bg-blue-600 active:scale-[0.98]"
  >
    Send Message
  </button>
</form>
  </div>
</div>
      </div>

      <Footer />
    </>
  );
}

export default Team;