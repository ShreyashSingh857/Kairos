import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useVitality() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const today = new Date().toISOString().split('T')[0];

    const { data: metrics, isLoading, refetch } = useQuery({
        queryKey: ['vitality', user?.id, today],
        queryFn: async () => {
            if (!user) return null;

            const { data, error } = await supabase
                .from('daily_metrics')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', today)
                .maybeSingle();

            if (error) throw error;

            // Return default structure if no data exists for today
            return data || {
                calories_consumed: 0,
                protein_consumed: 0,
                water_intake: 0,
                sleep_hours: 0,
                mood_rating: 5,
                calories_burned: 0, // Ensure this defaults to 0
            };
        },
        enabled: !!user,
    });

    const updateMetric = useMutation({
        mutationFn: async (updates) => {
            // First check if a record exists
            const { data: existing } = await supabase
                .from('daily_metrics')
                .select('id')
                .eq('user_id', user.id)
                .eq('date', today)
                .maybeSingle();

            if (existing) {
                const { error } = await supabase
                    .from('daily_metrics')
                    .update(updates)
                    .eq('id', existing.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('daily_metrics')
                    .insert([{ ...updates, user_id: user.id, date: today }]);
                if (error) throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['vitality', user?.id, today]);
        },
    });

    return {
        metrics,
        isLoading,
        updateMetric,
        refetch,
    };
}
