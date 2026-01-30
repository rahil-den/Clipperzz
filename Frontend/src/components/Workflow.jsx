import { Upload, Scan, Share2 } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: Upload,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        hoverIconBg: "group-hover:bg-green-200",
        title: "Upload Long Video",
        description:
            "Drop your podcast, interview, or long-form content. We handle any format.",
    },
    {
        number: "02",
        icon: Scan,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        hoverIconBg: "group-hover:bg-amber-200",
        title: "AI Analyzes & Generates",
        description:
            "Our engine detects high-retention moments and creates platform-ready clips.",
    },
    {
        number: "03",
        icon: Share2,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        hoverIconBg: "group-hover:bg-green-200",
        title: "Export & Publish",
        description:
            "Download clips with subtitles, or publish directly to your channels.",
    },
];

const Workflow = () => {
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                        Simple. Fast. Powerful.
                    </h2>
                    <p className="mt-3 text-base text-hero-secondary text-muted-foreground">
                        From upload to publish in minutes, not hours.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="group relative bg-card rounded-2xl p-6 pt-10 shadow-card border border-border transition-all duration-400 ease-out hover:shadow-xl hover:-translate-y-2 hover:border-primary/20"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            {/* Step Number Badge */}
                            <div className="absolute -top-3 left-6 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                                <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-green-500/30">
                                    {step.number}
                                </span>
                            </div>

                            {/* Icon */}
                            <div
                                className={`w-12 h-12 rounded-xl ${step.iconBg} ${step.hoverIconBg} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                            >
                                <step.icon className={`w-6 h-6 ${step.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
                                {step.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground/80">
                                {step.description}
                            </p>

                            {/* Hover glow effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* Connecting line decoration (visible on desktop) */}
                <div className="hidden md:flex justify-center mt-8">
                    <div className="flex items-center gap-4">
                        {[0, 1].map((i) => (
                            <div
                                key={i}
                                className="w-24 h-0.5 bg-gradient-to-r from-green-500/20 via-green-500/40 to-green-500/20 rounded-full"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Workflow;
