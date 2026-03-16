import HeroSection from "@/components/HeroSection";
import HeroBannerCarousel from "@/components/HeroBannerCarousel";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCarousel from "@/components/ProductCarousel";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import SustainabilitySection from "@/components/SustainabilitySection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { motion } from "framer-motion";
import { Award, Truck, RotateCcw, Headphones } from "lucide-react";

const trustBadges = [
  { icon: Truck, label: "Free Shipping Over $35" },
  { icon: RotateCcw, label: "30-Day Returns" },
  { icon: Award, label: "Eco Certified" },
  { icon: Headphones, label: "24/7 Support" },
];

const Index = () => {
  const bestSellers = products.filter((p) => p.isBestSeller);
  const trending = products.filter((p) => p.isTrending);

  return (
    <div className="min-h-screen">
      <Header />

      <HeroSection />

      <HeroBannerCarousel />

      {/* Trust Badges */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 py-2">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategoryGrid />

      {/* Best Sellers Carousel */}
      <ProductCarousel 
        products={bestSellers} 
        title="Best Sellers" 
        subtitle="Our most loved products, trusted by thousands of families."
      />

      <SustainabilitySection />

      {/* Trending Carousel */}
      <ProductCarousel 
        products={trending} 
        title="Trending Now" 
        subtitle="See what's popular in eco-friendly cleaning right now."
      />

      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
