import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How accurate is the AI at detecting high-retention moments?",
        answer: "Our AI has been trained on millions of successful clips and achieves 92% accuracy in identifying high-retention moments. It analyzes viewer patterns, engagement metrics, and content structure to find the best segments.",
    },
    {
        question: "What video formats and platforms do you support?",
        answer: "We support all major video formats including MP4, MOV, AVI, and MKV. You can import from YouTube, Vimeo, TikTok, or upload directly. Export options include formats optimized for YouTube Shorts, Instagram Reels, TikTok, and more.",
    },
    {
        question: "Are there limits on video length or file size?",
        answer: "Free users can upload videos up to 30 minutes and 500MB. Pro users get up to 2 hours and 2GB per video. Studio plans support up to 4 hours and 5GB per video with batch processing capabilities.",
    },
    {
        question: "How long does processing take?",
        answer: "Processing time depends on video length. A 1-hour video typically takes 5-10 minutes with our priority processing (Pro and Studio plans). Free users may experience slightly longer wait times during peak hours.",
    },
    {
        question: "Can I customize subtitle styles and branding?",
        answer: "Yes! Pro and Studio plans include full customization of subtitle fonts, colors, animations, and positioning. You can save brand presets to maintain consistency across all your clips.",
    },
    {
        question: "What happens to my videos after processing?",
        answer: "Your original videos are securely stored for 30 days (90 days for Pro, unlimited for Studio). All data is encrypted and you can delete your content at any time. We never use your content for training without explicit consent.",
    },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-background">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Everything you need to <span className="text-primary">know</span> about Clipperzz.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="max-w-3xl mx-auto space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-primary/20"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-5 text-left transition-colors duration-200 hover:bg-muted/50"
                            >
                                <span className="font-medium text-foreground pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <p className="px-5 pb-5 text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
