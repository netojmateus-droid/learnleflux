/// <reference types="vite-plugin-pwa/client" />

declare module 'pdfjs-dist/build/pdf.worker?url' {
	const src: string;
	export default src;
}

interface ImportMetaEnv {
	readonly VITE_POLLINATIONS_MODEL?: string;
	readonly VITE_PEXELS_API_KEY?: string;
	readonly VITE_PIXABAY_API_KEY?: string;
	readonly VITE_GIPHY_API_KEY?: string;
	readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
