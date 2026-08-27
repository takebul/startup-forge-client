import BannerPage from "@/components/Banner/Banner";
import FeaturedOpportunities from "@/components/HomePage/FeaturedOpportunities";
import FeaturedStartups from "@/components/HomePage/FeturedStartups";
import Testimonials from "@/components/HomePage/Testimonials";
import WhyJoinStartupForge from "@/components/HomePage/WhyJoinStartupForge";
import {
  getApplicationsByCollaboratorId,
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
import { getProfileData, getUsersData } from "@/lib/api/users";
import { getUserSession } from "@/lib/core/session";

export const metadata = {
  title: "StartupForge — Build Great Startups Together",
  description:
    "Connect visionary startup founders with world-class engineers, designers, and growth specialists to build high-growth ventures.",
  openGraph: {
    title: "StartupForge — Build Great Startups Together",
    description:
      "Join early-stage startups or recruit top talent across engineering, design, and growth.",
    url: "/",
    siteName: "StartupForge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StartupForge — Build Great Startups Together",
    description:
      "The dedicated platform connecting startup founders with skilled collaborators.",
  },
};

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
    collaboratorProfile,
  ] = await Promise.all([
    resolvedRole === "founder" && user?.id
      ? getApplicationsByStartupId(user.id)
      : Promise.resolve([]),
    resolvedRole === "founder" && user?.id
      ? getOpportunitiesByUserId(user.id)
      : Promise.resolve([]),
    resolvedRole === "founder" && user?.id
      ? getFounderStartup(user.id)
      : Promise.resolve([]),
    getOpportunities(),
    resolvedRole === "admin" ? getUsersData() : Promise.resolve([]),
    getStartups(),
    resolvedRole === "collaborator" && user?.id
      ? getApplicationsByCollaboratorId(user.id)
      : Promise.resolve([]),
    getFeaturedStartups(),
    getFeaturedOpportunities(),
    resolvedRole === "collaborator" && user?.id
      ? getProfileData(user.id)
      : Promise.resolve(null),
  ]);

  const profileData =
    collaboratorProfile?.data || collaboratorProfile?.user || collaboratorProfile;
  const bannerUser =
    resolvedRole === "collaborator" && profileData
      ? { ...user, ...profileData }
      : user;

  return (
    <>
      <BannerPage
        role={resolvedRole}
        user={bannerUser}
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
