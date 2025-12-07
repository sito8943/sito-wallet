export type RelationSelectConfig = Record<string, string>;

// Central place to declare related selects per table
export const relationSelectConfig: RelationSelectConfig = {
  transactions:
    "*, " +
    "account:accounts(id, name, updatedAt, currency:currencyId(id, name, symbol)), " +
    "category:transaction-categories(id, name, initial, type, updatedAt)",
  accounts: "*, currency:currencyId(id, name, symbol)",
};

export const getRelationSelect = (table: string): string | undefined =>
  relationSelectConfig[table];

// Common selects for /:table/common endpoints
export const commonSelectConfig: RelationSelectConfig = {
  transactions: "id, updatedAt",
  accounts: "id, name, updatedAt, currency:currencyId(id, name, symbol)",
  currencies: "id, name, symbol, updatedAt",
  "transaction-categories": "id, name, initial, type, updatedAt",
};

export const getCommonSelect = (table: string): string | undefined =>
  commonSelectConfig[table];
