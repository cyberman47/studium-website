import { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from "next/constants.js";

/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };

// `next dev` and `next build` both default to writing into the same
// `.next/` folder. Running a production build while a dev server is live
// (e.g. to verify a change) makes both processes read/write/prune the same
// webpack cache concurrently, which reliably corrupts it—symptoms range
// from stale 404s to a dev server crashing with "Cannot find module
// './XXXX.js'". Giving production builds their own directory means the two
// can never collide, permanently ruling out this failure mode. `next start`
// (PHASE_PRODUCTION_SERVER) has to point at the same directory `next build`
// wrote to, so it's included too—Vercel's build+serve pipeline picks this
// up automatically and is unaffected either way, since it never runs `next
// dev` alongside a build.
export default (phase) => {
  if (phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER) {
    return { ...nextConfig, distDir: ".next-build" };
  }
  return nextConfig;
};
