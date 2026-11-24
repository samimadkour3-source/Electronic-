export type GlossaryCategory = 'basics' | 'measurement' | 'circuits';

export interface GlossaryTerm {
  id: string;
  category: GlossaryCategory;
  termAr: string;
  termFr: string;
  termEn: string;
  symbolOrUnit?: string;
  shortDefAr: string;
  shortDefFr: string;
  shortDefEn: string;
  simpleExplainAr: string;
  simpleExplainFr: string;
  simpleExplainEn: string;
  exampleAr: string;
  exampleFr: string;
  exampleEn: string;
  aliasesAr: string[];
  aliasesFr: string[];
  aliasesEn: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'voltage',
    category: 'basics',
    termAr: 'الجهد الكهربائي (الفولتية)',
    termFr: 'Tension électrique (Voltage)',
    termEn: 'Voltage (Electrical Potential)',
    symbolOrUnit: 'V (Volt)',
    shortDefAr: 'القوة الدافعة التي تدفع الإلكترونات للتحرك داخل الأسلاك والعناصر.',
    shortDefFr: 'La force qui pousse les électrons à circuler dans un circuit.',
    shortDefEn: 'The electrical pressure that pushes current through a circuit.',
    simpleExplainAr:
      'تخيّل أن الكهرباء مثل الماء في أنبوب: الفولتية هي "ضغط الماء" الذي يدفع الماء للأمام. كلما زاد الجهد زادت قدرة الدائرة على دفع التيار عبر المقاومات والأحمال.',
    simpleExplainFr:
      'Imaginez l’électricité comme de l’eau dans un tuyau : la tension correspond à la pression qui pousse l’eau à avancer.',
    simpleExplainEn:
      'Think of electricity like water in a pipe: voltage is the water pressure pushing charge forward through components.',
    exampleAr: 'بطارية الهاتف تعطي نحو 3.7V بينما منفذ USB يعطي 5V.',
    exampleFr: 'Une pile USB fournit 5V, tandis qu’une pile carrée standard fournit 9V.',
    exampleEn: 'A USB port supplies 5V DC, while a common rectangular battery supplies 9V DC.',
    aliasesAr: ['الفولتية', 'الجهد الكهربائي', 'الجهد', 'فولتية', 'فولت'],
    aliasesFr: ['tension électrique', 'tension', 'voltage'],
    aliasesEn: ['voltage', 'potential difference'],
  },
  {
    id: 'current',
    category: 'basics',
    termAr: 'شدة التيار الكهربائي',
    termFr: 'Courant électrique (Intensité)',
    termEn: 'Electric Current',
    symbolOrUnit: 'I / A (Ampere)',
    shortDefAr: 'كمية الشحنات الكهربائية التي تمر عبر نقطة معينة في السلك خلال ثانية واحدة.',
    shortDefFr: 'La quantité de charge électrique circulant par seconde en un point du circuit.',
    shortDefEn: 'The rate of electric charge flowing through a conductor each second.',
    simpleExplainAr:
      'إذا كانت الفولتية هي ضغط الماء، فإن التيار (الأمبير) هو "كمية الماء المتدفقة" فعلياً في الثانية. الإلكترونيات الدقيقة تستهلك عادةً ملي أمبير (mA)، أي أجزاء من الألف من الأمبير.',
    simpleExplainFr:
      'Si la tension est la pression, le courant (en Ampères) représente le débit réel d’eau qui coule dans le tuyau.',
    simpleExplainEn:
      'If voltage is pressure, current (in Amps) is the actual volume of water flowing per second. Small electronics usually use milliamps (mA).',
    exampleAr: 'ليد 5mm عادي يحتاج تياراً بين 10mA و 20mA ليضيء بأمان.',
    exampleFr: 'Une LED standard de 5 mm consomme généralement entre 10 mA et 20 mA.',
    exampleEn: 'A standard 5mm LED safely draws about 10mA to 20mA.',
    aliasesAr: ['شدة التيار', 'التيار الكهربائي', 'التيار'],
    aliasesFr: ['intensité', 'courant électrique', 'courant'],
    aliasesEn: ['electric current', 'current'],
  },
  {
    id: 'resistance',
    category: 'basics',
    termAr: 'المقاومة الكهربائية',
    termFr: 'Résistance électrique',
    termEn: 'Electrical Resistance',
    symbolOrUnit: 'R / Ω (Ohm)',
    shortDefAr: 'ممانعة المادة لمرور التيار الكهربائي وتحويل جزء منه إلى حرارة.',
    shortDefFr: 'Opposition d’un matériau ou composant au passage du courant électrique.',
    shortDefEn: 'Opposition to the flow of electric current in a circuit.',
    simpleExplainAr:
      'المقاومة تشبه "ضيق الأنبوب" الذي يبطئ تدفق الماء. نستخدمها لحماية القطع الحساسة مثل الليد من الاحتراق بسبب التيار الزائد، وتُقاس بوحدة الأوم (Ω).',
    simpleExplainFr:
      'La résistance agit comme un rétrécissement dans un tuyau qui freine le débit pour protéger les composants sensibles.',
    simpleExplainEn:
      'Resistance acts like a narrow section of pipe that restricts flow, protecting delicate parts like LEDs from excess current.',
    exampleAr: 'مقاومة 330Ω تحمي الليد عند توصيله بمصدر 5V.',
    exampleFr: 'Une résistance de 330 Ω protège une LED branchée sur du 5 V.',
    exampleEn: 'A 330Ω resistor keeps a 5V-powered LED from burning out.',
    aliasesAr: ['المقاومة الكهربائية', 'مقاومة كهربائية', 'الأوم', 'أوم'],
    aliasesFr: ['résistance électrique', 'ohms', 'résistance'],
    aliasesEn: ['resistance', 'ohms'],
  },
  {
    id: 'power',
    category: 'basics',
    termAr: 'القدرة الكهربائية (الواط)',
    termFr: 'Puissance électrique (Watt)',
    termEn: 'Electrical Power',
    symbolOrUnit: 'P / W (Watt)',
    shortDefAr: 'معدل استهلاك العنصر للطاقة أو تبديدها على شكل حرارة وضوء في الثانية.',
    shortDefFr: 'Quantité d’énergie consommée ou dissipée en chaleur par seconde.',
    shortDefEn: 'Rate at which electrical energy is consumed or dissipated as heat/light.',
    simpleExplainAr:
      'القدرة (W) تساوي حاصل ضرب الجهد في التيار (P = V × I). إذا سخنت المقاومة أو الترانزستور أكثر من قدرته بالواط فسوف يحترق ويدخّن.',
    simpleExplainFr:
      'La puissance vaut P = V × I. Si un composant dissipe plus de watts que sa limite nominale, il surchauffe.',
    simpleExplainEn:
      'Power equals Voltage × Current (P = V × I). Exceeding a component’s watt rating causes overheating and damage.',
    exampleAr: 'مقاومة ربع واط (0.25W) تناسب الإشارات الصغيرة، بينما دوائر الشحن تحتاج مقاومات 1W أو 2W.',
    exampleFr: 'Les circuits logiques utilisent des résistances 1/4 W, les alimentations nécessitent 1 W ou 2 W.',
    exampleEn: 'Small signal circuits use 1/4W resistors, whereas power stages need 1W or 2W parts.',
    aliasesAr: ['القدرة الكهربائية', 'الواط', 'قدرة تبديد', 'قدرة'],
    aliasesFr: ['puissance électrique', 'puissance', 'watts'],
    aliasesEn: ['power dissipation', 'wattage', 'power'],
  },
  {
    id: 'polarity',
    category: 'basics',
    termAr: 'القطبية (الاستقطاب)',
    termFr: 'Polarité',
    termEn: 'Polarity',
    symbolOrUnit: '+ / -',
    shortDefAr: 'تحديد اتجاه التوصيل الإلزامي للعنصر بين القطب الموجب (+) والقطب السالب (-).',
    shortDefFr: 'Sens de branchement obligatoire d’un composant entre le pôle positif (+) et négatif (-).',
    shortDefEn: 'Required orientation of a component’s positive (+) and negative (-) leads.',
    simpleExplainAr:
      'بعض العناصر مثل المقاومة تعمل في أي اتجاه، أما العناصر "المستقطبة" مثل المكثف الكيميائي والدايود والليد فيجب تركيبها بالاتجاه الصحيح وإلا لن تعمل أو قد تنفجر.',
    simpleExplainFr:
      'Contrairement aux résistances, les composants polarisés (LED, diode, condensateur chimique) exigent le respect strict du + et du -.',
    simpleExplainEn:
      'Unlike resistors, polarized parts (LEDs, diodes, electrolytic capacitors) must be wired in the exact + and - orientation.',
    exampleAr: 'عكس قطبية المكثف الكيميائي قد يؤدي لانتفاخه وانفجاره.',
    exampleFr: 'Inverser un condensateur électrolytique peut le faire gonfler ou éclater.',
    exampleEn: 'Reversing an electrolytic capacitor’s polarity can cause it to vent or burst.',
    aliasesAr: ['القطبية', 'قطبية', 'المستقطب', 'مستقطب', 'الاستقطاب'],
    aliasesFr: ['polarité', 'polarisé', 'polarisée'],
    aliasesEn: ['polarity', 'polarized'],
  },
  {
    id: 'anode_cathode',
    category: 'basics',
    termAr: 'الأنود (+) والكاثود (-)',
    termFr: 'Anode (+) et Cathode (-)',
    termEn: 'Anode & Cathode',
    symbolOrUnit: 'A (+) / K (-)',
    shortDefAr: 'الأنود هو الطرف الموجب لدخول التيار، والكاثود هو الطرف السالب لخروجه في الدايود والليد.',
    shortDefFr: 'L’Anode est la borne positive (+) et la Cathode la borne négative (-) d’une diode ou LED.',
    shortDefEn: 'Anode is the positive (+) lead and Cathode is the negative (-) lead of a diode or LED.',
    simpleExplainAr:
      'في الليد يكون الأنود هو الرجل الأطول غالباً، وفي الدايود العادي يُميَّز الكاثود بحلقة فضية أو رمادية مرسومة على جسم العنصر.',
    simpleExplainFr:
      'Sur une LED, l’anode est la patte la plus longue ; sur une diode, la cathode est repérée par l’anneau coloré.',
    simpleExplainEn:
      'On an LED, the Anode is usually the longer leg; on a diode, the Cathode is marked with a printed stripe.',
    exampleAr: 'يضيء الليد عندما يكون الأنود متصلاً بالموجب والكاثود بالسالب.',
    exampleFr: 'La LED s’allume lorsque l’anode reçoit le (+) et la cathode le (-).',
    exampleEn: 'An LED lights up when its Anode connects to (+) and Cathode to (-).',
    aliasesAr: ['الأنود', 'أنود', 'الكاثود', 'كاثود'],
    aliasesFr: ['anode', 'cathode'],
    aliasesEn: ['anode', 'cathode'],
  },
  {
    id: 'capacitance',
    category: 'basics',
    termAr: 'السعة الكهربائية (الفاراد)',
    termFr: 'Capacité électrique (Farad)',
    termEn: 'Capacitance',
    symbolOrUnit: 'C / µF / nF / pF',
    shortDefAr: 'قدرة المكثف على تخزين الشحنات الكهربائية عند جهد معين.',
    shortDefFr: 'Capacité d’un condensateur à stocker une charge électrique sous une tension donnée.',
    shortDefEn: 'Ability of a capacitor to store electric charge per unit voltage.',
    simpleExplainAr:
      'الفاراد وحدة كبيرة جداً، لذلك نستخدم أجزاءها في الإلكترونيات: الميكروفاراد (µF) للتنعيم والطاقة، والنانوفاراد (nF) والبيكوفاراد (pF) لتصفية الإشارات السريعة.',
    simpleExplainFr:
      'Le Farad étant énorme, on utilise le microfarad (µF) pour le filtrage et le nanofarad/picofarad (nF, pF) pour les hautes fréquences.',
    simpleExplainEn:
      'One Farad is huge, so electronics use microfarads (µF) for power filtering and nF/pF for high-frequency signals.',
    exampleAr: 'مكثف 1000µF يخزن طاقة أكبر بآلاف المرات من مكثف سيراميك 100nF.',
    exampleFr: 'Un condensateur de 1000 µF stocke bien plus d’énergie qu’un céramique de 100 nF.',
    exampleEn: 'A 1000µF electrolytic holds vastly more charge than a 100nF ceramic cap.',
    aliasesAr: ['السعة الكهربائية', 'السعة', 'الميكروفاراد', 'الفاراد'],
    aliasesFr: ['capacité', 'microfarads', 'farad'],
    aliasesEn: ['capacitance', 'microfarads', 'farad'],
  },
  {
    id: 'inductance',
    category: 'basics',
    termAr: 'المحاثة / التحريض (الهنري)',
    termFr: 'Inductance (Henry)',
    termEn: 'Inductance',
    symbolOrUnit: 'L / mH / µH',
    shortDefAr: 'خاصية الملف التي تجعله يقاوم التغيّر المفاجئ في التيار عبر تخزين الطاقة في مجال مغناطيسي.',
    shortDefFr: 'Propriété d’une bobine à s’opposer aux variations brusques de courant via un champ magnétique.',
    shortDefEn: 'Property of a coil that opposes sudden current changes by storing magnetic energy.',
    simpleExplainAr:
      'الملف يحب استقرار التيار: إذا حاول التيار الارتفاع أو الانخفاض فجأة، يولّد الملف مجالاً مغناطيسياً يقاوم هذا التغيير السريع، وهذا أساس عمل المحولات ودوائر رفع وخفض الجهد.',
    simpleExplainFr:
      'La bobine lisse les variations brutales de courant grâce au magnétisme, principe de base des transformateurs et convertisseurs.',
    simpleExplainEn:
      'An inductor resists sudden changes in current via its magnetic field, forming the core of transformers and DC-DC converters.',
    exampleAr: 'ملف 100µH يُستخدم في شواحن السيارات لخفض الجهد من 12V إلى 5V بكفاءة.',
    exampleFr: 'Une inductance de 100 µH abaisse efficacement 12 V en 5 V dans un convertisseur Buck.',
    exampleEn: 'A 100µH choke is used in Buck converters to efficiently step 12V down to 5V.',
    aliasesAr: ['المحاثة', 'التحريض', 'المجال المغناطيسي', 'الهنري'],
    aliasesFr: ['inductance', 'champ magnétique', 'henry'],
    aliasesEn: ['inductance', 'magnetic field', 'henry'],
  },
  {
    id: 'frequency',
    category: 'basics',
    termAr: 'التردد (الهيرتز)',
    termFr: 'Fréquence (Hertz)',
    termEn: 'Frequency (Hz)',
    symbolOrUnit: 'f / Hz / kHz / MHz',
    shortDefAr: 'عدد المرات التي تتكرر فيها الموجة أو النبضة الكهربائية خلال ثانية واحدة.',
    shortDefFr: 'Nombre de cycles ou d’impulsions électriques répétés en une seconde.',
    shortDefEn: 'Number of complete electrical cycles or pulses occurring each second.',
    simpleExplainAr:
      'كهرباء المنزل تتبدل 50 أو 60 مرة في الثانية (50Hz)، أما الكريستالة في المعالجات فتتذبذب ملايين المرات في الثانية (MHz) لضبط الوقت والسرعة.',
    simpleExplainFr:
      'Le secteur oscille 50 fois par seconde (50 Hz), tandis qu’un quartz de microcontrôleur bat à plusieurs millions de cycles (MHz).',
    simpleExplainEn:
      'Mains AC cycles 50 or 60 times per second (Hz), while microcontroller crystals oscillate millions of times per second (MHz).',
    exampleAr: 'كريستالة 16MHz تعطي 16 مليون نبضة توقيت كل ثانية للوحة Arduino.',
    exampleFr: 'Un quartz de 16 MHz fournit 16 millions d’impulsions par seconde à une carte Arduino.',
    exampleEn: 'A 16MHz crystal clocks an Arduino board 16 million times per second.',
    aliasesAr: ['التردد', 'تردد', 'الهيرتز', 'تذبذب', 'نبضات التوقيت'],
    aliasesFr: ['fréquence', 'hertz', 'oscillation'],
    aliasesEn: ['frequency', 'hertz', 'oscillation'],
  },
  {
    id: 'ac_dc',
    category: 'basics',
    termAr: 'التيار المستمر (DC) والمتردد (AC)',
    termFr: 'Courant Continu (DC) et Alternatif (AC)',
    termEn: 'DC vs AC Current',
    symbolOrUnit: 'DC (⎓) / AC (∿)',
    shortDefAr: 'المستمر (DC) يسري في اتجاه واحد كالبطاريات، والمتردد (AC) يعكس اتجاهه دورياً ككهرباء المنزل.',
    shortDefFr: 'Le DC circule toujours dans le même sens (piles) ; l’AC s’inverse périodiquement (secteur).',
    shortDefEn: 'DC flows steadily in one direction (batteries); AC reverses direction periodically (wall mains).',
    simpleExplainAr:
      'كل الدوائر الإلكترونية الدقيقة تقريباً تحتاج تياراً مستمراً (DC) بجهد ثابت (مثل 5V أو 12V)، لذا تقوم وحدة التغذية بتحويل كهرباء المنزل المترددة (AC) إلى مستمرة (DC).',
    simpleExplainFr:
      'Les circuits électroniques fonctionnent presque toujours en DC stable ; l’alimentation convertit donc l’AC du secteur en DC.',
    simpleExplainEn:
      'Electronics require steady DC power, so power supplies convert wall AC into smooth low-voltage DC.',
    exampleAr: 'شاحن الهاتف يحول 220V AC من الجدار إلى 5V DC للهاتف.',
    exampleFr: 'Un chargeur de téléphone convertit le 220 V AC en 5 V DC.',
    exampleEn: 'A phone charger converts 220V AC wall power into 5V DC.',
    aliasesAr: ['التيار المستمر', 'التيار المتردد', 'تيار مستمر', 'تيار متردد', 'جهد مستمر', 'جهد متردد'],
    aliasesFr: ['courant continu', 'courant alternatif', 'tension continue', 'tension alternative'],
    aliasesEn: ['direct current', 'alternating current', 'dc voltage', 'ac voltage'],
  },
  {
    id: 'series_parallel',
    category: 'circuits',
    termAr: 'التوصيل على التوالي والتوازي',
    termFr: 'Montage en Série et en Parallèle',
    termEn: 'Series & Parallel Connections',
    symbolOrUnit: 'Series / Parallel',
    shortDefAr: 'التوالي يربط العناصر واحداً تلو الآخر في مسار واحد، والتوازي يعطي لكل عنصر مساراً مستقلاً.',
    shortDefFr: 'En série, les composants forment une seule boucle ; en parallèle, chacun reçoit la même tension.',
    shortDefEn: 'Series shares one current path end-to-end; Parallel connects parts across the same two voltage rails.',
    simpleExplainAr:
      'في التوالي يمر نفس التيار في الجميع وإذا انقطع عنصر تتوقف الدائرة، أما في التوازي فيأخذ كل عنصر نفس الفولتية وإذا تلف أحدهما تبقى البقية تعمل.',
    simpleExplainFr:
      'En série, le même courant traverse tout et une coupure arrête tout ; en parallèle, la tension est identique sur chaque branche.',
    simpleExplainEn:
      'In series, current is shared and one break stops everything; in parallel, every branch gets full voltage independently.',
    exampleAr: 'الفيوز يوضع دائماً على التوالي ليقطع التيار، ومكثف التنعيم يوضع على التوازي مع التغذية.',
    exampleFr: 'Un fusible se branche toujours en série ; un condensateur de filtrage se branche en parallèle.',
    exampleEn: 'A fuse is always wired in series, whereas a smoothing capacitor is wired in parallel.',
    aliasesAr: ['التوالي', 'على التوالي', 'التوازي', 'على التوازي'],
    aliasesFr: ['en série', 'en parallèle'],
    aliasesEn: ['in series', 'in parallel'],
  },
  {
    id: 'short_circuit',
    category: 'measurement',
    termAr: 'قصر الدائرة (الشورت)',
    termFr: 'Court-circuit (Short)',
    termEn: 'Short Circuit',
    symbolOrUnit: '~0 Ω',
    shortDefAr: 'اتصال مباشر وغير مقصود بين الموجب والسالب بمقاومة شبه معدومة يسبب تياراً خطيراً.',
    shortDefFr: 'Contact direct quasi nul (0 Ω) provoquant une surintensité dangereuse.',
    shortDefEn: 'Unintended near-zero-ohm connection causing excessive current flow.',
    simpleExplainAr:
      'عندما يتلف دايود أو ترانزستور أو يتلامس سلكان، يصبح كأنه سلك مباشر (0Ω) فيمر تيار ضخم يؤدي لارتفاع الحرارة أو احتراق الفيوز.',
    simpleExplainFr:
      'Un composant en court-circuit laisse passer le courant sans limite (~0 Ω), faisant chauffer les pistes ou griller le fusible.',
    simpleExplainEn:
      'A shorted component acts like a direct wire (~0Ω), causing runaway current, overheating, or blown fuses.',
    exampleAr: 'سماع صفارة متواصلة وقراءة 0.00Ω على طرفي دايود في الاتجاهين تعني وجود شورت.',
    exampleFr: 'Un bip continu et 0 Ω dans les deux sens sur une diode indiquent un court-circuit.',
    exampleEn: 'A continuous beep and ~0Ω in both directions across a diode indicates a short circuit.',
    aliasesAr: ['الشورت', 'قصر الدائرة', 'عطل قصر', 'شورت', 'تلامس داخلي'],
    aliasesFr: ['court-circuit'],
    aliasesEn: ['short circuit', 'shorted'],
  },
  {
    id: 'open_circuit',
    category: 'measurement',
    termAr: 'الدائرة المفتوحة (القطع)',
    termFr: 'Circuit ouvert (Coupure)',
    termEn: 'Open Circuit',
    symbolOrUnit: 'OL / ∞ Ω',
    shortDefAr: 'انقطاع المسار الكهربائي بحيث لا يستطيع أي تيار المرور مطلقاً.',
    shortDefFr: 'Rupture totale du passage électrique empêchant tout courant de circuler.',
    shortDefEn: 'Broken electrical path where zero current can flow.',
    simpleExplainAr:
      'مثل جسر منهار أو مفتاح مطفأ؛ إذا احترق سلك الفيوز الداخلي أو انقطعت مقاومة، تصبح المقاومة لا نهائية ويظهر الملتيميتر قراءة (OL).',
    simpleExplainFr:
      'Comme un pont coupé : le courant est totalement bloqué et le multimètre affiche OL.',
    simpleExplainEn:
      'Like a broken bridge, current cannot cross. A blown fuse or burned resistor reads OL (infinite resistance).',
    exampleAr: 'الفيوز المحترق يعطي قراءة OL ولا يصدر صفارة في وضع الاستمرارية.',
    exampleFr: 'Un fusible grillé affiche OL sans aucun bip en test de continuité.',
    exampleEn: 'A blown fuse reads OL with no beep on a continuity check.',
    aliasesAr: ['القطع', 'دائرة مفتوحة', 'عطل قطع', 'انقطاع داخلي'],
    aliasesFr: ['circuit ouvert', 'coupure'],
    aliasesEn: ['open circuit', 'open fault'],
  },
  {
    id: 'forward_reverse_bias',
    category: 'circuits',
    termAr: 'الانحياز الأمامي والعكسي',
    termFr: 'Polarisation directe et inverse',
    termEn: 'Forward & Reverse Bias',
    symbolOrUnit: 'Vf (~0.7V)',
    shortDefAr: 'الوضع الذي يسمح للدايود بالتوصيل (أمامي) أو يمنعه من التوصيل (عكسي).',
    shortDefFr: 'État où la diode conduit le courant (direct) ou le bloque (inverse).',
    shortDefEn: 'Condition where a PN junction conducts current (forward) or blocks it (reverse).',
    simpleExplainAr:
      'الدايود صمام باتجاه واحد: في الانحياز الأمامي (الموجب على الأنود) يفتح الطريق مقابل هبوط بسيط (~0.7V)، وفي العكسي يغلق الطريق تماماً.',
    simpleExplainFr:
      'En sens direct (+ sur l’anode), la diode conduit dès ~0,7 V ; en sens inverse, elle bloque le courant.',
    simpleExplainEn:
      'In forward bias (+ on Anode), a silicon diode conducts after ~0.7V; in reverse bias, it blocks current flow.',
    exampleAr: 'في وضع الدايود بالملتيميتر: السليم يعطي ~0.5V–0.7V في اتجاه و OL في الاتجاه المعاكس.',
    exampleFr: 'Au multimètre (mode Diode) : ~0,6 V en direct et OL en inverse.',
    exampleEn: 'In Multimeter Diode mode: ~0.6V forward and OL in reverse.',
    aliasesAr: ['الانحياز الأمامي', 'الانحياز العكسي', 'بالاتجاه الأمامي', 'الاتجاه العكسي', 'جهد العتبة'],
    aliasesFr: ['sens direct', 'sens inverse', 'polarisation directe'],
    aliasesEn: ['forward bias', 'reverse bias', 'forward voltage'],
  },
  {
    id: 'ground',
    category: 'circuits',
    termAr: 'الأرضي / السالب المشترك (GND)',
    termFr: 'Masse commune (GND)',
    termEn: 'Ground (GND)',
    symbolOrUnit: 'GND / 0V',
    shortDefAr: 'نقطة المرجع الصفرية (0V) التي تُقاس بالنسبة لها كل الفولتيات في الدائرة.',
    shortDefFr: 'Point de référence à 0 V par rapport auquel toutes les tensions sont mesurées.',
    shortDefEn: 'The common 0V reference point against which all circuit voltages are measured.',
    simpleExplainAr:
      'عند فحص أي جهد بالملتيميتر، نضع السلك الأسود (COM) على خط الأرضي (GND) ثم نقيس بالسلك الأحمر نقاط الدائرة المختلفة.',
    simpleExplainFr:
      'Lors d’une mesure de tension, la sonde noire (COM) reste généralement posée sur la masse (GND).',
    simpleExplainEn:
      'When probing DC voltages, place the black COM lead on Ground (GND) and probe test points with the red lead.',
    exampleAr: 'الطرف الأوسط (الرجل 2) في منظم الجهد LM7805 يتصل دائماً بالأرضي (GND).',
    exampleFr: 'La broche centrale du régulateur LM7805 est toujours reliée à la masse (GND).',
    exampleEn: 'The center pin of an LM7805 voltage regulator always connects to GND.',
    aliasesAr: ['الأرضي', 'السالب المشترك', 'خط السالب'],
    aliasesFr: ['masse', 'gnd'],
    aliasesEn: ['ground', 'gnd'],
  },
  {
    id: 'voltage_drop',
    category: 'circuits',
    termAr: 'هبوط الجهد',
    termFr: 'Chute de tension',
    termEn: 'Voltage Drop',
    symbolOrUnit: 'ΔV',
    shortDefAr: 'مقدار الفولتية التي يستهلكها أو يقتطعها العنصر أثناء مرور التيار عبره.',
    shortDefFr: 'Fraction de tension consommée ou perdue aux bornes d’un composant traversé par un courant.',
    shortDefEn: 'Amount of voltage lost across a component as current flows through it.',
    simpleExplainAr:
      'الدايود السيليكوني يقتطع حوالي 0.7V، والليد الأحمر يستهلك حوالي 2V، والباقي يذهب إلى المقاومة المتصلة معه.',
    simpleExplainFr:
      'Une diode silicium consomme ~0,7 V et une LED rouge ~2 V ; le reste de la tension tombe aux bornes de la résistance.',
    simpleExplainEn:
      'A silicon diode drops ~0.7V and a red LED drops ~2V, leaving the remainder across its series resistor.',
    exampleAr: 'عند تغذية ليد 2V من بطارية 9V، يكون هبوط الجهد على المقاومة 7V.',
    exampleFr: 'Sur 9 V avec une LED de 2 V, la chute de tension sur la résistance est de 7 V.',
    exampleEn: 'Powering a 2V LED from 9V leaves a 7V voltage drop across the limiting resistor.',
    aliasesAr: ['هبوط الجهد', 'جهد الانحياز'],
    aliasesFr: ['chute de tension'],
    aliasesEn: ['voltage drop'],
  },
  {
    id: 'voltage_divider',
    category: 'circuits',
    termAr: 'مجزئ الجهد',
    termFr: 'Diviseur de tension',
    termEn: 'Voltage Divider',
    symbolOrUnit: 'Vout = Vin·R2/(R1+R2)',
    shortDefAr: 'توصيل مقاومتين على التوالي للحصول على جهد أصغر عند نقطة المنتصف.',
    shortDefFr: 'Deux résistances en série permettant d’obtenir une tension réduite au point milieu.',
    shortDefEn: 'Two resistors in series that divide an input voltage down to a lower fraction.',
    simpleExplainAr:
      'يُستخدم كثيراً مع الحساسات مثل LDR أو لخفض إشارة 5V إلى 3.3V لقراءة الحساسات بأمان في المتحكمات.',
    simpleExplainFr:
      'Très utilisé avec les capteurs (LDR, thermistance) ou pour adapter un signal 5 V vers 3,3 V.',
    simpleExplainEn:
      'Widely used with resistive sensors (LDRs, NTCs) or to scale a 5V signal safely down to 3.3V.',
    exampleAr: 'مقاومتان متساويتان 10kΩ على مصدر 10V تعطيان 5V تماماً في المنتصف.',
    exampleFr: 'Deux résistances égales de 10 kΩ alimentées en 10 V donnent exactement 5 V au milieu.',
    exampleEn: 'Two equal 10kΩ resistors across 10V output exactly 5V at the midpoint.',
    aliasesAr: ['مجزئ الجهد', 'مجزئ جهد', 'تقسيم الجهد'],
    aliasesFr: ['diviseur de tension'],
    aliasesEn: ['voltage divider'],
  },
  {
    id: 'rectification',
    category: 'circuits',
    termAr: 'التوحيد (التقويم) وقنطرة الدايود',
    termFr: 'Redressement et Pont de diodes',
    termEn: 'Rectification & Diode Bridge',
    symbolOrUnit: 'AC → DC',
    shortDefAr: 'تحويل التيار المتردد ثنائي الاتجاه إلى تيار نبضي في اتجاه واحد فقط.',
    shortDefFr: 'Conversion d’un courant alternatif bidirectionnel en un courant unidirectionnel.',
    shortDefEn: 'Converting bidirectional AC into unidirectional pulsating DC using diodes.',
    simpleExplainAr:
      'باستخدام أربعة دايودات مرتبة بشكل معين (قنطرة/جسر)، يتم قلب النصف السالب من الموجة ليصبح موجباً مع النصف الأول، ثم يأتي دور المكثف لتنعيمه.',
    simpleExplainFr:
      'Un pont de quatre diodes redresse les deux alternances de l’AC dans un seul sens avant le lissage par condensateur.',
    simpleExplainEn:
      'Four diodes arranged in a bridge flip the negative AC half-cycles positive before a capacitor smooths them.',
    exampleAr: 'مكون RS207 أو 4 دايودات 1N4007 داخل شواحن المحولات.',
    exampleFr: 'Un pont moulé RS207 ou 4 diodes 1N4007 à l’entrée d’une alimentation.',
    exampleEn: 'A bridge rectifier IC like RS207 or four 1N4007 diodes inside linear adapters.',
    aliasesAr: ['التقويم', 'توحيد التيار', 'قنطرة', 'تقويم التيار'],
    aliasesFr: ['redressement', 'pont de diodes'],
    aliasesEn: ['rectification', 'bridge rectifier'],
  },
  {
    id: 'ripple_smoothing',
    category: 'circuits',
    termAr: 'التموج والتنعيم (الترشيح)',
    termFr: 'Ondulation et Lissage (Filtrage)',
    termEn: 'Ripple & Smoothing',
    symbolOrUnit: 'Vripple',
    shortDefAr: 'تعبئة الفراغات بين نبضات التيار الموحد ليصبح جهداً مستمراً ناعماً ومستقراً.',
    shortDefFr: 'Suppression des creux de tension après redressement grâce à un condensateur réservoir.',
    shortDefEn: 'Filling gaps between rectified pulses using a capacitor to produce smooth DC.',
    simpleExplainAr:
      'يشحن المكثف الكيميائي الكبير أثناء قمة الموجة ويفرغ طاقته أثناء انخفاضها، فيختفي التذبذب وتعمل الدائرة دون ضجيج أو إعادة تشغيل.',
    simpleExplainFr:
      'Le gros condensateur se charge aux crêtes et restitue son énergie dans les creux, stabilisant la tension DC.',
    simpleExplainEn:
      'A large reservoir capacitor charges at voltage peaks and discharges during dips, eliminating hum and resets.',
    exampleAr: 'مكثف 2200µF بعد قنطرة التوحيد ينعم جهد 12V لتشغيل المضخمات الصوتية.',
    exampleFr: 'Un condensateur de 2200 µF après le pont supprime le ronflement sur un ampli.',
    exampleEn: 'A 2200µF capacitor after a bridge rectifier removes 50/60Hz hum in audio amps.',
    aliasesAr: ['التنعيم', 'تنعيم الجهد', 'التموجات', 'الترشيح'],
    aliasesFr: ['lissage', 'filtrage', 'ondulation'],
    aliasesEn: ['smoothing', 'ripple', 'filtering'],
  },
  {
    id: 'pwm',
    category: 'circuits',
    termAr: 'تعديل عرض النبضة (PWM)',
    termFr: 'Modulation de largeur d’impulsion (PWM)',
    termEn: 'PWM (Pulse Width Modulation)',
    symbolOrUnit: '% Duty Cycle',
    shortDefAr: 'التحكم في قوة المحرك أو إضاءة الليد عبر تشغيله وإطفائه بسرعة فائقة وبنسب زمنية متغيرة.',
    shortDefFr: 'Contrôle de la puissance moyenne en hachant rapidement le signal avec un rapport cyclique variable.',
    shortDefEn: 'Controlling average power by rapidly switching a signal ON and OFF at varying duty cycles.',
    simpleExplainAr:
      'بدلاً من إهدار الطاقة في مقاومة ساخنة، يقوم الترانزستور أو الموسفت بالفتح والإغلاق آلاف المرات في الثانية؛ كلما طالت مدة التشغيل زادت السرعة أو الإضاءة.',
    simpleExplainFr:
      'En variant la durée de l’état haut par rapport à la période, on ajuste finement la vitesse d’un moteur sans chauffer.',
    simpleExplainEn:
      'Varying the ON-time ratio (duty cycle) thousands of times per second adjusts motor speed or LED brightness efficiently.',
    exampleAr: 'المؤقت NE555 يولد إشارة PWM للتحكم في سرعة مروحة 12V عبر موسفت.',
    exampleFr: 'Un NE555 génère un signal PWM pour piloter un ventilateur via un MOSFET.',
    exampleEn: 'An NE555 generates a PWM signal to dim LEDs or vary fan speed via a MOSFET.',
    aliasesAr: ['pwm', 'نبضات', 'النبضة'],
    aliasesFr: ['pwm', 'impulsions'],
    aliasesEn: ['pwm', 'duty cycle'],
  },
  {
    id: 'base_collector_emitter',
    category: 'circuits',
    termAr: 'القاعدة والمجمع والباعث (B / C / E)',
    termFr: 'Base, Collecteur et Émetteur (B / C / E)',
    termEn: 'Base, Collector & Emitter',
    symbolOrUnit: 'B / C / E',
    shortDefAr: 'الأطراف الثلاثة للترانزستور ثنائي القطب (BJT): القاعدة تتحكم، والمجمع يستقبل، والباعث يخرج التيار.',
    shortDefFr: 'Les 3 broches d’un transistor bipolaire : la Base commande le courant entre Collecteur et Émetteur.',
    shortDefEn: 'The three terminals of a BJT transistor where a small Base current controls Collector-to-Emitter flow.',
    simpleExplainAr:
      'القاعدة (Base) مثل صنبور صغير جداً؛ تيار ضعيف يدخل إليها يفتح الطريق لتيار أكبر بعشرات أو مئات المرات ليمر من المجمع (Collector) إلى الباعث (Emitter).',
    simpleExplainFr:
      'La Base agit comme un robinet sensible : un infime courant y déclenche un fort courant du Collecteur vers l’Émetteur.',
    simpleExplainEn:
      'Think of the Base as a sensitive valve: a tiny Base current unlocks a much larger current from Collector to Emitter.',
    exampleAr: 'في الترانزستور BC547 (NPN)، تمرر قاعدة بجهد >0.7V تياراً يشغّل ريلاي أو ليد.',
    exampleFr: 'Sur un BC547, >0,7 V sur la Base permet d’activer un relais entre Collecteur et Émetteur.',
    exampleEn: 'On a BC547 NPN, >0.7V at the Base switches a relay coil between Collector and Emitter.',
    aliasesAr: ['القاعدة', 'المجمع', 'الباعث'],
    aliasesFr: ['base', 'collecteur', 'émetteur'],
    aliasesEn: ['base', 'collector', 'emitter'],
  },
  {
    id: 'gate_drain_source',
    category: 'circuits',
    termAr: 'البوابة والمصرف والمصدر (G / D / S)',
    termFr: 'Grille, Drain et Source (G / D / S)',
    termEn: 'Gate, Drain & Source',
    symbolOrUnit: 'G / D / S',
    shortDefAr: 'الأطراف الثلاثة للموسفت (MOSFET): البوابة تتحكم بالجهد الكهربائي وليس بالتيار.',
    shortDefFr: 'Les 3 bornes d’un MOSFET où la tension appliquée à la Grille commande le canal Drain-Source.',
    shortDefEn: 'The three terminals of a MOSFET where voltage on the insulated Gate switches Drain-to-Source current.',
    simpleExplainAr:
      'على عكس الترانزستور العادي، بوابة الموسفت معزولة تماماً وتستجيب للجهد (الفولتية) فقط دون استهلاك تيار مستمر، مما يجعله مثالياً للأحمال الكبيرة.',
    simpleExplainFr:
      'La Grille étant isolée, le MOSFET se commande uniquement en tension avec très peu de pertes pour les fortes puissances.',
    simpleExplainEn:
      'Because the MOSFET Gate is insulated, it switches high currents using voltage alone with minimal heat loss.',
    exampleAr: 'تطبيق 10V على البوابة (Gate) في IRF540N يفتح القناة بين Drain و Source بمقاومة ضئيلة.',
    exampleFr: 'Appliquer 10 V sur la Grille d’un IRF540N ferme le passage Drain-Source.',
    exampleEn: 'Applying 10V to an IRF540N Gate closes the Drain-Source channel cleanly.',
    aliasesAr: ['البوابة', 'المصرف', 'المصدر'],
    aliasesFr: ['grille', 'drain', 'source'],
    aliasesEn: ['gate', 'drain', 'source'],
  },
  {
    id: 'saturation_cutoff',
    category: 'circuits',
    termAr: 'حالة التشبع والقطع',
    termFr: 'Saturation et Blocage',
    termEn: 'Saturation & Cutoff',
    symbolOrUnit: 'ON / OFF',
    shortDefAr: 'حالتا عمل الترانزستور كمفتاح إلكتروني: مفتوح بالكامل (تشبع) أو مغلق بالكامل (قطع).',
    shortDefFr: 'Les deux états de commutation d’un transistor : totalement passant (saturation) ou coupé (blocage).',
    shortDefEn: 'The two switching extremes of a transistor: fully ON (saturation) or fully OFF (cutoff).',
    simpleExplainAr:
      'في الدوائر الرقمية والمحركات نريد الترانزستور إما مطفأً تماماً (قطع) أو مفتوحاً بأقصى طاقة (تشبع) حتى لا يعمل بنصف طاقته ويسخن كثيراً.',
    simpleExplainFr:
      'En commutation, le transistor reste soit bloqué soit saturé pour éviter de dissiper de la chaleur inutilement.',
    simpleExplainEn:
      'Switching circuits push transistors hard into Saturation (ON) or Cutoff (OFF) to minimize heat.',
    exampleAr: 'تشغيل ريلاي 12V يعتمد على دفع الترانزستور إلى التشبع الكامل.',
    exampleFr: 'Piloter un relais exige de pousser le transistor en saturation.',
    exampleEn: 'Driving a relay coil requires pushing the driver transistor cleanly into saturation.',
    aliasesAr: ['التشبع', 'حالة التشبع'],
    aliasesFr: ['saturation', 'bloqué'],
    aliasesEn: ['saturation', 'cutoff'],
  },
  {
    id: 'zener_breakdown',
    category: 'circuits',
    termAr: 'جهد الانهيار المنضبط (الزينر)',
    termFr: 'Tension Zener (Claquage contrôlé)',
    termEn: 'Zener Breakdown Voltage',
    symbolOrUnit: 'Vz',
    shortDefAr: 'الجهد العكسي المحدد الذي يبدأ عنده دايود الزينر بالتوصيل لتثبيت الجهد وحماية الدائرة.',
    shortDefFr: 'Tension inverse précise à partir de laquelle la diode Zener conduit pour stabiliser la ligne.',
    shortDefEn: 'Precise reverse voltage at which a Zener diode conducts to clamp and regulate a rail.',
    simpleExplainAr:
      'الدايود العادي يحترق إذا مرّ تيار عكسي فيه، أما الزينر فمصمم خصيصاً ليعمل في الاتجاه العكسي ويمرر الفولت الزائد محافظاً على قيمة ثابتة (مثل 5.1V أو 12V).',
    simpleExplainFr:
      'Contrairement à une diode standard, la Zener régule en inverse à une valeur fixe (5,1 V, 12 V…) sans se détruire.',
    simpleExplainEn:
      'Unlike standard diodes, Zeners safely conduct in reverse at Vz (like 5.1V) to hold a steady reference voltage.',
    exampleAr: 'زينر 5.1V مع مقاومة 1kΩ يحمي مدخل المتحكم من ارتفاع الجهد فوق 5.1V.',
    exampleFr: 'Une Zener 5,1 V avec 1 kΩ protège une entrée contre toute surtension.',
    exampleEn: 'A 5.1V Zener with a 1kΩ resistor clamps input spikes safely at 5.1V.',
    aliasesAr: ['انهيار الزينر', 'جهد الزينر', 'الزينر'],
    aliasesFr: ['tension zener', 'claquage'],
    aliasesEn: ['zener voltage', 'zener breakdown'],
  },
  {
    id: 'leakage',
    category: 'measurement',
    termAr: 'التسريب الكهربائي',
    termFr: 'Courant de fuite',
    termEn: 'Electrical Leakage',
    symbolOrUnit: 'µA / Low R',
    shortDefAr: 'تسرب تيار غير مرغوب فيه عبر عازل ضعيف أو مكثف أو شبه موصل متضرر.',
    shortDefFr: 'Passage anormal de courant à travers un isolant ou composant vieilli.',
    shortDefEn: 'Unwanted small current sneaking through degraded insulation or junctions.',
    simpleExplainAr:
      'يعني أن العنصر لم ينقطع ولم يقصر بالكامل، لكنه صار "يرشّح" كهرباء؛ مثل مكثف كيميائي يفقد شحنته بسرعة أو دايود يمرر قراءة صغيرة في الاتجاه العكسي.',
    simpleExplainFr:
      'Le composant n’est ni totalement coupé ni en court-circuit, mais laisse fuir du courant là où il devrait bloquer.',
    simpleExplainEn:
      'Not fully open or shorted, but leaking charge—such as a diode showing partial reverse conduction or a tired capacitor.',
    exampleAr: 'ظهور قراءة في الاتجاهين على الدايود (مثلاً 0.6V و 1.4V) يدل على تسريب.',
    exampleFr: 'Une lecture dans les deux sens sur une diode signale une fuite interne.',
    exampleEn: 'A diode reading conduction in both directions indicates junction leakage.',
    aliasesAr: ['تسريب', 'التسريب'],
    aliasesFr: ['fuite', 'courant de fuite'],
    aliasesEn: ['leakage', 'leaky'],
  },
  {
    id: 'esr',
    category: 'measurement',
    termAr: 'المقاومة الداخلية المكافئة (ESR)',
    termFr: 'Résistance série équivalente (ESR)',
    termEn: 'ESR (Equivalent Series Resistance)',
    symbolOrUnit: 'Ω (ESR)',
    shortDefAr: 'مقاومة داخلية غير مرغوبة تظهر داخل المكثف عند جفافه أو تقدّم عمره.',
    shortDefFr: 'Résistance interne parasite d’un condensateur qui augmente avec le vieillissement.',
    shortDefEn: 'Internal resistance inside a capacitor that rises sharply when its electrolyte dries out.',
    simpleExplainAr:
      'قد يقيس المكثف التالف سعة صحيحة أحياناً، لكن ارتفاع ESR يمنعه من تنعيم التيار بسرعة فيسخن ويتسبب في انطفاء الجهاز أو رفة الشاشة.',
    simpleExplainFr:
      'Un condensateur sec peut garder une capacité apparente normale mais une ESR élevée qui empêche l’alimentation de démarrer.',
    simpleExplainEn:
      'An aged capacitor can fail in-circuit due to high ESR even if capacitance looks okay, causing power-supply flicker or no-boot.',
    exampleAr: 'ارتفاع ESR في مكثفات لوحة التغذية سبب شائع لتأخر إقلاع الشاشات.',
    exampleFr: 'Une ESR élevée dans les alimentations empêche souvent les écrans de s’allumer.',
    exampleEn: 'High ESR caps in power boards are a top cause of flickering TVs and monitors.',
    aliasesAr: ['esr'],
    aliasesFr: ['esr'],
    aliasesEn: ['esr'],
  },
  {
    id: 'continuity',
    category: 'measurement',
    termAr: 'اختبار الاستمرارية (الجرس / الصفارة)',
    termFr: 'Test de continuité (Bip)',
    termEn: 'Continuity Test',
    symbolOrUnit: '🔊 / <30 Ω',
    shortDefAr: 'وضع في الملتيميتر يطلق صوت صفارة عند وجود اتصال سلكي سليم بين نقطتين.',
    shortDefFr: 'Mode du multimètre émettant un signal sonore lorsqu’un chemin électrique continu existe.',
    shortDefEn: 'Multimeter mode that beeps when two points are directly connected with very low resistance.',
    simpleExplainAr:
      'أسرع طريقة لفحص الأسلاك المقطوعة، الفيوز، أو المفاتيح الضاغطة: إذا صدر صوت الجرس فالمسار متصل، وإذا صمت والجهاز يظهر OL فالمسار مقطوع.',
    simpleExplainFr:
      'Moyen rapide pour vérifier un câble, un fusible ou un interrupteur : le bip confirme la connexion.',
    simpleExplainEn:
      'Fastest way to check wires, fuses, PCB traces, and switches: a beep confirms a closed path.',
    exampleAr: 'يُمنع استخدام وضع الاستمرارية والدائرة موصولة بالكهرباء.',
    exampleFr: 'Ne testez jamais la continuité sur un circuit sous tension.',
    exampleEn: 'Always power off the circuit before running a continuity test.',
    aliasesAr: ['الاستمرارية', 'وضع الاستمرارية', 'الصفارة', 'الجرس', 'البزر'],
    aliasesFr: ['continuité', 'mode continuité', 'bip'],
    aliasesEn: ['continuity', 'continuity mode'],
  },
  {
    id: 'ol_reading',
    category: 'measurement',
    termAr: 'قراءة (OL) على شاشة الملتيميتر',
    termFr: 'Indication OL (Hors limite)',
    termEn: 'OL (Open Loop / Overload)',
    symbolOrUnit: 'OL',
    shortDefAr: 'تعني عدم وجود توصيل أو أن القيمة المقاسة أكبر من قدرة النطاق المختار.',
    shortDefFr: 'Signifie circuit ouvert (résistance infinie) ou valeur supérieure au calibre choisi.',
    shortDefEn: 'Means Open Loop (infinite resistance / no conduction) or out of selected measurement range.',
    simpleExplainAr:
      'لا تعني وجود خطأ في الملتيميتر نفسه! في وضع الدايود تعني أن الدايود يحجب التيار بنجاح في الاتجاه العكسي، وفي وضع الأوم تعني أن المسار مفتوح أو المقاومة أعلى من النطاق.',
    simpleExplainFr:
      'En mode Diode, OL en sens inverse est normal et prouve que la diode bloque bien le courant.',
    simpleExplainEn:
      'OL is normal in Diode reverse-bias tests (proving the diode blocks current) and means "no path" in Ohm mode.',
    exampleAr: 'في وضع الدايود: قراءة 0.6V في اتجاه و OL في الاتجاه الآخر تعني دايوداً سليماً.',
    exampleFr: 'Diode saine : ~0,6 V dans un sens et OL dans l’autre.',
    exampleEn: 'Healthy diode: ~0.6V one way and OL the other way.',
    aliasesAr: ['ol'],
    aliasesFr: ['ol'],
    aliasesEn: ['ol'],
  },
];
