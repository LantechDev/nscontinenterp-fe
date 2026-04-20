import { d as useState } from "./server.mjs";

const useConfirm = () => {
  const state = useState("confirm-dialog", () => ({
    isOpen: false,
    title: "",
    message: "",
    options: {},
    resolve: null,
  }));
  const confirm = (options) => {
    state.value.title = options.title || "Confirmation";
    state.value.message = options.message || "Are you sure?";
    state.value.options = options;
    state.value.isOpen = true;
    return new Promise((resolve) => {
      state.value.resolve = resolve;
    });
  };
  const handleConfirm = () => {
    state.value.isOpen = false;
    if (state.value.resolve) {
      state.value.resolve(true);
      state.value.resolve = null;
    }
  };
  const handleCancel = () => {
    state.value.isOpen = false;
    if (state.value.resolve) {
      state.value.resolve(false);
      state.value.resolve = null;
    }
  };
  return {
    state,
    confirm,
    handleConfirm,
    handleCancel,
  };
};

export { useConfirm as u };
//# sourceMappingURL=useConfirm-iFV_8p0v.mjs.map
