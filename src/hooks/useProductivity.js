import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useProductivity() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks', user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });

    const addTask = useMutation({
        mutationFn: async (newTask) => {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ ...newTask, user_id: user.id }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        },
    });

    const updateTaskStatus = useMutation({
        mutationFn: async ({ taskId, status }) => {
            const { error } = await supabase
                .from('tasks')
                .update({ status })
                .eq('id', taskId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        },
    });

    const deleteTask = useMutation({
        mutationFn: async (taskId) => {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
        },
    });

    return {
        tasks,
        isLoading,
        addTask,
        updateTaskStatus,
        deleteTask,
    };
}
