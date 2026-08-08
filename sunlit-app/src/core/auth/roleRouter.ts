/**
 * Sunlit Energy - Role Routing Authority
 * 
 * This is the SINGLE SOURCE OF TRUTH for dashboard routing.
 * No fallbacks. No defaults. Explicit roles only.
 */

export function getDashboardRoute(role: string): string {
  if (!role) {
    console.error("[AUTH] ROLE_UNDEFINED - Routing authority requires a valid role.");
    throw new Error("ROLE_UNDEFINED");
  }

  switch (role) {
    case "project_owner":
      return "/dashboard/project-owner";

    case "installer":
      return "/dashboard/installer";

    case "epc_contractor":
      return "/dashboard/installer";

    case "crew_member":
    case "crewlink":
    case "technician":
      return "/dashboard/crewlink";

    case "admin":
      return "/dashboard/admin";

    // Future roles (ready for activation)
    case "supplier":
      return "/dashboard/supplier";
      
    case "mini_grid":
      return "/dashboard/mini-grid";

    default:
      console.error(`[AUTH] INVALID_ROLE: ${role} - No routing path established.`);
      throw new Error("INVALID_ROLE: " + role);
  }
}
