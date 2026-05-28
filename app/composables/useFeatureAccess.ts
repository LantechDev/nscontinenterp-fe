import { toast } from "vue-sonner";
import type { AccessLevel } from "~/lib/permission-registry";

export function useFeatureAccess(feature: string) {
  const { hasAccess } = useRoleAccess();

  const canView = computed(() => hasAccess(feature, "view"));
  const canManage = computed(() => hasAccess(feature, "manage"));
  const canApprove = computed(() => hasAccess(feature, "approve"));

  const requireAccess = (level: AccessLevel = "manage", message?: string) => {
    if (hasAccess(feature, level)) {
      return true;
    }

    toast.error(message || `You need ${level} access for this feature.`);
    return false;
  };

  const requireManage = (message?: string) => requireAccess("manage", message);

  return {
    canView,
    canManage,
    canApprove,
    requireAccess,
    requireManage,
  };
}
