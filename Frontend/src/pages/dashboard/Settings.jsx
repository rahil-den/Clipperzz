import { useState, useRef } from "react";
import { User, Bell, Shield, Palette, Globe, Trash2, Camera, Link, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/dashboard-user/Button";
import { cn } from "../../lib/utils";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
        weekly: true,
    });
    const [connectedAccounts, setConnectedAccounts] = useState({
        youtube: false,
        google: true,
    });
    const [emailError, setEmailError] = useState("");
    const [passwordErrors, setPasswordErrors] = useState({
        current: "",
        new: "",
        confirm: "",
    });
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const bioRef = useRef(null);
    const currentPasswordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "appearance", label: "Appearance", icon: Palette },
    ];

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        if (!email) {
            setEmailError("Email is required");
        } else if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError("");
        }
    };

    const handleSaveChanges = () => {
        const email = emailRef.current?.value;

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email address");
            return;
        }

        const profileData = {
            firstName: firstNameRef.current?.value,
            lastName: lastNameRef.current?.value,
            email: email,
            bio: bioRef.current?.value,
            connectedAccounts,
        };
        console.log("Profile Data Saved:", profileData);
        setEmailError("");
    };

    const validatePassword = (password) => {
        const errors = [];
        if (password.length < 8) errors.push("At least 8 characters");
        if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
        if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
        if (!/[0-9]/.test(password)) errors.push("One number");
        if (!/[!@#$%^&*]/.test(password)) errors.push("One special character (!@#$%^&*)");
        return errors;
    };

    const handleUpdatePassword = () => {
        const currentPassword = currentPasswordRef.current?.value;
        const newPassword = newPasswordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;

        let hasError = false;
        const errors = { current: "", new: "", confirm: "" };

        if (!currentPassword) {
            errors.current = "Current password is required";
            hasError = true;
        }

        if (!newPassword) {
            errors.new = "New password is required";
            hasError = true;
        } else {
            const passwordValidation = validatePassword(newPassword);
            if (passwordValidation.length > 0) {
                errors.new = `Missing: ${passwordValidation.join(", ")}`;
                hasError = true;
            }
        }

        if (!confirmPassword) {
            errors.confirm = "Please confirm your password";
            hasError = true;
        } else if (newPassword !== confirmPassword) {
            errors.confirm = "Passwords do not match";
            hasError = true;
        }

        setPasswordErrors(errors);

        if (!hasError) {
            console.log("Password Updated Successfully", { currentPassword, newPassword });
            setPasswordSuccess(true);
            setTimeout(() => setPasswordSuccess(false), 3000);
            currentPasswordRef.current.value = "";
            newPasswordRef.current.value = "";
            confirmPasswordRef.current.value = "";
        }
    };

    const handleConnectAccount = (account) => {
        setConnectedAccounts((prev) => ({
            ...prev,
            [account]: !prev[account],
        }));
        console.log(`${account} ${connectedAccounts[account] ? "Disconnected" : "Connected"}`);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account preferences</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-56 shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-100 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-gray-600 hover:bg-gray-50"
                                )}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    {activeTab === "profile" && (
                        <>
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>

                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative">
                                        <img
                                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                                            alt="Avatar"
                                            className="w-20 h-20 rounded-full"
                                        />
                                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors">
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Profile Photo</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input
                                            ref={firstNameRef}
                                            type="text"
                                            defaultValue="Alex"
                                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input
                                            ref={lastNameRef}
                                            type="text"
                                            defaultValue="Johnson"
                                            className="w-full h-10 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            ref={emailRef}
                                            type="email"
                                            defaultValue="alex@example.com"
                                            onChange={handleEmailChange}
                                            className={cn(
                                                "w-full h-10 px-4 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent",
                                                emailError ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-emerald-500"
                                            )}
                                        />
                                        {emailError && (
                                            <div className="flex items-center gap-1 mt-1.5 text-red-500">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                <span className="text-xs">{emailError}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                        <textarea
                                            ref={bioRef}
                                            rows={3}
                                            defaultValue="Content creator and marketer."
                                            className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={handleSaveChanges}
                                        className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Link className="w-5 h-5 text-emerald-500" />
                                    <h2 className="text-lg font-semibold text-gray-900">Connected Accounts</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">YouTube</p>
                                                <p className="text-xs text-gray-500">
                                                    {connectedAccounts.youtube ? "Connected" : "Import videos directly from YouTube"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleConnectAccount("youtube")}
                                            className={cn(
                                                "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                                                connectedAccounts.youtube
                                                    ? "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                                                    : "bg-red-600 text-white hover:bg-red-700"
                                            )}
                                        >
                                            {connectedAccounts.youtube ? "Disconnect" : "Connect"}
                                        </button>
                                    </div>

                                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Google</p>
                                                <p className="text-xs text-gray-500">
                                                    {connectedAccounts.google ? "Connected as alex@gmail.com" : "Sign in with Google"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleConnectAccount("google")}
                                            className={cn(
                                                "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                                                connectedAccounts.google
                                                    ? "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
                                                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                                            )}
                                        >
                                            {connectedAccounts.google ? "Disconnect" : "Connect"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "notifications" && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                            <div className="space-y-6">
                                {[
                                    { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                                    { key: "push", label: "Push Notifications", desc: "Browser push notifications" },
                                    { key: "marketing", label: "Marketing Emails", desc: "Receive promotional content" },
                                    { key: "weekly", label: "Weekly Digest", desc: "Get a weekly summary" },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{item.label}</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                                            className={cn(
                                                "relative w-11 h-6 rounded-full transition-colors duration-200",
                                                notifications[item.key] ? "bg-emerald-500" : "bg-gray-200"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200",
                                                    notifications[item.key] ? "left-6" : "left-1"
                                                )}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>

                                {passwordSuccess && (
                                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-6 text-emerald-700">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">Password updated successfully!</span>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                        <div className="relative">
                                            <input
                                                ref={currentPasswordRef}
                                                type={showPassword.current ? "text" : "password"}
                                                className={cn(
                                                    "w-full h-10 px-4 pr-10 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent",
                                                    passwordErrors.current ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-emerald-500"
                                                )}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.current && (
                                            <div className="flex items-center gap-1 mt-1.5 text-red-500">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                <span className="text-xs">{passwordErrors.current}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                        <div className="relative">
                                            <input
                                                ref={newPasswordRef}
                                                type={showPassword.new ? "text" : "password"}
                                                className={cn(
                                                    "w-full h-10 px-4 pr-10 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent",
                                                    passwordErrors.new ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-emerald-500"
                                                )}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.new && (
                                            <div className="flex items-center gap-1 mt-1.5 text-red-500">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                <span className="text-xs">{passwordErrors.new}</span>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1.5">
                                            Must be 8+ chars with uppercase, lowercase, number & special character
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                ref={confirmPasswordRef}
                                                type={showPassword.confirm ? "text" : "password"}
                                                className={cn(
                                                    "w-full h-10 px-4 pr-10 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent",
                                                    passwordErrors.confirm ? "border-red-300 focus:ring-red-500" : "border-gray-200 focus:ring-emerald-500"
                                                )}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordErrors.confirm && (
                                            <div className="flex items-center gap-1 mt-1.5 text-red-500">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                <span className="text-xs">{passwordErrors.confirm}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={handleUpdatePassword}
                                        className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-red-200 p-6">
                                <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
                                <p className="text-sm text-gray-500 mb-4">
                                    Once you delete your account, there is no going back. Please be certain.
                                </p>
                                <Button variant="danger">
                                    <Trash2 className="w-4 h-4" />
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    )}

                    {activeTab === "appearance" && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Appearance Settings</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Theme</h3>
                                    <div className="flex gap-4">
                                        {["light", "dark", "system"].map((theme) => (
                                            <button
                                                key={theme}
                                                className={cn(
                                                    "px-6 py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all",
                                                    theme === "light"
                                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                )}
                                            >
                                                {theme}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Language</h3>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select className="w-full md:w-64 h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none">
                                            <option>English (US)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            <option>German</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
