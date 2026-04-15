import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
                <p className="text-gray-500 mb-8">Last updated: April 14, 2026</p>

                <div className="space-y-8 text-gray-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Clipperzz ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update or modify these terms at any time without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                        <p>
                            Clipperzz provides artificial intelligence-powered tools for video editing, content curation, and related media processing services. We continually strive to improve the Service and may add, modify, or remove features at our discretion.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                        <p>
                            You must create an account to use certain features of the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
                        <p>
                            You agree not to use the Service to:
                        </p>
                        <ul className="list-disc pl-6 mt-4 space-y-2">
                            <li>Process or distribute content that infringes upon the intellectual property rights of others.</li>
                            <li>Upload malicious code, viruses, or harmful materials.</li>
                            <li>Attempt to gain unauthorized access to our systems or user accounts.</li>
                            <li>Violate any applicable local, state, national, or international laws.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Intellectual Property</h2>
                        <p>
                            You retain all rights to the original video content you process through Clipperzz. By using the Service, you grant us a temporary license to process, store, and modify your content solely for the purpose of providing the service to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Limitation of Liability</h2>
                        <p>
                            Clipperzz is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <p>© 2026 Clipperzz. All rights reserved.</p>
                    <Link to="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">Read our Privacy Policy</Link>
                </div>
            </div>
        </div>
    );
};

export default Terms;
