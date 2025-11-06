import { useCallback, useMemo } from 'react';
import { usePrefsStore } from '@/store/prefsStore';

type TopicDescriptor = {
  id: string;
  label: string;
};

type StoryModes = {
  vocab: string;
  prompt: string;
};

type UILocale = {
  meta: {
    code: string;
    name: string;
    languageLabel: string;
    topics: TopicDescriptor[];
    storyModes: StoryModes;
  };
  nav: {
    library: string;
    import: string;
    vocabulary: string;
    review: string;
    stories: string;
    account: string;
  };
  common: {
    refresh: string;
    topic: string;
    noContent: string;
  };
  library: {
    tag: string;
    headline: string;
    description: string;
    emptyHeading: string;
    emptyDescription: string;
    error: string;
  };
  quickActions: Record<
    'youtube' | 'news' | 'vocab' | 'stories',
    {
      title: string;
      description: string;
    }
  >;
  news: {
    title: string;
    subtitle: string;
    error: string;
    empty: string;
    cta: string;
    save: string;
    saving: string;
    saved: string;
    saveError: string;
  };
  texts: {
    tag: string;
    title: string;
    description: string;
    modeLabel: string;
    promptLabel: string;
    promptPlaceholder: string;
    promptHint: string;
    extraPromptHint: string;
    summary: {
      selected: string;
      due: string;
      mastered: string;
      length: string;
      lengthUnit: string;
    };
    controls: {
      selectAll: string;
      clear: string;
      shuffle: string;
    };
    actions: {
      copy: string;
      copied: string;
      generate: string;
      generating: string;
      export: string;
    };
    messages: {
      needVocab: string;
      promptRequired: string;
      copied: string;
      copyError: string;
      saved: string;
      emptyGenerated: string;
      fallback: string;
    };
    storyPlaceholder: string;
    footerNote: string;
    story: {
      intro: string;
      vocabHeading: string;
      storyHeading: string;
      fallbackSentence: string;
      translationClause: string;
      promptIntro: string;
      promptMiddle: string;
      promptEnding: string;
      promptTitle: string;
    };
  };
};

export type UILanguageCode = keyof typeof uiLocales;

export const uiLocales: Record<string, UILocale> = {
  en: {
    meta: {
      code: 'en',
      name: 'English',
      languageLabel: 'English',
      topics: [
        { id: 'culture', label: 'Culture' },
        { id: 'technology', label: 'Technology' },
        { id: 'business', label: 'Business' },
        { id: 'education', label: 'Education' },
        { id: 'science', label: 'Science' },
      ],
      storyModes: {
        vocab: 'Saved vocabulary',
        prompt: 'Custom prompt',
      },
    },
    nav: {
      library: 'Library',
      import: 'Import',
      vocabulary: 'Vocabulary',
      review: 'Review',
      stories: 'Creations',
      account: 'Account',
    },
    common: {
      refresh: 'Refresh',
      topic: 'Topic',
      noContent: 'Nothing to show yet.',
    },
    library: {
      tag: 'Library',
      headline: 'Your comprehensible input garden',
      description: 'Organize texts, videos, and audio to nurture your fluency. Everything works offline, at your own pace.',
      emptyHeading: 'No texts yet — transform your input into learning.',
      emptyDescription: 'Import a text, video, or subtitle file and dive into focused reading.',
      error: 'Something did not load. Try again?',
    },
    quickActions: {
      youtube: {
        title: 'Save from YouTube',
        description: 'Paste a video link and turn it into study material.',
      },
      news: {
        title: 'News clipping',
        description: 'Read timely topics to practice extensive comprehension.',
      },
      vocab: {
        title: 'Saved vocabulary',
        description: 'Review flagged words and track spaced repetition progress.',
      },
      stories: {
        title: 'Generate stories',
        description: 'Combine vocabulary or your own prompt to craft mini tales.',
      },
    },
    news: {
      title: 'News highlights',
      subtitle: 'Daily digest curated for your study language. Pick a topic to dive in.',
      error: 'We could not refresh the clipping right now. Try again in a moment.',
      empty: 'No curated articles for this topic yet.',
      cta: 'Read article',
      save: 'Add to library',
      saving: 'Saving…',
      saved: 'Article saved to your library.',
      saveError: 'We could not save this article right now.',
    },
    texts: {
      tag: 'Creations',
      title: 'Mini stories and term remixes',
      description: 'Mix your vocabulary or write a custom prompt to spin new stories.',
      modeLabel: 'Story basis',
      promptLabel: 'Custom prompt',
      promptPlaceholder: 'Describe the setting, characters, tone, or grammar focus you want.',
      promptHint: 'Switch modes to choose between saved words or a fully custom prompt.',
      extraPromptHint: 'Add extra guidance (optional) when using vocabulary mode.',
      summary: {
        selected: 'Selected',
        due: 'Due',
        mastered: 'Mastered',
        length: 'Length',
        lengthUnit: 'chars',
      },
      controls: {
        selectAll: 'Select all',
        clear: 'Clear',
        shuffle: 'Shuffle',
      },
      actions: {
        copy: 'Copy',
        copied: 'Copied',
        generate: 'Generate story',
        generating: 'Generating...',
        export: 'Save to library',
      },
      messages: {
        needVocab: 'Save some words before generating stories.',
        promptRequired: 'Describe your idea before generating.',
        copied: 'Copied to the clipboard.',
        copyError: 'We could not copy right now.',
        saved: 'Story saved to the library.',
        emptyGenerated: 'Generate a story first.',
        fallback: 'Pollinations is unavailable. Showing a locally generated story instead.',
      },
      storyPlaceholder: 'Your generated story appears here. Tweak it freely before exporting.',
      footerNote: 'Story is generated locally. Adjust manually to weave in cultural nuances.',
      story: {
        intro: 'Create a mini-story in {language} that uses the following terms naturally. Vary verb tenses and keep an engaging tone.',
        vocabHeading: 'Focus vocabulary:',
        storyHeading: 'Story:',
        fallbackSentence: 'Write a short scene where "{term}"{translationClause} becomes meaningful to someone learning {language}.',
        translationClause: ' ({translation})',
        promptIntro: 'Use the following brief as inspiration: {prompt}',
        promptMiddle: 'Develop two concise paragraphs that highlight sensory detail and emotional stakes.',
        promptEnding: 'Finish with a line that invites reflection or discussion from learners.',
        promptTitle: 'Story idea ({date})',
      },
    },
  },
  es: {
    meta: {
      code: 'es',
      name: 'Español',
      languageLabel: 'Español',
      topics: [
        { id: 'culture', label: 'Cultura' },
        { id: 'technology', label: 'Tecnología' },
        { id: 'business', label: 'Negocios' },
        { id: 'education', label: 'Educación' },
        { id: 'science', label: 'Ciencia' },
      ],
      storyModes: {
        vocab: 'Palabras guardadas',
        prompt: 'Prompt personalizado',
      },
    },
    nav: {
      library: 'Biblioteca',
      import: 'Importar',
      vocabulary: 'Vocabulario',
      review: 'Revisión',
      stories: 'Creaciones',
      account: 'Cuenta',
    },
    common: {
      refresh: 'Actualizar',
      topic: 'Tema',
      noContent: 'Aún no hay contenido.',
    },
    library: {
      tag: 'Biblioteca',
      headline: 'Tu jardín de input comprensible',
      description: 'Organiza textos, vídeos y audios para nutrir tu fluidez. Todo funciona sin conexión, a tu ritmo.',
      emptyHeading: 'Aún no hay textos — convierte tu input en aprendizaje.',
      emptyDescription: 'Importa un texto, vídeo o subtítulo y sumérgete en una lectura enfocada.',
      error: 'Algo no cargó. ¿Intentas de nuevo?',
    },
    quickActions: {
      youtube: {
        title: 'Guardar desde YouTube',
        description: 'Pega un enlace de vídeo y conviértelo en material de estudio.',
      },
      news: {
        title: 'Recorte de noticias',
        description: 'Lee temas actuales para practicar comprensión extensiva.',
      },
      vocab: {
        title: 'Vocabulario guardado',
        description: 'Repasa palabras marcadas y sigue el progreso del SRS.',
      },
      stories: {
        title: 'Generar historias',
        description: 'Combina vocabulario o tu propio prompt para crear mini relatos.',
      },
    },
    news: {
      title: 'Noticias destacadas',
      subtitle: 'Digest diario curado para tu idioma de estudio. Elige un tema para explorar.',
      error: 'No pudimos actualizar el clipping ahora. Intenta de nuevo más tarde.',
      empty: 'Todavía no hay artículos curados para este tema.',
      cta: 'Leer artículo',
      save: 'Agregar a la biblioteca',
      saving: 'Guardando…',
      saved: 'Artículo guardado en tu biblioteca.',
      saveError: 'No pudimos guardar el artículo ahora.',
    },
    texts: {
      tag: 'Creaciones',
      title: 'Mini historias y mezclas de términos',
      description: 'Mezcla tu vocabulario o escribe un prompt propio para generar historias nuevas.',
      modeLabel: 'Base de la historia',
      promptLabel: 'Prompt personalizado',
      promptPlaceholder: 'Describe el escenario, los personajes, el tono o el enfoque gramatical que quieres.',
      promptHint: 'Cambia de modo para elegir entre palabras guardadas o un prompt totalmente personalizado.',
      extraPromptHint: 'Añade orientación adicional (opcional) cuando uses el modo de vocabulario.',
      summary: {
        selected: 'Seleccionadas',
        due: 'Pendientes',
        mastered: 'Dominadas',
        length: 'Longitud',
        lengthUnit: 'caracteres',
      },
      controls: {
        selectAll: 'Seleccionar todo',
        clear: 'Limpiar',
        shuffle: 'Aleatorio',
      },
      actions: {
        copy: 'Copiar',
        copied: 'Copiado',
        generate: 'Generar historia',
        generating: 'Generando...',
        export: 'Guardar en la biblioteca',
      },
      messages: {
        needVocab: 'Guarda algunas palabras antes de generar historias.',
        promptRequired: 'Describe tu idea antes de generar.',
        copied: 'Copiado al portapapeles.',
        copyError: 'No pudimos copiar ahora.',
        saved: 'Historia guardada en la biblioteca.',
        emptyGenerated: 'Genera una historia primero.',
        fallback: 'Pollinations no está disponible. Mostramos una historia generada localmente.',
      },
      storyPlaceholder: 'Tu historia generada aparece aquí. Edítala libremente antes de exportar.',
      footerNote: 'El texto se genera localmente. Ajusta a mano para incorporar matices culturales.',
      story: {
        intro: 'Crea una mini historia en {language} que utilice los siguientes términos de forma natural. Varía los tiempos verbales y mantén un tono atractivo.',
        vocabHeading: 'Vocabulario focal:',
        storyHeading: 'Historia:',
        fallbackSentence: 'Escribe una escena breve donde «{term}»{translationClause} cobre sentido para alguien que aprende {language}.',
        translationClause: ' ({translation})',
        promptIntro: 'Usa el siguiente brief como inspiración: {prompt}',
        promptMiddle: 'Desarrolla dos párrafos concisos con detalles sensoriales y tensión emocional.',
        promptEnding: 'Cierra con una frase que invite a la reflexión o al debate entre estudiantes.',
        promptTitle: 'Idea de historia ({date})',
      },
    },
  },
  pt: {
    meta: {
      code: 'pt',
      name: 'Português',
      languageLabel: 'Português',
      topics: [
        { id: 'culture', label: 'Cultura' },
        { id: 'technology', label: 'Tecnologia' },
        { id: 'business', label: 'Negócios' },
        { id: 'education', label: 'Educação' },
        { id: 'science', label: 'Ciência' },
      ],
      storyModes: {
        vocab: 'Palavras salvas',
        prompt: 'Prompt personalizado',
      },
    },
    nav: {
      library: 'Biblioteca',
      import: 'Importar',
      vocabulary: 'Vocabulário',
      review: 'Revisar',
      stories: 'Criações',
      account: 'Conta',
    },
    common: {
      refresh: 'Atualizar',
      topic: 'Tema',
      noContent: 'Nada por aqui ainda.',
    },
    library: {
      tag: 'Biblioteca',
      headline: 'Seu jardim de input compreensível',
      description: 'Organize textos, vídeos e áudios para nutrir sua fluência. Tudo funciona offline, no seu ritmo.',
      emptyHeading: 'Nenhum texto ainda — transforme o seu input em aprendizado.',
      emptyDescription: 'Importe um texto, vídeo ou legenda e mergulhe em uma leitura focada.',
      error: 'Algo não carregou agora. Tentar novamente?',
    },
    quickActions: {
      youtube: {
        title: 'Salvar do YouTube',
        description: 'Cole o link de um vídeo e transforme em material de estudo.',
      },
      news: {
        title: 'Clipping de notícias',
        description: 'Leia tópicos atuais para praticar leitura extensiva.',
      },
      vocab: {
        title: 'Vocabulário salvo',
        description: 'Revise termos marcados e acompanhe o progresso no SRS.',
      },
      stories: {
        title: 'Gerar histórias',
        description: 'Combine vocabulário ou um prompt próprio para criar mini-histórias.',
      },
    },
    news: {
      title: 'Notícias em destaque',
      subtitle: 'Digest diário curado para o idioma que você estuda. Escolha um tema para mergulhar.',
      error: 'Não conseguimos atualizar o clipping agora. Tente novamente em instantes.',
      empty: 'Ainda não há artigos curados para este tema.',
      cta: 'Ler matéria',
      save: 'Adicionar à biblioteca',
      saving: 'Salvando…',
      saved: 'Artigo adicionado à sua biblioteca.',
      saveError: 'Não conseguimos salvar o artigo agora.',
    },
    texts: {
      tag: 'Criações',
      title: 'Mini-histórias e remix de termos',
      description: 'Misture o vocabulário salvo ou escreva um prompt próprio para gerar novas histórias.',
      modeLabel: 'Base da história',
      promptLabel: 'Prompt personalizado',
      promptPlaceholder: 'Descreva cenário, personagens, tom ou foco gramatical desejado.',
      promptHint: 'Alterne o modo para escolher entre palavras salvas ou um prompt totalmente personalizado.',
      extraPromptHint: 'Inclua orientações extras (opcional) quando usar o modo de vocabulário.',
      summary: {
        selected: 'Selecionadas',
        due: 'Pendentes',
        mastered: 'Dominadas',
        length: 'Comprimento',
        lengthUnit: 'caracteres',
      },
      controls: {
        selectAll: 'Selecionar tudo',
        clear: 'Limpar',
        shuffle: 'Aleatório',
      },
      actions: {
        copy: 'Copiar',
        copied: 'Copiado',
        generate: 'Gerar história',
        generating: 'Gerando...',
        export: 'Salvar na biblioteca',
      },
      messages: {
        needVocab: 'Salve algumas palavras antes de gerar histórias.',
        promptRequired: 'Descreva a ideia antes de gerar.',
        copied: 'Copiado para a área de transferência.',
        copyError: 'Não foi possível copiar agora.',
        saved: 'História salva na biblioteca.',
        emptyGenerated: 'Gere uma história primeiro.',
        fallback: 'Pollinations está indisponível. Mostramos uma história gerada localmente.',
      },
      storyPlaceholder: 'Sua história gerada aparece aqui. Edite livremente antes de exportar.',
      footerNote: 'Conteúdo gerado localmente. Ajuste nuances culturais manualmente.',
      story: {
        intro: 'Crie uma mini-história em {language} que use naturalmente os termos a seguir. Varie tempos verbais e mantenha um tom envolvente.',
        vocabHeading: 'Vocabulário focal:',
        storyHeading: 'História:',
        fallbackSentence: 'Escreva uma cena breve em que "{term}"{translationClause} ganhe significado para quem aprende {language}.',
        translationClause: ' ({translation})',
        promptIntro: 'Use o brief a seguir como inspiração: {prompt}',
        promptMiddle: 'Desenvolva dois parágrafos concisos com detalhes sensoriais e tensão emocional.',
        promptEnding: 'Finalize com uma frase que convide à reflexão ou discussão entre aprendizes.',
        promptTitle: 'Ideia de história ({date})',
      },
    },
  },
};

const rtlLanguages = new Set(['ar', 'he', 'fa'] as const);

const fallbackLocale = uiLocales.en;

function normalizeLanguage(code: string | undefined): string {
  if (!code) return fallbackLocale.meta.code;
  const lowered = code.toLowerCase();
  const [base] = lowered.split('-');
  if (uiLocales[lowered]) return lowered;
  if (uiLocales[base]) return base;
  return fallbackLocale.meta.code;
}

function getFromPath(locale: UILocale, path: string): string | undefined {
  return path
    .split('.')
    .reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), locale) as
    | string
    | undefined;
}

export function useI18n() {
  const targetLang = usePrefsStore((state) => state.prefs.targetLang);

  const locale = useMemo<UILocale>(() => {
    const normalized = normalizeLanguage(targetLang);
    return uiLocales[normalized] ?? fallbackLocale;
  }, [targetLang]);

  const t = useCallback(
    (path: string, fallback?: string) => {
      const value = getFromPath(locale, path);
      if (typeof value === 'string') return value;
      return fallback ?? path;
    },
    [locale]
  );

  return {
    t,
    locale,
    currentLanguage: locale.meta.code,
    isRTL: rtlLanguages.has(locale.meta.code as (typeof rtlLanguages extends Set<infer U> ? U : never)),
  };
}

export { normalizeLanguage as normalizeUILanguage };