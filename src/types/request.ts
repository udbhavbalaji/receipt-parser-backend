interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userId: string;
}

interface ItemRequest {
  amount: number;
  description: string;
  flags?: string | null | undefined;
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
  serviceCharge?: string | null | undefined;
  tip?: number | null | undefined;
}

export { UserRequest, ReceiptRequest, ItemRequest };
