// Role preview, not access control. There's no auth server behind /admin
// (see app/admin/layout.tsx's header note), so nothing here can be real
// security—anyone can still type any /admin/* URL directly regardless of
// the selected preview role. What IS real: selecting a role genuinely
// filters the sidebar nav to only that role's sections, so you can see
// exactly what a narrower role's navigation would look like. Treat this as
// a UI design/QA tool, not a permission system.

export type AdminRole = "super-admin" | "medical-editor" | "content-creator" | "moderator";

export type AdminRoleDef = {
  id: AdminRole;
  label: string;
  description: string;
  allowedHrefs: string[] | "all";
};

export const adminRoleDefs: AdminRoleDef[] = [
  { id: "super-admin", label: "Super Admin", description: "Full access to every section.", allowedHrefs: "all" },
  { id: "medical-editor", label: "Medical Editor", description: "Vocabulary, Clinical Cases, Anatomy Library.", allowedHrefs: ["/admin", "/admin/vocabulary", "/admin/cases", "/admin/anatomy"] },
  { id: "content-creator", label: "Content Creator", description: "Lesson Builder, Question Bank.", allowedHrefs: ["/admin", "/admin/lessons", "/admin/questions"] },
  { id: "moderator", label: "Moderator", description: "Reports & Feedback, Account.", allowedHrefs: ["/admin", "/admin/reports", "/admin/account"] }
];

const ROLE_KEY = "studium_admin_preview_role";
export const ADMIN_ROLE_EVENT = "studium:adminRoleChange";

export function getPreviewRole(): AdminRole {
  if (typeof window === "undefined") return "super-admin";
  return (localStorage.getItem(ROLE_KEY) as AdminRole | null) ?? "super-admin";
}

export function setPreviewRole(role: AdminRole) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
  window.dispatchEvent(new CustomEvent(ADMIN_ROLE_EVENT));
}

export function isHrefAllowed(role: AdminRole, href: string): boolean {
  const def = adminRoleDefs.find(r => r.id === role);
  if (!def || def.allowedHrefs === "all") return true;
  return def.allowedHrefs.includes(href);
}
