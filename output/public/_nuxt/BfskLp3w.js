import { L as a } from "./D9q6143x.js";
const t = () => {
  const e = a("confirm-dialog", () => ({
    isOpen: !1,
    title: "",
    message: "",
    options: {},
    resolve: null,
  }));
  return {
    state: e,
    confirm: (l) => (
      (e.value.title = l.title || "Confirmation"),
      (e.value.message = l.message || "Are you sure?"),
      (e.value.options = l),
      (e.value.isOpen = !0),
      new Promise((s) => {
        e.value.resolve = s;
      })
    ),
    handleConfirm: () => {
      ((e.value.isOpen = !1), e.value.resolve && (e.value.resolve(!0), (e.value.resolve = null)));
    },
    handleCancel: () => {
      ((e.value.isOpen = !1), e.value.resolve && (e.value.resolve(!1), (e.value.resolve = null)));
    },
  };
};
export { t as u };
