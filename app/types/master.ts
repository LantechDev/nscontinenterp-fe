export interface ServiceCategoryDefaultAccount {
  id: string;
  code: string;
  name: string;
  type: string;
  isPosting: boolean;
  isActive: boolean;
}

export interface ServiceCategory {
  id: string;
  code: string;
  name: string;
  defaultRevenueAccountId?: string | null;
  defaultCostAccountId?: string | null;
  defaultRevenueAccount?: ServiceCategoryDefaultAccount | null;
  defaultCostAccount?: ServiceCategoryDefaultAccount | null;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceUnit {
  id: string;
  code: string;
  name: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseCategory {
  id: string;
  code: string;
  name: string;
  defaultDebitAccountId?: string | null;
  defaultDebitAccount?: ServiceCategoryDefaultAccount | null;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}
