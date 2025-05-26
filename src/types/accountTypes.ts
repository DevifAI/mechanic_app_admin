export interface Account {
  id: string;
  account_code: string;
  account_name: string;
  account_group: string; // This is a UUID referring to another account
  createdAt: string;
  updatedAt: string;
  group?: Account; // Optional related group object if populated
}

export interface CreateAccountPayload {
  account_code: string;
  account_name: string;
  account_group: string;
}

export interface UpdateAccountPayload {
  id: string;
  account_code?: string;
  account_name?: string;
  account_group?: string;
}
