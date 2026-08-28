"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, Mail, MapPin, MessageSquare, Sparkles } from "lucide-react";
import { LogoLinkedin } from "@gravity-ui/icons";

const Footer = () => {
  const pathname = usePathname();

  if (pathname?.includes("dashboard")) {
    return null;
  }

  return (
    <footer className="relative z-10 border-t border-slate-200/90 bg-white/95 backdrop-blur-md py-14 text-slate-800 transition-colors duration-200 dark:border-slate-800/90 dark:bg-[#060C1A]/95 dark:text-slate-200 shadow-sm">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Info & Mission */}
          <div className="col-span-full md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-violet-600/25">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Startup
                <span className="text-violet-600 dark:text-violet-400">
                  Forge
                </span>
              </span>
            </Link>
            <p className="max-w-sm text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Bridging visionary startup founders with world-class developers,
              designers, and growth specialists to turn ambitious ideas into
              reality.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono font-bold text-violet-700 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Building the next generation of tech ventures</span>
            </div>
          </div>

          {/* Quick Links: For Founders */}
          <div className="col-span-6 sm:col-span-3 md:col-span-2 text-left">
            <p className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              For Founders
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/dashboard/founder/add-opportunity"
                  className="font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors"
                >
                  Post Opportunity
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/founder/applications"
                  className="font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors"
                >
                  Review Applicants
                </Link>
              </li>
              <li>
                <Link
                  href="/startups"
                  className="font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors"
                >
                  Startup Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors"
                >
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: For Collaborators */}
          <div className="col-span-6 sm:col-span-3 md:col-span-2 text-left">
            <p className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Collaborators
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/opportunities"
                  className="font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors"
                >
                  Browse Roles
                </Link>
              </li>
              <li>
                <Link
                  href="/startups"
                  className="font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors"
                >
                  Explore Startups
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/collaborator/my-applications"
                  className="font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors"
                >
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/collaborator/profile"
                  className="font-medium text-slate-700 hover:text-violet-600 dark:text-slate-300 dark:hover:text-violet-400 transition-colors"
                >
                  Profile Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-full sm:col-span-6 md:col-span-3 text-left">
            <p className="pb-4 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Contact &amp; Support
            </p>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>Bangladesh, Pirojpur &amp; Global Remote</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <a
                  href="mailto:takebulislam@gmail.com"
                  className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  takebulislam@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                <span>24/7 Community Discord &amp; Live Chat</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="border-t border-slate-200/90 dark:border-slate-800/90 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>
              © {new Date().getFullYear()} StartupForge Inc. All rights
              reserved.
            </span>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
              >
                Privacy Policy
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social Links with Strong Contrast Badges */}
          <div className="flex items-center gap-2.5">
            <a
              href="mailto:takebulislam@gmail.com"
              title="Email Support"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-100/90 text-slate-700 shadow-xs transition-all hover:bg-violet-600 hover:text-white hover:border-violet-600 active:scale-95 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-violet-600 dark:hover:text-white"
            >
              <Mail className="h-4 w-4" />
            </a>

            <a
              href="https://www.linkedin.com/in/takebulislam"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn / in"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-100/90 text-slate-700 shadow-xs transition-all hover:bg-violet-600 hover:text-white hover:border-violet-600 active:scale-95 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-violet-600 dark:hover:text-white"
            >
              <LogoLinkedin />
            </a>

            <a
              href="https://github.com/takebul"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-slate-100/90 text-slate-700 shadow-xs transition-all hover:bg-violet-600 hover:text-white hover:border-violet-600 active:scale-95 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-violet-600 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-4 w-4"
              >
                <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
