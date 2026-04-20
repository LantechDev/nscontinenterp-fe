import process from "node:process";
globalThis._importMeta_ = globalThis._importMeta_ || { url: "file:///_entry.js", env: process.env };
import {
  defineComponent,
  shallowRef,
  getCurrentInstance,
  provide,
  cloneVNode,
  h,
  createElementBlock,
  toRef,
  isRef,
  hasInjectionContext,
  inject,
  ref,
  computed,
  Suspense,
  shallowReactive,
  Fragment,
  defineAsyncComponent,
  unref,
  useSSRContext,
  createApp,
  mergeProps,
  withCtx,
  createVNode,
  onErrorCaptured,
  onServerPrefetch,
  resolveDynamicComponent,
  reactive,
  effectScope,
  isReadonly,
  isShallow,
  isReactive,
  toRaw,
  nextTick,
  getCurrentScope,
} from "vue";
import {
  h as hasProtocol,
  i as isScriptProtocol,
  j as joinURL,
  w as withQuery,
  s as sanitizeStatusCode,
  g as getContext,
  $ as $fetch$1,
  b as baseURL,
  c as createHooks,
  e as executeAsync,
  a as createError$1,
  t as toRouteMatcher,
  d as createRouter$1,
  f as defu,
} from "../nitro/nitro.mjs";
import {
  RouterView,
  useRoute as useRoute$1,
  createMemoryHistory,
  createRouter,
  START_LOCATION,
} from "vue-router";
import {
  ssrRenderAttrs,
  ssrRenderComponent,
  ssrRenderSuspense,
  ssrRenderVNode,
} from "vue/server-renderer";
import "node:http";
import "node:https";
import "node:events";
import "node:buffer";
import "node:fs";
import "node:path";
import "node:crypto";
import "node:url";
import "ipx";

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL(),
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { componentName: "NuxtLink" };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false,
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    versions: {
      get nuxt() {
        return "4.2.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      },
    },
    payload: shallowReactive({
      ...(options.ssrContext?.payload || {}),
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({}),
    }),
    static: {
      data: {},
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {};
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options,
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app,
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function (hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) =>
      nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = (await nuxtApp.runWithContext(() => plugin2(nuxtApp))) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin =
      plugin2.dependsOn?.filter(
        (name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name),
      ) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2)
        .then(async () => {
          if (plugin2._name) {
            resolvedPlugins.add(plugin2._name);
            await Promise.all(
              unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
                if (dependsOn.has(plugin2._name)) {
                  dependsOn.delete(plugin2._name);
                  if (dependsOn.size === 0) {
                    promiseDepth++;
                    await executePlugin(unexecutedPlugin);
                  }
                }
              }),
            );
          }
        })
        .catch((e) => {
          if (!plugin2.parallel && !nuxtApp.payload.error) {
            throw e;
          }
          error ||= e;
        });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {}), plugin2, {
    [NuxtPluginIndicator]: true,
    _name,
  });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = /* @__PURE__ */ Symbol("layout-meta");
const PageRouteSymbol = /* @__PURE__ */ Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath =
    typeof to === "string"
      ? to
      : "path" in to
        ? resolveRouteObject(to)
        : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error(
        "Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.",
      );
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath =
        typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal
        ? toPath
        : joinURL(/* @__PURE__ */ useRuntimeConfig().app.baseURL, fullPath);
      const redirect = async function (response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader },
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => (final.fullPath === fullPath ? redirect(false) : void 0));
        return to;
      }
      return redirect(
        !inMiddleware
          ? void 0
          : /* abort route navigation */
            false,
      );
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {});
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false);
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) =>
  !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false,
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  },
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: /* @__PURE__ */ useRuntimeConfig().nitro.routeRules }),
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const __nuxt_page_meta$J = {
  layout: "default",
};
const __nuxt_page_meta$I = {
  layout: "default",
};
const __nuxt_page_meta$H = {
  layout: "default",
};
const __nuxt_page_meta$G = {
  layout: "dashboard",
};
const __nuxt_page_meta$F = {
  middleware: [
    function (to, from) {
      return navigateTo("/reports/profit-loss");
    },
  ],
};
const __nuxt_page_meta$E = {
  layout: "dashboard",
};
const __nuxt_page_meta$D = {
  layout: "dashboard",
};
const __nuxt_page_meta$C = {
  layout: "dashboard",
  title: "Finance Dashboard",
  hideHeader: true,
};
const __nuxt_page_meta$B = {
  layout: "dashboard",
};
const __nuxt_page_meta$A = {
  layout: "dashboard",
};
const __nuxt_page_meta$z = {
  layout: "dashboard",
};
const __nuxt_page_meta$y = {
  layout: "dashboard",
};
const __nuxt_page_meta$x = {
  layout: "dashboard",
};
const __nuxt_page_meta$w = {
  layout: "dashboard",
};
const __nuxt_page_meta$v = {
  layout: "dashboard",
};
const __nuxt_page_meta$u = {
  layout: "dashboard",
};
const __nuxt_page_meta$t = {
  layout: "dashboard",
};
const __nuxt_page_meta$s = {
  layout: "dashboard",
};
const __nuxt_page_meta$r = {
  layout: "dashboard",
};
const __nuxt_page_meta$q = {
  layout: "dashboard",
};
const __nuxt_page_meta$p = {
  layout: "dashboard",
};
const __nuxt_page_meta$o = {
  layout: "dashboard",
};
const __nuxt_page_meta$n = {
  layout: "dashboard",
};
const __nuxt_page_meta$m = {
  layout: "dashboard",
};
const __nuxt_page_meta$l = {
  layout: "dashboard",
};
const __nuxt_page_meta$k = {
  layout: "dashboard",
};
const __nuxt_page_meta$j = {
  layout: "dashboard",
};
const __nuxt_page_meta$i = {
  layout: "dashboard",
};
const __nuxt_page_meta$h = {
  layout: "dashboard",
};
const __nuxt_page_meta$g = {
  layout: "dashboard",
};
const __nuxt_page_meta$f = {
  layout: "dashboard",
};
const __nuxt_page_meta$e = {
  layout: "dashboard",
};
const __nuxt_page_meta$d = {
  layout: "dashboard",
};
const __nuxt_page_meta$c = {
  layout: "dashboard",
};
const __nuxt_page_meta$b = {
  layout: "dashboard",
};
const __nuxt_page_meta$a = {
  layout: "dashboard",
};
const __nuxt_page_meta$9 = {
  layout: "dashboard",
  title: "Create Job",
};
const __nuxt_page_meta$8 = {
  layout: "dashboard",
};
const __nuxt_page_meta$7 = {
  layout: "dashboard",
};
const __nuxt_page_meta$6 = {
  layout: "dashboard",
};
const __nuxt_page_meta$5 = {
  layout: "dashboard",
  title: "Closed Period Details",
};
const __nuxt_page_meta$4 = {
  layout: "dashboard",
  title: "Outstanding Report",
  hideHeader: true,
};
const __nuxt_page_meta$3 = {
  layout: "dashboard",
  title: "Edit Job",
};
const __nuxt_page_meta$2 = {
  layout: "dashboard",
  title: "Buat Transaksi",
};
const __nuxt_page_meta$1 = {
  layout: "dashboard",
};
const __nuxt_page_meta = {
  layout: "dashboard",
  title: "Account Detail",
};
const _routes = [
  {
    name: "index",
    path: "/",
    meta: __nuxt_page_meta$J || {},
    component: () => import("./index-CPtRxDuS.mjs"),
  },
  {
    name: "login",
    path: "/login",
    meta: __nuxt_page_meta$I || {},
    component: () => import("./login-BW1O9jZV.mjs"),
  },
  {
    name: "offline",
    path: "/offline",
    meta: __nuxt_page_meta$H || {},
    component: () => import("./offline-CRLtIZ8p.mjs"),
  },
  {
    name: "dashboard",
    path: "/dashboard",
    meta: __nuxt_page_meta$G || {},
    component: () => import("./dashboard-CCtWU0zP.mjs"),
  },
  {
    name: "reports",
    path: "/reports",
    meta: __nuxt_page_meta$F || {},
    component: () => import("./index-BaYLKFk_.mjs"),
  },
  {
    name: "finance-tax-id",
    path: "/finance/tax/:id()",
    meta: __nuxt_page_meta$E || {},
    component: () => import("./_id_-Q-THr2tZ.mjs"),
  },
  {
    name: "reports-cashflow",
    path: "/reports/cashflow",
    meta: __nuxt_page_meta$D || {},
    component: () => import("./cashflow-CiJcCHwp.mjs"),
  },
  {
    name: "finance-dashboard",
    path: "/finance/dashboard",
    meta: __nuxt_page_meta$C || {},
    component: () => import("./dashboard-3d5fi9bZ.mjs"),
  },
  {
    name: "finance-tax",
    path: "/finance/tax",
    meta: __nuxt_page_meta$B || {},
    component: () => import("./index-BDBTQOEl.mjs"),
  },
  {
    name: "finance-tax-create",
    path: "/finance/tax/create",
    meta: __nuxt_page_meta$A || {},
    component: () => import("./create-BKL4ukAW.mjs"),
  },
  {
    name: "master-vessel",
    path: "/master/vessel",
    meta: __nuxt_page_meta$z || {},
    component: () => import("./index-Cl7MNCkQ.mjs"),
  },
  {
    name: "operational-closing",
    path: "/operational/closing",
    meta: __nuxt_page_meta$y || {},
    component: () => import("./closing-BOB50JZ9.mjs"),
  },
  {
    name: "reports-profit-loss",
    path: "/reports/profit-loss",
    meta: __nuxt_page_meta$x || {},
    component: () => import("./profit-loss-nBvsuKtO.mjs"),
  },
  {
    name: "finance-invoice-id",
    path: "/finance/invoice/:id()",
    meta: __nuxt_page_meta$w || {},
    component: () => import("./_id_-6np9mMEF.mjs"),
  },
  {
    name: "master-company",
    path: "/master/company",
    meta: __nuxt_page_meta$v || {},
    component: () => import("./index-DfGRU-Hm.mjs"),
  },
  {
    name: "master-services-id",
    path: "/master/services/:id()",
    meta: __nuxt_page_meta$u || {},
    component: () => import("./_id_-Cw4xmGG6.mjs"),
  },
  {
    name: "operational-ebl-id",
    path: "/operational/ebl/:id()",
    meta: __nuxt_page_meta$t || {},
    component: () => import("./_id_-C0jzt-8L.mjs"),
  },
  {
    name: "sales-quotation-id",
    path: "/sales/quotation/:id()",
    meta: __nuxt_page_meta$s || {},
    component: () => import("./_id_-CwC606cn.mjs"),
  },
  {
    name: "settings-roles",
    path: "/settings/roles",
    meta: __nuxt_page_meta$r || {},
    component: () => import("./index-DWCiv0gC.mjs"),
  },
  {
    name: "settings-users",
    path: "/settings/users",
    meta: __nuxt_page_meta$q || {},
    component: () => import("./index-hXakRmlh.mjs"),
  },
  {
    name: "finance-expenses-id",
    path: "/finance/expenses/:id()",
    meta: __nuxt_page_meta$p || {},
    component: () => import("./_id_-wfet4lgo.mjs"),
  },
  {
    name: "finance-invoice",
    path: "/finance/invoice",
    meta: __nuxt_page_meta$o || {},
    component: () => import("./index-Cisge6GJ.mjs"),
  },
  {
    name: "master-services",
    path: "/master/services",
    meta: __nuxt_page_meta$n || {},
    component: () => import("./index-Db8phTw9.mjs"),
  },
  {
    name: "operational-ebl",
    path: "/operational/ebl",
    meta: __nuxt_page_meta$m || {},
    component: () => import("./index-CEO6sk4t.mjs"),
  },
  {
    name: "sales-quotation",
    path: "/sales/quotation",
    meta: __nuxt_page_meta$l || {},
    component: () => import("./index-8DIUcjIV.mjs"),
  },
  {
    name: "settings-roles-create",
    path: "/settings/roles/create",
    meta: __nuxt_page_meta$k || {},
    component: () => import("./create-CPhseWn5.mjs"),
  },
  {
    name: "settings-tenant",
    path: "/settings/tenant",
    meta: __nuxt_page_meta$j || {},
    component: () => import("./index-BRsWskUZ.mjs"),
  },
  {
    name: "settings-users-create",
    path: "/settings/users/create",
    meta: __nuxt_page_meta$i || {},
    component: () => import("./create-CrjmQlTT.mjs"),
  },
  {
    name: "finance-expenses",
    path: "/finance/expenses",
    meta: __nuxt_page_meta$h || {},
    component: () => import("./index-4intI7un.mjs"),
  },
  {
    name: "finance-invoice-create",
    path: "/finance/invoice/create",
    meta: __nuxt_page_meta$g || {},
    component: () => import("./create-nYb8_ZwE.mjs"),
  },
  {
    name: "finance-journal-create",
    path: "/finance/journal/create",
    meta: __nuxt_page_meta$f || {},
    component: () => import("./create-Dw6IfXCy.mjs"),
  },
  {
    name: "master-services-create",
    path: "/master/services/create",
    meta: __nuxt_page_meta$e || {},
    component: () => import("./create-COdwUDh6.mjs"),
  },
  {
    name: "operational-ebl-create",
    path: "/operational/ebl/create",
    meta: __nuxt_page_meta$d || {},
    component: () => import("./create-DVKo0VAx.mjs"),
  },
  {
    name: "operational-jobs",
    path: "/operational/jobs",
    meta: __nuxt_page_meta$c || {},
    component: () => import("./index-0432saj3.mjs"),
  },
  {
    name: "sales-quotation-create",
    path: "/sales/quotation/create",
    meta: __nuxt_page_meta$b || {},
    component: () => import("./create-CnxbJT4t.mjs"),
  },
  {
    name: "finance-expenses-create",
    path: "/finance/expenses/create",
    meta: __nuxt_page_meta$a || {},
    component: () => import("./create-BnDH40vJ.mjs"),
  },
  {
    name: "operational-jobs-create",
    path: "/operational/jobs/create",
    meta: __nuxt_page_meta$9 || {},
    component: () => import("./create-BDGg-CLG.mjs"),
  },
  {
    name: "settings-roles-id-edit",
    path: "/settings/roles/:id()/edit",
    meta: __nuxt_page_meta$8 || {},
    component: () => import("./edit-EmZUZqvn.mjs"),
  },
  {
    name: "settings-users-id-edit",
    path: "/settings/users/:id()/edit",
    meta: __nuxt_page_meta$7 || {},
    component: () => import("./edit-CvnsQeKS.mjs"),
  },
  {
    name: "settings-users-id",
    path: "/settings/users/:id()",
    meta: __nuxt_page_meta$6 || {},
    component: () => import("./index-CUL_A4PR.mjs"),
  },
  {
    name: "finance-finance-close-id",
    path: "/finance/finance-close/:id()",
    meta: __nuxt_page_meta$5 || {},
    component: () => import("./_id_-Dm8Tq6y5.mjs"),
  },
  {
    name: "finance-report-outstanding",
    path: "/finance/report/outstanding",
    meta: __nuxt_page_meta$4 || {},
    component: () => import("./outstanding-BeS4iBVQ.mjs"),
  },
  {
    name: "operational-jobs-id-edit",
    path: "/operational/jobs/:id()/edit",
    meta: __nuxt_page_meta$3 || {},
    component: () => import("./edit-DG-sqHkq.mjs"),
  },
  {
    name: "finance-tax-components",
    path: "/finance/tax/components",
    component: () =>
      import("./index-xuQBAI3p.mjs").then(function (n) {
        return n.i;
      }),
  },
  {
    name: "finance-transactions-create",
    path: "/finance/transactions/create",
    meta: __nuxt_page_meta$2 || {},
    component: () => import("./create-BV3UwjQo.mjs"),
  },
  {
    name: "settings-activity-logs",
    path: "/settings/activity-logs",
    meta: __nuxt_page_meta$1 || {},
    component: () => import("./index-BuyzPoU4.mjs"),
  },
  {
    name: "master-vessel-components",
    path: "/master/vessel/components",
    component: () => import("./index-CSedkFrD.mjs"),
  },
  {
    name: "settings-roles-components",
    path: "/settings/roles/components",
    component: () =>
      import("./index-D-4-Nze-.mjs").then(function (n) {
        return n.i;
      }),
  },
  {
    name: "finance-invoice-components",
    path: "/finance/invoice/components",
    component: () => import("./index-BdA2hnTR.mjs"),
  },
  {
    name: "master-services-components",
    path: "/master/services/components",
    component: () => import("./index-D_WBkLtT.mjs"),
  },
  {
    name: "finance-expenses-components",
    path: "/finance/expenses/components",
    component: () =>
      import("./index-BT9C6lFI.mjs").then(function (n) {
        return n.i;
      }),
  },
  {
    name: "finance-trial-balance-accountId",
    path: "/finance/trial-balance/:accountId()",
    meta: __nuxt_page_meta || {},
    component: () => import("./_accountId_-5YYPwFL4.mjs"),
  },
  {
    name: "finance-invoice-utils-pdf-generator",
    path: "/finance/invoice/utils/pdf-generator",
    component: () => import("./pdf-generator-B0NvKaaU.mjs"),
  },
  {
    name: "finance-expenses-utils-pdf-generator",
    path: "/finance/expenses/utils/pdf-generator",
    component: () => import("./pdf-generator-wwR8fvwZ.mjs"),
  },
  {
    name: "finance-tax-components-TaxEditModal",
    path: "/finance/tax/components/TaxEditModal",
    component: () =>
      import("./index-xuQBAI3p.mjs").then(function (n) {
        return n.T;
      }),
  },
  {
    name: "master-vessel-components-VesselStats",
    path: "/master/vessel/components/VesselStats",
    component: () => import("./VesselStats-DdMK8Yed.mjs"),
  },
  {
    name: "master-vessel-components-VesselTable",
    path: "/master/vessel/components/VesselTable",
    component: () => import("./VesselTable-zIHHJvqD.mjs"),
  },
  {
    name: "operational-jobs-components-JobBlTab",
    path: "/operational/jobs/components/JobBlTab",
    component: () => import("./JobBlTab-CuDR5bCH.mjs"),
  },
  {
    name: "master-company-components-CompanyGrid",
    path: "/master/company/components/CompanyGrid",
    component: () => import("./CompanyGrid-BtmfT20H.mjs"),
  },
  {
    name: "master-company-components-CompanyList",
    path: "/master/company/components/CompanyList",
    component: () => import("./CompanyList-D7lfcCYm.mjs"),
  },
  {
    name: "master-company-components-CompanyJobTab",
    path: "/master/company/components/CompanyJobTab",
    component: () => import("./CompanyJobTab-CfI_QLca.mjs"),
  },
  {
    name: "operational-jobs-components-JobPartyRow",
    path: "/operational/jobs/components/JobPartyRow",
    component: () => import("./JobPartyRow-CsBs8qVt.mjs"),
  },
  {
    name: "operational-jobs-components-SectionCard",
    path: "/operational/jobs/components/SectionCard",
    component: () => import("./SectionCard-BNHBHmfw.mjs"),
  },
  {
    name: "master-company-components-CompanySidebar",
    path: "/master/company/components/CompanySidebar",
    component: () => import("./CompanySidebar-C5zL0YBH.mjs"),
  },
  {
    name: "master-vessel-components-VesselFormModal",
    path: "/master/vessel/components/VesselFormModal",
    component: () => import("./VesselFormModal-Bs2RtofN.mjs"),
  },
  {
    name: "master-company-components-CompanyNotesTab",
    path: "/master/company/components/CompanyNotesTab",
    component: () => import("./CompanyNotesTab-BrQDifYh.mjs"),
  },
  {
    name: "finance-invoice-components-InvoiceGridView",
    path: "/finance/invoice/components/InvoiceGridView",
    component: () => import("./InvoiceGridView-CoQ_ezBl.mjs"),
  },
  {
    name: "finance-invoice-components-InvoiceListView",
    path: "/finance/invoice/components/InvoiceListView",
    component: () => import("./InvoiceListView-XMs5mdHT.mjs"),
  },
  {
    name: "master-services-components-ServiceGridView",
    path: "/master/services/components/ServiceGridView",
    component: () => import("./ServiceGridView-BmWLe_q5.mjs"),
  },
  {
    name: "master-services-components-ServiceListView",
    path: "/master/services/components/ServiceListView",
    component: () => import("./ServiceListView-CCgGhho6.mjs"),
  },
  {
    name: "operational-jobs-components-JobOverviewTab",
    path: "/operational/jobs/components/JobOverviewTab",
    component: () => import("./JobOverviewTab-BSyMBwLP.mjs"),
  },
  {
    name: "settings-roles-components-PermissionsTable",
    path: "/settings/roles/components/PermissionsTable",
    component: () =>
      import("./index-D-4-Nze-.mjs").then(function (n) {
        return n.P;
      }),
  },
  {
    name: "finance-invoice-components-InvoiceEditModal",
    path: "/finance/invoice/components/InvoiceEditModal",
    component: () => import("./InvoiceEditModal-D0WGWSNK.mjs"),
  },
  {
    name: "master-company-components-CompanyAddressTab",
    path: "/master/company/components/CompanyAddressTab",
    component: () => import("./CompanyAddressTab-CvjBOTg2.mjs"),
  },
  {
    name: "master-company-components-CompanyInvoiceTab",
    path: "/master/company/components/CompanyInvoiceTab",
    component: () => import("./CompanyInvoiceTab-DxL6RABJ.mjs"),
  },
  {
    name: "finance-expenses-components-ExpenseEditModal",
    path: "/finance/expenses/components/ExpenseEditModal",
    component: () =>
      import("./index-BT9C6lFI.mjs").then(function (n) {
        return n.E;
      }),
  },
  {
    name: "master-company-components-CompanyActivityTab",
    path: "/master/company/components/CompanyActivityTab",
    component: () => import("./CompanyActivityTab-CyC0EgTh.mjs"),
  },
  {
    name: "master-company-components-CompanyAddressForm",
    path: "/master/company/components/CompanyAddressForm",
    component: () => import("./CompanyAddressForm-VBZNMe2f.mjs"),
  },
  {
    name: "master-company-components-CompanyCreateModal",
    path: "/master/company/components/CompanyCreateModal",
    component: () => import("./CompanyCreateModal-BTEc1Ih0.mjs"),
  },
  {
    name: "master-company-components-CompanyDetailModal",
    path: "/master/company/components/CompanyDetailModal",
    component: () => import("./CompanyDetailModal-Dqa6C3Om.mjs"),
  },
  {
    name: "master-company-components-CompanyMainContent",
    path: "/master/company/components/CompanyMainContent",
    component: () => import("./CompanyMainContent-CRL18xQD.mjs"),
  },
  {
    name: "master-services-components-ServiceCreateModal",
    path: "/master/services/components/ServiceCreateModal",
    component: () => import("./ServiceCreateModal-CaY7_020.mjs"),
  },
  {
    name: "master-company-components-useCompanyAddressForm",
    path: "/master/company/components/useCompanyAddressForm",
    component: () => import("./useCompanyAddressForm-5b9x2tuV.mjs"),
  },
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source =
    route?.meta.key ??
    route.path
      .replace(ROUTE_KEY_PARENTHESES_RE, "$1")
      .replace(ROUTE_KEY_SYMBOLS_RE, "$1")
      .replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) =>
      comp.components && comp.components.default === from.matched[index]?.components?.default,
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return {
          el: to.hash,
          top: _getHashElementScrollMarginTop(to.hash),
          behavior: hashScrollBehaviour,
        };
      }
      return false;
    }
    const routeAllowsScrollToTop =
      typeof to.meta.scrollToTop === "function"
        ? to.meta.scrollToTop(to, from)
        : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() =>
          resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)),
        );
      });
    });
  },
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (
        (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) +
        (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0)
      );
    }
  } catch {}
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant",
    };
  }
  return {
    left: 0,
    top: 0,
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto",
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0,
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result =
    (([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to)))),
    (__temp = await __temp),
    __restore(),
    __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: (result && result.statusCode) || 404,
    statusMessage: (result && result.statusMessage) || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath,
    },
  });
  return error;
});
function getErrorMessage$1(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}
function handleApiError$1(error) {
  return { success: false, error: getErrorMessage$1(error) };
}
function getApiBase() {
  const config = /* @__PURE__ */ useRuntimeConfig();
  return config.public.apiBase;
}
const authApi = {
  async getSession() {
    try {
      return await $fetch(`${getApiBase()}/auth/get-session`, {
        credentials: "include",
      });
    } catch (error) {
      console.warn("[Auth] Session fetch failed:", error);
      return null;
    }
  },
  async signIn(email, password) {
    try {
      const data = await $fetch(`${getApiBase()}/auth/sign-in/email`, {
        method: "POST",
        body: { email, password },
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async signOut() {
    try {
      await $fetch(`${getApiBase()}/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async createUser(name, email, password, role) {
    try {
      const data = await $fetch(`${getApiBase()}/auth/admin/create-user`, {
        method: "POST",
        body: { name, email, password, role },
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async requestPasswordReset(email, redirectTo) {
    try {
      await $fetch(`${getApiBase()}/auth/request-password-reset`, {
        method: "POST",
        body: { email, redirectTo },
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async resetPassword(newPassword, token) {
    try {
      await $fetch(`${getApiBase()}/auth/reset-password`, {
        method: "POST",
        body: { newPassword, token },
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async changePassword(currentPassword, newPassword) {
    try {
      await $fetch(`${getApiBase()}/auth/change-password`, {
        method: "POST",
        body: { currentPassword, newPassword },
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async updateUser(data) {
    try {
      const responseData = await $fetch(`${getApiBase()}/auth/update-user`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async fetchUsers() {
    try {
      const data = await $fetch(`${getApiBase()}/admin/users`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async fetchUserById(id) {
    try {
      const data = await $fetch(`${getApiBase()}/admin/users/${id}`, {
        credentials: "include",
      });
      return { success: true, data: { user: data } };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async adminUpdateUser(userId, data) {
    try {
      const responseData = await $fetch(`${getApiBase()}/auth/admin/update-user`, {
        method: "POST",
        body: { userId, data },
        credentials: "include",
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async deleteUser(userId) {
    try {
      await $fetch(`${getApiBase()}/auth/admin/delete-user`, {
        method: "POST",
        body: { userId },
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async listOrganizations() {
    try {
      const data = await $fetch(`${getApiBase()}/auth/organization/list`, {
        credentials: "include",
      });
      return { success: true, data };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async setActiveOrganization(organizationId) {
    try {
      await $fetch(`${getApiBase()}/auth/organization/set-active`, {
        method: "POST",
        body: { organizationId },
        credentials: "include",
      });
      return { success: true };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async createOrganization(data) {
    try {
      const responseData = await $fetch(`${getApiBase()}/auth/organization/create`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
  async updateOrganization(organizationId, data) {
    try {
      const responseData = await $fetch(`${getApiBase()}/auth/organization/update`, {
        method: "POST",
        body: { organizationId, data },
        credentials: "include",
      });
      return { success: true, data: responseData };
    } catch (error) {
      return handleApiError$1(error);
    }
  },
};
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
function useAuth() {
  const user = useState("auth-user", () => null);
  const session = useState("auth-session", () => null);
  const isLoading = ref(true);
  async function fetchSession() {
    isLoading.value = true;
    try {
      const data = await authApi.getSession();
      user.value = data?.user || null;
      session.value = data?.session || null;
      return data;
    } catch (error) {
      console.warn("[Auth] Session fetch failed:", error);
      user.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  }
  async function login(email, password) {
    isLoading.value = true;
    try {
      const result = await authApi.signIn(email, password);
      if (result.success && result.data) {
        user.value = result.data.user || null;
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }
  async function logout() {
    isLoading.value = true;
    try {
      const result = await authApi.signOut();
      if (result.success) user.value = null;
      return result;
    } finally {
      isLoading.value = false;
    }
  }
  async function createUser(name, email, password, role) {
    isLoading.value = true;
    try {
      return await authApi.createUser(name, email, password, role);
    } finally {
      isLoading.value = false;
    }
  }
  async function requestPasswordReset(email, redirectTo) {
    isLoading.value = true;
    try {
      return await authApi.requestPasswordReset(email, redirectTo);
    } finally {
      isLoading.value = false;
    }
  }
  async function resetPassword(newPassword, token) {
    isLoading.value = true;
    try {
      return await authApi.resetPassword(newPassword, token);
    } finally {
      isLoading.value = false;
    }
  }
  async function changePassword(currentPassword, newPassword) {
    isLoading.value = true;
    try {
      return await authApi.changePassword(currentPassword, newPassword);
    } finally {
      isLoading.value = false;
    }
  }
  async function updateUser(data) {
    isLoading.value = true;
    try {
      const result = await authApi.updateUser(data);
      if (result.success && result.data?.user) {
        user.value = { ...user.value, ...result.data.user };
      }
      return result;
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchUsers() {
    isLoading.value = true;
    try {
      return await authApi.fetchUsers();
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchUserById(id) {
    isLoading.value = true;
    try {
      return await authApi.fetchUserById(id);
    } finally {
      isLoading.value = false;
    }
  }
  async function adminUpdateUser(userId, data) {
    isLoading.value = true;
    try {
      return await authApi.adminUpdateUser(userId, data);
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteUser(userId) {
    isLoading.value = true;
    try {
      return await authApi.deleteUser(userId);
    } finally {
      isLoading.value = false;
    }
  }
  async function listOrganizations() {
    isLoading.value = true;
    try {
      return await authApi.listOrganizations();
    } finally {
      isLoading.value = false;
    }
  }
  async function setActiveOrganization(organizationId) {
    isLoading.value = true;
    try {
      const result = await authApi.setActiveOrganization(organizationId);
      if (result.success) await fetchSession();
      return result;
    } finally {
      isLoading.value = false;
    }
  }
  async function createOrganization(data) {
    isLoading.value = true;
    try {
      return await authApi.createOrganization(data);
    } finally {
      isLoading.value = false;
    }
  }
  async function updateOrganization(organizationId, data) {
    isLoading.value = true;
    try {
      return await authApi.updateOrganization(organizationId, data);
    } finally {
      isLoading.value = false;
    }
  }
  const isLoggedIn = computed(() => !!user.value);
  const isOwner = computed(() => user.value?.role === "owner" || user.value?.role === "OWNER");
  const isAdmin = computed(() => user.value?.role === "admin" || user.value?.role === "ADMIN");
  const canApproveJobs = computed(() => isOwner.value);
  return {
    user,
    session,
    isLoggedIn,
    isOwner,
    isAdmin,
    canApproveJobs,
    isLoading,
    fetchSession,
    login,
    logout,
    createUser,
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateUser,
    fetchUsers,
    fetchUserById,
    adminUpdateUser,
    deleteUser,
    listOrganizations,
    setActiveOrganization,
    createOrganization,
    updateOrganization,
  };
}
function getErrorMessage(error) {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = error.data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}
function handleApiError(error) {
  return { success: false, error: getErrorMessage(error) };
}
function useRoles() {
  const config = /* @__PURE__ */ useRuntimeConfig();
  const isLoading = ref(false);
  const roles = useState("roles-list", () => []);
  async function fetchRoles() {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/admin/roles`, {
        credentials: "include",
      });
      roles.value = data || [];
      return { success: true, data: roles.value };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function createRole(roleData) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/admin/roles`, {
        method: "POST",
        body: roleData,
        credentials: "include",
      });
      roles.value = [...roles.value, data];
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function updateRole(id, roleData) {
    isLoading.value = true;
    try {
      const data = await $fetch(`${config.public.apiBase}/admin/roles/${id}`, {
        method: "PUT",
        body: roleData,
        credentials: "include",
      });
      roles.value = roles.value.map((r) => (r.id === id ? { ...r, ...data } : r));
      return { success: true, data };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteRole(id) {
    isLoading.value = true;
    try {
      await $fetch(`${config.public.apiBase}/admin/roles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      roles.value = roles.value.filter((r) => r.id !== id);
      return { success: true };
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }
  return {
    roles,
    isLoading,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  };
}
function normalizeRoleCode(role) {
  return role?.trim().toLowerCase() || "";
}
function hasResourcePermission(role, resource, action) {
  const actions = role?.permissions?.[resource] || [];
  if (!action) {
    return actions.length > 0;
  }
  return actions.includes(action);
}
function useRoleAccess() {
  const { user } = useAuth();
  const { roles } = useRoles();
  useState("role-access-loading", () => false);
  const normalizedUserRole = computed(() => normalizeRoleCode(user.value?.role));
  const isAdminRole = computed(() => {
    const role = normalizedUserRole.value;
    if (!role) {
      return false;
    }
    return ["admin", "administrator", "superadmin", "super_admin"].includes(role);
  });
  const currentRole = computed(() => {
    if (!user.value?.role) {
      return null;
    }
    return (
      roles.value.find((role) => normalizeRoleCode(role.code) === normalizedUserRole.value) || null
    );
  });
  const ensureRolesLoaded = async () => {
    {
      return;
    }
  };
  const hasPermission = (resource, action = "read") => {
    if (isAdminRole.value) {
      return true;
    }
    return hasResourcePermission(currentRole.value, resource, action);
  };
  const hasAnyPermission = (resource) => {
    if (isAdminRole.value) {
      return true;
    }
    return hasResourcePermission(currentRole.value, resource);
  };
  const canAccessFinance = () =>
    hasAnyPermission("invoice") || hasAnyPermission("payment") || hasAnyPermission("report");
  const isOwnProfileRoute = (path) => {
    const currentUserId = user.value?.id;
    if (!currentUserId) {
      return false;
    }
    return path === `/settings/users/${currentUserId}`;
  };
  const canAccessPath = (path) => {
    if (isAdminRole.value) {
      return true;
    }
    if (!path || path === "/" || path.startsWith("/dashboard")) {
      return true;
    }
    if (isOwnProfileRoute(path)) {
      return true;
    }
    if (
      path.startsWith("/master/company") ||
      path.startsWith("/master/services") ||
      path.startsWith("/master/vessel")
    ) {
      return hasAnyPermission("company");
    }
    if (path.startsWith("/operational/")) {
      return hasAnyPermission("job");
    }
    if (
      path.startsWith("/finance/dashboard") ||
      path.startsWith("/finance/finance-close") ||
      path.startsWith("/finance/tax") ||
      path.startsWith("/finance/trial-balance")
    ) {
      return canAccessFinance();
    }
    if (path.startsWith("/finance/invoice")) {
      return hasAnyPermission("invoice");
    }
    if (
      path.startsWith("/finance/expenses") ||
      path.startsWith("/finance/transactions") ||
      path.startsWith("/finance/journal")
    ) {
      return hasAnyPermission("payment");
    }
    if (path.startsWith("/settings/users")) {
      return hasAnyPermission("member");
    }
    if (path.startsWith("/settings/roles")) {
      return hasAnyPermission("member");
    }
    if (path.startsWith("/settings/activity-logs")) {
      return hasAnyPermission("report") || hasAnyPermission("organization");
    }
    if (path.startsWith("/settings/tenant")) {
      return hasAnyPermission("organization");
    }
    return true;
  };
  return {
    currentRole,
    ensureRolesLoaded,
    hasPermission,
    hasAnyPermission,
    canAccessPath,
    canAccessFinance,
    isAdminRole,
  };
}
const auth_45global = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, _from) => {
  useAuth();
  useRoleAccess();
  const publicRoutes = ["/login", "/"];
  publicRoutes.includes(to.path);
  {
    return;
  }
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [validate, auth_45global, manifest_45route_45rule];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = /* @__PURE__ */ useRuntimeConfig().app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes
      ? ((([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes))),
        (__temp = await __temp),
        __restore(),
        __temp) ?? _routes)
      : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes,
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value,
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    router.afterEach((to, from) => {
      if (to.matched.at(-1)?.components?.default === from.matched.at(-1)?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = { sync: syncCurrentRoute };
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true,
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {},
    };
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        (([__temp, __restore] = executeAsync(() => router.push(initialURL))),
          await __temp,
          __restore());
      }
      (([__temp, __restore] = executeAsync(() => router.isReady())), await __temp, __restore());
    } catch (error2) {
      (([__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2)))),
        await __temp,
        __restore());
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([
          ...globalMiddleware,
          ...nuxtApp._middleware.global,
        ]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware =
            typeof entry2 === "string"
              ? nuxtApp._middleware.named[entry2] ||
                (await namedMiddleware[entry2]?.().then((r) => r.default || r))
              : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false);
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 =
                  result ||
                  createError({
                    statusCode: 404,
                    statusMessage: `Page Not Found: ${initialURL}`,
                  });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() =>
          showError(
            createError({
              statusCode: 404,
              fatal: false,
              statusMessage: `Page not found: ${to.fullPath}`,
              data: {
                path: to.fullPath,
              },
            }),
          ),
        );
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true,
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  },
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  [
    "EmptyShallowRef",
    (data) =>
      isRef(data) &&
      isShallow(data) &&
      !data.value &&
      (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ],
  [
    "EmptyRef",
    (data) =>
      isRef(data) &&
      !data.value &&
      (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_"),
  ],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)],
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms =
  /* @__PURE__ */ defineNuxtPlugin({
    name: "nuxt:revive-payload:server",
    setup() {
      for (const [reducer, fn] of reducers) {
        definePayloadReducer(reducer, fn);
      }
    },
  });
const components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8 =
  /* @__PURE__ */ defineNuxtPlugin({
    name: "nuxt:global-components",
  });
const pwa_icons_plugin_OtOZ6CGly_Vz5_PCGGLA9qHLz2Y5_d5czYAX7q_3Lug =
  /* @__PURE__ */ defineNuxtPlugin(() => {
    return {
      provide: {
        pwaIcons: {
          transparent: {},
          maskable: {},
          favicon: {},
          apple: {},
          appleSplashScreen: {},
        },
      },
    };
  });
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_4kY4pyzJIYX99vmMAAIorFf3CnAaptHitJgf7JxiED8,
  pwa_icons_plugin_OtOZ6CGly_Vz5_PCGGLA9qHLz2Y5_d5czYAX7q_3Lug,
];
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  },
});
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
const __nuxt_component_1$1 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  },
});
function defaultEstimatedProgress(duration, elapsed) {
  const completionPercentage = (elapsed / duration) * 100;
  return (2 / Math.PI) * 100 * Math.atan(completionPercentage / 50);
}
function createLoadingIndicator(opts = {}) {
  const { duration = 2e3, throttle = 200, hideDelay = 500, resetDelay = 400 } = opts;
  opts.estimatedProgress || defaultEstimatedProgress;
  const nuxtApp = useNuxtApp();
  const progress = shallowRef(0);
  const isLoading = shallowRef(false);
  const error = shallowRef(false);
  const start = (opts2 = {}) => {
    error.value = false;
    set(0, opts2);
  };
  function set(at = 0, opts2 = {}) {
    if (nuxtApp.isHydrating) {
      return;
    }
    if (at >= 100) {
      return finish({ force: opts2.force });
    }
    progress.value = at < 0 ? 0 : at;
    opts2.force ? 0 : throttle;
    {
      isLoading.value = true;
    }
  }
  function finish(opts2 = {}) {
    progress.value = 100;
    if (opts2.error) {
      error.value = true;
    }
    if (opts2.force) {
      progress.value = 0;
      isLoading.value = false;
    }
  }
  function clear() {}
  let _cleanup = () => {};
  return {
    _cleanup,
    progress: computed(() => progress.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    start,
    set,
    finish,
    clear,
  };
}
function useLoadingIndicator(opts = {}) {
  const nuxtApp = useNuxtApp();
  const indicator = (nuxtApp._loadingIndicator ||= createLoadingIndicator(opts));
  return indicator;
}
const __nuxt_component_1 = defineComponent({
  name: "NuxtLoadingIndicator",
  props: {
    throttle: {
      type: Number,
      default: 200,
    },
    duration: {
      type: Number,
      default: 2e3,
    },
    hideDelay: {
      type: Number,
      default: 500,
    },
    resetDelay: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 3,
    },
    color: {
      type: [String, Boolean],
      default: "repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)",
    },
    errorColor: {
      type: String,
      default: "repeating-linear-gradient(to right,#f87171 0%,#ef4444 100%)",
    },
    estimatedProgress: {
      type: Function,
      required: false,
    },
  },
  setup(props, { slots, expose }) {
    const { progress, isLoading, error, start, finish, clear } = useLoadingIndicator({
      duration: props.duration,
      throttle: props.throttle,
      hideDelay: props.hideDelay,
      resetDelay: props.resetDelay,
      estimatedProgress: props.estimatedProgress,
    });
    expose({
      progress,
      isLoading,
      error,
      start,
      finish,
      clear,
    });
    return () =>
      h(
        "div",
        {
          class: "nuxt-loading-indicator",
          style: {
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            pointerEvents: "none",
            width: "auto",
            height: `${props.height}px`,
            opacity: isLoading.value ? 1 : 0,
            background: error.value ? props.errorColor : props.color || void 0,
            backgroundSize: `${progress.value > 0 ? (100 / progress.value) * 100 : 0}% auto`,
            transform: `scaleX(${progress.value}%)`,
            transformOrigin: "left",
            transition: "transform 0.1s, height 0.4s, opacity 0.4s",
            zIndex: 999999,
          },
        },
        slots,
      );
  },
});
const layouts = {
  dashboard: defineAsyncComponent(() =>
    import("./dashboard-CvT73LTH.mjs").then((m) => m.default || m),
  ),
  default: defineAsyncComponent(() => import("./default-Aor45fua.mjs").then((m) => m.default || m)),
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object,
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  },
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null,
  },
  fallback: {
    type: [String, Object],
    default: null,
  },
};
const __nuxt_component_2$1 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () =>
          h(
            Suspense,
            {
              suspensible: true,
              onResolve: () => {
                nextTick(done);
              },
            },
            {
              default: () =>
                h(
                  LayoutProvider,
                  {
                    layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
                    key: layout.value || void 0,
                    name: layout.value,
                    shouldProvide: !props.name,
                    isRenderingNewLayout: (name) => {
                      return name !== previouslyRenderedLayout && name === layout.value;
                    },
                    hasTransition: !!transitionProps,
                  },
                  context.slots,
                ),
            },
          ),
      }).default();
    };
  },
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean],
    },
    layoutProps: {
      type: Object,
    },
    hasTransition: {
      type: Boolean,
    },
    shouldProvide: {
      type: Boolean,
    },
    isRenderingNewLayout: {
      type: Function,
      required: true,
    },
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default"),
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name)
              ? vueRouterRoute[key]
              : injectedRoute[key];
          },
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || (typeof name === "string" && !(name in layouts))) {
        return context.slots.default?.();
      }
      return h(LayoutLoader, { key: name, layoutProps: props.layoutProps, name }, context.slots);
    };
  },
});
const defineRouteProvider = (name = "RouteProvider") =>
  defineComponent({
    name,
    props: {
      route: {
        type: Object,
        required: true,
      },
      vnode: Object,
      vnodeRef: Object,
      renderKey: String,
      trackRootNodes: Boolean,
    },
    setup(props) {
      const previousKey = props.renderKey;
      const previousRoute = props.route;
      const route = {};
      for (const key in props.route) {
        Object.defineProperty(route, key, {
          get: () => (previousKey === props.renderKey ? props.route[key] : previousRoute[key]),
          enumerable: true,
        });
      }
      provide(PageRouteSymbol, shallowReactive(route));
      return () => {
        if (!props.vnode) {
          return props.vnode;
        }
        return h(props.vnode, { ref: props.vnodeRef });
      };
    },
  });
const RouteProvider = defineRouteProvider();
const __nuxt_component_2 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
    },
    transition: {
      type: [Boolean, Object],
      default: void 0,
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0,
    },
    route: {
      type: Object,
    },
    pageKey: {
      type: [Function, String],
      default: null,
    },
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(
        RouterView,
        { name: props.name, route: props.route, ...attrs },
        {
          default: (routeProps) => {
            return h(
              Suspense,
              { suspensible: true },
              {
                default() {
                  return h(RouteProvider, {
                    vnode: slots.default
                      ? normalizeSlot(slots.default, routeProps)
                      : routeProps.Component,
                    route: routeProps.route,
                    vnodeRef: pageRef,
                  });
                },
              },
            );
          },
        },
      );
    };
  },
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "app",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1$1;
      const _component_NuxtLoadingIndicator = __nuxt_component_1;
      const _component_NuxtLayout = __nuxt_component_2$1;
      const _component_NuxtPage = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(
        ssrRenderComponent(
          _component_NuxtLoadingIndicator,
          {
            color: "#012D5A",
            height: 3,
            duration: 2e3,
          },
          null,
          _parent,
        ),
      );
      _push(
        ssrRenderComponent(
          _component_NuxtLayout,
          null,
          {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
              } else {
                return [createVNode(_component_NuxtPage)];
              }
            }),
            _: 1,
          },
          _parent,
        ),
      );
      _push(`</div>`);
    };
  },
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object,
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage =
      _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import("./error-404-CmGYAmS3.mjs"));
    const _Error = defineAsyncComponent(() => import("./error-500-BIridfE7.mjs"));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(
        ssrRenderComponent(
          unref(ErrorTemplate),
          mergeProps(
            {
              statusCode: unref(statusCode),
              statusMessage: unref(statusMessage),
              description: unref(description),
              stack: unref(stack),
            },
            _attrs,
          ),
          null,
          _parent,
        ),
      );
    };
  },
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "../node_modules/nuxt/dist/app/components/nuxt-error-page.vue",
  );
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks
        .callHook("vue:error", err, target, info)
        .catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(
              ssrRenderComponent(
                unref(IslandRenderer),
                { context: unref(islandContext) },
                null,
                _parent,
              ),
            );
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(
              _push,
              createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null),
              _parent,
            );
          } else {
            _push(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent));
          }
        },
        _: 1,
      });
    };
  },
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add(
    "../node_modules/nuxt/dist/app/components/nuxt-root.vue",
  );
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = (ssrContext) => entry(ssrContext);

export {
  __nuxt_component_1$1 as _,
  useRouter as a,
  useNuxtApp as b,
  nuxtLinkDefaults as c,
  useState as d,
  entry_default as default,
  useRoute as e,
  useRoles as f,
  useAuth as g,
  useRoleAccess as h,
  __nuxt_component_2 as i,
  navigateTo as n,
  resolveRouteObject as r,
  useRuntimeConfig as u,
};
//# sourceMappingURL=server.mjs.map
