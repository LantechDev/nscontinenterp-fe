export function useExportPopup() {
  const showExportOptions = ref(false);
  const triggerX = ref(0);
  const triggerY = ref(0);
  const triggerWidth = ref(160);
  const triggerHeight = ref(40);

  function openExportPopup(event?: MouseEvent) {
    if (event?.currentTarget) {
      const el = event.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      triggerX.value = rect.left;
      triggerY.value = rect.top;
      triggerWidth.value = rect.width;
      triggerHeight.value = rect.height;
    } else {
      // Fallback: position at bottom-right
      triggerX.value = window.innerWidth - 240;
      triggerY.value = window.innerHeight - 200;
      triggerWidth.value = 160;
      triggerHeight.value = 40;
    }
    showExportOptions.value = true;
  }

  return {
    showExportOptions,
    triggerX,
    triggerY,
    triggerWidth,
    triggerHeight,
    openExportPopup,
  };
}
