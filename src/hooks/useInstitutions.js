import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useInstitutions() {
    const queryClient = useQueryClient();

    // Search institutions (Server-side)
    const searchInstitutions = async (query) => {
        if (!query || query.length < 2) return [];

        const { data, error } = await supabase
            .from('institutions')
            .select('*')
            .ilike('name', `%${query}%`)
            .limit(20);

        if (error) throw error;
        return data;
    };

    // Add a new institution
    const addInstitution = useMutation({
        mutationFn: async (name) => {
            // First check if it exists (case insensitive search could be better but exact match for now)
            const { data: existing } = await supabase
                .from('institutions')
                .select('id')
                .eq('name', name)
                .single();

            if (existing) return existing;

            const { data, error } = await supabase
                .from('institutions')
                .insert([{ name, type: 'custom' }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['institutions']);
        },
    });

    return {
        searchInstitutions,
        addInstitution,
    };
}
