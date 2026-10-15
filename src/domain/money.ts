import { InvalidAmountError } from "./errors";

const AMOUNT_PATTERN = /^\d{1,9}([.,]\d{1,2})?$/;

export function parseAmountToCents(input: string): number {
  const value = input.trim();
  if (!AMOUNT_PATTERN.test(value)) throw new InvalidAmountError();
  const [strInteger, strCents = ""] = value.replace(",", ".").split(".");
  const cents = Number(strInteger) * 100 + Number(strCents.padEnd(2, "0"));
  if (cents <= 0) throw new InvalidAmountError();
  return cents;
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCents(cents: number): string {
  return brl.format(cents / 100);
}
