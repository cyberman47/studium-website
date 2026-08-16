// The bare /dashboard/community route has nothing of its own to show now
// that Community is a real 5-item section (My Profile / Forum / Challenges
// / Study Groups / Contribute)—the sidebar links straight to each child, so
// this only exists to give a stray bookmark or manually-typed URL somewhere
// sensible to land. My Profile is the natural "home" of Community (identity
// and progress first, matching the section's intended flow), so that's
// where it goes—an instant server-side redirect, not a client flash.
import { redirect } from "next/navigation";

export default function CommunityIndexPage() {
  redirect("/dashboard/community/profile");
}
