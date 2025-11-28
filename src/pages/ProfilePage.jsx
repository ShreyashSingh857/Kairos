import React, { useState, useEffect, useRef } from 'react';
import { User, Save, Loader2, Activity, Building2, Check, Camera, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { useInstitutions } from '../hooks/useInstitutions';

export default function ProfilePage() {
    const { user } = useAuth();
    const { searchInstitutions } = useInstitutions();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const videoRef = useRef(null);

    // Profile State
    const [profile, setProfile] = useState({
        username: '',
        full_name: '',
        avatar_url: '',
        caloric_target: 2000,
        hydration_target: 2500,
        weight: '',
        height: '',
        institution_id: null,
        gender: '',
        dob: '',
        activity_level: '',
        fitness_goal: ''
    });

    // Institution Search State
    const [institutionSearch, setInstitutionSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredInstitutions, setFilteredInstitutions] = useState([]);

    // Fetch Profile
    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*, institutions(name)')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                if (data) {
                    setProfile({
                        username: data.username || '',
                        full_name: data.full_name || '',
                        avatar_url: data.avatar_url || '',
                        caloric_target: data.caloric_target || 2000,
                        hydration_target: data.hydration_target || 2500,
                        weight: data.weight || '',
                        height: data.height || '',
                        institution_id: data.institution_id,
                        gender: data.gender || '',
                        dob: data.dob || '',
                        activity_level: data.activity_level || '',
                        fitness_goal: data.fitness_goal || ''
                    });
                    if (data.institutions?.name) {
                        setInstitutionSearch(data.institutions.name);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [user]);

    // Server-side Search with Debounce
    useEffect(() => {
        if (!institutionSearch || !showSuggestions) {
            setFilteredInstitutions([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const results = await searchInstitutions(institutionSearch);
                setFilteredInstitutions(results || []);
            } catch (error) {
                console.error("Search error:", error);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [institutionSearch, showSuggestions]);

    // Camera Logic
    const startCamera = async () => {
        setShowCamera(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            toast.error("Could not access camera. Please check permissions.");
            setShowCamera(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    const capturePhoto = async () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0);

        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            await uploadAvatar({ target: { files: [file] } }); // Reuse upload logic
            stopCamera();
        }, 'image/jpeg');
    };

    const uploadAvatar = async (event) => {
        try {
            setUploadingAvatar(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
        } catch (error) {
            toast.error('Error uploading avatar: ' + error.message);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Validate Institution Selection
            let finalInstitutionId = profile.institution_id;

            if (institutionSearch) {
                // Check if the typed name matches any of the currently filtered options
                // OR if the user has already selected a valid ID (profile.institution_id) and the name matches
                const match = filteredInstitutions.find(i => i.name.toLowerCase() === institutionSearch.toLowerCase());

                if (match) {
                    finalInstitutionId = match.id;
                } else if (profile.institution_id) {
                    // If we have an ID, but the search text might be slightly different or just re-typed
                    // We should ideally verify, but for now, if they selected it, it's fine.
                    // Simplified: If search text exists, it MUST match a result in the dropdown.
                    // But since we debounce, filteredInstitutions might be empty if they typed fast.
                    // So we trust the ID if it's set.
                    finalInstitutionId = profile.institution_id;
                } else {
                    toast.error("Please select a valid institution from the list.");
                    setSaving(false);
                    return;
                }
            } else {
                finalInstitutionId = null;
            }

            const updates = {
                ...profile,
                weight: profile.weight === '' ? null : parseFloat(profile.weight),
                height: profile.height === '' ? null : parseFloat(profile.height),
                caloric_target: parseInt(profile.caloric_target) || 0,
                hydration_target: parseInt(profile.hydration_target) || 0,
                institution_id: finalInstitutionId,
                updated_at: new Date(),
            };

            console.log("Sending updates:", updates); // Debug log

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id);

            if (error) {
                if (error.code === '23505') { // Unique violation code
                    throw new Error('Username already taken. Please choose another.');
                }
                throw error;
            }
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleSync = async () => {
        if (!confirm('This will fetch the full college list and add missing ones to your database. Continue?')) return;
        setSaving(true);
        try {
            const res = await fetch('https://raw.githubusercontent.com/VarthanV/Indian-Colleges-List/master/colleges.json');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            if (!Array.isArray(data)) throw new Error('Invalid data format');

            const colleges = data
                .filter(c => c.college)
                .map(c => ({ name: c.college, type: c.college_type || 'College' }));

            const uniqueColleges = Array.from(new Map(colleges.map(item => [item.name, item])).values());
            const chunkSize = 100;
            for (let i = 0; i < uniqueColleges.length; i += chunkSize) {
                const chunk = uniqueColleges.slice(i, i + chunkSize);
                const { error } = await supabase
                    .from('institutions')
                    .upsert(chunk, { onConflict: 'name', ignoreDuplicates: true });
                if (error) console.error('Chunk error:', error);
            }

            toast.success(`Database synced! Processed ${uniqueColleges.length} colleges.`);
            window.location.reload();
        } catch (err) {
            console.error('Sync failed:', err);
            toast.error('Sync failed. Check console.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                <p className="text-slate-400">Manage your account and goals.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center justify-center space-y-4 pb-6 border-b border-slate-800">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        <User className="w-10 h-10" />
                                    </div>
                                )}
                            </div>

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full gap-2">
                                <label className="cursor-pointer p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Upload Photo">
                                    <Upload className="w-5 h-5 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={uploadAvatar}
                                        disabled={uploadingAvatar}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={startCamera}
                                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                    title="Take Photo"
                                >
                                    <Camera className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">Upload or take a photo</p>
                    </div>

                    {/* Camera Modal */}
                    {showCamera && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 max-w-lg w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-white font-bold">Take Photo</h3>
                                    <button type="button" onClick={stopCamera} className="text-slate-400 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                </div>
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2"
                                    >
                                        <Camera className="w-5 h-5" />
                                        Capture
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                Personal Info
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.full_name}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    minLength={3}
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Institution / College</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={institutionSearch}
                                        onChange={(e) => {
                                            setInstitutionSearch(e.target.value);
                                            setShowSuggestions(true);
                                            if (profile.institution_id) {
                                                setProfile(p => ({ ...p, institution_id: null }));
                                            }
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        placeholder="Search your college..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && filteredInstitutions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                        {filteredInstitutions.map((inst) => (
                                            <button
                                                key={inst.id}
                                                type="button"
                                                onClick={() => {
                                                    setInstitutionSearch(inst.name);
                                                    setProfile(p => ({ ...p, institution_id: inst.id }));
                                                    setShowSuggestions(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-between group"
                                            >
                                                <span>{inst.name}</span>
                                                {inst.id === profile.institution_id && <Check className="w-3 h-3 text-blue-500" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Goals & Metrics */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-pink-500" />
                                Health & Metrics
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={profile.weight}
                                        onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. 70"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={profile.height}
                                        onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. 175"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Gender</label>
                                    <select
                                        value={profile.gender || ''}
                                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={profile.dob || ''}
                                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Activity Level</label>
                                    <select
                                        value={profile.activity_level || ''}
                                        onChange={(e) => setProfile({ ...profile, activity_level: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Activity Level</option>
                                        <option value="sedentary">Sedentary (Little/No Exercise)</option>
                                        <option value="light">Light (1-3 days/week)</option>
                                        <option value="moderate">Moderate (3-5 days/week)</option>
                                        <option value="active">Active (6-7 days/week)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Fitness Goal</label>
                                    <select
                                        value={profile.fitness_goal || ''}
                                        onChange={(e) => setProfile({ ...profile, fitness_goal: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Goal</option>
                                        <option value="weight_loss">Weight Loss</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="weight_gain">Weight Gain</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Daily Calories (kcal)</label>
                                    <input
                                        type="number"
                                        value={profile.caloric_target}
                                        onChange={(e) => setProfile({ ...profile, caloric_target: parseInt(e.target.value) })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Daily Water (ml)</label>
                                    <input
                                        type="number"
                                        value={profile.hydration_target}
                                        onChange={(e) => setProfile({ ...profile, hydration_target: parseInt(e.target.value) })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleSync}
                            className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
                        >
                            Sync College Database
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
