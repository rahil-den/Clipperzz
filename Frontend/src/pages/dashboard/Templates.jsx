import { useState } from "react";
import { Layout, Search, Star, Clock, Play, Sparkles, TrendingUp, Mic, MessageSquare, Zap, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

const Templates = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { id: "all", label: "All Templates", icon: Layout },
        { id: "viral", label: "Viral Hooks", icon: TrendingUp },
        { id: "educational", label: "Educational", icon: Sparkles },
        { id: "podcast", label: "Podcast", icon: Mic },
        { id: "testimonial", label: "Testimonials", icon: MessageSquare },
    ];

    const templates = [
        {
            id: 1,
            title: "Viral Hook Opener",
            description: "Perfect for attention-grabbing intros that stop the scroll",
            thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
            category: "viral",
            uses: 12430,
            duration: "0:15",
            isPremium: false,
        },
        {
            id: 2,
            title: "Educational Explainer",
            description: "Break down complex topics into digestible content",
            thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
            category: "educational",
            uses: 8920,
            duration: "0:30",
            isPremium: true,
        },
        {
            id: 3,
            title: "Podcast Highlight",
            description: "Extract the best moments from your podcast episodes",
            thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop",
            category: "podcast",
            uses: 5670,
            duration: "0:45",
            isPremium: false,
        },
        {
            id: 4,
            title: "Customer Testimonial",
            description: "Showcase social proof with compelling customer stories",
            thumbnail: "https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=300&fit=crop",
            category: "testimonial",
            uses: 4230,
            duration: "0:20",
            isPremium: true,
        },
        {
            id: 5,
            title: "Tutorial Teaser",
            description: "Create engaging previews for your tutorial content",
            thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
            category: "educational",
            uses: 3450,
            duration: "0:25",
            isPremium: false,
        },
        {
            id: 6,
            title: "Interview Clips",
            description: "Capture the most impactful interview moments",
            thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop",
            category: "podcast",
            uses: 2890,
            duration: "0:35",
            isPremium: true,
        },
        {
            id: 7,
            title: "Trend Reaction",
            description: "Quick reaction clips for trending topics",
            thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop",
            category: "viral",
            uses: 6780,
            duration: "0:10",
            isPremium: false,
        },
        {
            id: 8,
            title: "Success Story",
            description: "Before/after transformation narratives",
            thumbnail: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop",
            category: "testimonial",
            uses: 1980,
            duration: "0:40",
            isPremium: false,
        },
    ];

    const filteredTemplates = templates.filter((t) => {
        const matchesCategory = activeCategory === "all" || t.category === activeCategory;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatUses = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
        return num.toString();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 font-['Satoshi',sans-serif]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
                    <p className="text-gray-500 mt-1">Pre-built clip styles to jumpstart your content</p>
                </div>
                <button className="flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm">
                    <Plus className="w-4 h-4" />
                    Request Template
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search templates..."
                        className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                    activeCategory === category.id
                                        ? "bg-emerald-500 text-white shadow-sm"
                                        : "bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {category.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTemplates.map((template) => (
                    <div
                        key={template.id}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="relative aspect-video">
                            <img
                                src={template.thumbnail}
                                alt={template.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                    <Play className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" />
                                </button>
                            </div>
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {template.duration}
                            </div>
                            {template.isPremium && (
                                <div className="absolute top-2 left-2 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-md">
                                    <Zap className="w-3 h-3" />
                                    Pro
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-1">{template.title}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <TrendingUp className="w-3 h-3" />
                                    {formatUses(template.uses)} uses
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                                    Use Template
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTemplates.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Layout className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
                    <p className="text-gray-500 mb-4">Try selecting a different category or search term</p>
                    <button
                        onClick={() => {
                            setActiveCategory("all");
                            setSearchQuery("");
                        }}
                        className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            <div
                className="rounded-2xl border p-6 flex items-center justify-between"
                style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)",
                    borderColor: "rgba(16, 185, 129, 0.2)",
                }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Can't find what you need?</h3>
                        <p className="text-gray-500 text-sm">Let us know and we'll create custom templates for you</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 h-10 px-5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm">
                    Request Custom Template
                </button>
            </div>
        </div>
    );
};

export default Templates;
