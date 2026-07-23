export type PaymentSystem = 'Stripe' | 'Bkash' | 'Rocket' | 'Nagad';
export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface IWithdrawal {
  _id?: string;
  creatorEmail: string;
  creatorName: string;
  withdrawalCredit: number;
  withdrawalAmount: number;
  paymentSystem: PaymentSystem;
  accountNumber: string;
  status: WithdrawalStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
