const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ---------------------------------------------------------------------------
// 1. CLIENT ARCHITECTURE - DARK MODE
// ---------------------------------------------------------------------------
function getClientDarkSvg() {
  return `<svg width="1000" height="700" viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="StartupForge Client Architecture Dark Mode">
  <defs>
    <linearGradient id="bgGradD" x1="0" y1="0" x2="1000" y2="700" gradientUnits="userSpaceOnUse">
      <stop stop-color="#080C16"/>
      <stop offset="1" stop-color="#0E1626"/>
    </linearGradient>
    <linearGradient id="headerGradD" x1="0" y1="0" x2="350" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="#A78BFA"/>
      <stop offset="1" stop-color="#60A5FA"/>
    </linearGradient>
    <linearGradient id="cardGradD" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#141E33"/>
      <stop offset="1" stop-color="#0F172A"/>
    </linearGradient>
    <marker id="arrowD" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#818CF8"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1000" height="700" rx="16" fill="url(#bgGradD)"/>
  <rect x="1" y="1" width="998" height="698" rx="15" stroke="#1E293B" stroke-width="1.5"/>

  <!-- Header -->
  <g transform="translate(36, 30)">
    <rect x="0" y="0" width="38" height="38" rx="10" fill="#7C3AED"/>
    <path d="M19 11 v16 M11 19 h16" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <text x="50" y="22" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="url(#headerGradD)">
      StartupForge Client Platform Architecture
    </text>
    <text x="50" y="38" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="normal" fill="#94A3B8">
      Next.js 16 App Router | better-auth | Express 5 Core API | MongoDB Atlas
    </text>
  </g>

  <!-- TIER 1: CLIENT LAYER -->
  <g transform="translate(36, 85)">
    <rect width="928" height="115" rx="12" fill="#0B1324" stroke="#1E293B" stroke-width="1"/>
    <text x="20" y="24" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#38BDF8">
      1. CLIENT AND PRESENTATION LAYER (Next.js 16 + React 19)
    </text>

    <g transform="translate(20, 36)">
      <rect width="280" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="14" y="22" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#F8FAFC">Modern UI and Styling</text>
      <text x="14" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">HeroUI v3 | Tailwind CSS 4 | next-themes</text>
      <text x="14" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Ambient design tokens and dual themes</text>
    </g>

    <g transform="translate(324, 36)">
      <rect width="280" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="14" y="22" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#F8FAFC">Responsive Navigation</text>
      <text x="14" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">Desktop Header + Mobile Bottom Dock</text>
      <text x="14" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Safe-area aware | Active pill animations</text>
    </g>

    <g transform="translate(628, 36)">
      <rect width="280" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="14" y="22" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#F8FAFC">Interactive Engine</text>
      <text x="14" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">Framer Motion | Lucide | Recharts</text>
      <text x="14" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Optimistic updates with rollback recovery</text>
    </g>
  </g>

  <!-- Connectors 1 to 2 -->
  <line x1="200" y1="200" x2="200" y2="235" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowD)"/>
  <line x1="500" y1="200" x2="500" y2="235" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowD)"/>
  <line x1="800" y1="200" x2="800" y2="235" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowD)"/>

  <!-- TIER 2: SERVER ACTIONS LAYER -->
  <g transform="translate(36, 235)">
    <rect width="928" height="115" rx="12" fill="#0B1324" stroke="#1E293B" stroke-width="1"/>
    <text x="20" y="24" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#A78BFA">
      2. NEXT.JS APP ROUTER AND SERVER ACTIONS (Server-Side)
    </text>

    <g transform="translate(20, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">Route Guards and Proxy</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">requireAccountType()</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Plan-gated proxy.js checks</text>
    </g>

    <g transform="translate(250, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">Server Actions</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">src/lib/actions/*</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Secure mutation handlers</text>
    </g>

    <g transform="translate(480, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">better-auth Core</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">MongoDB Adapter + JWT</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Admin plugin and session sync</text>
    </g>

    <g transform="translate(710, 36)">
      <rect width="198" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">Stripe Billing</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">Checkout Sessions API</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Receipt and plan mapping</text>
    </g>
  </g>

  <!-- Connectors 2 to 3 -->
  <line x1="300" y1="350" x2="300" y2="385" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowD)"/>
  <line x1="700" y1="350" x2="700" y2="385" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowD)"/>

  <!-- TIER 3: BACKEND REST API -->
  <g transform="translate(36, 385)">
    <rect width="928" height="115" rx="12" fill="#0B1324" stroke="#1E293B" stroke-width="1"/>
    <text x="20" y="24" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#34D399">
      3. BACKEND CORE REST API (Express 5 Service)
    </text>

    <g transform="translate(20, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">Security and Auth Gate</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">verifyToken + requireAnyRole</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Anti-IDOR and identity stamping</text>
    </g>

    <g transform="translate(250, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">Startups and Vetting</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">Approval State Machine</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Pending to Approved or Rejected</text>
    </g>

    <g transform="translate(480, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">Opportunities Engine</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">Quota Meters (3 / 10 / 100)</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Faceted URL-driven search</text>
    </g>

    <g transform="translate(710, 36)">
      <rect width="198" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">Applications and Alerts</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">100% Profile Validation</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Bidirectional notifications</text>
    </g>
  </g>

  <!-- Connectors 3 to 4 -->
  <line x1="200" y1="500" x2="200" y2="535" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowD)"/>
  <line x1="500" y1="500" x2="500" y2="535" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowD)"/>
  <line x1="800" y1="500" x2="800" y2="535" stroke="#818CF8" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowD)"/>

  <!-- TIER 4: PERSISTENCE LAYER -->
  <g transform="translate(36, 535)">
    <rect width="928" height="115" rx="12" fill="#0B1324" stroke="#1E293B" stroke-width="1"/>
    <text x="20" y="24" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#FBBF24">
      4. PERSISTENCE AND CLOUD ECOSYSTEM
    </text>

    <g transform="translate(20, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">MongoDB Atlas</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">Native Driver v7 (Stable v1)</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">9 Collections | $lookup joins</text>
    </g>

    <g transform="translate(250, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">Stripe Billing</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">Subscription Webhooks</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Idempotent session logging</text>
    </g>

    <g transform="translate(480, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">ImgBB CDN</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">REST Asset Ingestion</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Logos and user avatars</text>
    </g>

    <g transform="translate(710, 36)">
      <rect width="198" height="64" rx="8" fill="url(#cardGradD)" stroke="#2A3854"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#F8FAFC">Google Cloud OAuth</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#94A3B8">OAuth 2.0 Credentials</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Single sign-on verification</text>
    </g>
  </g>
</svg>`;
}

// ---------------------------------------------------------------------------
// 2. CLIENT ARCHITECTURE - LIGHT MODE
// ---------------------------------------------------------------------------
function getClientLightSvg() {
  return `<svg width="1000" height="700" viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="StartupForge Client Architecture Light Mode">
  <defs>
    <linearGradient id="bgGradL" x1="0" y1="0" x2="1000" y2="700" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F8FAFC"/>
      <stop offset="1" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="headerGradL" x1="0" y1="0" x2="350" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6D28D9"/>
      <stop offset="1" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="cardGradL" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#F8FAFC"/>
    </linearGradient>
    <marker id="arrowL" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#6366F1"/>
    </marker>
  </defs>

  <rect width="1000" height="700" rx="16" fill="url(#bgGradL)"/>
  <rect x="1" y="1" width="998" height="698" rx="15" stroke="#E2E8F0" stroke-width="1.5"/>

  <!-- Header -->
  <g transform="translate(36, 30)">
    <rect x="0" y="0" width="38" height="38" rx="10" fill="#7C3AED"/>
    <path d="M19 11 v16 M11 19 h16" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <text x="50" y="22" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="url(#headerGradL)">
      StartupForge Client Platform Architecture
    </text>
    <text x="50" y="38" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="normal" fill="#64748B">
      Next.js 16 App Router | better-auth | Express 5 Core API | MongoDB Atlas
    </text>
  </g>

  <!-- TIER 1 -->
  <g transform="translate(36, 85)">
    <rect width="928" height="115" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <text x="20" y="24" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0284C7">
      1. CLIENT AND PRESENTATION LAYER (Next.js 16 + React 19)
    </text>

    <g transform="translate(20, 36)">
      <rect width="280" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="14" y="22" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#0F172A">Modern UI and Styling</text>
      <text x="14" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">HeroUI v3 | Tailwind CSS 4 | next-themes</text>
      <text x="14" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Ambient design tokens and dual themes</text>
    </g>

    <g transform="translate(324, 36)">
      <rect width="280" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="14" y="22" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#0F172A">Responsive Navigation</text>
      <text x="14" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">Desktop Header + Mobile Bottom Dock</text>
      <text x="14" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Safe-area aware | Active pill animations</text>
    </g>

    <g transform="translate(628, 36)">
      <rect width="280" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="14" y="22" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="bold" fill="#0F172A">Interactive Engine</text>
      <text x="14" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">Framer Motion | Lucide | Recharts</text>
      <text x="14" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Optimistic updates with rollback recovery</text>
    </g>
  </g>

  <!-- Connectors 1 to 2 -->
  <line x1="200" y1="200" x2="200" y2="235" stroke="#6366F1" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowL)"/>
  <line x1="500" y1="200" x2="500" y2="235" stroke="#6366F1" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowL)"/>
  <line x1="800" y1="200" x2="800" y2="235" stroke="#6366F1" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowL)"/>

  <!-- TIER 2 -->
  <g transform="translate(36, 235)">
    <rect width="928" height="115" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <text x="20" y="24" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#6D28D9">
      2. NEXT.JS APP ROUTER AND SERVER ACTIONS (Server-Side)
    </text>

    <g transform="translate(20, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">Route Guards and Proxy</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">requireAccountType()</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Plan-gated proxy.js checks</text>
    </g>

    <g transform="translate(250, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">Server Actions</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">src/lib/actions/*</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Secure mutation handlers</text>
    </g>

    <g transform="translate(480, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">better-auth Core</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">MongoDB Adapter + JWT</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Admin plugin and session sync</text>
    </g>

    <g transform="translate(710, 36)">
      <rect width="198" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">Stripe Billing</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">Checkout Sessions API</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Receipt and plan mapping</text>
    </g>
  </g>

  <!-- Connectors 2 to 3 -->
  <line x1="300" y1="350" x2="300" y2="385" stroke="#6366F1" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowL)"/>
  <line x1="700" y1="350" x2="700" y2="385" stroke="#6366F1" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowL)"/>

  <!-- TIER 3 -->
  <g transform="translate(36, 385)">
    <rect width="928" height="115" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <text x="20" y="24" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#059669">
      3. BACKEND CORE REST API (Express 5 Service)
    </text>

    <g transform="translate(20, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">Security and Auth Gate</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">verifyToken + requireAnyRole</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Anti-IDOR and identity stamping</text>
    </g>

    <g transform="translate(250, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">Startups and Vetting</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">Approval State Machine</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Pending to Approved or Rejected</text>
    </g>

    <g transform="translate(480, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">Opportunities Engine</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">Quota Meters (3 / 10 / 100)</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Faceted URL-driven search</text>
    </g>

    <g transform="translate(710, 36)">
      <rect width="198" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">Applications and Alerts</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">100% Profile Validation</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Bidirectional notifications</text>
    </g>
  </g>

  <!-- Connectors 3 to 4 -->
  <line x1="200" y1="500" x2="200" y2="535" stroke="#6366F1" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowL)"/>
  <line x1="500" y1="500" x2="500" y2="535" stroke="#6366F1" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowL)"/>
  <line x1="800" y1="500" x2="800" y2="535" stroke="#6366F1" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arrowL)"/>

  <!-- TIER 4 -->
  <g transform="translate(36, 535)">
    <rect width="928" height="115" rx="12" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
    <text x="20" y="24" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#D97706">
      4. PERSISTENCE AND CLOUD ECOSYSTEM
    </text>

    <g transform="translate(20, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">MongoDB Atlas</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">Native Driver v7 (Stable v1)</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">9 Collections | $lookup joins</text>
    </g>

    <g transform="translate(250, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">Stripe Billing</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">Subscription Webhooks</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Idempotent session logging</text>
    </g>

    <g transform="translate(480, 36)">
      <rect width="210" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">ImgBB CDN</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">REST Asset Ingestion</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Logos and user avatars</text>
    </g>

    <g transform="translate(710, 36)">
      <rect width="198" height="64" rx="8" fill="url(#cardGradL)" stroke="#CBD5E1"/>
      <text x="12" y="22" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#0F172A">Google Cloud OAuth</text>
      <text x="12" y="40" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#475569">OAuth 2.0 Credentials</text>
      <text x="12" y="54" font-family="Arial, Helvetica, sans-serif" font-size="10" fill="#64748B">Single sign-on verification</text>
    </g>
  </g>
</svg>`;
}

// Write client files
fs.writeFileSync(path.join(__dirname, '../public/architecture-dark.svg'), getClientDarkSvg(), 'utf8');
fs.writeFileSync(path.join(__dirname, '../public/architecture-light.svg'), getClientLightSvg(), 'utf8');

// Copy/generate server architecture as well
fs.writeFileSync(path.join(__dirname, '../../startup-forge-server/public/architecture-dark.svg'), getClientDarkSvg().replace(/StartupForge Client Platform Architecture/, 'StartupForge Server Architecture (Core Engine)'), 'utf8');
fs.writeFileSync(path.join(__dirname, '../../startup-forge-server/public/architecture-light.svg'), getClientLightSvg().replace(/StartupForge Client Platform Architecture/, 'StartupForge Server Architecture (Core Engine)'), 'utf8');

// Rasterize to PNG for verification
Promise.all([
  sharp(Buffer.from(getClientDarkSvg())).png().toFile(path.join(__dirname, '../public/architecture-dark.png')),
  sharp(Buffer.from(getClientLightSvg())).png().toFile(path.join(__dirname, '../public/architecture-light.png'))
]).then(() => {
  console.log('Successfully generated all clean SVGs and PNG previews!');
});
