export type NewsTopicId = 'culture' | 'technology' | 'business' | 'education' | 'science';

export interface CuratedNewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  topic: NewsTopicId;
  language: string;
  content?: string;
}

export type CuratedNewsBucket = Record<NewsTopicId, CuratedNewsItem[]>;

const article = (...paragraphs: string[]) => paragraphs.join('\n\n');

const topicInsights: Record<string, Record<NewsTopicId, string>> = {
  en: {
    culture:
      'Artists and cultural organizers involved in the project emphasized how language choice can reshape the tone of a performance, prompting audiences to reflect on migration, identity, and belonging from fresh angles.',
    technology:
      'Developers behind the initiative highlighted that blending pedagogy with engineering requires constant feedback from teachers, so they have built advisory boards to review privacy, accessibility, and curriculum alignment.',
    business:
      'Facilitators noted that multilingual workplaces thrive when teams invest in consistent terminology guides, allowing deals, customer calls, and compliance paperwork to flow without misunderstandings.',
    education:
      'Educators describe the initiative as part of a broader shift toward experiential learning, where students connect theory to practice through projects, exchanges, and community storytelling.',
    science:
      'Researchers involved say that opening complex topics to wider audiences demands precise yet approachable language, and they are publishing supporting glossaries to keep learners engaged.',
  },
  es: {
    culture:
      'Artistas y gestores culturales remarcan que cambiar de idioma modifica la textura emocional de cada actividad, invitando al público a revisar la memoria migratoria y la identidad desde nuevas perspectivas.',
    technology:
      'El equipo de desarrollo insiste en que unir pedagogía con ingeniería requiere ciclos constantes de retroalimentación, por lo que formaron comités docentes que revisan privacidad, accesibilidad y pertinencia curricular.',
    business:
      'Facilitadores empresariales subrayan que las organizaciones multilingües prosperan cuando documentan glosarios vivos, evitando malentendidos en negociaciones, atención al cliente y procesos de cumplimiento.',
    education:
      'Docentes describen la propuesta como parte de una ola de aprendizaje experiencial, donde el alumnado enlaza teoría y práctica mediante proyectos, intercambios y relatos comunitarios.',
    science:
      'Investigadores señalan que abrir temas complejos a nuevas audiencias exige un lenguaje preciso y cercano, por lo que publican glosarios de apoyo que mantienen la curiosidad encendida.',
  },
  pt: {
    culture:
      'Artistas e gestores culturais destacam que alternar idiomas muda o clima emocional de cada atividade, levando o público a revisitar memórias de migração e identidade por outros ângulos.',
    technology:
      'A equipe de tecnologia afirma que unir pedagogia e engenharia depende de ciclos constantes de feedback, por isso criaram conselhos docentes que avaliam privacidade, acessibilidade e aderência curricular.',
    business:
      'Mentores empresariais apontam que ambientes de trabalho multilíngues prosperam quando mantêm glossários vivos, reduzindo ruídos em negociações, suporte ao cliente e rotinas de compliance.',
    education:
      'Educadores descrevem a iniciativa como parte de uma virada para o aprendizado experiencial, em que estudantes conectam teoria e prática por meio de projetos, intercâmbios e narrativas comunitárias.',
    science:
      'Pesquisadores ressaltam que democratizar temas complexos demanda linguagem precisa e acolhedora, motivo pelo qual divulgam glossários de apoio que mantêm a curiosidade do público.',
  },
};

const closingInsights: Record<string, string> = {
  en: 'Learners following the project are encouraged to review the key expressions afterwards, add them to personalised study decks, and share reflections with peers so the vocabulary stays active beyond the news cycle.',
  es: 'Quienes acompañan la iniciativa reciben guías para revisar expresiones clave después, incorporarlas a sus propias listas de estudio y debatirlas con compañeros, manteniendo el vocabulario vivo más allá de la noticia.',
  pt: 'Participantes e ouvintes recebem guias para revisar as expressões-chave depois, adicioná-las às listas de estudo e comentá-las com colegas, mantendo o vocabulário ativo muito além da reportagem.',
};

const articleFromSummary = ({
  language,
  topic,
  title,
  summary,
  detail,
}: {
  language: keyof typeof topicInsights;
  topic: NewsTopicId;
  title: string;
  summary: string;
  detail?: string;
}) =>
  article(
    `${title}. ${summary}${detail ? ` ${detail}` : ''}`.trim(),
    topicInsights[language][topic],
    closingInsights[language]
  );

export const curatedNews: Record<string, CuratedNewsBucket> = {
  en: {
    culture: [
      {
        id: 'en-culture-1',
        title: 'New bilingual theater collective sparks immersive performances',
        summary:
          'A troupe of actors from London and Bogotá premiered a bilingual play that lets the audience choose scenes in English or Spanish, highlighting code-switching in daily life.',
        url: 'https://www.example.com/en/culture/bilingual-theater-collective',
        source: 'Cultural Pulse',
        topic: 'culture',
        language: 'en',
        content: article(
          'A new bilingual theater collective linking London and Bogotá is reshaping the way audiences experience live storytelling. Their debut production layers English and Spanish scenes, inviting viewers to vote in real time for which language and perspective the actors should adopt next. The ensemble says the format reflects the fluid conversations they hear on city streets and in immigrant households.',
          'The creative team spent months workshopping idiomatic expressions, cultural references, and instruments so the transitions would feel organic instead of gimmicky. QR codes printed on the program lead to glossaries and short pronunciation clips, allowing attendees to prepare before curtain call. After each show the cast stays for an open forum where spectators share moments that challenged their comprehension and celebrate the phrases they carried home.',
          'Language educators attending the premiere noted how the performance encouraged active listening and provided dozens of authentic phrases for classroom discussion. The collective plans to release study guides and annotated scripts so learners can revisit the material at their own pace. Tickets for the next run sold out in a weekend, signaling strong demand for cultural experiences that double as vibrant language labs.'
        ),
      },
      {
        id: 'en-culture-2',
        title: 'Literary café hosts multilingual poetry night for learners',
        summary:
          'Students and teachers gathered in Lisbon to read short poems in their learning language, sharing tips on pronunciation and rhythm.',
        url: 'https://www.example.com/en/culture/multilingual-poetry-night',
        source: 'Language Today',
        topic: 'culture',
        language: 'en',
        content: article(
          'A cozy literary café tucked inside Lisbon’s Bairro Alto transformed into a stage for aspiring polyglots this weekend. Learners of all ages recited short poems in their target languages, alternating between Portuguese, English, French, and Cape Verdean Creole. Each reading began with a brief introduction highlighting the poem’s cultural background and the vocabulary that initially challenged the speaker.',
          'Between performances, local linguists demonstrated breathing and rhythm exercises drawn from choral training to help readers maintain clarity under pressure. Attendees swapped annotated copies of the poems, comparing how literal translations can miss the playfulness or melancholy woven into the original text. Musicians provided soft accompaniment with fado guitar and hand drums, cueing transitions and underscoring the lyrical cadences of each language.',
          'Organizers said the event is part of a monthly series aimed at demystifying public speaking for language learners while building a repository of crowd-sourced pronunciation notes. Recordings from the evening will be uploaded to an open archive, paired with learner reflections and mini-quizzes for educators. The café plans to expand future sessions to include sign language poetry and spoken word pieces that mix multiple languages in the same performance.'
        ),
      },
      {
        id: 'en-culture-3',
        title: 'Community radio stages language exchange drama series',
        summary:
          'A volunteer station in Montreal airs short dramas co-written by learners, letting listeners vote on plot twists in English and French.',
        url: 'https://www.example.com/en/culture/community-radio-language-drama',
        source: 'Culture Wave',
        topic: 'culture',
        language: 'en',
        content: article(
          'Volunteer producers at a neighborhood radio station in Montreal have launched a serialized drama that doubles as a language exchange experiment. Each episode follows roommates navigating workplace mishaps, family expectations, and late-night food cravings while switching fluidly between English and French. Scripts are co-written by learners who workshop vocabulary lists with mentors before recording in the station’s basement studio.',
          'Listeners can stream the show live or on-demand and then vote online for the next plot twist, forcing writers to respond with quick, idiom-rich dialogue. To support comprehension, the station publishes time-stamped transcripts, interactive glossaries, and behind-the-scenes interviews that unpack slang or regional expressions. A Discord community has sprung up around the series, where fans rehearse lines together and propose new characters representing Haitian Creole and Inuktitut communities.',
          'The project illustrates how community media can create low-pressure immersion opportunities without the cost of formal classes. Teachers have already begun assigning episodes as homework, citing how the authentic pace of speech helps students get comfortable with natural code-switching. Funding from a local arts council will keep the series on air through the winter while the production team trains other neighborhoods to replicate the concept.'
        ),
      },
      {
        id: 'en-culture-4',
        title: 'Museum launches augmented reality language tours',
        summary:
          'Visitors wear smart glasses that overlay bilingual captions and pronunciation tips while they explore a rotating exhibit on migration stories.',
        url: 'https://www.example.com/en/culture/museum-ar-language-tours',
        source: 'Heritage Weekly',
        topic: 'culture',
        language: 'en',
        content: article(
          'A waterfront museum in Rotterdam has debuted an augmented reality tour that blends migration history with live language coaching. Visitors borrow lightweight glasses that project bilingual captions, phonetic hints, and cultural trivia as they move from gallery to gallery. The current exhibition features oral histories from newcomers who describe their first impressions of Dutch markets, paperwork, and seaside weather.',
          'The AR interface adapts in real time: pause near a vintage suitcase, and the overlay prompts key vocabulary related to travel logistics; linger at an archival photo, and the system offers idioms that express homesickness or resilience. Curators partnered with language teachers to script bite-size grammar notes and conversation starters families can practice while waiting in line. Feedback panels positioned throughout the exhibit capture new phrases guests plan to reuse at home.',
          'Attendance has doubled since the launch, with many learners scheduling repeat visits to tackle higher difficulty settings that unlock region-specific dialects. The museum is packaging the platform as an open toolkit so smaller cultural centers can host similar bilingual tours. Educators hope the combination of visual storytelling and interactive language guidance will inspire more institutions to treat linguistic inclusion as a core part of visitor engagement.'
        ),
      },
      {
        id: 'en-culture-5',
        title: 'Indie game jam celebrates bilingual storytelling mechanics',
        summary:
          'Developers from Seoul and São Paulo prototyped games where players switch languages to unlock clues and character backstories.',
        url: 'https://www.example.com/en/culture/bilingual-game-jam',
        source: 'PlayLab',
        topic: 'culture',
        language: 'en',
        content: article(
          'An indie game jam spanning Seoul and São Paulo challenged developers to weave bilingual mechanics directly into gameplay. Over a marathon weekend, small teams built prototypes where puzzles only unlock when players alternate between Portuguese, Korean, and English dialogue options. One standout entry cast gamers as translators decoding radio transmissions, rewarding correct context guesses with character backstories and new vocabulary flashcards.',
          'Mentors from the localization industry hosted lightning talks on balancing readability with cultural nuance, encouraging participants to think beyond direct translation. Sound designers layered ambient recordings from both cities, blending subway announcements with street market chatter to reinforce the sense of navigating multiple linguistic worlds. Streamers broadcasting the event hosted live polls where viewers suggested slang terms to include in branching narratives.',
          'Organizers plan to package the top prototypes as open-source learning tools, accompanied by teacher guides and worksheets. They hope the jam inspires studios to treat language switching as a core design choice rather than a subtitle toggle. The next edition will invite teams from Nairobi and Montreal, expanding the experiment into a rotating global residency for multilingual game design.'
        ),
      },
      {
        id: 'en-culture-6',
        title: 'Street art collective releases multilingual audio guides',
        summary:
          'A collective in Berlin mapped murals with QR codes that trigger narrative snippets recorded by local learners.',
        url: 'https://www.example.com/en/culture/street-art-audio-guides',
        source: 'Urban Canvas',
        topic: 'culture',
        language: 'en',
        content: article(
          'Berlin’s street art collective Farbwechsel has unveiled a city-wide audio trail that transforms murals into mini language labs. Contributors affixed discrete QR codes to 30 large-format pieces across Kreuzberg and Neukölln, each linking to short narratives recorded in German, Turkish, and English. The stories mix artist interviews, neighborhood history, and vocabulary callouts designed by local adult learners.',
          'Participants rehearse their scripts in community centers before stepping outside with portable recorders, capturing ambient noise so listeners feel embedded in each location. The project website displays transcripts with highlighted idioms and rough translations, while a mobile app lets users slow playback or loop tricky sentences. Residents can also submit their own interpretations, expanding the archive with dialects such as Arabic, Polish, and Spanish.',
          'Tour guides report that even seasoned Berliners are revisiting alleyways to experience the new content, often pausing as a group to analyze metaphors or regional slang. Teachers have started assigning the walk as a scavenger hunt, pushing students to compare how graffiti vocabulary travels between languages. The collective hopes other cities will adopt the model and has published an open kit covering consent guidelines, signage templates, and audio post-production tips.'
        ),
      },
      {
        id: 'en-culture-7',
        title: 'Local library rotates manga translation workshops',
        summary:
          'Translators host monthly sessions breaking down visual storytelling cues and idioms found in contemporary manga.',
        url: 'https://www.example.com/en/culture/library-manga-workshops',
        source: 'Reader Connect',
        topic: 'culture',
        language: 'en',
        content: article(
          'A suburban library outside Vancouver has discovered that manga can become a gateway to serious translation practice. Volunteer translators now host monthly workshops where participants dissect panels from contemporary series, comparing official English releases with fan-made versions. Facilitators focus on how facial expressions, panel pacing, and onomatopoeia shift the tone of a scene, prompting learners to justify their wording choices out loud.',
          'The sessions include mini-lectures on cultural references—everything from regional snack brands to pop idols—so readers appreciate why certain jokes land differently abroad. Attendees split into small groups to produce revised drafts, then reconvene to present the linguistic compromises they negotiated. The library records the discussions and publishes anonymized commentary alongside vocabulary lists, turning each workshop into a reusable study kit.',
          'Interest has grown so quickly that organizers now rotate themes, covering sports manga one month and slice-of-life dramas the next to keep the content fresh. Teachers of Japanese immersion programs have begun sending students to earn elective credit, noting how the collaborative environment encourages risk-taking with colloquial speech. The library’s leadership is exploring partnerships with publishers to secure early preview chapters and further enrich the curriculum.'
        ),
      },
      {
        id: 'en-culture-8',
        title: 'Cultural institute streams cross-border cooking classes',
        summary:
          'Chefs in Rabat and Marseille cook dishes side-by-side while teaching vocabulary for ingredients, utensils, and family traditions.',
        url: 'https://www.example.com/en/culture/cross-border-cooking-stream',
        source: 'Culinary Bridges',
        topic: 'culture',
        language: 'en',
        content: article(
          'The Andalusian Cultural Institute has launched a livestream series that brings together chefs in Rabat and Marseille for synchronized cooking classes. Each episode features families preparing cherished recipes—think bissara soup alongside bouillabaisse—while narrating ingredient names and kitchen verbs in Arabic and French. Hosts pause regularly to zoom in on spices, utensils, and idiomatic expressions that describe simmering, marinating, or serving guests.',
          'Viewers receive downloadable ingredient cards with phonetic spellings, plus substitution tips for sourcing items in different regions. A chat moderator fields vocabulary questions and invites audience members to share their own culinary stories, creating a dynamic glossary in real time. Between courses, the chefs swap anecdotes about holidays, markets, and grandmotherly advice, showing how food rituals encode values across generations.',
          'The institute plans to archive each class with closed captions in three languages, turning the sessions into reusable learning modules for schools and community groups. Participants report that hearing culinary terms in context makes them stick, especially when paired with sensory cues from sizzling pans or mortar-and-pestle rhythms. Future episodes will expand to include guest appearances from Tunis, Lisbon, and Dakar, broadening the shared pantry of words and memories.'
        ),
      },
      {
        id: 'en-culture-9',
        title: 'Urban dance troupe shares glossary for choreography terms',
        summary:
          'Dancers compiled bilingual shorthand for movements so international crews can rehearse over video calls.',
        url: 'https://www.example.com/en/culture/dance-troupe-glossary',
        source: 'Movement Beat',
        topic: 'culture',
        language: 'en',
        content: article(
          'An urban dance troupe known for viral rooftop performances has published a bilingual glossary to help crews rehearse across continents. The collective, splitting time between Manila and Los Angeles, catalogued more than 200 movement cues spanning popping, waacking, and contemporary fusion. Each entry includes a short definition in English and Filipino, audio clips that model pronunciation, and video snippets demonstrating how the term plays out in choreography.',
          'Company co-founders explain that online rehearsals often stall when dancers interpret shorthand differently, so they spent months documenting the vocabulary they shout mid-routine. They invited collaborators in Seoul, Paris, and Lima to annotate the list with regional slang, adding context about how history and community influence naming conventions. The glossary lives on a free website with filters by style, tempo, and difficulty, complemented by a forum where users can request new terms.',
          'Dance educators say the resource makes it easier to onboard beginners while preserving the genre’s rich oral tradition. The troupe plans to release quarterly updates that profile specific moves and trace their lineage through interviews with veteran dancers. Workshops built around the glossary now double as language practice sessions, proving that mastering a pirouette or dime-stop can also sharpen listening skills.'
        ),
      },
      {
        id: 'en-culture-10',
        title: 'Festival of lights hosts interactive vocabulary treasure hunt',
        summary:
          'Families scan illuminated installations to reveal riddles that must be solved in two languages to unlock the next clue.',
        url: 'https://www.example.com/en/culture/festival-lights-vocabulary-hunt',
        source: 'Nightlife Gazette',
        topic: 'culture',
        language: 'en',
        content: article(
          'A riverside festival of lights in Lyon has turned its glowing sculptures into stations for an interactive vocabulary treasure hunt. Visitors use their phones to scan QR markers hidden within the installations, triggering riddles that must be solved in both French and English to advance. Families huddle together, comparing hints, testing pronunciations, and listening to short audio clues recorded by local schoolchildren.',
          'Each puzzle blends wordplay with cultural references—from culinary idioms about cheeses and pastries to expressions drawn from the city’s silk-weaving past. When players submit a correct answer, the installation bursts into a new pattern of lights that highlights the featured words, offering instant visual reinforcement. Volunteers circulate with handheld projectors to display mini grammar lessons for anyone who wants a deeper explanation on the spot.',
          'Festival organizers created the bilingual experience after surveys showed attendees wanted more opportunities to interact beyond passive viewing. The treasure hunt now anchors the event’s educational program, and teachers are booking field trips to let students test their skills in an immersive setting. Plans are already underway to add Italian and German tracks next year, ensuring the luminous maze keeps challenging multilingual adventurers.'
        ),
      },
    ],
    technology: [
      {
        id: 'en-tech-1',
        title: 'AI subtitling tool boosts comprehension for language students',
        summary:
          'A startup released an offline-first subtitle enhancer that lets learners slow audio, highlight vocabulary, and export phrases straight into SRS decks.',
        url: 'https://www.example.com/en/technology/ai-subtitling-tool',
        source: 'Tech Lingua',
        topic: 'technology',
        language: 'en',
        content: article(
          'An edtech startup based in Dublin has unveiled a subtitling companion that transforms streaming videos into personalized study sessions. The offline-first app overlays transcripts in multiple languages, offering sliders to adjust speech speed without distorting voices. Learners can tap any word or phrase to see contextual definitions, pitch accents, and usage notes crowd-sourced from teachers.',
          'A standout feature exports selected phrases directly into spaced-repetition decks, tagging each card with timestamps so users can revisit the exact scene later. To respect privacy, the tool processes video locally on the device and stores notes in encrypted folders that sync only when users opt in. Pilot tests in university language labs showed a 20 percent increase in listening comprehension scores after four weeks of regular use.',
          'The company plans to open-source its language models and publish accessibility guidelines so other developers can tailor the interface to low-vision or deaf learners. Educators praise the way the app encourages students to annotate media they already enjoy, bridging entertainment and study time. A roadmap for 2026 includes collaborative classrooms where teachers can push vocabulary packs to entire cohorts with a single click.'
        ),
      },
      {
        id: 'en-tech-2',
        title: 'Universities adopt open corpora to teach domain-specific jargon',
        summary:
          'European universities are sharing annotated corpora covering business, health, and climate topics to help learners access specialist language earlier.',
        url: 'https://www.example.com/en/technology/open-corpora-program',
        source: 'Academic Wire',
        topic: 'technology',
        language: 'en',
        content: article(
          'A network of European universities has pooled resources to publish annotated corpora focused on business, healthcare, and climate science. The datasets combine journal excerpts, policy briefs, and interview transcripts, each tagged with grammatical patterns and industry-specific terminology. Educators can slice the corpus by proficiency level, generating reading packs that gradually introduce learners to acronyms, formulas, and meeting protocols.',
          'Pilot classrooms report that students feel less intimidated when encountering specialist vocabulary in internships or exchange programs. The project’s open license encourages companies and public institutions to contribute fresh material, ensuring lessons stay aligned with evolving jargon. Organizers are now recruiting mentors to host live coding sessions where learners explore the corpora with simple queries and build their own glossaries.'
        ),
      },
      {
        id: 'en-tech-3',
        title: 'Wearable translator adds spatial audio cues for vocabulary recall',
        summary:
          'A hardware startup built bone-conduction earbuds that whisper context-aware hints when learners pause during conversations.',
        url: 'https://www.example.com/en/technology/wearable-spatial-audio',
        source: 'Gadget Grid',
        topic: 'technology',
        language: 'en',
        content: articleFromSummary({
          language: 'en',
          topic: 'technology',
          title: 'Wearable translator adds spatial audio cues for vocabulary recall',
          summary:
            'A hardware startup built bone-conduction earbuds that whisper context-aware hints when learners pause during conversations.',
          detail: 'Beta testers praised the discreet prompts during networking events, saying the device nudged them toward natural phrasing without derailing the dialogue.',
        }),
      },
      {
        id: 'en-tech-4',
        title: 'Open-source plugin enforces bilingual commit messages',
        summary:
          'Global dev teams adopted a Git hook that suggests terminology matches across English and Japanese repositories.',
        url: 'https://www.example.com/en/technology/bilingual-commit-plugin',
        source: 'Code Relay',
        topic: 'technology',
        language: 'en',
        content: article(
          'Distributed developer teams swapping between English and Japanese repositories have embraced a new open-source Git hook. The plugin analyzes commit messages and flags jargon that lacks a counterpart in the target language, proposing translations drawn from shared glossaries. Engineers can accept, tweak, or reject suggestions directly in their terminal before the commit lands.',
          'Maintainers say the tool has reduced misunderstandings during code reviews and made onboarding smoother for new hires. The project’s documentation includes tips for building parallel glossaries in other language pairs, and contributors are already experimenting with Spanish-German and Korean-French variants. Companies report that bilingual commit history doubles as a knowledge base for support staff who trace bugs across regions.'
        ),
      },
      {
        id: 'en-tech-5',
        title: 'AR dictionary overlays live transcripts onto transit signage',
        summary:
          'Commuters in Singapore test an app that projects translations on bus stops while highlighting related grammar patterns.',
        url: 'https://www.example.com/en/technology/ar-transit-dictionary',
        source: 'City Tech',
        topic: 'technology',
        language: 'en',
        content: articleFromSummary({
          language: 'en',
          topic: 'technology',
          title: 'AR dictionary overlays live transcripts onto transit signage',
          summary:
            'Commuters in Singapore test an app that projects translations on bus stops while highlighting related grammar patterns.',
          detail: 'Transit authorities embedded commuter feedback buttons in the pilot stations, and early surveys show riders revisiting the same stop just to practice new sentence structures.',
        }),
      },
      {
        id: 'en-tech-6',
        title: 'Browser extension gamifies reading with adaptive micro-quizzes',
        summary:
          'Learners earn points by answering context questions that pop up after tricky paragraphs on news sites.',
        url: 'https://www.example.com/en/technology/browser-micro-quizzes',
        source: 'Productivity Pulse',
        topic: 'technology',
        language: 'en',
        content: articleFromSummary({
          language: 'en',
          topic: 'technology',
          title: 'Browser extension gamifies reading with adaptive micro-quizzes',
          summary:
            'Learners earn points by answering context questions that pop up after tricky paragraphs on news sites.',
          detail: 'The extension now syncs with classroom leaderboards, letting teachers spotlight articles that inspired the most discussion and clarifying which question types still cause confusion.',
        }),
      },
      {
        id: 'en-tech-7',
        title: 'Synthetic voice pack tuned for slow-paced listening practice',
        summary:
          'Researchers released open voices that emphasize intonation patterns for intermediate learners.',
        url: 'https://www.example.com/en/technology/synthetic-voice-pack',
        source: 'Voice Frontier',
        topic: 'technology',
        language: 'en',
        content: articleFromSummary({
          language: 'en',
          topic: 'technology',
          title: 'Synthetic voice pack tuned for slow-paced listening practice',
          summary:
            'Researchers released open voices that emphasize intonation patterns for intermediate learners.',
          detail: 'Audio designers recorded native speakers reading dialogues at multiple tempos so learners can compare natural rhythm with slowed-down delivery inside the same track.',
        }),
      },
      {
        id: 'en-tech-8',
        title: 'Nonprofit curates dataset of accessible tech manuals',
        summary:
          'Community translators converted robotics documentation into simplified bilingual glossaries.',
        url: 'https://www.example.com/en/technology/accessibility-manuals',
        source: 'Inclusive Labs',
        topic: 'technology',
        language: 'en',
        content: articleFromSummary({
          language: 'en',
          topic: 'technology',
          title: 'Nonprofit curates dataset of accessible tech manuals',
          summary:
            'Community translators converted robotics documentation into simplified bilingual glossaries.',
          detail: 'Volunteer engineers annotated diagrams with plain-language captions, and the nonprofit is pairing each manual with short pronunciation guides recorded by apprentices.',
        }),
      },
      {
        id: 'en-tech-9',
        title: 'Hackathon prototypes AI meeting partner for real-time note-taking',
        summary:
          'Students designed a privacy-first agent that summarizes jargon and flags unknown terms for later review.',
        url: 'https://www.example.com/en/technology/ai-meeting-partner',
        source: 'Campus Innovate',
        topic: 'technology',
        language: 'en',
        content: articleFromSummary({
          language: 'en',
          topic: 'technology',
          title: 'Hackathon prototypes AI meeting partner for real-time note-taking',
          summary:
            'Students designed a privacy-first agent that summarizes jargon and flags unknown terms for later review.',
          detail: 'The team is releasing a sandbox dataset so other universities can stress-test the bot, and mentors insisted the code remain open to reassure participants about data handling.',
        }),
      },
      {
        id: 'en-tech-10',
        title: 'Universities compile multilingual cybersecurity playbooks',
        summary:
          'Joint task forces in Canada and Germany publish training modules to teach risk vocabulary for IT teams.',
        url: 'https://www.example.com/en/technology/multilingual-cybersecurity-playbook',
        source: 'Security Sphere',
        topic: 'technology',
        language: 'en',
        content: articleFromSummary({
          language: 'en',
          topic: 'technology',
          title: 'Universities compile multilingual cybersecurity playbooks',
          summary:
            'Joint task forces in Canada and Germany publish training modules to teach risk vocabulary for IT teams.',
          detail: 'Each module includes mock incident reports translated side by side, giving analysts a chance to practice escalations in English, French, and German before they face real alerts.',
        }),
      },
    ],
    business: [
      {
        id: 'en-business-1',
        title: 'Remote companies invest in cross-language onboarding',
        summary:
          'Distributed teams are hiring coaches to help new employees learn workplace idioms and cultural cues within the first quarter.',
        url: 'https://www.example.com/en/business/cross-language-onboarding',
        source: 'Global Work',
        topic: 'business',
        language: 'en',
      },
      {
        id: 'en-business-2',
        title: 'Entrepreneurs launch marketplace for bilingual tutors',
        summary:
          'A cooperative of independent tutors offers lessons focused on negotiation and customer support in two languages.',
        url: 'https://www.example.com/en/business/bilingual-tutor-marketplace',
        source: 'Startup Weekly',
        topic: 'business',
        language: 'en',
      },
      {
        id: 'en-business-3',
        title: 'Global incubator mentors founders to pitch in three languages',
        summary:
          'A cohort of climate startups practiced investor decks in English, Mandarin, and Spanish with professional coaches.',
        url: 'https://www.example.com/en/business/global-incubator-trilingual-pitches',
        source: 'Venture Voice',
        topic: 'business',
        language: 'en',
      },
      {
        id: 'en-business-4',
        title: 'Trade show recruits interpreters for pop-up negotiation labs',
        summary:
          'Exhibitors simulate deals in rotating language pairs so teams can stress-test their sales scripts.',
        url: 'https://www.example.com/en/business/trade-show-negotiation-labs',
        source: 'Market Stage',
        topic: 'business',
        language: 'en',
      },
      {
        id: 'en-business-5',
        title: 'Finance firms roll out bilingual mentorship rotations',
        summary:
          'Analysts shadow peers in São Paulo and Toronto to master compliance terminology in both Portuguese and English.',
        url: 'https://www.example.com/en/business/bilingual-mentorship-rotations',
        source: 'Finance Ledger',
        topic: 'business',
        language: 'en',
      },
      {
        id: 'en-business-6',
        title: 'Customer support alliance shares glossary for regional slang',
        summary:
          'Support leads compiled idioms gathered from help desk transcripts through Latin America.',
        url: 'https://www.example.com/en/business/customer-support-glossary',
        source: 'Service Desk Pro',
        topic: 'business',
        language: 'en',
      },
      {
        id: 'en-business-7',
        title: 'Hospitality chain launches language stipends tied to retention',
        summary:
          'Hotels reimburse classes for concierge staff who demonstrate guest satisfaction gains in a second language.',
        url: 'https://www.example.com/en/business/hospitality-language-stipends',
        source: 'Travel Ledger',
        topic: 'business',
        language: 'en',
      },
      {
        id: 'en-business-8',
        title: 'Export council publishes multilingual supply chain templates',
        summary:
          'SMBs download contract boilerplates annotated with key phrases in English, Arabic, and French.',
        url: 'https://www.example.com/en/business/multilingual-supply-chain-templates',
        source: 'Logistics Today',
        topic: 'business',
        language: 'en',
      },
      {
        id: 'en-business-9',
        title: 'Remote-first companies test asynchronous language buddies',
        summary:
          'Employees pair up across time zones to exchange video notes focused on workplace idioms.',
        url: 'https://www.example.com/en/business/asynchronous-language-buddies',
        source: 'Future Work',
        topic: 'business',
        language: 'en',
      },
      {
        id: 'en-business-10',
        title: 'Retail giants host multilingual product feedback marathons',
        summary:
          'Teams invite customers to annotate packaging prototypes while capturing common expressions in Spanish and English.',
        url: 'https://www.example.com/en/business/multilingual-feedback-marathons',
        source: 'Commerce Insight',
        topic: 'business',
        language: 'en',
      },
    ],
    education: [
      {
        id: 'en-education-1',
        title: 'Schools pilot story-based immersion modules',
        summary:
          'High schools in Canada replaced textbook drills with serialized audio dramas that adapt vocabulary to each class level.',
        url: 'https://www.example.com/en/education/story-immersion-modules',
        source: 'EduLab',
        topic: 'education',
        language: 'en',
      },
      {
        id: 'en-education-2',
        title: 'Teachers swap lessons on sustainable cities across borders',
        summary:
          'Educators from São Paulo and Barcelona co-wrote bilingual lessons about public transport and climate resilience.',
        url: 'https://www.example.com/en/education/cross-border-lessons',
        source: 'Classroom Exchange',
        topic: 'education',
        language: 'en',
      },
      {
        id: 'en-education-3',
        title: 'Community colleges launch micro-credentials in live interpreting',
        summary:
          'Students earn badges after practicing simultaneous interpretation during campus events and webinars.',
        url: 'https://www.example.com/en/education/micro-credential-interpreting',
        source: 'Academic Paths',
        topic: 'education',
        language: 'en',
      },
      {
        id: 'en-education-4',
        title: 'Blended reality field trips link classrooms across continents',
        summary:
          'Schools in Nairobi and Oslo shared VR walks where learners narrated scenes using curated vocabulary decks.',
        url: 'https://www.example.com/en/education/blended-reality-field-trips',
        source: 'Learning Horizons',
        topic: 'education',
        language: 'en',
      },
      {
        id: 'en-education-5',
        title: 'Language labs adopt AI conversation partners for homework help',
        summary:
          'Tutors monitor AI chats and inject targeted prompts so students reflect on grammar choices.',
        url: 'https://www.example.com/en/education/ai-conversation-partners',
        source: 'EdTech Journal',
        topic: 'education',
        language: 'en',
      },
      {
        id: 'en-education-6',
        title: 'After-school clubs digitize oral histories for heritage language practice',
        summary:
          'Teens interview grandparents and transform recordings into bilingual readers with comprehension quizzes.',
        url: 'https://www.example.com/en/education/oral-history-clubs',
        source: 'Community Classroom',
        topic: 'education',
        language: 'en',
      },
      {
        id: 'en-education-7',
        title: 'Scholarship program funds immersion exchange for vocational learners',
        summary:
          'Apprentices in culinary and renewable energy tracks pair with partner schools to master technical jargon abroad.',
        url: 'https://www.example.com/en/education/vocational-immersion-scholarship',
        source: 'Skills Network',
        topic: 'education',
        language: 'en',
      },
      {
        id: 'en-education-8',
        title: 'Libraries pilot bilingual storytime podcasts for families',
        summary:
          'Children record weekly episodes retelling folktales while librarians share comprehension prompts.',
        url: 'https://www.example.com/en/education/bilingual-storytime-podcast',
        source: 'Family Literacy',
        topic: 'education',
        language: 'en',
      },
      {
        id: 'en-education-9',
        title: 'Teacher cooperatives build open dataset of formative prompts',
        summary:
          'Educators mapped can-do statements to scaffolded questions for CLIL lessons across STEM subjects.',
        url: 'https://www.example.com/en/education/formative-prompt-dataset',
        source: 'Pedagogy Hub',
        topic: 'education',
        language: 'en',
      },
      {
        id: 'en-education-10',
        title: 'National exam board integrates intercultural communication modules',
        summary:
          'New assessments evaluate how students negotiate meaning and repair misunderstandings in second-language scenarios.',
        url: 'https://www.example.com/en/education/intercultural-exam-modules',
        source: 'Assessment Review',
        topic: 'education',
        language: 'en',
      },
    ],
    science: [
      {
        id: 'en-science-1',
        title: 'Linguists map how climate news spreads across languages',
        summary:
          'A research group analyzed climate change terminology across thirteen languages to help fact-checkers localize alerts faster.',
        url: 'https://www.example.com/en/science/climate-news-linguistics',
        source: 'Science & Language',
        topic: 'science',
        language: 'en',
      },
      {
        id: 'en-science-2',
        title: 'Neuroscientists study drift in late bilingual pronunciation',
        summary:
          'A new study finds that daily shadowing exercises help adults maintain pronunciation accuracy even after switching work languages.',
        url: 'https://www.example.com/en/science/bilingual-pronunciation-drift',
        source: 'NeuroLingua',
        topic: 'science',
        language: 'en',
      },
      {
        id: 'en-science-3',
        title: 'Speech lab maps tone patterns across emerging dialects',
        summary:
          'Researchers collected tone contour datasets to help learners mimic regional intonation in Mandarin and Yoruba.',
        url: 'https://www.example.com/en/science/tone-pattern-research',
        source: 'Phonetics Review',
        topic: 'science',
        language: 'en',
      },
      {
        id: 'en-science-4',
        title: 'Cognitive scientists test spaced repetition for signed languages',
        summary:
          'A trial measured how learners retain ASL classifiers when practice includes haptic feedback.',
        url: 'https://www.example.com/en/science/spaced-repetition-sign-language',
        source: 'Cognition Lab',
        topic: 'science',
        language: 'en',
      },
      {
        id: 'en-science-5',
        title: 'Data scientists analyze learner podcasts for vocabulary density',
        summary:
          'The open dataset tracks how community shows recycle high-frequency terms and introduces idioms.',
        url: 'https://www.example.com/en/science/podcast-vocabulary-density',
        source: 'DataLingua',
        topic: 'science',
        language: 'en',
      },
      {
        id: 'en-science-6',
        title: 'Ecologists co-design multilingual citizen science prompts',
        summary:
          'Teams crafted birdwatching surveys in three languages to minimize ambiguity for volunteers.',
        url: 'https://www.example.com/en/science/multilingual-citizen-science',
        source: 'Green Science',
        topic: 'science',
        language: 'en',
      },
      {
        id: 'en-science-7',
        title: 'AI researchers model accent adaptation for text-to-speech systems',
        summary:
          'New models let learners blend their native phonology with target language prosody for more natural feedback.',
        url: 'https://www.example.com/en/science/accent-adaptation-tts',
        source: 'AI Speech Digest',
        topic: 'science',
        language: 'en',
      },
      {
        id: 'en-science-8',
        title: 'Medical linguists compile rapid-response telehealth lexicon',
        summary:
          'Clinics share multilingual scripts covering triage, consent, and follow-up instructions.',
        url: 'https://www.example.com/en/science/telehealth-lexicon',
        source: 'Health Language',
        topic: 'science',
        language: 'en',
      },
      {
        id: 'en-science-9',
        title: 'Psycholinguists study storytelling scaffolds in immersive VR lessons',
        summary:
          'Participants who rephrased plot summaries in VR retained figurative language at higher rates.',
        url: 'https://www.example.com/en/science/vr-storytelling-scaffolds',
        source: 'Mind & Language',
        topic: 'science',
        language: 'en',
      },
      {
        id: 'en-science-10',
        title: 'Space agency trains crew with cross-language mission rehearsals',
        summary:
          'Astronauts simulate emergency checklists alternating between Russian and English to reduce handover friction.',
        url: 'https://www.example.com/en/science/cross-language-mission-rehearsal',
        source: 'Orbital Research',
        topic: 'science',
        language: 'en',
      },
    ],
  },
  es: {
    culture: [
      {
        id: 'es-culture-1',
        title: 'Festival de cine ofrece coloquios en el idioma del público',
        summary:
          'El festival de San Sebastián habilitó sesiones bilingües donde los asistentes comentan cortometrajes en su idioma de aprendizaje.',
        url: 'https://www.example.com/es/cultura/festival-cine-bilingue',
        source: 'Cultura Viva',
        topic: 'culture',
        language: 'es',
      },
      {
        id: 'es-culture-2',
        title: 'Club de lectura en línea mezcla autores latinoamericanos y asiáticos',
        summary:
          'Estudiantes de Madrid y Ciudad de México leen cuentos breves en su idioma meta y comparten audio-notas para practicar entonación.',
        url: 'https://www.example.com/es/cultura/club-lectura-multilingue',
        source: 'Lectores Hoy',
        topic: 'culture',
        language: 'es',
      },
      {
        id: 'es-culture-3',
        title: 'Radio comunitaria estrena radionovela para intercambio lingüístico',
        summary:
          'Un colectivo en Medellín produce episodios cortos en dos idiomas para practicar modismos y pronunciación en vivo.',
        url: 'https://www.example.com/es/cultura/radio-comunitaria-radionovela',
        source: 'Voces Urbanas',
        topic: 'culture',
        language: 'es',
      },
      {
        id: 'es-culture-4',
        title: 'Museo lanza visitas de realidad aumentada con subtítulos bilingües',
        summary:
          'Los visitantes activan paneles interactivos que muestran contextos históricos y expresiones clave en el idioma meta.',
        url: 'https://www.example.com/es/cultura/museo-realidad-aumentada',
        source: 'Patrimonio Hoy',
        topic: 'culture',
        language: 'es',
      },
      {
        id: 'es-culture-5',
        title: 'Jam de videojuegos impulsa narrativas interculturales',
        summary:
          'Equipos de Buenos Aires y Tokio diseñaron juegos donde avanzar requiere alternar entre vocabularios.',
        url: 'https://www.example.com/es/cultura/jam-videojuegos-bilingue',
        source: 'Pixel Colectivo',
        topic: 'culture',
        language: 'es',
      },
      {
        id: 'es-culture-6',
        title: 'Colectivo de muralistas publica audioguías multilingües',
        summary:
          'Un mapa de murales en Valparaíso integra códigos QR con relatos grabados por estudiantes de idiomas.',
        url: 'https://www.example.com/es/cultura/murales-audioguias',
        source: 'Arte Vivo',
        topic: 'culture',
        language: 'es',
      },
      {
        id: 'es-culture-7',
        title: 'Biblioteca organiza talleres de traducción de cómics contemporáneos',
        summary:
          'Editoras independientes comparten técnicas para adaptar humor visual y expresiones coloquiales.',
        url: 'https://www.example.com/es/cultura/taller-traduccion-comics',
        source: 'Lectores Globales',
        topic: 'culture',
        language: 'es',
      },
      {
        id: 'es-culture-8',
        title: 'Instituto cultural transmite clases de cocina conectando ciudades hermanas',
        summary:
          'Chef de Puebla y Lyon enseñan recetas familiares mientras comparan vocabulario gastronómico.',
        url: 'https://www.example.com/es/cultura/clases-cocina-ciudades-hermanas',
        source: 'Sabores del Mundo',
        topic: 'culture',
        language: 'es',
      },
      {
        id: 'es-culture-9',
        title: 'Compañía de danza urbana comparte glosario colaborativo',
        summary:
          'Bailarines documentan indicaciones escénicas en español e inglés para ensayar a distancia.',
        url: 'https://www.example.com/es/cultura/danza-glosario-colaborativo',
        source: 'Movimiento Libre',
        topic: 'culture',
        language: 'es',
      },
      {
        id: 'es-culture-10',
        title: 'Festival de luces propone gincana de vocabulario interactiva',
        summary:
          'Familias resuelven pistas bilingües proyectadas en fachadas históricas para desbloquear escenas secretas.',
        url: 'https://www.example.com/es/cultura/festival-luces-gincana',
        source: 'Noches Culturales',
        topic: 'culture',
        language: 'es',
      },
    ],
    technology: [
      {
        id: 'es-tech-1',
        title: 'Aplicación móvil enseña jerga tecnológica con mini retos diarios',
        summary:
          'La app LabLingo lanza desafíos de traducción de commits y documentación para desarrolladores en español.',
        url: 'https://www.example.com/es/tecnologia/app-jerga-tecnologica',
        source: 'TecnoAprende',
        topic: 'technology',
        language: 'es',
      },
      {
        id: 'es-tech-2',
        title: 'Universidades crean repositorio libre de guías de estilo multilingües',
        summary:
          'Facultades de ingeniería publican glosarios comparados para que estudiantes comprendan manuales técnicos en varios idiomas.',
        url: 'https://www.example.com/es/tecnologia/repositorio-estilo',
        source: 'Campus Global',
        topic: 'technology',
        language: 'es',
      },
      {
        id: 'es-tech-3',
        title: 'Auriculares traductores añaden pistas espaciales para recordar vocabulario',
        summary:
          'Una startup diseña dispositivos que detectan pausas en la conversación y sugieren expresiones con volumen adaptativo.',
        url: 'https://www.example.com/es/tecnologia/auriculares-traductores-pistas',
        source: 'Innovación Portátil',
        topic: 'technology',
        language: 'es',
      },
      {
        id: 'es-tech-4',
        title: 'Plugin open source exige mensajes de commit bilingües',
        summary:
          'Equipos distribuidos sincronizan términos clave entre repositorios en español e inglés para evitar ambigüedades.',
        url: 'https://www.example.com/es/tecnologia/plugin-commit-bilingue',
        source: 'Código Abierto',
        topic: 'technology',
        language: 'es',
      },
      {
        id: 'es-tech-5',
        title: 'Aplicación de realidad aumentada traduce señalización de transporte',
        summary:
          'Pasajeros en Ciudad de México prueban un visor que resalta verbos y tiempos verbales presentes en anuncios públicos.',
        url: 'https://www.example.com/es/tecnologia/realidad-aumentada-transporte',
        source: 'Movilidad Inteligente',
        topic: 'technology',
        language: 'es',
      },
      {
        id: 'es-tech-6',
        title: 'Extensión de navegador propone micro-cuestionarios según el contexto',
        summary:
          'Lectores de noticias responden preguntas de opción múltiple cada vez que aparece una expresión idiomática.',
        url: 'https://www.example.com/es/tecnologia/extension-cuestionarios-contexto',
        source: 'Productividad Digital',
        topic: 'technology',
        language: 'es',
      },
      {
        id: 'es-tech-7',
        title: 'Paquete de voces sintéticas se ajusta a ritmos de aprendizaje',
        summary:
          'Investigadores liberan voces que enfatizan entonación y pausas para quienes estudian a velocidad lenta.',
        url: 'https://www.example.com/es/tecnologia/voces-sinteticas-aprendizaje',
        source: 'Laboratorio Vocal',
        topic: 'technology',
        language: 'es',
      },
      {
        id: 'es-tech-8',
        title: 'Organización sin fines de lucro recopila manuales técnicos accesibles',
        summary:
          'Voluntarios generan glosarios paralelos de robótica y energías limpias con ejemplos prácticos.',
        url: 'https://www.example.com/es/tecnologia/manuales-tecnicos-accesibles',
        source: 'Tecnología Inclusiva',
        topic: 'technology',
        language: 'es',
      },
      {
        id: 'es-tech-9',
        title: 'Hackatón desarrolla asistente de reuniones con resúmenes terminológicos',
        summary:
          'Estudiantes implementan un agente que etiqueta jerga especializada y la envía a la app de estudio del equipo.',
        url: 'https://www.example.com/es/tecnologia/asistente-reuniones-terminologia',
        source: 'Campus Tech',
        topic: 'technology',
        language: 'es',
      },
      {
        id: 'es-tech-10',
        title: 'Universidades crean manuales de ciberseguridad en varios idiomas',
        summary:
          'Docentes de Madrid y Bogotá diseñan simulaciones de incidentes con vocabulario clave para equipos de TI.',
        url: 'https://www.example.com/es/tecnologia/manuales-ciberseguridad-multilingues',
        source: 'Seguridad 360',
        topic: 'technology',
        language: 'es',
      },
    ],
    business: [
      {
        id: 'es-business-1',
        title: 'Cooperativas regionales ofrecen mentorías bilingües para exportadores',
        summary:
          'Pequeñas empresas latinoamericanas reciben clases de inglés comercial para negociar con distribuidores europeos.',
        url: 'https://www.example.com/es/negocios/mentorias-bilingues',
        source: 'Mercado Abierto',
        topic: 'business',
        language: 'es',
      },
      {
        id: 'es-business-2',
        title: 'Podcast empresarial analiza expresiones idiomáticas en ventas',
        summary:
          'Consultoras de Buenos Aires explican frases hechas y ofrecen ejemplos de pitch en español e inglés.',
        url: 'https://www.example.com/es/negocios/podcast-expresiones',
        source: 'Negocios Hoy',
        topic: 'business',
        language: 'es',
      },
      {
        id: 'es-business-3',
        title: 'Aceleradora global entrena a emprendedores para pitch trilingüe',
        summary:
          'Startups de energía limpia ensayan presentaciones en inglés, mandarín y español con asesoría especializada.',
        url: 'https://www.example.com/es/negocios/aceleradora-pitch-trilingue',
        source: 'Capital Emprendedor',
        topic: 'business',
        language: 'es',
      },
      {
        id: 'es-business-4',
        title: 'Feria comercial organiza laboratorios de negociación con intérpretes',
        summary:
          'Expositores replican contratos ficticios en distintos idiomas para mejorar la comunicación con proveedores.',
        url: 'https://www.example.com/es/negocios/laboratorios-negociacion',
        source: 'Mercados Unidos',
        topic: 'business',
        language: 'es',
      },
      {
        id: 'es-business-5',
        title: 'Firmas financieras lanzan mentorías bilingües entre sucursales',
        summary:
          'Analistas de Lima y Toronto intercambian terminología regulatoria y simulaciones de reportes.',
        url: 'https://www.example.com/es/negocios/mentorias-financieras-bilingues',
        source: 'Finanzas Globales',
        topic: 'business',
        language: 'es',
      },
      {
        id: 'es-business-6',
        title: 'Alianza de soporte al cliente comparte glosario de modismos regionales',
        summary:
          'Empresas de e-commerce recolectan frases frecuentes de tickets para capacitar agentes remotos.',
        url: 'https://www.example.com/es/negocios/glosario-modismos-soporte',
        source: 'Atención Total',
        topic: 'business',
        language: 'es',
      },
      {
        id: 'es-business-7',
        title: 'Cadenas hoteleras vinculan estipendios de idioma con retención laboral',
        summary:
          'Gerentes demuestran mayor satisfacción de huéspedes tras ofrecer coaching de vocabulario especializado.',
        url: 'https://www.example.com/es/negocios/hoteles-estipendios-idiomas',
        source: 'Turismo Profesional',
        topic: 'business',
        language: 'es',
      },
      {
        id: 'es-business-8',
        title: 'Consejo exportador publica plantillas de cadena de suministro multilingües',
        summary:
          'Pequeñas empresas descargan contratos con notas sobre cláusulas clave en árabe, francés e inglés.',
        url: 'https://www.example.com/es/negocios/plantillas-cadena-suministro',
        source: 'Logística Hoy',
        topic: 'business',
        language: 'es',
      },
      {
        id: 'es-business-9',
        title: 'Compañías remotas prueban parejas lingüísticas asincrónicas',
        summary:
          'Colaboradores se envían videomensajes semanales centrados en expresiones corporativas difíciles.',
        url: 'https://www.example.com/es/negocios/parejas-linguisticas-asincronas',
        source: 'Trabajo Futuro',
        topic: 'business',
        language: 'es',
      },
      {
        id: 'es-business-10',
        title: 'Minoristas organizan maratones de retroalimentación multilingüe de productos',
        summary:
          'Clientes editan etiquetas piloto mientras graban comentarios en inglés y español para equipos de diseño.',
        url: 'https://www.example.com/es/negocios/maratones-retroalimentacion',
        source: 'Retail Insight',
        topic: 'business',
        language: 'es',
      },
    ],
    education: [
      {
        id: 'es-education-1',
        title: 'Programa de intercambio conecta aulas rurales con ciudades',
        summary:
          'Docentes de Cusco y Barcelona diseñan actividades en español y catalán para comparar la vida rural y urbana.',
        url: 'https://www.example.com/es/educacion/intercambio-rural',
        source: 'Aula Viva',
        topic: 'education',
        language: 'es',
      },
      {
        id: 'es-education-2',
        title: 'Curso en línea guía estudiantes por museos virtuales',
        summary:
          'El programa “Museos sin frontera” ofrece tours narrados en tiempo real con foco en vocabulario de arte.',
        url: 'https://www.example.com/es/educacion/museos-virtuales',
        source: 'Aprender Arte',
        topic: 'education',
        language: 'es',
      },
      {
        id: 'es-education-3',
        title: 'Colegios comunitarios crean microcredenciales en interpretación en vivo',
        summary:
          'Estudiantes obtienen certificaciones tras traducir charlas y seminarios transmitidos por streaming.',
        url: 'https://www.example.com/es/educacion/microcredenciales-interpretacion',
        source: 'Ruta Académica',
        topic: 'education',
        language: 'es',
      },
      {
        id: 'es-education-4',
        title: 'Excursiones híbridas conectan aulas en Nairobi y Bilbao',
        summary:
          'Alumnado narra experiencias en realidad virtual y crea glosarios compartidos para describir paisajes urbanos.',
        url: 'https://www.example.com/es/educacion/excursiones-hibridas',
        source: 'Horizonte Escolar',
        topic: 'education',
        language: 'es',
      },
      {
        id: 'es-education-5',
        title: 'Laboratorios de idiomas adoptan acompañantes conversacionales con IA',
        summary:
          'Docentes revisan chats y dejan notas metalingüísticas para reforzar estructuras complejas.',
        url: 'https://www.example.com/es/educacion/companion-ia-conversacion',
        source: 'Aula Digital',
        topic: 'education',
        language: 'es',
      },
      {
        id: 'es-education-6',
        title: 'Clubes vespertinos digitalizan historias orales familiares',
        summary:
          'Adolescentes convierten relatos de abuelos en lecturas bilingües con preguntas de comprensión.',
        url: 'https://www.example.com/es/educacion/historias-orales-digitales',
        source: 'Comunidad Educadora',
        topic: 'education',
        language: 'es',
      },
      {
        id: 'es-education-7',
        title: 'Programa de becas financia inmersión técnica en oficios',
        summary:
          'Aprendices de gastronomía y energía solar realizan rotaciones cortas en países socios.',
        url: 'https://www.example.com/es/educacion/becas-inmersion-oficios',
        source: 'Red de Talentos',
        topic: 'education',
        language: 'es',
      },
      {
        id: 'es-education-8',
        title: 'Bibliotecas lanzan pódcast de cuentos bilingües para familias',
        summary:
          'Niños narran fábulas mientras bibliotecarias añaden retos de vocabulario y pronunciación.',
        url: 'https://www.example.com/es/educacion/podcast-cuentos-bilingues',
        source: 'Lectura Familiar',
        topic: 'education',
        language: 'es',
      },
      {
        id: 'es-education-9',
        title: 'Cooperativa docente construye banco abierto de preguntas formativas',
        summary:
          'Profesores relacionan objetivos comunicativos con situaciones auténticas en ciencias y humanidades.',
        url: 'https://www.example.com/es/educacion/banco-preguntas-formativas',
        source: 'Pedagogía Colectiva',
        topic: 'education',
        language: 'es',
      },
      {
        id: 'es-education-10',
        title: 'Organismo evaluador incorpora módulos de comunicación intercultural',
        summary:
          'Nuevas pruebas miden cómo los estudiantes reparan malentendidos y construyen significado en otra lengua.',
        url: 'https://www.example.com/es/educacion/modulos-comunicacion-intercultural',
        source: 'Evaluación Integral',
        topic: 'education',
        language: 'es',
      },
    ],
    science: [
      {
        id: 'es-science-1',
        title: 'Investigadores analizan cómo se comunica la ciencia climática en español',
        summary:
          'El proyecto TermoClima detecta lagunas terminológicas en noticias ambientales y propone equivalentes claros.',
        url: 'https://www.example.com/es/ciencia/comunicacion-climatica',
        source: 'Ciencia Pública',
        topic: 'science',
        language: 'es',
      },
      {
        id: 'es-science-2',
        title: 'Neuropsicólogos estudian la memoria al alternar idiomas',
        summary:
          'Un equipo de Valencia descubre que repasar vocabulario antes de dormir mejora la consolidación en bilingües tardíos.',
        url: 'https://www.example.com/es/ciencia/memoria-bilingue',
        source: 'Neuro Aprendizaje',
        topic: 'science',
        language: 'es',
      },
      {
        id: 'es-science-3',
        title: 'Laboratorio fonético mapea patrones tonales en dialectos emergentes',
        summary:
          'Investigadores recopilan curvas melódicas para ayudar a estudiantes a imitar entonaciones regionales.',
        url: 'https://www.example.com/es/ciencia/patrones-tonales-dialectos',
        source: 'Fonética Aplicada',
        topic: 'science',
        language: 'es',
      },
      {
        id: 'es-science-4',
        title: 'Científicos cognitivos prueban repetición espaciada en lengua de señas',
        summary:
          'Un estudio analiza la retención de clasificadores cuando se combinan prácticas hápticas y visuales.',
        url: 'https://www.example.com/es/ciencia/repeticion-espaciada-senas',
        source: 'Cognición y Lenguaje',
        topic: 'science',
        language: 'es',
      },
      {
        id: 'es-science-5',
        title: 'Analistas de datos estudian pódcasts estudiantiles para medir densidad léxica',
        summary:
          'La base abierta rastrea cómo los programas comunitarios introducen modismos a lo largo de la temporada.',
        url: 'https://www.example.com/es/ciencia/podcasts-densidad-lexica',
        source: 'Datos Lingüísticos',
        topic: 'science',
        language: 'es',
      },
      {
        id: 'es-science-6',
        title: 'Ecologistas diseñan cuestionarios de ciencia ciudadana multilingües',
        summary:
          'Las guías reducen ambigüedades para voluntarios que registran aves migratorias en rutas compartidas.',
        url: 'https://www.example.com/es/ciencia/ciencia-ciudadana-multilingue',
        source: 'Planeta Vivo',
        topic: 'science',
        language: 'es',
      },
      {
        id: 'es-science-7',
        title: 'Equipo de IA modela adaptación de acento en sistemas de síntesis',
        summary:
          'Los modelos permiten ajustar rasgos prosódicos sin perder claridad para oyentes principiantes.',
        url: 'https://www.example.com/es/ciencia/adaptacion-acento-tts',
        source: 'IA y Voz',
        topic: 'science',
        language: 'es',
      },
      {
        id: 'es-science-8',
        title: 'Lingüistas médicos compilan léxico para telemedicina',
        summary:
          'Centros de salud publican scripts de triage, consentimiento y seguimiento en varios dialectos.',
        url: 'https://www.example.com/es/ciencia/lexico-telemedicina',
        source: 'Salud Lingüística',
        topic: 'science',
        language: 'es',
      },
      {
        id: 'es-science-9',
        title: 'Psicolingüistas exploran andamiajes narrativos en aulas de realidad virtual',
        summary:
          'Participantes que reformulan tramas muestran mayor retención de lenguaje figurado.',
        url: 'https://www.example.com/es/ciencia/andamiaje-narrativo-vr',
        source: 'Mente y Idioma',
        topic: 'science',
        language: 'es',
      },
      {
        id: 'es-science-10',
        title: 'Agencia espacial ensaya protocolos cruzados entre ruso e inglés',
        summary:
          'Astronautas practican listas de verificación de emergencia alternando idiomas para reducir errores de transferencia.',
        url: 'https://www.example.com/es/ciencia/protocolos-cruzados-mision',
        source: 'Exploración Orbital',
        topic: 'science',
        language: 'es',
      },
    ],
  },
  pt: {
    culture: [
      {
        id: 'pt-culture-1',
        title: 'Festival literário promove saraus em múltiplos idiomas',
        summary:
          'Em Recife, leitores se reúnem para ler contos curtos na língua que estão estudando e receber feedback de sotaque.',
        url: 'https://www.example.com/pt/cultura/festival-literario-multilingue',
        source: 'Cultura em Rede',
        topic: 'culture',
        language: 'pt',
      },
      {
        id: 'pt-culture-2',
        title: 'Clube de cinema oferece debates com mediação bilíngue',
        summary:
          'Cineastas independentes exibem filmes estrangeiros e propõem perguntas guiadas para ampliar vocabulário.',
        url: 'https://www.example.com/pt/cultura/clube-cinema-bilingue',
        source: 'Tela Aberta',
        topic: 'culture',
        language: 'pt',
      },
      {
        id: 'pt-culture-3',
        title: 'Rádio comunitária lança radionovela para intercâmbio linguístico',
        summary:
          'Em Belo Horizonte, voluntários escrevem episódios bilíngues que apresentam gírias e expressões cotidianas.',
        url: 'https://www.example.com/pt/cultura/radio-radionovela-intercambio',
        source: 'Vozes Locais',
        topic: 'culture',
        language: 'pt',
      },
      {
        id: 'pt-culture-4',
        title: 'Museu inaugura visitas com realidade aumentada e legendas duplas',
        summary:
          'Óculos inteligentes exibem termos históricos e pronúncia guiada à medida que o público percorre as salas.',
        url: 'https://www.example.com/pt/cultura/museu-realidade-aumentada',
        source: 'Patrimônio Vivo',
        topic: 'culture',
        language: 'pt',
      },
      {
        id: 'pt-culture-5',
        title: 'Maratona de jogos independentes celebra narrativas bilíngues',
        summary:
          'Times de Curitiba e Lisboa criaram protótipos em que trocar de idioma revela pistas secretas.',
        url: 'https://www.example.com/pt/cultura/maratona-jogos-bilingues',
        source: 'Pixel Livre',
        topic: 'culture',
        language: 'pt',
      },
      {
        id: 'pt-culture-6',
        title: 'Coletivo de arte urbana lança audioguias multilíngues',
        summary:
          'Mapas de grafites em São Paulo trazem QR codes com relatos interpretados por estudantes.',
        url: 'https://www.example.com/pt/cultura/audioguia-arte-urbana',
        source: 'Cidade Criativa',
        topic: 'culture',
        language: 'pt',
      },
      {
        id: 'pt-culture-7',
        title: 'Biblioteca promove oficinas de tradução de mangás contemporâneos',
        summary:
          'Tradutores convidam leitores a adaptar gírias e onomatopeias preservando o ritmo da narrativa.',
        url: 'https://www.example.com/pt/cultura/oficina-traducao-mangas',
        source: 'Leitura Aberta',
        topic: 'culture',
        language: 'pt',
      },
      {
        id: 'pt-culture-8',
        title: 'Instituto cultural transmite aulas de culinária entre cidades irmãs',
        summary:
          'Chefes de Salvador e Porto ensinam pratos familiares enquanto explicam termos regionais.',
        url: 'https://www.example.com/pt/cultura/aulas-culinaria-cidades-irmas',
        source: 'Sabores Conectados',
        topic: 'culture',
        language: 'pt',
      },
      {
        id: 'pt-culture-9',
        title: 'Grupo de dança urbana divulga glossário colaborativo',
        summary:
          'Coreógrafos registram comandos em português e inglês para ensaios remotos sincronizados.',
        url: 'https://www.example.com/pt/cultura/danca-glossario-colaborativo',
        source: 'Movimento Vivo',
        topic: 'culture',
        language: 'pt',
      },
      {
        id: 'pt-culture-10',
        title: 'Festival de luzes cria caça ao tesouro de vocabulário',
        summary:
          'Visitantes desbloqueiam poemas projetados ao resolver charadas em dois idiomas.',
        url: 'https://www.example.com/pt/cultura/festival-luzes-vocabulario',
        source: 'Noite Cultural',
        topic: 'culture',
        language: 'pt',
      },
    ],
    technology: [
      {
        id: 'pt-tech-1',
        title: 'Plataforma open source traduz boletins técnicos em tempo real',
        summary:
          'Voluntários criaram glossários comparados para termos de energia renovável em português e alemão.',
        url: 'https://www.example.com/pt/tecnologia/plataforma-traducao-tecnica',
        source: 'Tech&Línguas',
        topic: 'technology',
        language: 'pt',
      },
      {
        id: 'pt-tech-2',
        title: 'Aplicativo nacional lança coach de pronúncia com IA offline',
        summary:
          'O recurso treina entonação e dá feedback sobre sotaque usando frases reais de podcasts populares.',
        url: 'https://www.example.com/pt/tecnologia/app-pronuncia-ia',
        source: 'Inovação Brasil',
        topic: 'technology',
        language: 'pt',
      },
      {
        id: 'pt-tech-3',
        title: 'Fone tradutor inclui pistas espaciais para reforçar vocabulário',
        summary:
          'Uma startup carioca ajusta volume e posição do áudio conforme o nível de confiança do aprendiz.',
        url: 'https://www.example.com/pt/tecnologia/fone-tradutor-pistas',
        source: 'Inova Som',
        topic: 'technology',
        language: 'pt',
      },
      {
        id: 'pt-tech-4',
        title: 'Plugin open source sugere commits bilíngues automaticamente',
        summary:
          'Equipes distribuem glossários sincronizados entre repositórios em português e inglês.',
        url: 'https://www.example.com/pt/tecnologia/plugin-commits-bilingues',
        source: 'Código Vivo',
        topic: 'technology',
        language: 'pt',
      },
      {
        id: 'pt-tech-5',
        title: 'App de realidade aumentada traduz sinalização de metrô em tempo real',
        summary:
          'Passageiros no Rio apontam o celular para placas e recebem traduções com notas gramaticais.',
        url: 'https://www.example.com/pt/tecnologia/app-ra-metro',
        source: 'Mobilidade Inteligente',
        topic: 'technology',
        language: 'pt',
      },
      {
        id: 'pt-tech-6',
        title: 'Extensão de navegador aplica quizzes contextuais enquanto o usuário lê',
        summary:
          'Perguntas aparecem após parágrafos complexos e oferecem explicações de expressões idiomáticas.',
        url: 'https://www.example.com/pt/tecnologia/extensao-quizzes-contexto',
        source: 'Produtividade Agora',
        topic: 'technology',
        language: 'pt',
      },
      {
        id: 'pt-tech-7',
        title: 'Pacote de vozes sintéticas destaca prosódia para estudantes intermediários',
        summary:
          'Pesquisadores lançam modelos que enfatizam ritmo natural sem acelerar demais as frases.',
        url: 'https://www.example.com/pt/tecnologia/pacote-vozes-prosodia',
        source: 'Voz e IA',
        topic: 'technology',
        language: 'pt',
      },
      {
        id: 'pt-tech-8',
        title: 'ONG organiza repositório de manuais técnicos acessíveis',
        summary:
          'Voluntários compartilham traduções comentadas de documentos sobre energia solar e automação.',
        url: 'https://www.example.com/pt/tecnologia/manuais-tecnicos-acessiveis',
        source: 'Tech Solidária',
        topic: 'technology',
        language: 'pt',
      },
      {
        id: 'pt-tech-9',
        title: 'Hackathon cria assistente de reuniões que marca jargões desconhecidos',
        summary:
          'O protótipo gera resumos com termos-chave e links para revisões posteriores.',
        url: 'https://www.example.com/pt/tecnologia/assistente-reunioes-jargao',
        source: 'Campus Inova',
        topic: 'technology',
        language: 'pt',
      },
      {
        id: 'pt-tech-10',
        title: 'Universidades publicam playbooks de cibersegurança multilíngues',
        summary:
          'Instituições de Brasília e Berlim elaboram drills que padronizam terminologia crítica.',
        url: 'https://www.example.com/pt/tecnologia/playbook-ciberseguranca-multilingue',
        source: 'Segurança em Rede',
        topic: 'technology',
        language: 'pt',
      },
    ],
    business: [
      {
        id: 'pt-business-1',
        title: 'Startups criam programas de imersão para equipes globais',
        summary:
          'Empresas brasileiras oferecem rotinas bilíngues de onboarding com foco em linguagem de negócios.',
        url: 'https://www.example.com/pt/negocios/imersao-equipes-globais',
        source: 'Mercado Global',
        topic: 'business',
        language: 'pt',
      },
      {
        id: 'pt-business-2',
        title: 'Consultorias ensinam expressões comerciais em encontros semanais',
        summary:
          'Mentores ajudam profissionais a adaptar pitches de vendas para clientes internacionais.',
        url: 'https://www.example.com/pt/negocios/consultoria-expressoes',
        source: 'Negócios em Foco',
        topic: 'business',
        language: 'pt',
      },
      {
        id: 'pt-business-3',
        title: 'Aceleradora global prepara fundadores para pitches trilingues',
        summary:
          'Empreendedores de impacto social treinam apresentações em inglês, espanhol e português.',
        url: 'https://www.example.com/pt/negocios/aceleradora-pitches-trilingues',
        source: 'Capital Criativo',
        topic: 'business',
        language: 'pt',
      },
      {
        id: 'pt-business-4',
        title: 'Feira internacional monta laboratório de negociação com intérpretes',
        summary:
          'Expositores simulam contratos em diferentes idiomas para testar repertórios de vendas.',
        url: 'https://www.example.com/pt/negocios/laboratorio-negociacao',
        source: 'Mercado Conectado',
        topic: 'business',
        language: 'pt',
      },
      {
        id: 'pt-business-5',
        title: 'Bancos criam mentorias bilíngues entre escritórios regionais',
        summary:
          'Analistas de Porto Alegre e Toronto trocam relatórios e desenvolvem vocabulário regulatório compartilhado.',
        url: 'https://www.example.com/pt/negocios/mentoria-bilingue-bancos',
        source: 'Finance Lab',
        topic: 'business',
        language: 'pt',
      },
      {
        id: 'pt-business-6',
        title: 'Rede de suporte ao cliente divulga glossário de expressões locais',
        summary:
          'Equipes compilam ditados e abreviações comuns para acelerar respostas em chats multilíngues.',
        url: 'https://www.example.com/pt/negocios/glossario-expressao-suporte',
        source: 'Atendimento 360',
        topic: 'business',
        language: 'pt',
      },
      {
        id: 'pt-business-7',
        title: 'Hotelaria vincula bônus de idiomas à satisfação dos hóspedes',
        summary:
          'Concierges recebem formação contínua e monitoram avaliações para medir impacto do aprendizado.',
        url: 'https://www.example.com/pt/negocios/hotelaria-bonus-idiomas',
        source: 'Turismo Inteligente',
        topic: 'business',
        language: 'pt',
      },
      {
        id: 'pt-business-8',
        title: 'Conselho exportador disponibiliza modelos logísticos bilíngues',
        summary:
          'PMEs baixam planilhas com cláusulas destacadas em árabe, inglês e português.',
        url: 'https://www.example.com/pt/negocios/modelos-logisticos-bilingues',
        source: 'Cadeia Global',
        topic: 'business',
        language: 'pt',
      },
      {
        id: 'pt-business-9',
        title: 'Empresas remotas experimentam duplas de idioma assíncronas',
        summary:
          'Colaboradores gravam vídeos semanais focados em expressões corporativas difíceis.',
        url: 'https://www.example.com/pt/negocios/duplas-idioma-assincronas',
        source: 'Trabalho Híbrido',
        topic: 'business',
        language: 'pt',
      },
      {
        id: 'pt-business-10',
        title: 'Varejistas promovem maratonas de feedback em múltiplos idiomas',
        summary:
          'Clientes comentam protótipos de embalagens e registram sugestões em espanhol e português.',
        url: 'https://www.example.com/pt/negocios/maratona-feedback-multilingue',
        source: 'Retail Brasil',
        topic: 'business',
        language: 'pt',
      },
    ],
    education: [
      {
        id: 'pt-education-1',
        title: 'Rede pública integra histórias seriadas nas aulas de idiomas',
        summary:
          'Professores utilizam narrativas curtas em áudio para reforçar vocabulário com atividades interativas.',
        url: 'https://www.example.com/pt/educacao/historias-seriadas',
        source: 'Educação Hoje',
        topic: 'education',
        language: 'pt',
      },
      {
        id: 'pt-education-2',
        title: 'Parceria internacional leva laboratório de idiomas a bairros periféricos',
        summary:
          'Estudantes de Recife e Porto trocam cartas de áudio comentando iniciativas de sustentabilidade.',
        url: 'https://www.example.com/pt/educacao/laboratorio-idiomas',
        source: 'Rede Escola',
        topic: 'education',
        language: 'pt',
      },
      {
        id: 'pt-education-3',
        title: 'Institutos federais criam microcertificações em interpretação simultânea',
        summary:
          'Turmas praticam tradução ao vivo em eventos acadêmicos e recebem feedback de especialistas.',
        url: 'https://www.example.com/pt/educacao/microcertificacao-interpretacao',
        source: 'Educação Técnica',
        topic: 'education',
        language: 'pt',
      },
      {
        id: 'pt-education-4',
        title: 'Excursões imersivas unem escolas de Maputo e Porto Alegre',
        summary:
          'Estudantes descrevem cenários em realidade virtual e constroem glossários colaborativos.',
        url: 'https://www.example.com/pt/educacao/excursoes-imersivas',
        source: 'Mundos Conectados',
        topic: 'education',
        language: 'pt',
      },
      {
        id: 'pt-education-5',
        title: 'Laboratórios de idiomas adotam parceiros conversacionais com IA',
        summary:
          'Tutoras supervisionam diálogos gerados por IA e inserem desafios específicos de gramática.',
        url: 'https://www.example.com/pt/educacao/parceiro-conversacional-ia',
        source: 'EdTech Brasil',
        topic: 'education',
        language: 'pt',
      },
      {
        id: 'pt-education-6',
        title: 'Clubes juvenis digitalizam memórias familiares para estudo de língua de herança',
        summary:
          'Grupos transformam entrevistas em livros digitais com exercícios de compreensão.',
        url: 'https://www.example.com/pt/educacao/memorias-familiares-digitais',
        source: 'Comunidade Escola',
        topic: 'education',
        language: 'pt',
      },
      {
        id: 'pt-education-7',
        title: 'Bolsa de intercâmbio financia imersão técnica para aprendizes',
        summary:
          'Cursos profissionalizantes de gastronomia e tecnologia enviam estudantes para residências curtas.',
        url: 'https://www.example.com/pt/educacao/bolsa-imersao-tecnica',
        source: 'Rede Profissões',
        topic: 'education',
        language: 'pt',
      },
      {
        id: 'pt-education-8',
        title: 'Bibliotecas lançam podcast de contação de histórias bilíngue',
        summary:
          'Famílias participam lendo episódios e recebendo sugestões de entonação.',
        url: 'https://www.example.com/pt/educacao/podcast-contacao-bilingue',
        source: 'Leitura em Casa',
        topic: 'education',
        language: 'pt',
      },
      {
        id: 'pt-education-9',
        title: 'Coletivo docente cria banco aberto de tarefas formativas',
        summary:
          'Educadores alinham descritores de nível com perguntas situadas em STEAM.',
        url: 'https://www.example.com/pt/educacao/banco-tarefas-formativas',
        source: 'Pedagogia Aberta',
        topic: 'education',
        language: 'pt',
      },
      {
        id: 'pt-education-10',
        title: 'Conselho avaliador inclui módulos de comunicação intercultural',
        summary:
          'Avaliações nacionais passam a medir estratégias de negociação de sentido em segunda língua.',
        url: 'https://www.example.com/pt/educacao/modulos-comunicacao-intercultural',
        source: 'Avalia Brasil',
        topic: 'education',
        language: 'pt',
      },
    ],
    science: [
      {
        id: 'pt-science-1',
        title: 'Pesquisadores analisam terminologia de saúde em múltiplos idiomas',
        summary:
          'Universidades lusófonas mapeiam diferenças em relatórios médicos para acelerar traduções de urgência.',
        url: 'https://www.example.com/pt/ciencia/terminologia-saude',
        source: 'Ciência Viva',
        topic: 'science',
        language: 'pt',
      },
      {
        id: 'pt-science-2',
        title: 'Estudo revela impacto da música na retenção de vocabulário',
        summary:
          'Neurocientistas brasileiros observam que cantar com letras adaptadas ajuda adultos a memorizar expressões complexas.',
        url: 'https://www.example.com/pt/ciencia/musica-vocabulario',
        source: 'NeuroEdu',
        topic: 'science',
        language: 'pt',
      },
      {
        id: 'pt-science-3',
        title: 'Laboratório de fonética mapeia entoação em dialetos emergentes',
        summary:
          'Pesquisadores disponibilizam curvas de tons para auxiliar imitadores de sotaque.',
        url: 'https://www.example.com/pt/ciencia/entoacao-dialetos-emergentes',
        source: 'Fonética Em Foco',
        topic: 'science',
        language: 'pt',
      },
      {
        id: 'pt-science-4',
        title: 'Cientistas cognitivos testam repetição espaçada em línguas de sinais',
        summary:
          'Participantes usam luvas hápticas para reforçar classificadores complexos.',
        url: 'https://www.example.com/pt/ciencia/repeticao-espacada-libras',
        source: 'Cognição & Linguagem',
        topic: 'science',
        language: 'pt',
      },
      {
        id: 'pt-science-5',
        title: 'Equipe de dados avalia densidade vocabular em podcasts estudantis',
        summary:
          'O conjunto aberto mede frequência de expressões idiomáticas ao longo dos episódios.',
        url: 'https://www.example.com/pt/ciencia/podcasts-densidade-vocabular',
        source: 'Dados & Línguas',
        topic: 'science',
        language: 'pt',
      },
      {
        id: 'pt-science-6',
        title: 'Ecologistas criam guias de ciência cidadã multilíngues',
        summary:
          'Projetos de observação de aves recebem roteiros claros para voluntários internacionais.',
        url: 'https://www.example.com/pt/ciencia/guias-ciencia-cidada',
        source: 'Planeta Verde',
        topic: 'science',
        language: 'pt',
      },
      {
        id: 'pt-science-7',
        title: 'Pesquisa em IA modela adaptação de sotaque para síntese de fala',
        summary:
          'Modelos ajustam prosódia de acordo com a língua alvo, preservando inteligibilidade.',
        url: 'https://www.example.com/pt/ciencia/adaptacao-sotaque-tts',
        source: 'IA & Voz',
        topic: 'science',
        language: 'pt',
      },
      {
        id: 'pt-science-8',
        title: 'Linguistas clínicos criam léxico ágil para telemedicina',
        summary:
          'Hospitais compartilham scripts multilingues para triagem, consentimento e alta.',
        url: 'https://www.example.com/pt/ciencia/lexico-telemedicina',
        source: 'Saúde Linguística',
        topic: 'science',
        language: 'pt',
      },
      {
        id: 'pt-science-9',
        title: 'Psicolinguistas estudam narrativas em aulas imersivas de VR',
        summary:
          'Alunos que recontam histórias em realidade virtual retêm metáforas com maior precisão.',
        url: 'https://www.example.com/pt/ciencia/narrativas-vr-imersivo',
        source: 'Mente & Fala',
        topic: 'science',
        language: 'pt',
      },
      {
        id: 'pt-science-10',
        title: 'Agência espacial treina equipes com checklists bilíngues',
        summary:
          'Operações simuladas alternam russo e inglês para reduzir ruído em emergências.',
        url: 'https://www.example.com/pt/ciencia/checklists-bilingues-espaco',
        source: 'Pesquisa Orbital',
        topic: 'science',
        language: 'pt',
      },
    ],
  },
};

export function getCuratedNews(language: string, topic: NewsTopicId): CuratedNewsItem[] {
  const locale = language.toLowerCase();
  const [base] = locale.split('-');
  if (curatedNews[locale]?.[topic]) return curatedNews[locale][topic];
  if (curatedNews[base]?.[topic]) return curatedNews[base][topic];
  return curatedNews.en[topic];
}
