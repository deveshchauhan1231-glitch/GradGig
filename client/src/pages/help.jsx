import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Help() {
    return (
        <>
            <Navbar />
            <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-3xl gap-8 flex flex-col justify-center align-items-center">
                <section id="terms-of-service">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <ul class="space-y-4 text-gray-700">
                        <li>
                            <strong>1. Acceptance of Terms</strong>
                            <p class="mt-1">By accessing or using GradGig, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
                        </li>
                        <li>
                            <strong>2. Who Can Use GradGig</strong>
                            <p class="mt-1">GradGig is open to college students as freelancers and to anyone seeking to hire for project-based work. You must provide accurate information during registration.</p>
                        </li>
                        <li>
                            <strong>3. GradGig's Role</strong>
                            <p class="mt-1">GradGig is strictly a connection platform. We facilitate discovery between clients and student freelancers. We do not participate in, manage, or oversee any agreements, contracts, or transactions made between users.</p>
                        </li>
                        <li>
                            <strong>4. Payments & Disputes</strong>
                            <p class="mt-1">All payment arrangements are solely between the client and the freelancer. GradGig is not a party to any financial transaction and holds no liability for payment failures, fraud, or disputes arising from user agreements.</p>
                        </li>
                        <li>
                            <strong>5. User Conduct</strong>
                            <p class="mt-1">Users are expected to behave honestly and professionally. Harassment, fraudulent listings, fake reviews, or any form of misconduct is strictly prohibited.</p>
                        </li>
                        <li>
                            <strong>6. Reporting & Bans</strong>
                            <p class="mt-1">Any user can report suspicious or fraudulent behavior through the platform. GradGig reserves the right to investigate reports and suspend or permanently ban accounts found in violation of these terms.</p>
                        </li>
                        <li>
                            <strong>7. Intellectual Property</strong>
                            <p class="mt-1">All content, branding, and code on GradGig is the property of GradGig. Users retain ownership of work they produce or commission through the platform.</p>
                        </li>
                        <li>
                            <strong>8. Limitation of Liability</strong>
                            <p class="mt-1">GradGig is not liable for any loss, damage, or dispute arising from interactions between users on the platform. Use GradGig at your own discretion.</p>
                        </li>
                        <li>
                            <strong>9. Changes to Terms</strong>
                            <p class="mt-1">We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
                        </li>
                    </ul>
                </section>
                <span class="flex items-center">
                    <span class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>


                    <span class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
                </span>
                <section id="privacy-policy" className="mt-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-5">Privacy Policy</h1>
                    <ul class="space-y-4 text-gray-700">
                        <li>
                            <strong>1. Information We Collect</strong>
                            <p class="mt-1">We collect basic information during registration including your name, email address, and profile details. We also collect usage data to improve platform experience.</p>
                        </li>
                        <li>
                            <strong>2. How We Use Your Information</strong>
                            <p class="mt-1">Your information is used solely to operate and improve GradGig — to manage your account, display your profile to relevant users, and send important platform notifications.</p>
                        </li>
                        <li>
                            <strong>3. Authentication</strong>
                            <p class="mt-1">GradGig uses Clerk for secure authentication. We do not store raw passwords. All auth data is handled by Clerk in accordance with their privacy standards.</p>
                        </li>
                        <li>
                            <strong>4. Data Sharing</strong>
                            <p class="mt-1">We do not sell, rent, or share your personal data with any third party for marketing or commercial purposes. Your data stays on GradGig.</p>
                        </li>
                        <li>
                            <strong>5. Payments</strong>
                            <p class="mt-1">Since GradGig does not handle payments, we do not collect or store any financial information such as bank details or card numbers.</p>
                        </li>
                        <li>
                            <strong>6. Cookies</strong>
                            <p class="mt-1">GradGig may use cookies to maintain sessions and improve user experience. You can control cookie preferences through your browser settings.</p>
                        </li>
                        <li>
                            <strong>7. Data Security</strong>
                            <p class="mt-1">We try our best to protect your data. However, no system is completely immune — use the platform responsibly.</p>
                        </li>
                        <li>
                            <strong>8. Your Rights</strong>
                            <p class="mt-1">You have the right to access, update, or delete your account and associated data at any time through your profile settings.</p>
                        </li>
                        <li>
                            <strong>9. Changes to This Policy</strong>
                            <p class="mt-1">We may update this Privacy Policy from time to time. We will notify users of significant changes via email or platform notifications.</p>
                        </li>
                    </ul>
                </section>
                <span class="flex items-center">
                    <span class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>


                    <span class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
                </span>
                <section id="faq" class="flow-root mt-8">
                    <h1 class="text-2xl font-bold text-gray-900 text-3xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h1>
                    <div class="-my-4 flex flex-col divide-y divide-gray-200">

                        <details class="group py-4 [&_summary::-webkit-details-marker]:hidden" open>
                            <summary class="flex items-center justify-between gap-1.5 text-gray-900">
                                <h2 class="text-lg font-medium">What is GradGig?</h2>
                                <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p class="pt-4 text-gray-900">GradGig is a freelance marketplace built exclusively for students. It connects clients with skilled student freelancers — making it easier to find the right person for the job.</p>
                        </details>

                        <details class="group py-4 [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex items-center justify-between gap-1.5 text-gray-900">
                                <h2 class="text-lg font-medium">Who can join GradGig?</h2>
                                <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p class="pt-4 text-gray-900">Any college student can sign up as a freelancer, and anyone looking to get work done can post as a client.</p>
                        </details>

                        <details class="group py-4 [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex items-center justify-between gap-1.5 text-gray-900">
                                <h2 class="text-lg font-medium">What kind of work can I find here?</h2>
                                <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p class="pt-4 text-gray-900">Web development, graphic design, content writing, video editing, data entry, ML/AI tasks — if a student can do it, it belongs on GradGig.</p>
                        </details>

                        <details class="group py-4 [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex items-center justify-between gap-1.5 text-gray-900">
                                <h2 class="text-lg font-medium">Does GradGig handle payments?</h2>
                                <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p class="pt-4 text-gray-900">No. GradGig is purely a connection platform. All payment decisions, methods, and transactions happen directly between the client and the freelancer. GradGig is not involved in or liable for any payment-related disputes.</p>
                        </details>

                        <details class="group py-4 [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex items-center justify-between gap-1.5 text-gray-900">
                                <h2 class="text-lg font-medium">What if a payment goes wrong?</h2>
                                <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p class="pt-4 text-gray-900">Since GradGig does not facilitate payments, we are not responsible for payment disputes. We strongly recommend agreeing on payment terms upfront before starting any work. However you can report the issue if it occurs and we will investigate and may ban the user.</p>
                        </details>

                        <details class="group py-4 [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex items-center justify-between gap-1.5 text-gray-900">
                                <h2 class="text-lg font-medium">Can I report a fraudulent or suspicious user?</h2>
                                <svg class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </summary>
                            <p class="pt-4 text-gray-900">Yes. If you encounter a user behaving fraudulently or dishonestly, you can report them directly through the platform. GradGig reviews all reports and reserves the right to suspend or permanently ban users found violating community guidelines.</p>
                        </details>

                    </div>
                </section>
                <span class="flex items-center">
                    <span class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>


                    <span class="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
                </span>
                <section id="contact" className="mt-8">
                    <h1 class="text-3xl font-bold text-gray-900">Contact</h1>
                    <p class="mt-4 text-gray-700">If you have any questions or feedback, please reach out at deveshchauhan1.2.3.1@gmail.com</p>
                </section>
            </div>
            <Footer />
        </>
    )

}
export default Help