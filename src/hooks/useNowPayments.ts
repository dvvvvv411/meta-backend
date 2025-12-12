import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CreatePaymentParams {
  amount_eur: number;
  pay_currency: string;
  payment_type?: 'deposit' | 'rental';
}

interface PaymentResponse {
  transaction_id: string;
  payment_id: string;
  pay_address: string;
  pay_amount: number;
  pay_currency: string;
  payment_status: string;
  expires_at: string;
  amount_eur: number;
  net_amount: number;
  fee_amount: number;
}

interface PaymentStatus {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  pay_amount: number;
  actually_paid: number;
  confirmations: number;
}

export const useNowPayments = () => {
  const createPayment = useMutation({
    mutationFn: async (params: CreatePaymentParams): Promise<PaymentResponse> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Nicht eingeloggt');
      }

      const response = await supabase.functions.invoke('nowpayments/create-payment', {
        body: params,
      });

      if (response.error) {
        throw new Error(response.error.message || 'Zahlung fehlgeschlagen');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    },
  });

  const checkPaymentStatus = async (paymentId: string): Promise<PaymentStatus> => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Nicht eingeloggt');
    }

    const response = await supabase.functions.invoke('nowpayments/payment-status', {
      body: { payment_id: paymentId },
    });

    if (response.error) {
      throw new Error(response.error.message || 'Status-Abfrage fehlgeschlagen');
    }

    return response.data;
  };

  return {
    createPayment,
    checkPaymentStatus,
  };
};

export const useCurrencies = () => {
  return useQuery({
    queryKey: ['nowpayments-currencies'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return ['USDT', 'USDC', 'BTC', 'ETH'];
      }

      const response = await supabase.functions.invoke('nowpayments/currencies', {
        method: 'GET',
      });

      if (response.error || !response.data?.currencies) {
        return ['USDT', 'USDC', 'BTC', 'ETH'];
      }

      return response.data.currencies;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
