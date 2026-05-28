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
        method: "POST",
        body: payload,
      });
      movements.value = [...movements.value, data];
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
        method: "PUT",
        body: payload,
      });
      movements.value = movements.value.map((item) =>
        item.id === id ? { ...item, ...data } : item,
      );
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
        method: "DELETE",
      });
      movements.value = movements.value.filter((item) => item.id !== id);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    } finally {
      isLoading.value = false;
    }
  }

  return {
    movements: readonly(movements),
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    fetchMovements,
    createMovement,
    updateMovement,
    deleteMovement,
  };
}
