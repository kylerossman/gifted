/** Money encoded without floating-point decimals, as in the draft JSON contract. */
export interface Money {
  /** Amount in the smallest currency unit, e.g. 12999 means USD 129.99. */
  amountMinor: number;
  /** ISO 4217 currency code, e.g. USD. */
  currency: string;
}