export interface ConfirmOptions {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
}

interface ConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
}

export const useConfirm = () => {
    const state = useState<ConfirmState>("confirm-dialog", () => ({
        isOpen: false,
        title: "",
        message: "",
        options: {},
        resolve: null,
    }));

    const confirm = (options: ConfirmOptions): Promise<boolean> => {
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
