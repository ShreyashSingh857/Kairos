import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useSubjects() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: subjects, isLoading } = useQuery({
        queryKey: ['subjects', user?.id],
        queryFn: async () => {
            if (!user) return [];

            // Fetch subjects with their attendance logs and chapters
            const { data, error } = await supabase
                .from('subjects')
                .select(`
          *,
          attendance_logs (status),
          chapters (status)
        `)
                .eq('user_id', user.id);

            if (error) throw error;

            // Calculate attendance percentage and study progress for each subject
            return data.map(subject => {
                // Attendance
                const totalClasses = subject.attendance_logs.length;
                const presentClasses = subject.attendance_logs.filter(log => log.status === 'present').length;
                const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 100;

                // Study Progress
                const totalChapters = subject.chapters.length;
                const masteredChapters = subject.chapters.filter(ch => ch.status === 'mastered').length;
                const studyProgress = totalChapters > 0 ? Math.round((masteredChapters / totalChapters) * 100) : 0;

                return {
                    ...subject,
                    attendancePercentage,
                    totalClasses,
                    presentClasses,
                    studyProgress,
                    totalChapters,
                    masteredChapters
                };
            });
        },
        enabled: !!user,
    });

    const addSubject = useMutation({
        mutationFn: async (newSubject) => {
            const { data, error } = await supabase
                .from('subjects')
                .insert([{ ...newSubject, user_id: user.id }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['subjects']);
        },
    });

    const markAttendance = useMutation({
        mutationFn: async ({ subjectId, status }) => {
            const { error } = await supabase
                .from('attendance_logs')
                .insert([{ subject_id: subjectId, status }]);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['subjects']);
        },
    });

    const deleteSubject = useMutation({
        mutationFn: async (subjectId) => {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', subjectId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['subjects']);
        },
    });

    return {
        subjects,
        isLoading,
        addSubject,
        markAttendance,
        deleteSubject,
    };
}
