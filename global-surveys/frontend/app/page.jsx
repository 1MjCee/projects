import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/howitworks";
import Testimonials from "@/components/landing/testimonials";
import FeaturedSurveys from "@/components/landing/featuredSurveys";
import Footer from "@/components/global/footer";
import Navbar from "@/components/global/Navbar";
import Partners from "@/components/landing/partners";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Partners />
      <HowItWorks />
      <FeaturedSurveys />
      <Testimonials />
      <Footer />
    </main>
  );
}
