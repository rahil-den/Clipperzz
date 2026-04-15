import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 p-6 md:p-12 font-['Satoshi',sans-serif]">
            {/* Header */}
            <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Home</span>
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                            <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Clipperzz</span>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <p className="text-gray-500 mb-8">Last updated: April 14, 2026</p>

                <div className="space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Name, email address, and authentication credentials.</li>
                            <li>Video files, audio files, and other media you upload for processing.</li>
                            <li>Usage data, including how you interact with our tools and features.</li>
                            <li>Device and connection information, such as IP address and browser type.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to operate, maintain, and improve our services. Specifically, we use your data to:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Process your video content using our AI algorithms.</li>
                            <li>Provide customer support and respond to your requests.</li>
                            <li>Send administrative messages, security alerts, and service updates.</li>
                            <li>Analyze usage metrics to optimize platform performance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Media Processing and Storage</h2>
                        <p>
                            Your uploaded media files are securely stored on our cloud infrastructure. We process these files temporarily to generate clips and outputs. We retain your resulting clips according to your subscription plan. You can delete your content at any time through your dashboard.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
                        <p>
                            We do not sell your personal information or media content. We may share data with trusted third-party service providers who assist us in operating our platform, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information and media files. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                        <p>
                            You have the right to access, update, or delete your personal information at any time. If you wish to permanently delete your account and all associated data, you may do so from your account settings or by contacting our support team.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <p>© 2026 Clipperzz. All rights reserved.</p>
                    <Link to="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">Read our Terms of Service</Link>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
