interface ItemRequest {
  amount: number;
  description: string;
  flags?: string | null;
  qty: number;
  unitPrice: number;
}

interface ReceiptRequest {
  merchantName: string;
  merchantAddress: string | null;
  merchantPhone: string | null;
  merchantWebsite: string | null;
  receiptNo: string;
  date: string;
  time: string | null;
  items: ItemRequest[];
  currency: string;
  total: number;
  subtotal: number;
  tax: number | null;
  serviceCharge: string | null;
  tip: number | null;
}

export { ReceiptRequest, ItemRequest };
