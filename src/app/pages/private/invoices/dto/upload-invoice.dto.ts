export interface UploadInvoiceDto {
  name: string;
  email: string;
  amount: number;
  invoiceNumber: string;
  businessId: number;
  file: {
    contentType: string;
    base64Data: string;
  };
}
