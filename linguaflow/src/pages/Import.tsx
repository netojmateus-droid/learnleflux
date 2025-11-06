
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Link, Youtube, UploadCloud, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useLibraryStore } from '@/store/libraryStore';
import { Button } from '@/components/common/Button';
import { Caption } from '@/types';

// Simple language detector (heuristic)
const detectLang = (text: string): string => {
  if (/\b(the|and|is|are)\b/i.test(text)) return 'en';
  if (/\b(el|la|es|son)\b/i.test(text)) return 'es';
  if (/\b(le|la|est|sont)\b/i.test(text)) return 'fr';
  if (/\b(der|die|das|ist|sind)\b/i.test(text)) return 'de';
  return 'unknown';
}

const YOUTUBE_ID_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

const getYouTubeVideoId = (url: string) => {
    const match = url.match(YOUTUBE_ID_REGEX);
    return match ? match[1] : null;
};

const ImportPage = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [youtubeSubtitles, setYoutubeSubtitles] = useState<Caption[] | null>(null);
  const [subtitleStatus, setSubtitleStatus] = useState<'idle' | 'fetching' | 'success' | 'failed'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const addText = useLibraryStore((s) => s.addText);

  const handleAddLibraryItem = () => {
    setIsLoading(true);

    if (activeTab === 'youtube' && youtubeVideoId) {
        if (!youtubeSubtitles) {
            alert("Please add subtitles to the video before saving.");
            setIsLoading(false);
            return;
        }
        const content = JSON.stringify(youtubeSubtitles);
        const wordCount = youtubeSubtitles.reduce((acc, cap) => acc + cap.text.split(/\s+/).length, 0);

        addText({
          title,
          lang: 'en', // transcript API is mostly english
          content,
          progress: 0,
          wordCount,
          type: 'video',
          videoId: youtubeVideoId,
        });
    } else {
        if (!text || !title) {
             setIsLoading(false);
             return;
        }
        const lang = detectLang(text);
        const wordCount = text.split(/\s+/).length;

        addText({
          title,
          lang,
          content: text,
          progress: 0,
          wordCount,
          type: 'text'
        });
    }

    console.log("✨ Item saved");
    navigate('/');
  };

  const extractArticleContent = (doc: Document): { content: string, title: string } => {
    const pageTitle = doc.querySelector('title')?.innerText || url.split('/').filter(Boolean).pop() || 'Untitled Article';
    const article = doc.body.cloneNode(true) as HTMLElement;
    article.querySelectorAll('script, style, nav, header, footer, aside, form, noscript, [aria-hidden="true"]').forEach(el => el.remove());
    const cleanedText = article.innerText.replace(/(\n\s*){3,}/g, '\n\n').trim();
    return { content: cleanedText, title: pageTitle };
  };

  const handleFetchFromUrl = async () => {
    if (!url || !url.startsWith('http')) return;
    setIsLoading(true);
    try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const { content, title } = extractArticleContent(doc);
        setTitle(title);
        setText(content);
    } catch (error) {
        console.error("Error fetching from URL:", error);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleYoutubeUrlChange = useCallback(async (newUrl: string) => {
    setYoutubeUrl(newUrl);
    const videoId = getYouTubeVideoId(newUrl);
    setYoutubeVideoId(videoId);
    setYoutubeSubtitles(null);

    if (videoId) {
        try {
            // Fetch metadata
            const oembedRes = await fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`);
            const metadata = await oembedRes.json();
            setTitle(metadata.title || 'YouTube Video');
            
            // Fetch transcript
            setSubtitleStatus('fetching');
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://youtube-transcript-api.vercel.app/?id=${videoId}`)}`;
            const transcriptRes = await fetch(proxyUrl);
            if (!transcriptRes.ok) throw new Error('Transcript not available');
            const transcriptData = await transcriptRes.json();
            
            const captions: Caption[] = transcriptData.map((t: any) => ({
                start: t.offset,
                end: t.offset + t.duration,
                text: t.text,
            }));

            setYoutubeSubtitles(captions);
            setSubtitleStatus('success');

        } catch (error) {
            console.warn("Could not auto-fetch subtitles:", error);
            setSubtitleStatus('failed');
        }
    } else {
        setTitle('');
        setSubtitleStatus('idle');
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTitle(file.name.split('.')[0].replace(/_/g, ' '));
    setIsLoading(true);

    if (file.type === 'application/pdf') {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
      const reader = new FileReader();
      reader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument(typedarray).promise;
        let content = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          content += textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
        }
        setText(content);
        setIsLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.srt') || file.name.endsWith('.vtt')) {
        const { parse } = await import('subsrt-ts');
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target?.result as string;
            const parsedCaptions = parse(fileContent);
          // parsedCaptions typings vary by parser version; coerce to the expected shape
          const captions: Caption[] = (parsedCaptions as any[]).map(c => ({ start: Number(c.start), end: Number(c.end), text: String(c.text) }));
            if (activeTab === 'youtube') {
                setYoutubeSubtitles(captions);
                setSubtitleStatus('success');
            } else {
                setText(captions.map(c => c.text).join(' \n'));
            }
            setIsLoading(false);
        };
        reader.readAsText(file);
    } else {
        const reader = new FileReader();
        reader.onload = (event) => {
            setText(event.target?.result as string);
            setIsLoading(false);
        }
        reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'text', icon: FileText, label: 'Paste Text' },
    { id: 'file', icon: UploadCloud, label: 'File' },
    { id: 'link', icon: Link, label: 'Link' },
    { id: 'youtube', icon: Youtube, label: 'YouTube' },
  ];

  const contentPreviewText = activeTab === 'youtube'
    ? youtubeSubtitles?.map(c => c.text).join(' ').substring(0, 500)
    : text.substring(0, 500);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="font-display text-4xl text-dark-text-primary mb-8">Import</h1>
      <div className="flex border-b border-white/10 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === tab.id ? 'text-accent border-b-2 border-accent' : 'text-dark-text-secondary hover:text-dark-text-primary'}`}>
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-accent focus:border-accent" />

        {activeTab === 'text' && (<textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here..." className="w-full h-64 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-accent focus:border-accent resize-none" />)}
        
        {activeTab === 'file' && (
            <div className="relative w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-dark-text-secondary">
                <UploadCloud size={40} className="mb-2"/><p>Drag & drop or click to upload</p><p className="text-xs">PDF, SRT, VTT, TXT</p>
                <input type="file" onChange={handleFileChange} className="absolute w-full h-full opacity-0 cursor-pointer" accept=".pdf,.srt,.vtt,.txt"/>
            </div>
        )}
        
        {activeTab === 'link' && (
           <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/article" className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-accent focus:border-accent" />
                    <Button onClick={handleFetchFromUrl} disabled={isLoading || !url}>{isLoading ? 'Fetching...' : 'Fetch Content'}</Button>
                </div>
                <div className="flex items-start gap-2 p-3 text-sm bg-yellow-500/10 text-yellow-300 rounded-lg"><AlertCircle size={18} className="flex-shrink-0 mt-0.5"/><p>Note: Due to web security restrictions (CORS), this may not work for all websites.</p></div>
           </div>
        )}

        {activeTab === 'youtube' && (
            <div className="space-y-4">
                <input type="url" value={youtubeUrl} onChange={(e) => handleYoutubeUrlChange(e.target.value)} placeholder="Paste a YouTube URL" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-accent focus:border-accent" />
                {subtitleStatus === 'fetching' && <p className="text-dark-text-secondary">Fetching subtitles...</p>}
                {subtitleStatus === 'success' && <div className="flex items-center gap-2 p-3 text-sm bg-green-500/10 text-green-400 rounded-lg"><CheckCircle size={18} /> Subtitles loaded successfully.</div>}
                {subtitleStatus === 'failed' && (
                    <div className="space-y-3 p-3 bg-red-500/10 text-red-300 rounded-lg">
                        <div className="flex items-center gap-2"><XCircle size={18} /> Could not fetch subtitles automatically.</div>
                        <p className="text-sm">Please upload a subtitle file (.srt or .vtt) for this video.</p>
                        <input type="file" onChange={handleFileChange} accept=".srt,.vtt" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-dark-base-end hover:file:bg-accent/90" />
                    </div>
                )}
            </div>
        )}
        
        {(text || youtubeSubtitles) && (
            <div>
                <h3 className="font-display text-lg text-dark-text-secondary mb-2">Content Preview</h3>
                 <div className="p-4 bg-white/5 rounded-xl max-h-48 overflow-y-auto border border-white/10">
                    <p className="text-dark-text-secondary whitespace-pre-wrap">{contentPreviewText}{contentPreviewText && contentPreviewText.length >= 500 ? '...' : ''}</p>
                </div>
            </div>
        )}
        
        <Button onClick={handleAddLibraryItem} disabled={isLoading || (activeTab === 'youtube' ? !youtubeVideoId || !youtubeSubtitles : (!text || !title))} className="w-full">
          {isLoading ? 'Processing...' : 'Add to Library'}
        </Button>
      </div>
    </div>
  );
};

export default ImportPage;