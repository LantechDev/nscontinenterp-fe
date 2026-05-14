export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("uppercase", {
    mounted(el) {
      const input =
        el.tagName === "INPUT" || el.tagName === "TEXTAREA"
          ? el
          : el.querySelector("input") || el.querySelector("textarea");

      if (!input) return;

      input.addEventListener("input", (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        // Transform to uppercase
        const upperValue = target.value.toUpperCase();

        if (target.value !== upperValue) {
          target.value = upperValue;

          // Maintain cursor position
          if (start !== null && end !== null) {
            target.setSelectionRange(start, end);
          }

          // Manually trigger input event for v-model compatibility
          target.dispatchEvent(new CustomEvent("input", { bubbles: true }));
        }
      });

      // Also handle paste
      input.addEventListener("paste", (e: ClipboardEvent) => {
        setTimeout(() => {
          const target = e.target as HTMLInputElement | HTMLTextAreaElement;
          const upperValue = target.value.toUpperCase();
          if (target.value !== upperValue) {
            target.value = upperValue;
            target.dispatchEvent(new CustomEvent("input", { bubbles: true }));
          }
        }, 0);
      });
    },
  });
});
