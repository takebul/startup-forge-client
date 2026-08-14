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
  // Server component — reads session, passes role + user down to client banner

  const user = await getUserSession();
  const role = user?.role ?? null;

  const founderApplications = await getApplicationsByStartupId(user?.id);
  const founderOpportunities = await getOpportunitiesByUserId(user?.id);
  const founderStartup = await getFounderStartup(user?.id);
  const opportunities = await getOpportunities();
  const userData = await getUsersData();
  const startups = await getStartups();
  const collaboratorApplications = await getApplicationsById(user?.id);
  const featuredStartups = await getFeaturedStartups();
  const featuredOpportunities = await getFeaturedOpportunities();

  // console.log({
  //   user,
  //   founderApplications,
  //   founderOpportunities,
  //   founderStartup,
  //   opportunities,
  //   userData,
  //   startups,
  //   collaboratorApplications,
  // });

  return (
    <>
      <BannerPage
        role={role}
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
        featuredOpportunities={featuredOpportunities}
      />
      <FeaturedOpportunities />
      <WhyJoinStartupForge />
      <Testimonials />
    </>
  );
}
