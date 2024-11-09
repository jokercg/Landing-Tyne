export interface InvoiceDto {
    id: number;
    business: Business,
    createdAt: Date,
    invoiceNumber: string,
    amount:number,
    invoiceStatus: InvoiceStatus,
    urlInvoice: string,
    user: User
}

export interface Business {
    id: number,
    name: string
}

export interface User {
    id: number,
    name: string,
    email: string
}

export interface InvoiceStatus {
    id: number,
    name: string,
}