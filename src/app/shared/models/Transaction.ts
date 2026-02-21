export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  WITHDRAWAL = 'WITHDRAWAL'
}

export interface Transaction {
    id: number,
    transactionType: TransactionType,
    originAccountId: number,
    counterpartyAccountId: number,
    amount: number,
    resultingBalance: number,
    details: string,
    timestamp: Date | string

}