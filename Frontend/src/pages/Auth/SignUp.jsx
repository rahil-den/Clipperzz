import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Star, AlertCircle, Check, Loader2, ChevronDown, Phone } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SignUp = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const dropdownRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        countryCode: "+91",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Country codes list
    const countryCodes = [
        { code: "+91", country: "India", flag: "🇮🇳" },
        { code: "+1", country: "United States", flag: "🇺🇸" },
        { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
        { code: "+61", country: "Australia", flag: "🇦🇺" },
        { code: "+86", country: "China", flag: "🇨🇳" },
        { code: "+81", country: "Japan", flag: "🇯🇵" },
        { code: "+49", country: "Germany", flag: "🇩🇪" },
        { code: "+33", country: "France", flag: "🇫🇷" },
        { code: "+39", country: "Italy", flag: "🇮🇹" },
        { code: "+55", country: "Brazil", flag: "🇧🇷" },
        { code: "+7", country: "Russia", flag: "🇷🇺" },
        { code: "+82", country: "South Korea", flag: "🇰🇷" },
        { code: "+34", country: "Spain", flag: "🇪🇸" },
        { code: "+52", country: "Mexico", flag: "🇲🇽" },
        { code: "+62", country: "Indonesia", flag: "🇮🇩" },
        { code: "+90", country: "Turkey", flag: "🇹🇷" },
        { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    ];

    const filteredCountryCodes = countryCodes.filter(
        (c) =>
            c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
            c.code.includes(countrySearch)
    );

    // Close country dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowCountryDropdown(false);
                setCountrySearch("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Validation functions
    const validateFullName = (name) => {
        if (!name) return "Full name is required";
        if (name.length < 2) return "Name must be at least 2 characters";
        if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
        return "";
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) return "Email is required";
        if (!emailRegex.test(email)) return "Please enter a valid email address";
        return "";
    };

    const validatePhone = (phone) => {
        if (!phone) return ""; // Phone is optional
        if (!/^[0-9]+$/.test(phone)) return "Phone number must contain only digits";
        if (phone.length !== 10) return "Phone number must be exactly 10 digits";
        return "";
    };

    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character";
        return "";
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return "Please confirm your password";
        if (confirmPassword !== password) return "Passwords do not match";
        return "";
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-emerald-500"];

    // Validate on change
    useEffect(() => {
        const newErrors = {};
        if (touched.fullName) {
            const nameError = validateFullName(formData.fullName);
            if (nameError) newErrors.fullName = nameError;
        }
        if (touched.email) {
            const emailError = validateEmail(formData.email);
            if (emailError) newErrors.email = emailError;
        }
        if (touched.phone) {
            const phoneError = validatePhone(formData.phone);
            if (phoneError) newErrors.phone = phoneError;
        }
        if (touched.password) {
            const passwordError = validatePassword(formData.password);
            if (passwordError) newErrors.password = passwordError;
        }
        if (touched.confirmPassword) {
            const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password);
            if (confirmError) newErrors.confirmPassword = confirmError;
        }
        setErrors(newErrors);
    }, [formData, touched]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        // Touch all fields to show errors
        setTouched({ fullName: true, email: true, phone: true, password: true, confirmPassword: true });

        // Validate all fields
        const nameError = validateFullName(formData.fullName);
        const emailError = validateEmail(formData.email);
        const phoneError = validatePhone(formData.phone);
        const passwordError = validatePassword(formData.password);
        const confirmError = validateConfirmPassword(formData.confirmPassword, formData.password);

        if (nameError || emailError || phoneError || passwordError || confirmError) {
            setErrors({
                fullName: nameError,
                email: emailError,
                phone: phoneError,
                password: passwordError,
                confirmPassword: confirmError,
            });
            return;
        }

        setIsLoading(true);
        try {
            await register({
                name: formData.fullName,
                email: formData.email,
                countryCode: formData.countryCode,
                phone: formData.phone || undefined,
                password: formData.password,
            });
            console.log("[SignUp.jsx] Account Created Successfully");
            // Redirect to verify-email page so the user knows to check their inbox
            navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (error) {
            console.error("[SignUp.jsx] Error creating account:", error);
            setApiError(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        console.log("[SignUp.jsx] Google Sign Up initiated");
        alert("Google Sign Up - Check console for details.");
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
                            Create viral<br />clips in minutes
                        </h1>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs">
                            Turn long videos into high-retention short content using AI
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
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Get started free</h2>
                            <p className="text-sm text-gray-500">Create your account in seconds</p>
                        </div>

                        {/* Google Button */}
                        <button
                            onClick={handleGoogleSignUp}
                            className="w-full flex items-center justify-center gap-3 h-11 px-4 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-5">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="John Doe"
                                    className={`w-full h-11 px-4 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.fullName
                                        ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                        : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        }`}
                                />
                                {errors.fullName && (
                                    <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs">{errors.fullName}</span>
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="you@example.com"
                                    className={`w-full h-11 px-4 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.email
                                        ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                        : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        }`}
                                />
                                {errors.email && (
                                    <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs">{errors.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-gray-400 font-normal">(optional)</span></label>
                                <div className="flex gap-2">
                                    {/* Country Code Dropdown */}
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                            className="flex items-center gap-1 h-11 px-3 text-sm bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-w-[90px]"
                                        >
                                            <span className="text-base">{countryCodes.find(c => c.code === formData.countryCode)?.flag || "🌍"}</span>
                                            <span className="text-gray-700 font-medium">{formData.countryCode}</span>
                                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showCountryDropdown ? "rotate-180" : ""}`} />
                                        </button>
                                        {/* Dropdown */}
                                        {showCountryDropdown && (
                                            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                                {/* Search */}
                                                <div className="p-2 border-b border-gray-100">
                                                    <input
                                                        type="text"
                                                        value={countrySearch}
                                                        onChange={(e) => setCountrySearch(e.target.value)}
                                                        placeholder="Search country..."
                                                        className="w-full h-8 px-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                        autoFocus
                                                    />
                                                </div>
                                                {/* Options */}
                                                <div className="max-h-48 overflow-y-auto">
                                                    {filteredCountryCodes.map((c) => (
                                                        <button
                                                            key={c.code}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, countryCode: c.code });
                                                                setShowCountryDropdown(false);
                                                                setCountrySearch("");
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-emerald-50 transition-colors ${
                                                                formData.countryCode === c.code ? "bg-emerald-50 text-emerald-700" : "text-gray-700"
                                                            }`}
                                                        >
                                                            <span className="text-base">{c.flag}</span>
                                                            <span className="flex-1 text-left">{c.country}</span>
                                                            <span className="text-gray-400 font-mono text-xs">{c.code}</span>
                                                        </button>
                                                    ))}
                                                    {filteredCountryCodes.length === 0 && (
                                                        <p className="text-xs text-gray-400 text-center py-3">No country found</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Phone Input */}
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={(e) => {
                                                // Only allow digits, max 10
                                                const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                setFormData({ ...formData, phone: val });
                                            }}
                                            onBlur={handleBlur}
                                            placeholder="9876543210"
                                            className={`w-full h-11 pl-9 pr-4 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                                errors.phone
                                                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                                    : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            }`}
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                                {errors.phone && (
                                    <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs">{errors.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Create a strong password"
                                        className={`w-full h-11 px-4 pr-11 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.password
                                            ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </div>
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all ${i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className={`text-xs ${passwordStrength >= 4 ? "text-emerald-600" : passwordStrength >= 2 ? "text-yellow-600" : "text-red-500"}`}>
                                            Password strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
                                        </p>
                                    </div>
                                )}
                                {errors.password && (
                                    <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs">{errors.password}</span>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Confirm your password"
                                        className={`w-full h-11 px-4 pr-11 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword
                                            ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                            : formData.confirmPassword && formData.confirmPassword === formData.password
                                                ? "border-emerald-400 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.confirmPassword === formData.password && !errors.confirmPassword && (
                                    <div className="flex items-center gap-1.5 mt-1.5 text-emerald-500">
                                        <Check className="w-3.5 h-3.5" />
                                        <span className="text-xs">Passwords match</span>
                                    </div>
                                )}
                                {errors.confirmPassword && (
                                    <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs">{errors.confirmPassword}</span>
                                    </div>
                                )}
                            </div>

                            {/* API Error Message */}
                            {apiError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{apiError}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center text-sm text-gray-500 mt-5">
                            Already have an account?{" "}
                            <Link to="/login" className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
