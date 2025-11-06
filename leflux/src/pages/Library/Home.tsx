import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Youtube, Newspaper, BookMarked, Sparkles } from 'lucide-react';
import { useLibraryStore } from '@/store/libraryStore';
import { Button } from '@/components/common/Button';
import { LibraryCardGrid } from '@/components/library/LibraryCardGrid';
import { NewsHighlights } from '@/components/library/NewsHighlights';
import { useI18n } from '@/services/i18n';

export function LibraryHome() {
  const { texts, isLoading, error } = useLibraryStore();
  const { locale } = useI18n();

  const hasTexts = useMemo(() => texts.length > 0, [texts]);

  const quickActions = useMemo(
    () => [
      {
        id: 'youtube',
        to: '/import',
        icon: Youtube,
        title: locale.quickActions.youtube.title,
        description: locale.quickActions.youtube.description,
      },
      {
        id: 'news',
        href: '#news',
        icon: Newspaper,
        title: locale.quickActions.news.title,
        description: locale.quickActions.news.description,
      },
      {
        id: 'vocab',
        to: '/vocabulary',
        icon: BookMarked,
        title: locale.quickActions.vocab.title,
        description: locale.quickActions.vocab.description,
      },
      {
        id: 'stories',
        to: '/texts',
        icon: Sparkles,
        title: locale.quickActions.stories.title,
        description: locale.quickActions.stories.description,
      },
    ],
    [locale.meta.code]
  );

  return (
    <div className="flex min-h-screen flex-col pb-24 lg:pb-0">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="mx-auto w-full max-w-5xl px-6 pt-10"
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary">{locale.library.tag}</p>
          <h1 className="font-display text-3xl font-semibold text-text-primary md:text-4xl">{locale.library.headline}</h1>
          <p className="max-w-2xl text-text-secondary">{locale.library.description}</p>
        </div>
      </motion.header>

      <section className="mx-auto w-full max-w-5xl px-6 pt-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ id, icon: Icon, title, description, to, href }) => {
            const cardContent = (
              <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-6 transition hover:border-accent/40 hover:bg-accent/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-text-primary">{title}</h3>
                    <p className="text-sm text-text-secondary">{description}</p>
                  </div>
                </div>
              </div>
            );

            if (to) {
              return (
                <Link key={id} to={to} className="focus-ring block" aria-label={title}>
                  {cardContent}
                </Link>
              );
            }

            return (
              <a key={id} href={href} className="focus-ring block" aria-label={title}>
                {cardContent}
              </a>
            );
          })}
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-6 py-10">
        <NewsHighlights />

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="surface-glass animate-pulse p-6" />
            ))}
          </div>
        ) : hasTexts ? (
          <LibraryCardGrid texts={texts} />
        ) : (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="surface-glass flex flex-col items-center gap-6 px-8 py-16 text-center"
          >
            <span className="text-5xl" role="img" aria-hidden>
              📖
            </span>
            <div className="max-w-md space-y-2">
              <h2 className="font-display text-2xl font-semibold text-text-primary">
                {locale.library.emptyHeading}
              </h2>
              <p className="text-text-secondary">{locale.library.emptyDescription}</p>
            </div>
            <Button to="/import" intent="accent">
              + {locale.nav.import}
            </Button>
          </motion.section>
        )}

        {error && (
          <div className="mt-8 rounded-3xl border border-accent/40 bg-accent/10 px-6 py-4 text-accent">{locale.library.error}</div>
        )}
      </main>

    </div>
  );
}
