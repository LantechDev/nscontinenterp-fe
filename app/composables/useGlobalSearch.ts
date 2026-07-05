// Shared open/close state for the global search palette so it can be
// triggered from the dashboard header AND from pages that hide the header
// (e.g. finance dashboard, outstanding report, quotations).
export const useGlobalSearch = () => {
  const isOpen = useState<boolean>("global-search-open", () => false);
  const open = () => {
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };
  return { isOpen, open, close };
};
