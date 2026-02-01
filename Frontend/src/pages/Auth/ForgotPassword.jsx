import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Star, Mail } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("[ForgotPassword.jsx] Reset Link Sent:", {
            email: email,
            sentAt: new Date().toISOString(),
        });
        setIsSubmitted(true);
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
                            Reset your<br />password
                        </h1>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs">
                            Don't worry, we'll send you a link to reset your password
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

                {/* Right Panel - Form */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
                    <div className="w-full max-w-sm">
                        {!isSubmitted ? (
                            <>
                                {/* Header */}
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">Forgot password?</h2>
                                    <p className="text-sm text-gray-500">No worries, we'll send you reset instructions</p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                                    >
                                        Send Reset Link
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </form>

                                {/* Back to Login */}
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-6 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to login
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Success State */}
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Mail className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
                                    <p className="text-sm text-gray-500 mb-6">
                                        We sent a password reset link to<br />
                                        <span className="font-medium text-gray-700">{email}</span>
                                    </p>

                                    <button
                                        onClick={() => {
                                            console.log("[ForgotPassword.jsx] Resend Link clicked for:", email);
                                            alert("Reset link resent!");
                                        }}
                                        className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 mb-4"
                                    >
                                        Resend Email
                                    </button>

                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to login
                                    </Link>
                                </div>
                            </>
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

export default ForgotPassword;
