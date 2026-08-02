import BannerPage from "@/components/Banner/Banner";
import FeaturedOpportunities from "@/components/HomePage/FeaturedOpportunities";
import FeaturedStartups from "@/components/HomePage/FeturedStartups";
import Testimonials from "@/components/HomePage/Testimonials";
import WhyJoinStartupForge from "@/components/HomePage/WhyJoinStartupForge";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  // Server component — reads session, passes role + user down to client banner

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user ?? null;
  const role = user?.role ?? null;

  return (
    <>
      <BannerPage role={role} user={user} />
      <FeaturedStartups />
      <FeaturedOpportunities />
      <WhyJoinStartupForge />
      <Testimonials />
    </>
  );
}
