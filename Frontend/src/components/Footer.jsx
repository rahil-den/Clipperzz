import { Link } from "react-router-dom";
import { Twitter, Youtube, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
    Product: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Use Cases", href: "#use-cases" },
        { label: "API", href: "#" },
    ],
    Company: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
    ],
    Resources: [
        { label: "Help Center", href: "#" },
        { label: "Tutorials", href: "#" },
        { label: "Community", href: "#" },
        { label: "Contact", href: "#" },
    ],
    Legal: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Cookie Policy", href: "#" },
    ],
};

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
];

// Random brand color on hover (green or orange)
const getRandomBrandColor = () => {
    return Math.random() > 0.5 ? "hover:text-green-400" : "hover:text-orange-400";
};

const Footer = () => {
    return (
        <footer className="bg-hero-gradient border-t border-hero-border">
            <div className="container mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-hero-primary mb-4 block">
                            Clipperzz
                        </Link>
                        <p className="text-hero-secondary/70 text-sm mb-6 max-w-xs">
                            AI-powered video clipping for creators who publish at scale.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-lg bg-hero-surface/50 border border-hero-border flex items-center justify-center text-hero-secondary/70 transition-all duration-300 hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-400 hover:scale-110"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-semibold text-hero-primary mb-4">{category}</h4>
                            <ul className="space-y-2">
                                {links.map((link, index) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className={`text-sm text-hero-secondary/70 transition-colors duration-200 ${index % 2 === 0 ? "hover:text-green-400" : "hover:text-orange-400"
                                                }`}
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-hero-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-hero-secondary/60">
                        © {new Date().getFullYear()} Clipperzz. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-sm text-hero-secondary/60 hover:text-green-400 transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-hero-secondary/60 hover:text-orange-400 transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
