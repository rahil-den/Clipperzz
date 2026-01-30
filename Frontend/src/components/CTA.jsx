import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
    return (
        <section className="py-32 bg-hero-gradient relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8 animate-bounce" style={{ animationDuration: "2s" }}>
                        <Sparkles className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Start for free today</span>
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-hero-primary mb-6 leading-tight">
                        Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500">Transform</span> Your Content?
                    </h2>

                    {/* Subtext */}
                    <p className="text-lg text-hero-secondary/80 mb-10 max-w-xl mx-auto leading-relaxed">
                        Join thousands of creators scaling their content with Clipperzz.
                    </p>

                    {/* Single CTA Button */}
                    <Link
                        to="/dashboard"
                        className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-bold text-lg shadow-2xl shadow-green-500/30 transition-all duration-500 hover:shadow-green-500/50 hover:scale-105 active:scale-[0.98] overflow-hidden"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <span className="relative z-10">Start Creating for Free</span>
                        <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
                    </Link>

                    {/* Trust Line */}
                    <p className="mt-8 text-sm text-hero-secondary/60">
                        No credit card required · Free forever tier · Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CTA;
