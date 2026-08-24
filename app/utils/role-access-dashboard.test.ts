// @ts-ignore
import { describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("role access dashboard visibility", () => {
  it("does not expose dashboard as the default route for vessel tracking only access", () => {
    const roleAccess = readFileSync(join(root, "app/composables/useRoleAccess.ts"), "utf8");
    const authMiddleware = readFileSync(join(root, "app/middleware/auth.global.ts"), "utf8");
    const sidebar = readFileSync(join(root, "app/composables/useAppSidebar.ts"), "utf8");

    expect(roleAccess).toContain("const canAccessDashboard = () =>");
    expect(roleAccess).toContain('if (path.startsWith("/dashboard"))');
    expect(roleAccess).toContain(
      'if (hasAccess("operational.vesselTracking")) return "/operational/vessel-tracking"',
    );
    expect(roleAccess).not.toContain('path.startsWith("/dashboard")) {\n      return true;');
    expect(authMiddleware).toContain("getDefaultPath()");
    expect(authMiddleware).not.toContain('return navigateTo("/dashboard")');
    expect(sidebar).toContain("router.push(getDefaultPath())");
  });
});
