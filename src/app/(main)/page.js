import BannerPage from "@/components/Banner/Banner";
import FeaturedOpportunities from "@/components/HomePage/FeaturedOpportunities";
import FeaturedStartups from "@/components/HomePage/FeturedStartups";
import Testimonials from "@/components/HomePage/Testimonials";
import WhyJoinStartupForge from "@/components/HomePage/WhyJoinStartupForge";
import {
  getApplicationsById,
  getApplicationsByStartupId,
} from "@/lib/api/applications";
import {
  getFeaturedOpportunities,
  getOpportunities,
  getOpportunitiesByUserId,
} from "@/lib/api/opportunities";
import {
  getFeaturedStartups,
  getFounderStartup,
  getStartups,
} from "@/lib/api/startups";
import { getUsersData } from "@/lib/api/users";
import { getUserSession } from "@/lib/core/session";

export default async function Home() {
  // 1. Read session and extract user persona
  const user = await getUserSession();

  // Resolve role: prioritizes 'admin', then checks 'accountType' (founder/collaborator)
  const resolvedRole =
    user?.role === "admin"
      ? "admin"
      : user?.accountType || (user?.role !== "user" ? user?.role : null);

  // 2. Parallel data fetching for dashboard and home components
  const [
    founderApplications,
    founderOpportunities,
    founderStartup,
    opportunities,
    userData,
    startups,
    collaboratorApplications,
    featuredStartups,
    featuredOpportunities,
  ] = await Promise.all([
    getApplicationsByStartupId(user?.id),
    getOpportunitiesByUserId(user?.id),
    getFounderStartup(user?.id),
    getOpportunities(),
    getUsersData(),
    getStartups(),
    getApplicationsById(user?.id),
    getFeaturedStartups(),
    getFeaturedOpportunities(),
  ]);

  return (
    <>
      <BannerPage
        role={resolvedRole}
        user={user}
        founderApplications={founderApplications}
        founderOpportunities={founderOpportunities}
        founderStartup={founderStartup}
        collaboratorApplications={collaboratorApplications}
        opportunities={opportunities}
        userData={userData}
        startups={startups}
      />
      <FeaturedStartups
        featuredStartups={featuredStartups}
        opportunities={opportunities}
      />
      <FeaturedOpportunities
        featuredOpportunities={featuredOpportunities}
        startups={startups}
      />
      <WhyJoinStartupForge />
      <Testimonials />
    </>
  );
}
