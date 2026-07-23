export interface IPayment {
  _id?: string;
  transactionId: string;
  userEmail: string;
  userName: string;
  amount: number;
  credits: number;
  paymentMethod: string;
  status: 'succeeded' | 'pending' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}
