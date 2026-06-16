import type { MovementType } from "~/composables/useMasterData";

export type MovementKind = "cargo" | "delivery";

export interface CreateMovementTypeInput {
  name: string;
  code?: string;
}

export interface UpdateMovementTypeInput {
  name: string;
}

type ErrorResponse = {
  message?: string;
  error?: string;
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const errorData = (error as { data?: ErrorResponse }).data;
    if (errorData?.message) return errorData.message;
    if (errorData?.error) return errorData.error;
  }
  if (error instanceof Error) return error.message;
  return "An error occurred";
}

type LocalMutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

const localMutationOptions = <TBody>(method: LocalMutationMethod, body?: TBody) =>
  body === undefined
    ? { method, skipNuxtDataRefresh: false }
    : { method, body, skipNuxtDataRefresh: false };

const movementPath = (kind: MovementKind) =>
  kind === "cargo" ? "/api/master/cargo-movements" : "/api/master/delivery-movements";

export function useMovementTypes(kind: MovementKind) {
  const movements = useState<MovementType[]>(`${kind}-movements`, () => []);
  const isLoading = ref(false);

  const stats = computed(() => ({
    total: movements.value.length,
  }));

  async function fetchMovements(): Promise<{
    success: boolean;
    data?: MovementType[];
    error?: string;
  }> {
    isLoading.value = true;
    try {
      const data = await $fetch<MovementType[]>(movementPath(kind));
      movements.value = data || [];
      return { success: true, data: movements.value };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function createMovement(
    payload: CreateMovementTypeInput,
  ): Promise<{ success: boolean; data?: MovementType; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<MovementType>(movementPath(kind), {
        ...localMutationOptions("POST", payload),
      });
      movements.value = [...movements.value, data];
      refreshNuxtData(`${kind}-movements-list`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function updateMovement(
    id: string,
    payload: UpdateMovementTypeInput,
  ): Promise<{ success: boolean; data?: MovementType; error?: string }> {
    isLoading.value = true;
    try {
      const data = await $fetch<MovementType>(`${movementPath(kind)}/${id}`, {
        ...localMutationOptions("PUT", payload),
      });
      movements.value = movements.value.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      );
      refreshNuxtData(`${kind}-movements-list`);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteMovement(id: string): Promise<{ success: boolean; error?: string }> {
    isLoading.value = true;
    try {
      await $fetch(`${movementPath(kind)}/${id}`, {
        ...localMutationOptions("DELETE"),
      });
      movements.value = movements.value.filter((item) => item.id !== id);
      refreshNuxtData(`${kind}-movements-list`);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    movements: movements,
    stats: stats,
    isLoading: isLoading,
    fetchMovements,
    createMovement,
    updateMovement,
    deleteMovement,
  };
}
