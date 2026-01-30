import {
    Sparkles,
    Captions,
    Layers,
    MonitorSmartphone,
    SlidersHorizontal,
    Palette
} from "lucide-react";

const Features = () => {
    return (
        <section id="features" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                        Everything You Need to Scale Content
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Professional tools designed for creators who ship daily.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="max-w-6xl mx-auto">
                    {/* Top Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        {/* Large Feature - AI Moment Detection (spans 2 cols) */}
                        <div className="lg:col-span-2 group">
                            <div className="h-full bg-card rounded-2xl border border-border p-8 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <Sparkles className="w-6 h-6 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-3 transition-colors duration-300 group-hover:text-primary">
                                    AI Moment Detection
                                </h3>
                                <p className="text-muted-foreground mb-8">
                                    Finds segments <span className="text-primary">people actually watch</span>. Our AI analyzes viewer patterns to <span className="text-primary">identify high-retention moments</span>.
                                </p>

                                {/* Progress bars visualization */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <div className="h-3 flex-1 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full w-[35%] bg-green-400/60 rounded-full transition-all duration-500 group-hover:w-[40%]" />
                                        </div>
                                        <span className="text-xs font-medium text-primary w-10">High</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-3 flex-1 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full w-[85%] bg-green-500 rounded-full transition-all duration-500 group-hover:w-[90%]" />
                                        </div>
                                        <span className="text-xs font-medium text-primary w-10">Peak</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-3 flex-1 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full w-[50%] bg-green-400/70 rounded-full transition-all duration-500 group-hover:w-[55%]" />
                                        </div>
                                        <span className="text-xs font-medium text-primary w-10">Good</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subtitle Intelligence */}
                        <div className="group">
                            <div className="h-full bg-card rounded-2xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-secondary/20">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <Captions className="w-5 h-5 text-orange-500 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-secondary">
                                    Subtitle Intelligence
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Clean, readable captions optimized per platform. Auto-styled for maximum engagement.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Row - 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Multi-Clip Extraction */}
                        <div className="group">
                            <div className="h-full bg-card rounded-2xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-secondary/20">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <Layers className="w-5 h-5 text-orange-500 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-secondary">
                                    Multi-Clip Extraction
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    One upload → multiple usable clips. Export dozens of clips from a single video.
                                </p>
                            </div>
                        </div>

                        {/* Platform Presets */}
                        <div className="group">
                            <div className="h-full bg-card rounded-2xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <MonitorSmartphone className="w-5 h-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
                                    Platform Presets
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    TikTok, Shorts, Reels formats out of the box. Perfectly sized for each platform.
                                </p>
                            </div>
                        </div>

                        {/* Precision Timeline Control */}
                        <div className="group">
                            <div className="h-full bg-card rounded-2xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-border">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <SlidersHorizontal className="w-5 h-5 text-gray-500 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-foreground">
                                    Precision Timeline Control
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Fine-tune clips without complexity. Adjust start, end, and transitions with ease.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Brand Consistency Tools */}
                        <div className="group">
                            <div className="h-full bg-card rounded-2xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                    <Palette className="w-5 h-5 text-green-600 transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
                                    Brand Consistency Tools
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Fonts, colors, subtitle styles. Keep your brand consistent across all clips.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
