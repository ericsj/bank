export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidAmountError extends DomainError {
  constructor() {
    super(
      "The value should be greater than 0 and have one of these formats: 111 or 111,11 or 111.11",
    );
  }
}

export class SameAccountError extends DomainError {
  constructor() {
    super("Sender and recepient accounts should be different");
  }
}

export class AccountNotFoundError extends DomainError {
  constructor(accountId: string) {
    super(`Account ${accountId} wasn't found`);
  }
}

export class InsufficientFundsError extends DomainError {
  constructor() {
    super("Insufficient funds");
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Invalid email or password");
  }
}
