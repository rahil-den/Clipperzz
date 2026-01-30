import { Mic, Video, GraduationCap, Building2 } from "lucide-react";

const useCases = [
    {
        icon: Mic,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "Podcasters",
        description: (
            <>
                Turn hour-long episodes into dozens of shareable clips <span className="text-primary font-medium">that drive listeners</span> to your full show.
            </>
        ),
        stats: "Avg. 15 clips per episode",
    },
    {
        icon: Video,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "YouTube Creators",
        description: (
            <>
                Repurpose long-form content into Shorts. Grow your channel <span className="text-primary font-medium">3x faster</span> with consistent short clips.
            </>
        ),
        stats: "2.5x subscriber growth",
    },
    {
        icon: GraduationCap,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "Course Creators",
        description: (
            <>
                Extract key lessons from your courses. Perfect for <span className="text-primary font-medium">marketing and student engagement</span>.
            </>
        ),
        stats: "40% more enrollments",
    },
    {
        icon: Building2,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "Agencies & Teams",
        description: (
            <>
                Scale content operations for <span className="text-primary font-medium">multiple clients</span>. Process hundreds of videos per month.
            </>
        ),
        stats: "80% time saved",
    },
];

const UseCases = () => {
    return (
        <section id="use-cases" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                        Built for Every Creator
                    </h2>
                    <p className="text-base text-muted-foreground">
                        From solo creators to enterprise teams, Clipperzz scales with you.
                    </p>
                </div>

                {/* Use Cases Grid */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {useCases.map((useCase, index) => (
                        <div
                            key={useCase.title}
                            className="group bg-card rounded-2xl border border-border p-8 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-start gap-5">
                                <div className={`w-12 h-12 rounded-xl ${useCase.iconBg} flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                    <useCase.icon className={`w-6 h-6 ${useCase.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
                                        {useCase.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-4 leading-relaxed">
                                        {useCase.description}
                                    </p>
                                    {/* Stats badge with green gradient border */}
                                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-primary/50 transition-all duration-300 group-hover:from-green-500/20 group-hover:to-emerald-500/20 group-hover:border-primary group-hover:scale-105">
                                        <span className="text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                            {useCase.stats}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
