<script setup lang="ts">
import { ChevronDown, ChevronRight, User, X } from "lucide-vue-next";
import { cn } from "~/lib/utils";

type SidebarVariant = "desktop" | "mobile";

interface Props {
  variant?: SidebarVariant;
  open?: boolean;
}

interface Emits {
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "desktop",
  open: false,
});

const emit = defineEmits<Emits>();

const {
  user,
  organizations,
  isOrgDropdownOpen,
  isUserDropdownOpen,
  expandedItems,
  currentOrg,
  handleLogout,
  toggleOrgDropdown,
  handleOrgSwitch,
  toggleExpand,
  isActive,
  isChildActive,
  navItems,
} = useAppSidebar();

const isMobile = computed(() => props.variant === "mobile");

const handleClose = (): void => {
  if (isMobile.value) {
    emit("close");
  }
};

const handleOrgSwitchWithClose = async (orgId: string): Promise<void> => {
  await handleOrgSwitch(orgId);
  handleClose();
};

const handleLogoutWithClose = async (): Promise<void> => {
  await handleLogout();
  handleClose();
};

const sidebarClasses = computed(() =>
  cn(
    "fixed inset-y-0 left-0 bg-[#012D5A] text-white flex-col font-sans transition-transform duration-300 will-change-transform pb-[env(safe-area-inset-bottom)]",
    isMobile.value
      ? cn(
          "lg:hidden flex z-[1100] w-72 max-w-[90vw] shadow-2xl pt-[env(safe-area-inset-top)]",
          props.open ? "translate-x-0" : "-translate-x-full",
        )
      : "hidden lg:flex z-40 w-64 translate-x-0",
  ),
);

const overlayClasses = computed(() =>
  cn(
    "fixed inset-0 bg-black/40 transition-opacity duration-200 lg:hidden",
    props.open ? "opacity-100 z-[1090]" : "opacity-0 pointer-events-none",
  ),
);
</script>

<template>
  <div v-if="isMobile" :class="overlayClasses" @click="emit('close')"></div>

  <aside :class="sidebarClasses">
    <!-- Logo / Organization Switcher -->
    <div class="px-4 py-4 mb-2">
      <div v-if="isMobile" class="flex items-center justify-between mb-3">
        <p class="text-sm font-medium text-white/90">Menu</p>
        <button
          type="button"
          class="p-2 rounded-lg hover:bg-white/10 transition-colors"
          @click="emit('close')"
          aria-label="Close menu"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <button
        @click="toggleOrgDropdown"
        class="flex items-center justify-between w-full px-3 py-2.5 bg-[#1e4a7a]/50 rounded-lg hover:bg-[#1e4a7a]/70 transition-colors border border-white/10"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-8 h-8 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden"
          >
            <NuxtImg
              src="/images/logo2.png"
              alt="NS Continent"
              class="w-full h-full object-contain"
            />
          </div>
          <span class="font-medium text-sm truncate">{{ currentOrg?.name || "NS Continent" }}</span>
        </div>
        <div class="flex flex-col gap-0.5">
          <ChevronDown class="w-4 h-4 text-white/70" />
        </div>
      </button>

      <!-- Org Dropdown -->
      <div
        v-if="isOrgDropdownOpen"
        class="absolute top-16 left-4 w-56 bg-white text-slate-900 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        :class="isMobile ? 'z-[1120]' : 'z-50'"
      >
        <div class="py-1">
          <button
            v-for="org in organizations"
            :key="org.id"
            @click="handleOrgSwitchWithClose(org.id)"
            class="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition-colors"
          >
            {{ org.name }}
          </button>
          <div v-if="organizations.length === 0" class="px-4 py-2 text-xs text-slate-500">
            No organizations
          </div>
        </div>
      </div>
      <div
        v-if="isOrgDropdownOpen"
        @click="isOrgDropdownOpen = false"
        class="fixed inset-0 bg-transparent"
        :class="isMobile ? 'z-[1110]' : 'z-40'"
      ></div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hidden">
      <!-- Main Dashboard -->
      <NuxtLink
        to="/dashboard"
        :class="
          cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isActive('/dashboard')
              ? 'bg-[#1e4a7a]/50 text-white'
              : 'text-white/80 hover:bg-white/5 hover:text-white',
          )
        "
        @click="handleClose"
      >
        <span>Dashboard</span>
      </NuxtLink>

      <template v-for="item in navItems.slice(1)" :key="item.title">
        <div v-if="item.children" class="space-y-1">
          <button
            @click="toggleExpand(item.title)"
            :class="
              cn(
                'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isChildActive(item.children) || expandedItems.includes(item.title)
                  ? 'text-white'
                  : 'text-white/80 hover:bg-white/5 hover:text-white',
              )
            "
          >
            <div class="flex items-center gap-3">
              <span>{{ item.title }}</span>
            </div>
            <ChevronDown
              class="w-4 h-4 transition-transform duration-200"
              :class="expandedItems.includes(item.title) ? 'rotate-180' : ''"
            />
          </button>

          <div v-if="expandedItems.includes(item.title)" class="space-y-1 pl-3">
            <NuxtLink
              v-for="child in item.children"
              :key="child.href"
              :to="child.href"
              :class="
                cn(
                  'block w-full text-left px-3 py-3 rounded-lg text-sm transition-colors mb-1 last:mb-0',
                  isActive(child.href)
                    ? 'bg-[#1e4a7a] text-white font-medium'
                    : 'text-white/70 hover:text-white hover:bg-white/5',
                )
              "
              @click="handleClose"
            >
              {{ child.title }}
            </NuxtLink>
          </div>
        </div>

        <NuxtLink
          v-else
          :to="item.href!"
          :class="
            cn(
              'flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors',
              isActive(item.href!)
                ? 'bg-white/10 text-white'
                : 'text-white/80 hover:bg-white/5 hover:text-white',
            )
          "
          @click="handleClose"
        >
          <div class="flex items-center gap-3">
            <span>{{ item.title }}</span>
          </div>
          <ChevronRight class="w-4 h-4 text-white/50" />
        </NuxtLink>
      </template>
    </nav>

    <!-- Footer / User -->
    <div class="p-4 mt-auto relative">
      <!-- User Dropdown Menu -->
      <ClientOnly>
        <div
          v-if="isUserDropdownOpen"
          class="absolute bottom-20 left-4 w-56 bg-white text-slate-900 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200"
          :class="isMobile ? 'z-[1120]' : 'z-50'"
        >
          <div class="p-2 border-b border-border">
            <p class="font-medium text-sm truncate px-2">{{ user?.name }}</p>
            <p class="text-xs text-muted-foreground truncate px-2">{{ user?.email }}</p>
          </div>
          <div class="p-1">
            <NuxtLink
              v-if="user"
              :to="`/settings/users/${user.id}`"
              @click="isUserDropdownOpen = false"
              class="flex items-center gap-2 w-full px-2 py-2 text-sm rounded-md hover:bg-slate-100 transition-colors"
            >
              <User class="w-4 h-4" />
              <span>My Profile</span>
            </NuxtLink>
            <button
              @click="handleLogoutWithClose"
              class="flex items-center gap-2 w-full px-2 py-2 text-sm rounded-md hover:bg-red-50 text-red-600 transition-colors"
            >
              <User class="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        <!-- Backdrop -->
        <div
          v-if="isUserDropdownOpen"
          @click="isUserDropdownOpen = false"
          class="fixed inset-0 bg-transparent"
          :class="isMobile ? 'z-[1110]' : 'z-40'"
        ></div>

        <button
          v-if="user"
          @click="isUserDropdownOpen = !isUserDropdownOpen"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer w-full text-left"
          :class="{ 'bg-white/5': isUserDropdownOpen }"
        >
          <div
            class="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#012D5A] shrink-0"
          >
            <User class="w-6 h-6" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ user.name }}</p>
            <p class="text-xs text-white/60 truncate">{{ user.email }}</p>
          </div>
          <ChevronRight
            class="w-5 h-5 text-white/50 group-hover:text-white transition-transform duration-200"
            :class="{ '-rotate-90': isUserDropdownOpen }"
          />
        </button>
      </ClientOnly>
    </div>
  </aside>
</template>

<style scoped>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
