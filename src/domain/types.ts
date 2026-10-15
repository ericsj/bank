export type Account = {
  id: string;
  owner: string;
  balance: number; // cents
};

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
