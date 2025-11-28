import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useResources(projectId = null, chapterId = null) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch resources for a specific project or chapter
    const { data: resources, isLoading } = useQuery({
        queryKey: ['resources', projectId, chapterId],
        queryFn: async () => {
            let query = supabase
                .from('resources')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (projectId) {
                query = query.eq('project_id', projectId);
            } else if (chapterId) {
                query = query.eq('chapter_id', chapterId);
            } else {
                // If neither is provided, return empty (or all resources if that was the intent, but usually we want context)
                return [];
            }

            const { data, error } = await query;
            if (error) throw error;
            return data;
        },
        enabled: !!user && (!!projectId || !!chapterId),
    });

    // Add a new resource
    const addResource = useMutation({
        mutationFn: async (newResource) => {
            const { data, error } = await supabase
                .from('resources')
                .insert([{
                    ...newResource,
                    user_id: user.id,
                    project_id: projectId, // Context is passed from hook usage
                    chapter_id: chapterId
                }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['resources', projectId, chapterId]);
        },
    });

    // Upload a file to storage
    const uploadFile = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('resources')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('resources')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    // Delete a resource
    const deleteResource = useMutation({
        mutationFn: async (resourceId) => {
            const { error } = await supabase
                .from('resources')
                .delete()
                .eq('id', resourceId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['resources', projectId, chapterId]);
        },
    });

    return {
        resources,
        isLoading,
        addResource,
        deleteResource,
        uploadFile
    };
}

export function usePublicResources() {
    const { user } = useAuth();

    const { data: publicResources, isLoading } = useQuery({
        queryKey: ['public-resources', user?.id],
        queryFn: async () => {
            if (!user) return [];

            // RLS policy "Users can view public resources from their institution" handles the filtering
            const { data, error } = await supabase
                .from('resources')
                .select(`
                    *,
                    profiles:user_id (full_name, avatar_url)
                `)
                .eq('is_public', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });

    return { publicResources, isLoading };
}
