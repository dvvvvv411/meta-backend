import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useUserBalance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: balanceEur = 0, isLoading, refetch } = useQuery({
    queryKey: ['user-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('balance_eur')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user balance:', error);
        return 0;
      }
      
      return data?.balance_eur ?? 0;
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
  });

  const invalidateBalance = () => {
    queryClient.invalidateQueries({ queryKey: ['user-balance', user?.id] });
  };

  return { 
    balanceEur, 
    isLoading,
    refetch,
    invalidateBalance
  };
};
