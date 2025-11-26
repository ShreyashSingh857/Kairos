import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useProjects() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects', user?.id],
        queryFn: async () => {
            if (!user) return [];

            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    project_milestones (
                        id,
                        title,
                        status,
                        due_date
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Calculate progress for each project
            return data.map(project => {
                const totalMilestones = project.project_milestones.length;
                const completedMilestones = project.project_milestones.filter(m => m.status === 'completed').length;
                const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

                return {
                    ...project,
                    progress,
                    totalMilestones,
                    completedMilestones
                };
            });
        },
        enabled: !!user,
    });

    const addProject = useMutation({
        mutationFn: async (newProject) => {
            const { data, error } = await supabase
                .from('projects')
                .insert([{ ...newProject, user_id: user.id }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
        },
    });

    const deleteProject = useMutation({
        mutationFn: async (projectId) => {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
        },
    });

    const addMilestone = useMutation({
        mutationFn: async ({ projectId, title, dueDate }) => {
            const { data, error } = await supabase
                .from('project_milestones')
                .insert([{ project_id: projectId, title, due_date: dueDate }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
        },
    });

    const updateMilestoneStatus = useMutation({
        mutationFn: async ({ milestoneId, status }) => {
            const { error } = await supabase
                .from('project_milestones')
                .update({ status })
                .eq('id', milestoneId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
        },
    });

    const deleteMilestone = useMutation({
        mutationFn: async (milestoneId) => {
            const { error } = await supabase
                .from('project_milestones')
                .delete()
                .eq('id', milestoneId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
        },
    });

    return {
        projects,
        isLoading,
        addProject,
        deleteProject,
        addMilestone,
        updateMilestoneStatus,
        deleteMilestone,
    };
}
