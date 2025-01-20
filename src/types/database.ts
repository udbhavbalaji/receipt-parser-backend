import { Receipt } from "./request";

interface UserDB {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_id: string;
  logged_in?: "Y" | "N";
  last_generated_token: string | null;
}

// interface ReceiptDB {
//   user_id: string;
//   receipt_id: string;
//   merchant_name: string;
//   merchant_address: string | null;
//   merchant_phone: string | null;
//   merchant_website: string | null;
//   receipt_no: string;
//   date: string;
//   time: string | null;
//   currency: string;
//   total: number;
//   subtotal: number;
//   tax: number | null;
//   service_charge: string | null | undefined;
//   tip: number | null | undefined;
// }

interface ReceiptDB extends Receipt {
  userId: string;
  receiptId: string;
}

interface ItemDB {
  item_id: string;
  receipt_id: string;
  amount: number;
  description: string;
  flags?: string | null;
  qty: number;
  unit_price: number | null;
}

export { UserDB, ReceiptDB, ItemDB };
