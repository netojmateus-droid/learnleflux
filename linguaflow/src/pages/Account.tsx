
import React from 'react';
import { usePrefsStore } from '@/store/prefsStore';
import { useLibraryStore } from '@/store/libraryStore';
import { useVocabStore } from '@/store/vocabStore';
import { Button } from '@/components/common/Button';
import { Download, Upload } from 'lucide-react';

const AccountPage = () => {
    const { prefs, setTheme, setFontSize, setLineHeight } = usePrefsStore();

    const handleExport = () => {
        const data = {
            texts: useLibraryStore.getState().texts,
            vocabulary: useVocabStore.getState().vocabulary,
            preferences: usePrefsStore.getState().prefs,
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `linguaflow_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };
    
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                if (data.texts) useLibraryStore.setState({ texts: data.texts });
                if (data.vocabulary) useVocabStore.setState({ vocabulary: data.vocabulary });
                if (data.preferences) usePrefsStore.setState({ prefs: data.preferences });
                alert('Backup restored successfully!');
            } catch (error) {
                alert('Failed to parse backup file.');
            }
        };
        reader.readAsText(file);
    };


    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 pb-24">
            <h1 className="font-display text-4xl text-dark-text-primary mb-8">Account</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="font-display text-xl text-dark-text-secondary mb-4">Appearance</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-dark-text-secondary mb-2">Theme</label>
                            <select value={prefs.theme} onChange={e => setTheme(e.target.value as any)} className="w-full bg-white/5 border-white/10 rounded-lg">
                                <option value="auto">Auto</option>
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-dark-text-secondary mb-2">Font Size ({prefs.fontSize}%)</label>
                            <input type="range" min="80" max="150" value={prefs.fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" />
                        </div>
                         <div>
                            <label className="block text-dark-text-secondary mb-2">Line Height ({prefs.lineHeight})</label>
                            <input type="range" min="1.4" max="2.0" step="0.1" value={prefs.lineHeight} onChange={e => setLineHeight(Number(e.target.value))} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent" />
                        </div>
                    </div>
                </section>
                
                <section>
                    <h2 className="font-display text-xl text-dark-text-secondary mb-4">Data Management</h2>
                    <div className="flex gap-4">
                        <Button onClick={handleExport} icon={<Download size={18}/>} variant="secondary">Export Data</Button>
                        <label className="cursor-pointer">
                            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-display font-semibold transition-all duration-200 ease-in-out bg-white/10 text-dark-text-primary hover:bg-white/20">
                                <Upload size={18}/>
                                <span>Import Data</span>
                            </div>
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>
                    </div>
                </section>

                 <section>
                    <h2 className="font-display text-xl text-dark-text-secondary mb-4">Cloud Backup (Coming Soon)</h2>
                    <p className="text-dark-text-tertiary text-sm mb-4">Backup and restore your data using your Google Drive account. This feature is currently unavailable.</p>
                    <Button disabled variant="secondary">Connect Google Drive</Button>
                </section>
            </div>
        </div>
    );
};

export default AccountPage;
   