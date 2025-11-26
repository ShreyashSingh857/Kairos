import React, { useState } from 'react';
import { FileText, Image, Link as LinkIcon, File, Trash2, Plus, ExternalLink } from 'lucide-react';
import { useResources } from '../../hooks/useResources';

export default function ResourceList({ projectId, chapterId }) {
    const { resources, isLoading, addResource, deleteResource, uploadFile } = useResources(projectId, chapterId);
    const [isAdding, setIsAdding] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', type: 'link', url: '' });
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let finalUrl = newResource.url;

            if (selectedFile) {
                finalUrl = await uploadFile(selectedFile);
            }

            await addResource.mutateAsync({
                ...newResource,
                url: finalUrl
            });

            setIsAdding(false);
            setNewResource({ title: '', type: 'link', url: '' });
            setSelectedFile(null);
        } catch (error) {
            console.error("Failed to add resource:", error);
            alert("Failed to add resource. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileText className="w-4 h-4 text-red-400" />;
            case 'word': return <FileText className="w-4 h-4 text-blue-400" />;
            case 'image': return <Image className="w-4 h-4 text-purple-400" />;
            case 'link': return <LinkIcon className="w-4 h-4 text-green-400" />;
            default: return <File className="w-4 h-4 text-slate-400" />;
        }
    };

    if (isLoading) return <div className="text-xs text-slate-500">Loading resources...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-slate-300">Resources</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <Plus className="w-3 h-3" />
                    Add Resource
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 space-y-3">
                    <input
                        type="text"
                        placeholder="Title (e.g., Design Specs)"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                    <div className="flex gap-2">
                        <select
                            value={newResource.type}
                            onChange={(e) => {
                                setNewResource({ ...newResource, type: e.target.value, url: '' });
                                setSelectedFile(null);
                            }}
                            className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="link">Link</option>
                            <option value="pdf">PDF</option>
                            <option value="word">Word</option>
                            <option value="image">Image</option>
                            <option value="other">Other File</option>
                        </select>

                        {newResource.type === 'link' ? (
                            <input
                                type="text"
                                placeholder="URL / Link"
                                value={newResource.url}
                                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        ) : (
                            <input
                                type="file"
                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                accept={
                                    newResource.type === 'image' ? 'image/*' :
                                        newResource.type === 'pdf' ? '.pdf' :
                                            newResource.type === 'word' ? '.doc,.docx' :
                                                undefined
                                }
                                className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-400 focus:outline-none focus:border-blue-500 file:mr-4 file:py-0 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                                required
                            />
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="text-xs text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? 'Uploading...' : 'Add'}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-2">
                {resources?.length === 0 && !isAdding && (
                    <p className="text-xs text-slate-500 italic">No resources added yet.</p>
                )}
                {resources?.map(resource => (
                    <div key={resource.id} className="group flex items-center justify-between p-2 rounded hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800">
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 flex-1 min-w-0"
                        >
                            {getIcon(resource.type)}
                            <span className="text-sm text-slate-300 truncate group-hover:text-blue-400 transition-colors">
                                {resource.title}
                            </span>
                            <ExternalLink className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <button
                            onClick={() => deleteResource.mutate(resource.id)}
                            className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
