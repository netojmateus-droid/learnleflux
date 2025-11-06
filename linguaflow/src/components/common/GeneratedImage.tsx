import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GeneratedImageProps = {
  prompt: string;
  className?: string;
  alt?: string;
};

// Create a deterministic seed from a string
const getSeedFromString = (str: string) => {
    let hash = 0;
    if (!str || str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ prompt, className, alt }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const generateImage = async () => {
      if (!prompt) return;
      setIsLoading(true);
      setImageUrl(null);

      const seed = getSeedFromString(prompt);
      const enhancedPrompt = `zen, minimalist illustration, ${prompt}`;
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux`;
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch image from Pollinations AI');
        const blob = await response.blob();
        if (!isCancelled) {
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        }
      } catch (error) {
        console.error("Failed to generate image:", error);
        if (!isCancelled) setImageUrl(null);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    generateImage();

    return () => {
      isCancelled = true;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [prompt]);

  return (
    <div className={`relative overflow-hidden bg-dark-base-end ${className}`}>
        <AnimatePresence>
            {isLoading && (
                 <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                 >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-t-accent border-white/20 rounded-full"
                    />
                </motion.div>
            )}
        </AnimatePresence>
        
        <AnimatePresence>
        {imageUrl && !isLoading && (
             <motion.img
                key="image"
                src={imageUrl} 
                alt={alt || prompt} 
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
             />
        )}
        </AnimatePresence>
    </div>
  );
};