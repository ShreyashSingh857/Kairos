import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useProjects() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch projects where user is owner OR member
    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects', user?.id],
        queryFn: async () => {
            if (!user) return [];

            // 1. Fetch owned projects
            const { data: ownedProjects, error: ownedError } = await supabase
                .from('projects')
                .select(`
                    *,
                    project_milestones (id, title, status, due_date),
                    project_members (user_id, role, profiles(full_name, avatar_url))
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (ownedError) throw ownedError;

            // 2. Fetch shared projects
            const { data: memberProjects, error: memberError } = await supabase
                .from('project_members')
                .select(`
                    project:projects (
                        *,
                        project_milestones (id, title, status, due_date),
                        project_members (user_id, role, profiles(full_name, avatar_url))
                    )
                `)
                .eq('user_id', user.id);

            if (memberError) throw memberError;

            // Combine and format
            const allProjects = [
                ...ownedProjects,
                ...memberProjects.map(mp => mp.project)
            ];

            // Remove duplicates (if any) and calculate progress
            const uniqueProjects = Array.from(new Map(allProjects.map(p => [p.id, p])).values());

            return uniqueProjects.map(project => {
                const totalMilestones = project.project_milestones?.length || 0;
                const completedMilestones = project.project_milestones?.filter(m => m.status === 'completed').length || 0;
                const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

                return {
                    ...project,
                    progress,
                    totalMilestones,
                    completedMilestones,
                    isOwner: project.user_id === user.id
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

    const addMember = useMutation({
        mutationFn: async ({ projectId, userId, role = 'editor' }) => {
            const { data, error } = await supabase
                .from('project_members')
                .insert([{ project_id: projectId, user_id: userId, role }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['projects']);
        },
    });

    const searchUsers = async (query) => {
        if (!query || query.length < 3) return [];
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, username') // Assuming username exists, or use email if available/safe
            .ilike('full_name', `%${query}%`)
            .limit(5);

        if (error) throw error;
        return data;
    };

    return {
        projects,
        isLoading,
        addProject,
        deleteProject,
        addMilestone,
        updateMilestoneStatus,
        deleteMilestone,
        addMember,
        searchUsers
    };
}
