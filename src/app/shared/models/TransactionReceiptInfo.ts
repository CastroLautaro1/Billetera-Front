import { TransactionType } from "./Transaction";

export interface TransactionReceiptInfo {
    id: number,
    transactionType: TransactionType,
    amount: number,
    resultingBalance: number,
    details: string,
    timestamp: Date | string,
    originFullname: string,
    originCvu: string,
    destinationFullname: string,
    destinationCvu: string
    
}