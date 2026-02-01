import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Star, CheckCircle, RefreshCw } from "lucide-react";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const email = searchParams.get("email") || "your email";

    useEffect(() => {
        // Simulate verification check
        const timer = setTimeout(() => {
            setIsLoading(false);
            // Auto-verify if token exists in URL
            if (searchParams.get("token")) {
                setIsVerified(true);
                console.log("[VerifyEmail.jsx] Email Verified:", {
                    email: email,
                    token: searchParams.get("token"),
                    verifiedAt: new Date().toISOString(),
                });
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [searchParams, email]);

    const handleResendEmail = () => {
        console.log("[VerifyEmail.jsx] Resend Verification Email:", {
            email: email,
            sentAt: new Date().toISOString(),
        });
        alert("Verification email resent! Check console for details.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-['Satoshi',sans-serif] bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
            {/* Decorative Background Elements */}
            <div className="fixed -left-64 -top-64 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[120px]" />
            <div className="fixed -right-64 -bottom-64 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[120px]" />

            {/* Main Card */}
            <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden flex">
                {/* Left Panel - Dark Gradient */}
                <div className="hidden md:flex md:w-[45%] relative overflow-hidden">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

                    {/* Decorative Blurs */}
                    <div className="absolute -left-20 top-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />
                    <div className="absolute -right-20 bottom-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px]" />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center p-8 lg:p-10">
                        {/* Logo */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                                    <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">Clipperz</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                            Verify your<br />email address
                        </h1>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs">
                            We need to confirm your email to activate your account
                        </p>

                        {/* Divider */}
                        <div className="w-12 h-0.5 bg-gray-700 mb-6" />

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                            <div className="pr-6 border-r border-gray-700">
                                <p className="text-xl font-bold text-emerald-400">10K+</p>
                                <p className="text-xs text-gray-500">Creators</p>
                            </div>
                            <div className="pr-6 border-r border-gray-700">
                                <p className="text-xl font-bold text-emerald-400">1M+</p>
                                <p className="text-xs text-gray-500">Clips Made</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="text-xl font-bold text-emerald-400">4.9</p>
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <p className="text-xs text-gray-500 ml-0.5">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Content */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
                    <div className="w-full max-w-sm">
                        {isLoading ? (
                            // Loading State
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying...</h2>
                                <p className="text-sm text-gray-500">Please wait while we verify your email</p>
                            </div>
                        ) : isVerified ? (
                            // Verified State
                            <div className="text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                                <p className="text-sm text-gray-500 mb-6">
                                    Your email has been successfully verified.<br />
                                    You can now access all features.
                                </p>

                                <Link
                                    to="/dashboard"
                                    className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            // Pending Verification State
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Verify your email</h2>
                                <p className="text-sm text-gray-500 mb-6">
                                    We sent a verification link to<br />
                                    <span className="font-medium text-gray-700">{email}</span>
                                </p>

                                <p className="text-xs text-gray-400 mb-4">
                                    Click the link in your email to verify your account
                                </p>

                                <button
                                    onClick={handleResendEmail}
                                    className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 mb-4"
                                >
                                    Resend Verification Email
                                </button>

                                <Link
                                    to="/login"
                                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Back to login
                                </Link>
                            </div>
                        )}

                        {/* Terms - Orange colored */}
                        <p className="text-center text-xs text-gray-400 mt-8">
                            By continuing, you agree to our{" "}
                            <Link to="/terms" className="text-orange-500 hover:text-orange-600 transition-colors">
                                Terms of Service
                            </Link>
                            {" "}and{" "}
                            <Link to="/privacy" className="text-orange-500 hover:text-orange-600 transition-colors">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
