import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useChapters(subjectId) {
    const queryClient = useQueryClient();

    const { data: chapters, isLoading } = useQuery({
        queryKey: ['chapters', subjectId],
        queryFn: async () => {
            if (!subjectId) return [];
            const { data, error } = await supabase
                .from('chapters')
                .select('*')
                .eq('subject_id', subjectId)
                .order('created_at', { ascending: true });
            if (error) throw error;
            return data;
        },
        enabled: !!subjectId,
    });

    const addChapter = useMutation({
        mutationFn: async (title) => {
            const { data, error } = await supabase
                .from('chapters')
                .insert([{ subject_id: subjectId, title }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['chapters', subjectId]);
        },
    });

    const updateStatus = useMutation({
        mutationFn: async ({ chapterId, status }) => {
            const { error } = await supabase
                .from('chapters')
                .update({ status })
                .eq('id', chapterId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['chapters', subjectId]);
        },
    });

    const deleteChapter = useMutation({
        mutationFn: async (chapterId) => {
            const { error } = await supabase
                .from('chapters')
                .delete()
                .eq('id', chapterId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['chapters', subjectId]);
        },
    });

    return {
        chapters,
        isLoading,
        addChapter,
        updateStatus,
        deleteChapter,
    };
}
