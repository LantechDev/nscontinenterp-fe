<script setup lang="ts">
import {
  ChevronDown,
  ChevronRight,
  User,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-vue-next";
import { cn } from "~/lib/utils";

const {
  user,
  organizations,
  isOrgDropdownOpen,
  isUserDropdownOpen,
  isSidebarCollapsed,
  expandedItems,
  currentOrg,
  handleLogout,
  toggleOrgDropdown,
  handleOrgSwitch,
  toggleExpand,
  toggleSidebar,
  isActive,
  isChildActive,
  navItems,
} = useAppSidebar();

const { isOwner, isAdmin, canApproveJobs } = useAuth();

type SidebarNavItem = (typeof navItems.value)[number];

const collapsedFlyoutItem = ref<SidebarNavItem | null>(null);
const collapsedFlyoutTop = ref(0);

const handleParentClick = (item: SidebarNavItem, event: MouseEvent) => {
  if (!isSidebarCollapsed.value) {
    toggleExpand(item.title);
    return;
  }

  const target = event.currentTarget as HTMLElement;
  collapsedFlyoutTop.value = target.getBoundingClientRect().top;
  collapsedFlyoutItem.value = collapsedFlyoutItem.value?.title === item.title ? null : item;
};

watch(isSidebarCollapsed, () => {
  collapsedFlyoutItem.value = null;
});
</script>

<template>
  <aside
    :class="
      cn(
        'fixed inset-y-0 left-0 z-40 bg-[#012D5A] text-white flex flex-col font-sans transition-all duration-300',
        isSidebarCollapsed ? 'w-20' : 'w-64',
      )
    "
  >
    <!-- Logo / Organization Switcher -->
    <div :class="cn('px-4 py-4 mb-2', isSidebarCollapsed && 'px-3')">
      <button
        @click="toggleOrgDropdown"
        :title="currentOrg?.name || 'NS Continent'"
        :class="
          cn(
            'flex items-center justify-between w-full px-3 py-2.5 bg-[#1e4a7a]/50 rounded-lg hover:bg-[#1e4a7a]/70 transition-colors border border-white/10',
            isSidebarCollapsed && 'justify-center px-2',
          )
        "
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-8 h-8 rounded-md bg-white flex items-center justify-center shrink-0 overflow-hidden"
          >
            <NuxtImg
              src="/images/logo2.jpeg"
              alt="NS Continent"
              class="w-full h-full object-contain"
            />
          </div>
          <span v-if="!isSidebarCollapsed" class="font-medium text-sm truncate">{{
            currentOrg?.name || "NS Continent"
          }}</span>
        </div>
        <div v-if="!isSidebarCollapsed" class="flex flex-col gap-0.5">
          <ChevronDown class="w-4 h-4 text-white/70" />
        </div>
      </button>

      <button
        type="button"
        :title="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        class="mt-3 flex h-9 w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        @click="toggleSidebar"
      >
        <PanelLeftOpen v-if="isSidebarCollapsed" class="w-4 h-4" />
        <PanelLeftClose v-else class="w-4 h-4" />
      </button>

      <!-- Org Dropdown -->
      <div
        v-if="isOrgDropdownOpen"
        :class="
          cn(
            'absolute top-16 bg-white text-slate-900 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200',
            isSidebarCollapsed ? 'left-3 w-64' : 'left-4 w-56',
          )
        "
      >
        <div class="py-1">
          <button
            v-for="org in organizations"
            :key="org.id"
            @click="handleOrgSwitch(org.id)"
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
        class="fixed inset-0 z-40 bg-transparent"
      ></div>
    </div>

    <!-- Navigation -->
    <nav
      :class="
        cn('flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hidden', isSidebarCollapsed && 'px-3')
      "
    >
      <!-- Main Dashboard -->
      <NuxtLink
        to="/dashboard"
        title="Dashboard"
        :class="
          cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            isSidebarCollapsed && 'justify-center px-0',
            isActive('/dashboard')
              ? 'bg-[#1e4a7a]/50 text-white'
              : 'text-white/80 hover:bg-white/5 hover:text-white',
          )
        "
      >
        <LayoutDashboard class="w-4 h-4 shrink-0 text-white/70" />
        <span v-if="!isSidebarCollapsed">Dashboard</span>
      </NuxtLink>

      <ClientOnly>
        <template v-for="item in navItems.slice(1)" :key="item.title">
          <div v-if="item.children" class="space-y-1">
            <button
              @click="handleParentClick(item, $event)"
              :title="item.title"
              :class="
                cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isSidebarCollapsed && 'justify-center px-0',
                  isChildActive(item.children) || expandedItems.includes(item.title)
                    ? 'text-white'
                    : 'text-white/80 hover:bg-white/5 hover:text-white',
                )
              "
            >
              <div :class="cn('flex items-center gap-3', isSidebarCollapsed && 'justify-center')">
                <component :is="item.icon" class="w-4 h-4 shrink-0 text-white/70" />
                <span v-if="!isSidebarCollapsed">{{ item.title }}</span>
              </div>
              <ChevronDown
                v-if="!isSidebarCollapsed"
                class="w-4 h-4 transition-transform duration-200"
                :class="expandedItems.includes(item.title) ? 'rotate-180' : ''"
              />
            </button>

            <div
              v-if="!isSidebarCollapsed && expandedItems.includes(item.title)"
              :class="cn('space-y-1 pl-3', isSidebarCollapsed && 'pl-0')"
            >
              <NuxtLink
                v-for="child in item.children"
                :key="child.href"
                :to="child.href"
                :title="child.title"
                :class="
                  cn(
                    'flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    isSidebarCollapsed && 'justify-center px-0',
                    isActive(child.href)
                      ? 'bg-[#1e4a7a] text-white font-medium'
                      : 'text-white/70 hover:text-white hover:bg-white/5',
                  )
                "
              >
                <component
                  v-if="child.icon"
                  :is="child.icon"
                  class="w-3.5 h-3.5 shrink-0 opacity-60"
                />
                <span v-if="!isSidebarCollapsed">{{ child.title }}</span>
              </NuxtLink>
            </div>
          </div>

          <NuxtLink
            v-else
            :to="item.href!"
            :title="item.title"
            :class="
              cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isSidebarCollapsed && 'justify-center px-0',
                isActive(item.href!)
                  ? 'bg-white/10 text-white'
                  : 'text-white/80 hover:bg-white/5 hover:text-white',
              )
            "
          >
            <div :class="cn('flex items-center gap-3', isSidebarCollapsed && 'justify-center')">
              <component :is="item.icon" class="w-4 h-4 shrink-0 text-white/70" />
              <span v-if="!isSidebarCollapsed">{{ item.title }}</span>
            </div>
            <ChevronRight v-if="!isSidebarCollapsed" class="w-4 h-4 text-white/50" />
          </NuxtLink>
        </template>
      </ClientOnly>
    </nav>

    <Teleport to="body">
      <ClientOnly>
        <div
          v-if="isSidebarCollapsed && collapsedFlyoutItem"
          class="fixed inset-0 z-[55] bg-transparent"
          @click="collapsedFlyoutItem = null"
        ></div>
        <div
          v-if="isSidebarCollapsed && collapsedFlyoutItem"
          class="fixed left-20 z-[60] ml-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 text-slate-900 shadow-xl"
          :style="{ top: `${collapsedFlyoutTop}px` }"
        >
          <div class="border-b border-slate-100 px-3 pb-2">
            <p class="text-xs font-bold uppercase tracking-wider text-slate-500">
              {{ collapsedFlyoutItem.title }}
            </p>
          </div>
          <NuxtLink
            v-for="child in collapsedFlyoutItem.children"
            :key="child.href"
            :to="child.href"
            class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50"
            :class="isActive(child.href) ? 'bg-blue-50 text-[#012D5A]' : 'text-slate-700'"
            @click="collapsedFlyoutItem = null"
          >
            <component v-if="child.icon" :is="child.icon" class="w-4 h-4 shrink-0" />
            <span>{{ child.title }}</span>
          </NuxtLink>
        </div>
      </ClientOnly>
    </Teleport>

    <!-- Footer / User -->
    <div :class="cn('p-4 mt-auto relative', isSidebarCollapsed && 'px-3')">
      <!-- User Dropdown Menu -->
      <ClientOnly>
        <div
          v-if="isUserDropdownOpen"
          :class="
            cn(
              'absolute bottom-20 bg-white text-slate-900 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200',
              isSidebarCollapsed ? 'left-3 w-64' : 'left-4 w-56',
            )
          "
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
              @click="handleLogout"
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
          class="fixed inset-0 z-40 bg-transparent"
        ></div>

        <button
          v-if="user"
          @click="isUserDropdownOpen = !isUserDropdownOpen"
          :title="user.name"
          :class="
            cn(
              'flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer w-full text-left',
              isSidebarCollapsed && 'justify-center px-2',
              isUserDropdownOpen && 'bg-white/5',
            )
          "
        >
          <div
            class="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#012D5A] shrink-0"
          >
            <User class="w-6 h-6" />
          </div>
          <div v-if="!isSidebarCollapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">{{ user.name }}</p>
            <p class="text-xs text-white/60 truncate">{{ user.email }}</p>
          </div>
          <ChevronRight
            v-if="!isSidebarCollapsed"
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
