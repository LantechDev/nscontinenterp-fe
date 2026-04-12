export interface BlParty {
  id: string;
  companyId?: string | null;
  companyName?: string;
  partyRole?: {
    code: string;
    name: string;
  };
  partyRoleCode?: string;
}

export interface BlData {
  id: string;
  blNumber: string;
  containerNumber?: string | null;
  sealNumber?: string | null;
  containerTypeId?: string | null;
  grossWeight?: string | null;
  netWeight?: string | null;
  measurement?: string | null;
  packagesCount?: number | null;
  packageTypeId?: string | null;
  cargoDescription?: string | null;
  statusId?: string | null;
  blParties?: BlParty[];
}
