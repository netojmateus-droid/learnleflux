import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastIntent = 'success' | 'error' | 'info';

interface ToastData {
  id: string;
  message: string;
  intent: ToastIntent;
}

interface ToastContextValue {
  push: (message: string, intent?: ToastIntent) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const push = useCallback((message: string, intent: ToastIntent = 'info') => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, intent }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  const contextValue = useMemo<ToastContextValue>(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex flex-col items-center gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className={cn(
                'surface-glass pointer-events-auto flex items-center gap-3 px-5 py-3 text-sm text-text-primary shadow-soft',
                toast.intent === 'success' && 'border border-emerald-400/40 text-emerald-200',
                toast.intent === 'error' && 'border border-red-400/40 text-red-200'
              )}
            >
              {toast.intent === 'success' && <CheckCircle2 className="h-4 w-4" aria-hidden />}
              {toast.intent === 'error' && <AlertCircle className="h-4 w-4" aria-hidden />}
              {toast.intent === 'info' && <Info className="h-4 w-4" aria-hidden />}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
