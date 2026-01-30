import { Star } from "lucide-react";
import { useEffect, useRef } from "react";

const testimonials = [
    {
        quote: "Clipperzz cut my editing time by 80%. What used to take a full day now takes 30 minutes.",
        name: "Alex Chen",
        role: "YouTube Creator",
        platform: "YouTube",
        initials: "AC",
        color: "bg-green-500",
    },
    {
        quote: "The AI actually understands what makes a good clip. My engagement went up 3x since switching.",
        name: "Sarah Martinez",
        role: "Podcast Host",
        platform: "TikTok",
        initials: "SM",
        color: "bg-amber-500",
    },
    {
        quote: "We process 50+ videos weekly. Clipperzz is the backbone of our content operation now.",
        name: "David Kim",
        role: "Content Agency",
        platform: "Instagram",
        initials: "DK",
        color: "bg-green-600",
    },
    {
        quote: "Perfect for repurposing course content. The subtitle quality is incredible.",
        name: "Emily Ross",
        role: "Course Creator",
        platform: "YouTube",
        initials: "ER",
        color: "bg-pink-500",
    },
    {
        quote: "Finally, a tool that understands retention. Our Shorts are performing better than ever.",
        name: "Marcus Johnson",
        role: "Media Company",
        platform: "Shorts",
        initials: "MJ",
        color: "bg-blue-500",
    },
    {
        quote: "As a solo creator, this is like having an editor on staff. Game changer.",
        name: "Lisa Wang",
        role: "Solo Creator",
        platform: "Reels",
        initials: "LW",
        color: "bg-green-500",
    },
];

// Duplicate for seamless loop
const allTestimonials = [...testimonials, ...testimonials];

const Testimonials = () => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId;
        let scrollPos = 0;
        const speed = 0.5; // pixels per frame

        const scroll = () => {
            scrollPos += speed;

            // Reset when we've scrolled half (the duplicated content)
            if (scrollPos >= scrollContainer.scrollWidth / 2) {
                scrollPos = 0;
            }

            scrollContainer.scrollLeft = scrollPos;
            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);

        // Pause on hover
        const handleMouseEnter = () => cancelAnimationFrame(animationId);
        const handleMouseLeave = () => {
            animationId = requestAnimationFrame(scroll);
        };

        scrollContainer.addEventListener("mouseenter", handleMouseEnter);
        scrollContainer.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationId);
            scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
            scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <section id="reviews" className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                        Trusted by Creators Who Publish at Scale
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Join thousands of creators using <span className="text-primary">Clipperzz</span> to grow their audience.
                    </p>
                </div>
            </div>

            {/* Carousel Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-hidden cursor-grab active:cursor-grabbing px-6"
                style={{ scrollBehavior: "auto" }}
            >
                {allTestimonials.map((testimonial, index) => (
                    <div
                        key={`${testimonial.name}-${index}`}
                        className="flex-shrink-0 w-[350px] group bg-card rounded-2xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                    >
                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                        </div>

                        {/* Quote */}
                        <p className="text-foreground mb-6 leading-relaxed text-sm">
                            "{testimonial.quote}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center text-white text-sm font-semibold`}>
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                {testimonial.platform}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
