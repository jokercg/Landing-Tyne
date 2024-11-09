import { InvoiceStatusEnum } from "../../../../infrastructure/enums/invoice-status.enum";

export class ApproveRejectInvoiceDto {
    invoiceId: number;
    invoiceStatus: InvoiceStatusEnum;
}