import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import hero from '/hero.svg'
function Home() {
  return (
    <>
      <Navbar />
      <div classNameName="flex flex-col items-center justify-center gap-4">
        <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
          <div
            className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-4 lg:px-8 lg:py-32"
          >
            <div className="max-w-prose text-left">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Where <strong className="text-blue-800"> Students Work </strong> Where <strong className="text-blue-800"> Clients Win </strong>


              </h1>

              <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                GradGig connects ambitious students with real projects —
                build your portfolio, earn on your terms, and launch your career
                before graduation day.</p>

              <div className="mt-4 flex gap-4 sm:mt-6">
                <a
                  className="inline-block rounded border border-blue-800 bg-blue-800 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-blue-900"
                  href="#"
                >
                  Get Started
                </a>

                <a
                  className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
                  href="#"
                >
                  Learn More
                </a>
              </div>
            </div>
            <img src={hero} alt="hero" className="mt-10 w-full max-w-lg sm:mt-16 md:mt-0 md:max-w-none" />
            
          </div>
        </section>
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-6 lg:gap-8 mb-12 px-4 sm:px-6 lg:px-8">
          <a href="#" className="block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6 hover:border-gray-400 hover:ring-1 hover:ring-gray-400 focus:outline-none focus:ring transform transition-all duration-300 ease-out hover:scale-105">
            <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
              <div className="sm:order-last sm:shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-15">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>

              </div>

              <div className="mt-4 sm:mt-0">
                <h1 className="text-3xl font-bold text-pretty text-gray-900">
                  For Students
                </h1>

                {/* <p className="mt-1 text-sm text-gray-700">By John Doe</p> */}

                <p className="mt-4 line-clamp-2 text-sm text-pretty text-gray-700">
                  Whether you want to build cv, earn money or hire other students, we have a solution for you.
                </p>
              </div>
            </div>
            {/* 
            <dl className="mt-6 flex gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <dt className="text-gray-700">
                  <span className="sr-only"> Published on </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                </dt>

                <dd className="text-xs text-gray-700">31/06/2025</dd>
              </div>

              <div className="flex items-center gap-2">
                <dt className="text-gray-700">
                  <span className="sr-only"> Reading time </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </dt>

                <dd className="text-xs text-gray-700">12 minutes</dd>
              </div>
            </dl> */}
          </a>
          <a href="#" className="block rounded-md border border-gray-300 p-4 shadow-sm sm:p-6 hover:border-gray-400 hover:ring-1 hover:ring-gray-400 focus:outline-none focus:ring transform transition-all duration-300 ease-out hover:scale-105">
            <div className="sm:flex sm:justify-between sm:gap-4 lg:gap-6">
              <div className="sm:order-last sm:shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-15">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                </svg>

              </div>

              <div className="mt-4 sm:mt-0">
                <h1 className="text-3xl font-bold text-pretty text-gray-900">
                  For Employers
                </h1>

                {/* <p className="mt-1 text-sm text-gray-700">By John Doe</p> */}

                <p className="mt-4 line-clamp-2 text-m text-pretty text-gray-700">
                  Access a pool of vetted students and hire them for your projects. We make sure you get the best talent for your needs.
                </p>
              </div>
            </div>
            {/* 
            <dl className="mt-6 flex gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <dt className="text-gray-700">
                  <span className="sr-only"> Published on </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                </dt>

                <dd className="text-xs text-gray-700">31/06/2025</dd>
              </div>

              <div className="flex items-center gap-2">
                <dt className="text-gray-700">
                  <span className="sr-only"> Reading time </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </dt>

                <dd className="text-xs text-gray-700">12 minutes</dd>
              </div>
            </dl> */}
          </a>
        </div>
      </div>
      <Footer />
    </>

  )
}

export default Home
