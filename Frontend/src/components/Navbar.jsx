import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-hero-gradient backdrop-blur-xl border-b border-hero-border shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-hero-secondary/50 hover:text-hero-primary transition-colors duration-300"
          >
            Clipperzz
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-hero-secondary/70 hover:text-hero-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost-nav"
              size="sm"
              className="hidden sm:inline-flex text-hero-secondary/70 hover:text-hero-primary transition-colors duration-300"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <Link to="/dashboard">Start Free</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;