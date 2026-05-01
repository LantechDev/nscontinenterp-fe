export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  currency: string;
  isActive?: boolean;
}

export interface UpdateBankAccount extends Partial<CreateBankAccount> {}

const createBankAccount = async (data: CreateBankAccount) => {
  try {
    const resp = await $fetch(`/api/master/bank-accounts`, {
      method: "POST",
      body: data,
    });
    return { success: true, data: resp };
  } catch (e) {
    return { success: false, error: e };
  }
};

const updateBankAccount = async (id: string, data: UpdateBankAccount) => {
  try {
    const resp = await $fetch(`/api/master/bank-accounts/${id}`, {
      method: "PATCH",
      body: data,
    });
    return { success: true, data: resp };
  } catch (e) {
    return { success: false, error: e };
  }
};

const deleteBankAccount = async (id: string) => {
  try {
    await $fetch(`/api/master/bank-accounts/${id}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};

export const useBankAccounts = () => {
  const isLoading = ref(false);

  const fetchBankAccounts = async (params?: { currency?: string; isActive?: boolean }) => {
    isLoading.value = true;
    try {
      const data = await $fetch<BankAccount[]>(`/api/master/bank-accounts`, {
        query: params,
      });
      return { success: true, data };
    } catch (e) {
      console.error(e);
      return { success: false, data: [] };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    fetchBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
  };
};
