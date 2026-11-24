export type AppLanguage = 'ar' | 'fr' | 'en';

export const LANGUAGE_OPTIONS: { code: AppLanguage; nativeLabel: string; shortLabel: string }[] = [
  { code: 'ar', nativeLabel: 'العربية', shortLabel: 'AR' },
  { code: 'fr', nativeLabel: 'Français', shortLabel: 'FR' },
  { code: 'en', nativeLabel: 'English', shortLabel: 'EN' },
];

export interface UIStrings {
  brand: string;
  creatorPrefix: string;
  creatorName: string;
  offlineBadge: string;
  copyrightTitle: string;
  copyrightWarning: string;
  footerCopyright: string;
  footerAppTitle: string;
  nav: {
    components: string;
    componentsMobile: string;
    circuit: string;
    circuitMobile: string;
    projects: string;
    projectsMobile: string;
    lab: string;
    labMobile: string;
    quiz: string;
    quizMobile: string;
    notes: string;
    notesMobile: string;
    glossary: string;
    glossaryMobile: string;
  };
  topbar: {
    themeLight: string;
    themeDark: string;
    settings: string;
    languageLabel: string;
  };
  hero: {
    title: string;
    subtitle: string;
    statsLine: string;
    searchPlaceholder: string;
    searchAria: string;
    saved: string;
    noResults: string;
    showAll: string;
    symbolPrefix: string;
    readMore: string;
    saveAria: string;
    unsaveAria: string;
  };
  categories: Record<'all' | 'passive' | 'semiconductor' | 'power' | 'sensor', string>;
  labTabs: {
    multimeter: string;
    calculators: string;
  };
  settings: {
    title: string;
    subtitle: string;
    closeAria: string;
    languageTitle: string;
    fontSizeTitle: string;
    decrease: string;
    defaultBtn: string;
    increase: string;
    previewLabel: string;
    previewTitle: string;
    previewDesc: string;
    appearanceTitle: string;
    lightMode: string;
    darkMode: string;
    offlineTitle: string;
    offlineDesc: string;
    offlineSavedCount: string;
    offlineReady: string;
    offlineLocal: string;
    offlineSyncBtn: string;
    offlineSyncing: string;
    offlineFallbackMsg: string;
    done: string;
    scaleLabels: Record<85 | 92 | 100 | 112 | 125, string>;
  };
  pwa: {
    installBtn: string;
    modalTitle: string;
    modalSubtitle: string;
    iosSteps: [string, string, string];
    androidSteps: [string, string, string];
    gotIt: string;
    offlineToast: string;
  };
  detail: {
    backToGuide: string;
    prevAria: string;
    nextAria: string;
    unitLabel: string;
    schematicLabel: string;
    testInMultimeter: string;
    sec1Title: string;
    roleHeading: string;
    howWorksHeading: string;
    formulaHeading: string;
    pinoutHeading: string;
    sec2Title: string;
    requiredMode: string;
    polaritySensitive: string;
    nonPolarized: string;
    safetyPrefix: string;
    stepsHeading: string;
    goodLabel: string;
    openLabel: string;
    shortLabel: string;
    degradedLabel: string;
    sec3Title: string;
    sec4Title: string;
    sec5Title: string;
  };
}

export const UI_TRANSLATIONS: Record<AppLanguage, UIStrings> = {
  ar: {
    brand: 'دليل العناصر الإلكترونية',
    creatorPrefix: 'صناعة وتطوير:',
    creatorName: 'الأستاذ سامي مذكور',
    offlineBadge: 'يعمل بدون إنترنت',
    copyrightTitle: 'تنبيه حقوق الملكية الفكرية',
    copyrightWarning:
      'جميع الحقوق محفوظة للأستاذ سامي مذكور. يُمنع منعاً باتاً نسخ هذا التطبيق أو تقليده أو إعادة نشره أو توزيعه بدون إذن صريح ومسبق.',
    footerCopyright: 'جميع الحقوق محفوظة © 2026 · الأستاذ سامي مذكور',
    footerAppTitle: 'دليل العناصر الإلكترونية',
    nav: {
      components: 'العناصر',
      componentsMobile: 'العناصر',
      circuit: 'محاكي الدوائر',
      circuitMobile: 'المحاكاة',
      projects: 'المشاريع',
      projectsMobile: 'المشاريع',
      lab: 'القياس والحاسبات',
      labMobile: 'المختبر',
      quiz: 'اختبار',
      quizMobile: 'اختبار',
      notes: 'الملاحظات',
      notesMobile: 'ملاحظاتي',
      glossary: 'القاموس',
      glossaryMobile: 'القاموس',
    },
    topbar: {
      themeLight: 'الوضع النهاري',
      themeDark: 'الوضع الليلي',
      settings: 'الإعدادات',
      languageLabel: 'اللغة',
    },
    hero: {
      title: 'دليل العناصر الإلكترونية بالصور وطرق القياس',
      subtitle:
        'تعرّف على شكل كل عنصر إلكتروني، رمزه في المخططات، دوره الدقيق في الدوائر، وخطوات فحصه بالملتيميتر للتمييز بين السليم والتالف.',
      statsLine: '38 عنصراً إلكترونياً · محاكي دوائر حي · مختبر ملتيميتر · مشاريع واختبارات · دفتر ملاحظات محلي',
      searchPlaceholder: 'ابحث عن عنصر (مثلاً: دايود، مكثف، 7805)...',
      searchAria: 'ابحث في العناصر الإلكترونية',
      saved: 'المحفوظة',
      noResults: 'لا توجد عناصر مطابقة لبحثك حالياً.',
      showAll: 'عرض جميع العناصر',
      symbolPrefix: 'الرمز',
      readMore: 'الشرح والقياس ←',
      saveAria: 'حفظ العنصر',
      unsaveAria: 'إزالة من المحفوظات',
    },
    categories: {
      all: 'الكل',
      passive: 'عناصر خاملة',
      semiconductor: 'أشباه موصلات',
      power: 'طاقة وحماية',
      sensor: 'حساسات وتحكم',
    },
    labTabs: {
      multimeter: 'محاكي الملتيميتر',
      calculators: 'حاسبة الألوان والليد',
    },
    settings: {
      title: 'إعدادات التطبيق',
      subtitle: 'اللغة · حجم الخط · المظهر · العمل بدون إنترنت',
      closeAria: 'إغلاق الإعدادات',
      languageTitle: 'لغة التطبيق (Language)',
      fontSizeTitle: 'حجم الخط (تكبير وتصغير)',
      decrease: 'تصغير',
      defaultBtn: 'افتراضي',
      increase: 'تكبير',
      previewLabel: 'معاينة فورية لحجم النص:',
      previewTitle: 'المقاومة الكهربائية',
      previewDesc: 'تحدّ المقاومة من شدة التيار المار في الدائرة وتحمي العناصر الحساسة مثل الدايود الباعث للضوء.',
      appearanceTitle: 'مظهر الواجهة',
      lightMode: 'الوضع النهاري',
      darkMode: 'الوضع الليلي',
      offlineTitle: 'العمل بدون إنترنت (Offline)',
      offlineDesc:
        'جميع بيانات العناصر الإلكترونية، محاكي الدوائر، الملتيميتر، الحاسبات، المشاريع، والاختبارات تعمل محلياً على جهازك دون الحاجة لاتصال بالإنترنت.',
      offlineSavedCount: 'ملف مخزن',
      offlineReady: 'جاهز',
      offlineLocal: 'مدعوم محلياً',
      offlineSyncBtn: 'حفظ وتحديث جميع الصور والملفات للأوفلاين',
      offlineSyncing: 'جاري حفظ جميع الصور والملفات...',
      offlineFallbackMsg: 'بيانات العناصر والاختبارات والمحاكي محفوظة مسبقاً داخل التطبيق.',
      done: 'تم',
      scaleLabels: {
        85: 'مضغوط',
        92: 'صغير',
        100: 'افتراضي',
        112: 'كبير',
        125: 'كبير جداً',
      },
    },
    pwa: {
      installBtn: 'تثبيت على أندرويد',
      modalTitle: 'تشغيل التطبيق على أندرويد دون إنترنت',
      modalSubtitle: 'صناعة وتطوير: الأستاذ سامي مذكور · يعمل كتطبيق مستقل دون إنترنت',
      iosSteps: [
        'افتح التطبيق في متصفح Safari.',
        'اضغط على زر المشاركة (Share) أسفل الشاشة.',
        'اختر إضافة إلى الشاشة الرئيسية (Add to Home Screen).',
      ],
      androidSteps: [
        'افتح رابط التطبيق في متصفح Google Chrome على هاتف أندرويد.',
        'اضغط على قائمة النقاط الثلاث (⋮) في أعلى المتصفح.',
        'اختر تثبيت التطبيق (Install app) أو الإضافة إلى الشاشة الرئيسية.',
      ],
      gotIt: 'حسناً، فهمت',
      offlineToast: 'وضع عدم الاتصال — يتم عرض البيانات والصور المخزنة محلياً.',
    },
    detail: {
      backToGuide: 'العودة للدليل',
      prevAria: 'العنصر السابق',
      nextAria: 'العنصر التالي',
      unitLabel: 'وحدة القياس:',
      schematicLabel: 'الرمز الهندسي في المخططات (Schematic)',
      testInMultimeter: 'جرّب قياس هذا العنصر في محاكي الملتيميتر',
      sec1Title: '01. دوره في الإلكترونيات ومبدأ العمل',
      roleHeading: 'الوظيفة الأساسية في الدوائر',
      howWorksHeading: 'كيف يعمل من الداخل؟',
      formulaHeading: 'القانون الرياضي الأساسي',
      pinoutHeading: 'الأطراف والقطبية (Pinout)',
      sec2Title: '02. كيفية القياس والفحص بالملتيميتر',
      requiredMode: 'الوضع المطلوب:',
      polaritySensitive: 'حساس للقطبية (+/-)',
      nonPolarized: 'غير مستقطب',
      safetyPrefix: 'تنبيه سلامة القياس:',
      stepsHeading: 'خطوات الفحص العملية',
      goodLabel: 'سليم (Good)',
      openLabel: 'عطل قطع (Open)',
      shortLabel: 'عطل قصر / شورت (Short)',
      degradedLabel: 'ضعف أو تسريب (Degraded)',
      sec3Title: '03. الأنواع الشائعة',
      sec4Title: '04. تطبيقات عملية',
      sec5Title: '05. علامات التلف الظاهرية',
    },
  },
  fr: {
    brand: 'Guide des Composants',
    creatorPrefix: 'Créé et développé par :',
    creatorName: 'Prof. Sami Madhkour',
    offlineBadge: 'Fonctionne hors ligne',
    copyrightTitle: 'Avis de propriété intellectuelle',
    copyrightWarning:
      'Tous droits réservés au Prof. Sami Madhkour. Toute copie, imitation ou redistribution sans son autorisation expresse est strictement interdite.',
    footerCopyright: 'Tous droits réservés © 2026 · Prof. Sami Madhkour',
    footerAppTitle: 'Guide des Composants Électroniques',
    nav: {
      components: 'Composants',
      componentsMobile: 'Composants',
      circuit: 'Simulateur',
      circuitMobile: 'Simulateur',
      projects: 'Projets',
      projectsMobile: 'Projets',
      lab: 'Mesure & Outils',
      labMobile: 'Labo',
      quiz: 'Quiz',
      quizMobile: 'Quiz',
      notes: 'Mes Notes',
      notesMobile: 'Notes',
      glossary: 'Lexique',
      glossaryMobile: 'Lexique',
    },
    topbar: {
      themeLight: 'Mode clair',
      themeDark: 'Mode sombre',
      settings: 'Paramètres',
      languageLabel: 'Langue',
    },
    hero: {
      title: 'Guide Complet des Composants Électroniques et Mesures',
      subtitle:
        'Découvrez l’apparence de chaque composant, son symbole schématique, son rôle dans les circuits et la méthode exacte de test au multimètre.',
      statsLine: '38 composants · Simulateur de circuits · Labo multimètre · Projets, Quiz & Notes locales',
      searchPlaceholder: 'Rechercher un composant (ex : diode, condensateur, 7805)...',
      searchAria: 'Rechercher dans les composants électroniques',
      saved: 'Favoris',
      noResults: 'Aucun composant ne correspond à votre recherche.',
      showAll: 'Afficher tout',
      symbolPrefix: 'Symbole',
      readMore: 'Détails & Test →',
      saveAria: 'Enregistrer',
      unsaveAria: 'Retirer des favoris',
    },
    categories: {
      all: 'Tous',
      passive: 'Passifs',
      semiconductor: 'Semi-conducteurs',
      power: 'Puissance & Protection',
      sensor: 'Capteurs & Contrôle',
    },
    labTabs: {
      multimeter: 'Simulateur Multimètre',
      calculators: 'Calculateurs Couleurs & LED',
    },
    settings: {
      title: 'Paramètres de l’application',
      subtitle: 'Langue · Taille du texte · Thème · Hors ligne',
      closeAria: 'Fermer les paramètres',
      languageTitle: 'Langue de l’interface',
      fontSizeTitle: 'Taille du texte (Zoom)',
      decrease: 'Réduire',
      defaultBtn: 'Par défaut',
      increase: 'Agrandir',
      previewLabel: 'Aperçu instantané du texte :',
      previewTitle: 'Résistance électrique',
      previewDesc: 'La résistance limite l’intensité du courant dans le circuit et protège les composants sensibles comme les LED.',
      appearanceTitle: 'Apparence',
      lightMode: 'Mode clair',
      darkMode: 'Mode sombre',
      offlineTitle: 'Mode Hors Ligne (Offline)',
      offlineDesc:
        'Tous les composants, le simulateur de circuits, le multimètre, les calculateurs, les projets et les quiz fonctionnent localement sans connexion Internet.',
      offlineSavedCount: 'fichiers en cache',
      offlineReady: 'Prêt',
      offlineLocal: 'Stocké localement',
      offlineSyncBtn: 'Télécharger et vérifier les fichiers hors ligne',
      offlineSyncing: 'Mise en cache des images et fichiers...',
      offlineFallbackMsg: 'Les données, le simulateur et les quiz sont déjà stockés localement.',
      done: 'Terminer',
      scaleLabels: {
        85: 'Compact',
        92: 'Petit',
        100: 'Défaut',
        112: 'Grand',
        125: 'Très grand',
      },
    },
    pwa: {
      installBtn: 'Installer sur Android',
      modalTitle: 'Installer l’application sur Android (Hors ligne)',
      modalSubtitle: 'Créé par Prof. Sami Madhkour · Fonctionne hors ligne',
      iosSteps: [
        'Ouvrez l’application dans le navigateur Safari.',
        'Appuyez sur le bouton Partager en bas de l’écran.',
        'Choisissez Sur l’écran d’accueil (Add to Home Screen).',
      ],
      androidSteps: [
        'Ouvrez ce lien dans Google Chrome sur votre téléphone Android.',
        'Appuyez sur le menu à trois points (⋮) en haut à droite.',
        'Sélectionnez Installer l’application ou Ajouter à l’écran d’accueil.',
      ],
      gotIt: 'Compris',
      offlineToast: 'Mode hors ligne — Données et images chargées depuis le cache local.',
    },
    detail: {
      backToGuide: 'Retour au guide',
      prevAria: 'Composant précédent',
      nextAria: 'Composant suivant',
      unitLabel: 'Unité :',
      schematicLabel: 'Symbole schématique normalisé',
      testInMultimeter: 'Tester ce composant dans le simulateur multimètre',
      sec1Title: '01. Rôle en électronique et principe',
      roleHeading: 'Fonction principale dans les circuits',
      howWorksHeading: 'Fonctionnement interne',
      formulaHeading: 'Loi et formule mathématique',
      pinoutHeading: 'Brochage et polarité (Pinout)',
      sec2Title: '02. Mesure et test au multimètre',
      requiredMode: 'Mode requis :',
      polaritySensitive: 'Polarisé (+/-)',
      nonPolarized: 'Non polarisé',
      safetyPrefix: 'Consigne de sécurité :',
      stepsHeading: 'Étapes pratiques de mesure',
      goodLabel: 'Bon état (Good)',
      openLabel: 'Circuit ouvert (Open)',
      shortLabel: 'Court-circuit (Short)',
      degradedLabel: 'Fuite / Dégradé',
      sec3Title: '03. Types courants',
      sec4Title: '04. Applications pratiques',
      sec5Title: '05. Signes visibles de panne',
    },
  },
  en: {
    brand: 'Components Guide',
    creatorPrefix: 'Created & Developed by:',
    creatorName: 'Prof. Sami Madhkour',
    offlineBadge: 'Works Offline',
    copyrightTitle: 'Intellectual Property Notice',
    copyrightWarning:
      'All rights reserved to Prof. Sami Madhkour. Any unauthorized copying, cloning, imitation, or redistribution is strictly prohibited.',
    footerCopyright: 'All Rights Reserved © 2026 · Prof. Sami Madhkour',
    footerAppTitle: 'Electronic Components Guide',
    nav: {
      components: 'Components',
      componentsMobile: 'Parts',
      circuit: 'Circuit Sim',
      circuitMobile: 'Simulator',
      projects: 'Projects',
      projectsMobile: 'Projects',
      lab: 'Meter & Tools',
      labMobile: 'Lab',
      quiz: 'Quiz',
      quizMobile: 'Quiz',
      notes: 'My Notes',
      notesMobile: 'Notes',
      glossary: 'Glossary',
      glossaryMobile: 'Terms',
    },
    topbar: {
      themeLight: 'Light Mode',
      themeDark: 'Dark Mode',
      settings: 'Settings',
      languageLabel: 'Language',
    },
    hero: {
      title: 'Complete Electronic Components & Testing Guide',
      subtitle:
        'Explore every electronic component with visuals, schematic symbols, circuit roles, and step-by-step multimeter testing instructions.',
      statsLine: '38 components · Live DC circuit sim · Multimeter lab · Projects, Quizzes & Local Notes',
      searchPlaceholder: 'Search component (e.g., diode, capacitor, 7805)...',
      searchAria: 'Search electronic components',
      saved: 'Saved',
      noResults: 'No components match your search.',
      showAll: 'Show all components',
      symbolPrefix: 'Symbol',
      readMore: 'Guide & Test →',
      saveAria: 'Save component',
      unsaveAria: 'Remove from saved',
    },
    categories: {
      all: 'All',
      passive: 'Passive',
      semiconductor: 'Semiconductors',
      power: 'Power & Protection',
      sensor: 'Sensors & Control',
    },
    labTabs: {
      multimeter: 'Multimeter Sim',
      calculators: 'Color & LED Calculators',
    },
    settings: {
      title: 'App Settings',
      subtitle: 'Language · Font Size · Appearance · Offline',
      closeAria: 'Close settings',
      languageTitle: 'Interface Language',
      fontSizeTitle: 'Font Size (Zoom)',
      decrease: 'Smaller',
      defaultBtn: 'Default',
      increase: 'Larger',
      previewLabel: 'Live typography preview:',
      previewTitle: 'Electrical Resistor',
      previewDesc: 'A resistor limits electric current flow in a circuit and protects sensitive parts such as LEDs.',
      appearanceTitle: 'Appearance',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      offlineTitle: 'Offline Support',
      offlineDesc:
        'All electronic component guides, circuit simulator, multimeter lab, calculators, projects, and quizzes work locally without Internet.',
      offlineSavedCount: 'cached files',
      offlineReady: 'Ready',
      offlineLocal: 'Stored locally',
      offlineSyncBtn: 'Save & verify all images and files offline',
      offlineSyncing: 'Caching images and files...',
      offlineFallbackMsg: 'Component data, simulator, and quizzes are already stored locally.',
      done: 'Done',
      scaleLabels: {
        85: 'Compact',
        92: 'Small',
        100: 'Default',
        112: 'Large',
        125: 'Extra Large',
      },
    },
    pwa: {
      installBtn: 'Install Android App',
      modalTitle: 'Run Offline on Android',
      modalSubtitle: 'Created by Prof. Sami Madhkour · Standalone Offline App',
      iosSteps: [
        'Open the app in Safari.',
        'Tap the Share button at the bottom of the screen.',
        'Select Add to Home Screen.',
      ],
      androidSteps: [
        'Open this link in Google Chrome on your Android phone.',
        'Tap the three-dot menu (⋮) in the top corner.',
        'Select Install app or Add to Home screen.',
      ],
      gotIt: 'Got it',
      offlineToast: 'Offline mode — Showing locally cached data and images.',
    },
    detail: {
      backToGuide: 'Back to Guide',
      prevAria: 'Previous component',
      nextAria: 'Next component',
      unitLabel: 'Unit:',
      schematicLabel: 'Schematic Symbol',
      testInMultimeter: 'Test this component in the Multimeter Simulator',
      sec1Title: '01. Role in Electronics & Working Principle',
      roleHeading: 'Primary Circuit Function',
      howWorksHeading: 'How It Works Internally',
      formulaHeading: 'Key Formula',
      pinoutHeading: 'Pinout & Polarity',
      sec2Title: '02. How to Measure with a Multimeter',
      requiredMode: 'Recommended Mode:',
      polaritySensitive: 'Polarity Sensitive (+/-)',
      nonPolarized: 'Non-Polarized',
      safetyPrefix: 'Measurement Safety:',
      stepsHeading: 'Practical Testing Steps',
      goodLabel: 'Healthy (Good)',
      openLabel: 'Open Fault',
      shortLabel: 'Short Circuit Fault',
      degradedLabel: 'Degraded / Leaky',
      sec3Title: '03. Common Types',
      sec4Title: '04. Real-World Applications',
      sec5Title: '05. Visual Fault Signs',
    },
  },
};
