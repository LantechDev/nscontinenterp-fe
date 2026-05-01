import { _ as __nuxt_component_0 } from "./NuxtImg-DaZEoQQo.mjs";
import { defineComponent, ref, mergeProps, unref, useSSRContext } from "vue";
import {
  ssrRenderAttrs,
  ssrRenderAttr,
  ssrRenderComponent,
  ssrInterpolate,
  ssrRenderDynamicModel,
  ssrIncludeBooleanAttr,
} from "vue/server-renderer";
import { EyeOff, Eye, Loader2 } from "lucide-vue-next";
import { a as useRouter, g as useAuth } from "./server.mjs";
import "../nitro/nitro.mjs";
import "node:http";
import "node:https";
import "node:events";
import "node:buffer";
import "node:fs";
import "node:path";
import "node:crypto";
import "node:url";
import "ipx";
import "./composables-BvrNzaE9.mjs";
import "../routes/renderer.mjs";
import "vue-bundle-renderer/runtime";
import "unhead/server";
import "devalue";
import "unhead/utils";
import "vue-router";

const loginIllustrationUrl = "" + __buildAssetsURL("login.Z_OMUEo5.svg");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuth();
    const showPassword = ref(false);
    const isLoading = ref(false);
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(
        `<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex" }, _attrs))}><div class="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden"><div class="absolute inset-0"><img${ssrRenderAttr("src", unref(loginIllustrationUrl))} alt="" class="object-cover flex w-full h-full bg-black opacity-50 drop-shadow-[0_40px_70px_rgba(0,0,0,0.5)]"><div class="absolute inset-0 bg-gradient-to-b from-[#012D5A]/10 via-[#012D5A]/30 to-[#012D5A]/80"></div><div class="absolute inset-0 bg-black/10"></div></div><div class="absolute inset-0 bg-[url(&#39;data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E&#39;)] opacity-30"></div><div class="relative z-10 flex flex-col justify-center px-12 xl:px-20"><div class="flex items-center gap-4 mb-8"><div class="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtImg,
          {
            src: "/favicon.png",
            alt: "Logo",
            class: "w-full h-full object-cover object-left rounded-lg",
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><div><h1 class="text-3xl font-bold text-white">NSContinent</h1><p class="text-white/70 text-sm">E-Report Finance</p></div></div><div class="space-y-6 max-w-md"><h2 class="text-4xl xl:text-5xl font-bold text-white leading-tight"> Manage Your Business Finances with Ease </h2><p class="text-lg text-white/80"> System integrated for comprehensive financial reporting, designed to streamline your operations and empower your business growth. </p></div></div><div class="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div><div class="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div></div><div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background"><div class="w-full max-w-md space-y-8 animate-fade-in"><div class="lg:hidden flex items-center justify-center gap-3 mb-8"><div class="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary/20 backdrop-blur-sm">`,
      );
      _push(
        ssrRenderComponent(
          _component_NuxtImg,
          {
            src: "/favicon.png",
            alt: "Logo",
            class: "w-8 h-8",
          },
          null,
          _parent,
        ),
      );
      _push(
        `</div><div><h1 class="text-2xl font-bold text-foreground">Lantech</h1><p class="text-xs text-muted-foreground">E-Report Finance</p></div></div><div class="text-center lg:text-left"><h2 class="text-2xl font-bold text-foreground">Selamat Datang</h2><p class="text-muted-foreground mt-2">Masuk ke akun Anda untuk melanjutkan</p></div>`,
      );
      if (unref(errorMessage)) {
        _push(
          `<div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">${ssrInterpolate(unref(errorMessage))}</div>`,
        );
      } else {
        _push(`<!---->`);
      }
      _push(
        `<form class="space-y-5"><div><label for="email" class="block text-sm font-medium text-foreground mb-2"> Email </label><input id="email"${ssrRenderAttr("value", unref(email))} type="email" placeholder="nama@perusahaan.com" class="input-field" required></div><div><div class="flex items-center justify-between mb-2"><label for="password" class="block text-sm font-medium text-foreground"> Password </label><button type="button" class="text-sm text-accent hover:text-accent/80 font-medium"> Lupa Password? </button></div><div class="relative"><input id="password"${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="••••••••" class="input-field pr-12" required><button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">`,
      );
      if (unref(showPassword)) {
        _push(ssrRenderComponent(unref(EyeOff), { class: "w-5 h-5" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Eye), { class: "w-5 h-5" }, null, _parent));
      }
      _push(
        `</button></div></div><div class="flex items-center gap-2"><input id="remember" type="checkbox" class="w-4 h-4 rounded border-border text-primary focus:ring-primary"><label for="remember" class="text-sm text-muted-foreground"> Ingat saya di perangkat ini </label></div><button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="w-full btn-primary h-12 text-base">`,
      );
      if (unref(isLoading)) {
        _push(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin" }, null, _parent));
      } else {
        _push(`<span>Masuk</span>`);
      }
      _push(
        `</button></form><p class="text-center text-sm text-muted-foreground"> Belum punya akun? <button class="text-accent hover:text-accent/80 font-medium"> Hubungi Administrator </button></p></div></div></div>`,
      );
    };
  },
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-BW1O9jZV.mjs.map
