import BannerPage from "@/components/Banner/Banner";
import FeaturedOpportunities from "@/components/HomePage/FeaturedOpportunities";
import FeaturedStartups from "@/components/HomePage/FeturedStartups";
import Testimonials from "@/components/HomePage/Testimonials";
import WhyJoinStartupForge from "@/components/HomePage/WhyJoinStartupForge";

export default function Home() {
  return (
    <>
      <BannerPage />
      <FeaturedStartups />
      <FeaturedOpportunities />
      <WhyJoinStartupForge />
      <Testimonials />
    </>
  );
}
