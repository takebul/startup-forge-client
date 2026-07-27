"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  if (pathname.includes("dashboard")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-10 text-slate-700 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="container mx-auto space-y-8 divide-y divide-slate-200 px-6 dark:divide-slate-800 md:space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Brand Info & Mission */}
          <div className="col-span-full pb-6 md:col-span-5 md:pb-0">
            <Link
              href="/"
              className="flex items-center space-x-3 justify-start"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Startup
                <span className="text-violet-600 dark:text-violet-400">
                  Forge
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-600 dark:text-slate-400">
              Bridging visionary startup founders with world-class developers,
              designers, and marketers to turn ambitious ideas into reality.
            </p>
          </div>

          {/* Quick Links: For Founders */}
          <div className="col-span-6 md:col-span-2 text-left">
            <p className="pb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Founders
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/founder/post-role"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Post Requirements
                </Link>
              </li>
              <li>
                <Link
                  href="/founder/applications"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Review Applicants
                </Link>
              </li>
              <li>
                <Link
                  href="/talents"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Talent Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: For Collaborators */}
          <div className="col-span-6 md:col-span-2 text-left">
            <p className="pb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Collaborators
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/explore"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Explore Startups
                </Link>
              </li>
              <li>
                <Link
                  href="/collaborator/my-applications"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/collaborator/profile"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Profile Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Collaborator Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-full md:col-span-3 text-left">
            <p className="pb-3 text-sm font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Contact Us
            </p>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center space-x-2">
                <span>📍 San Francisco, CA & Remote</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✉️ support@startupforge.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>💬 Live Chat (24/7 Support)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="grid justify-center pt-6 lg:justify-between">
          <div className="flex flex-col items-center justify-center text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:space-x-6 lg:col-start-1">
            <span>
              © {new Date().getFullYear()} StartupForge Inc. All rights
              reserved.
            </span>
            <div className="mt-2 flex space-x-4 sm:mt-0">
              <Link
                href="/privacy"
                className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center pt-4 space-x-3 lg:pt-0 lg:col-end-13">
            {/* Email Contact */}
            <a
              href="mailto:support@startupforge.com"
              title="Email Us"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-colors hover:bg-violet-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-violet-600 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </a>

            {/* X (formerly Twitter) */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-colors hover:bg-violet-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-violet-600 dark:hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-colors hover:bg-violet-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-violet-600 dark:hover:text-white"
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
