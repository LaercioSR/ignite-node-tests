export interface ITransferDTO{
  id: string;
  sender_id: string;
  amount: number,
  description: string;
  type: string;
  created_at: Date;
  updated_at: Date;
}
