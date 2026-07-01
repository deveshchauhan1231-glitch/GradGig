import { Link } from "react-router-dom"

function Footer() {
  return (
    <>
      <footer class="bg-white dark:bg-gray-900 ">
        <div class="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <div class="text-teal-600 dark:text-teal-300">
                <svg className=" size-20" viewBox="0 0 400 400" role="img" xmlns="http://www.w3.org/2000/svg">



                  <rect x="20" y="20" width="360" height="360" rx="80" fill="#0d1540" />


                  <rect x="70" y="220" width="60" height="120" rx="16" fill="#ffffff" opacity="0.35" />
                  <rect x="170" y="160" width="60" height="180" rx="16" fill="#ffffff" opacity="0.65" />
                  <rect x="270" y="110" width="60" height="230" rx="16" fill="#3d52e6" />


                  <polygon points="300,42 360,72 300,96 240,72" fill="#ffffff" />

                  <polygon points="240,72 300,96 360,72 360,82 300,106 240,82" fill="#b0bce8" opacity="0.6" />

                  <circle cx="354" cy="70" r="7" fill="#3d52e6" />
                  <line x1="354" y1="77" x2="364" y2="104" stroke="#3d52e6" stroke-width="5" stroke-linecap="round" />
                  <rect x="357" y="102" width="14" height="7" rx="2" fill="#3d52e6" />

                </svg>
              </div>

              <p class="mt-4 max-w-xs text-gray-500 dark:text-gray-400">
                Build your portfolio.
                Earn on your terms.
                Launch your career before graduation.
              </p>

              <ul class="mt-8 flex gap-6">
                <li>
                  <a
                    href="https://github.com/deveshchauhan1231-glitch"
                    rel="noreferrer"
                    target="_blank"
                    class="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    <span class="sr-only">GitHub</span>

                    <svg class="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </li>


                <li>
                  <a
                    href="https://www.linkedin.com/in/devesh-chauhan1231/"
                    rel="noreferrer"
                    target="_blank"
                    class="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    <span class="sr-only">Linked in</span>

                    <svg fill="#FFFFFF" class="size-5" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45.959 45.959" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M5.392,0.492C2.268,0.492,0,2.647,0,5.614c0,2.966,2.223,5.119,5.284,5.119c1.588,0,2.956-0.515,3.957-1.489 c0.96-0.935,1.489-2.224,1.488-3.653C10.659,2.589,8.464,0.492,5.392,0.492z M7.847,7.811C7.227,8.414,6.34,8.733,5.284,8.733 C3.351,8.733,2,7.451,2,5.614c0-1.867,1.363-3.122,3.392-3.122c1.983,0,3.293,1.235,3.338,3.123 C8.729,6.477,8.416,7.256,7.847,7.811z"></path> <path d="M0.959,45.467h8.988V12.422H0.959V45.467z M2.959,14.422h4.988v29.044H2.959V14.422z"></path> <path d="M33.648,12.422c-4.168,0-6.72,1.439-8.198,2.792l-0.281-2.792H15v33.044h9.959V28.099c0-0.748,0.303-2.301,0.493-2.711 c1.203-2.591,2.826-2.591,5.284-2.591c2.831,0,5.223,2.655,5.223,5.797v16.874h10v-18.67 C45.959,16.92,39.577,12.422,33.648,12.422z M43.959,43.467h-6V28.593c0-4.227-3.308-7.797-7.223-7.797 c-2.512,0-5.358,0-7.099,3.75c-0.359,0.775-0.679,2.632-0.679,3.553v15.368H17V14.422h6.36l0.408,4.044h1.639l0.293-0.473 c0.667-1.074,2.776-3.572,7.948-3.572c4.966,0,10.311,3.872,10.311,12.374V43.467z"></path> </g> </g> </g></svg>

                  </a>
                </li>



              </ul>
            </div>

            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Services</p>

                <ul class="mt-6 space-y-4 text-sm">
                  <li>
                    <a href="/post-gig" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      Post a Gig
                    </a>
                  </li>

                  <li>
                    <a href="/find-gig" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      Browse Gigs
                    </a>
                  </li>

                  <li>
                    <a href="/browse-profiles" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      Browse Freelancers
                    </a>
                  </li>

                  <li>
                    <a href="/about" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      How it works
                    </a>
                  </li>



                </ul>
              </div>

              <div>
                <p class="font-medium text-gray-900 dark:text-white">Company</p>

                <ul class="mt-6 space-y-4 text-sm">
                  <li>
                    <Link to="/about" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      About
                    </Link>
                  </li>

                  <li>
                    <Link to="/team" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      Meet the Developer
                    </Link>
                  </li>

                </ul>
              </div>

              <div>
                <p class="font-medium text-gray-900 dark:text-white">Helpful Links</p>

                <ul class="mt-6 space-y-4 text-sm">
                  <li>
                    <a href="/help#contact" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      Contact
                    </a>
                  </li>

                  <li>
                    <a href="/help#faq" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      FAQs
                    </a>
                  </li>

                </ul>
              </div>

              <div>
                <p class="font-medium text-gray-900 dark:text-white">Legal</p>

                <ul class="mt-6 space-y-4 text-sm">
                  <li>
                    <a href="/help" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      Terms of Service
                    </a>
                  </li>

                  <li>
                    <a href="/help#privacy-policy" class="text-gray-700 transition hover:opacity-75 dark:text-gray-200">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p class="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()}. GradGig. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

export default Footer