import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowRight, Star, CheckCircle, RefreshCw, XCircle, Mail } from "lucide-react";
import { verifyEmail as apiVerifyEmail, resendVerification as apiResendVerification } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const [status, setStatus] = useState("idle"); // idle | verifying | success | error | pending
    const [errorMessage, setErrorMessage] = useState("");
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    // Auto-verify when a token is present in the URL
    const runVerification = useCallback(async () => {
        if (!token) {
            // No token — user just registered and is waiting to click the email link
            setStatus("pending");
            return;
        }

        setStatus("verifying");
        try {
            const data = await apiVerifyEmail(token);
            // data = { message, token (JWT), user }
            if (data.user) {
                setUser(data.user);
            }
            setStatus("success");

            // Give the user 2 s to see the success animation, then redirect
            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 2000);
        } catch (err) {
            setErrorMessage(
                err.response?.data?.message ||
                "Verification failed. The link may have expired. Please request a new one."
            );
            setStatus("error");
        }
    }, [token, navigate, setUser]);

    useEffect(() => {
        runVerification();
    }, [runVerification]);

    const handleResend = async () => {
        if (!email) {
            setResendMessage("Please enter your email to resend the verification link.");
            return;
        }
        setResendLoading(true);
        setResendMessage("");
        try {
            const data = await apiResendVerification(email);
            setResendMessage(data.message || "Verification email sent! Check your inbox.");
        } catch (err) {
            setResendMessage(
                err.response?.data?.message || "Failed to resend. Please try again."
            );
        } finally {
            setResendLoading(false);
        }
    };

    // ── Render helpers ────────────────────────────────────────────────────────
    const LeftPanel = () => (
        <div className="hidden md:flex md:w-[45%] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
            <div className="absolute -left-20 top-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />
            <div className="absolute -right-20 bottom-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px]" />

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

                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                    Verify your<br />email address
                </h1>
                <p className="text-gray-400 text-sm mb-8 max-w-xs">
                    We need to confirm your email to activate your account
                </p>

                <div className="w-12 h-0.5 bg-gray-700 mb-6" />

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
    );

    const renderContent = () => {
        switch (status) {
            // ── Verifying (spinner) ───────────────────────────────────────────
            case "verifying":
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying your email…</h2>
                        <p className="text-sm text-gray-500">Please hold on for a moment</p>
                    </div>
                );

            // ── Success ───────────────────────────────────────────────────────
            case "success":
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Email Verified! 🎉</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Your account is now active.<br />
                            Redirecting you to your dashboard…
                        </p>
                        <Link
                            to="/dashboard"
                            className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                        >
                            Go to Dashboard
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                );

            // ── Error ─────────────────────────────────────────────────────────
            case "error":
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>

                        {/* Resend */}
                        <button
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 mb-3"
                        >
                            {resendLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                            {resendLoading ? "Sending…" : "Resend Verification Email"}
                        </button>

                        {resendMessage && (
                            <p className="text-xs text-emerald-600 mb-3">{resendMessage}</p>
                        )}

                        <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                            Back to login
                        </Link>
                    </div>
                );

            // ── Pending (user just registered — no token in URL yet) ───────────
            case "pending":
            default:
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
                        <p className="text-sm text-gray-500 mb-2">
                            We sent a verification link to
                        </p>
                        {email && (
                            <p className="text-sm font-semibold text-gray-800 mb-6">{email}</p>
                        )}
                        <p className="text-xs text-gray-400 mb-6">
                            Click the link in your email to verify your account (it expires in 24 h).
                        </p>

                        <button
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 mb-4"
                        >
                            {resendLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                            {resendLoading ? "Sending…" : "Resend Verification Email"}
                        </button>

                        {resendMessage && (
                            <p className="text-xs text-emerald-600 mb-3">{resendMessage}</p>
                        )}

                        <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                            Back to login
                        </Link>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-['Satoshi',sans-serif] bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
            {/* Decorative Background */}
            <div className="fixed -left-64 -top-64 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[120px]" />
            <div className="fixed -right-64 -bottom-64 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[120px]" />

            {/* Main Card */}
            <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden flex">
                <LeftPanel />

                {/* Right Panel */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
                    <div className="w-full max-w-sm">
                        {renderContent()}

                        {/* Terms */}
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
