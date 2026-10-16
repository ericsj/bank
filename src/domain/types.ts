export type Account = {
  id: string;
  owner: string;
  balance: number; // cents
};

export type AccountSummary = Pick<Account, "id" | "owner">;

export type Transfer = {
  id: string;
  amount: number;
  fromAccountId: string;
  toAccountId: string;
  createdAt: Date;
};

export type TransferWithOwners = Transfer & {
  fromOwner: string;
  toOwner: string;
};

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  accountId: string;
};

export type Session = {
  userId: string;
  accountId: string;
};
