import React, { useMemo, useState } from 'react';
import { AlertTriangle, Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

type PinoutCategory = 'all' | 'bjt' | 'mosfet' | 'regulator' | 'ic_sensor';
type PackageType = 'TO-92' | 'TO-220' | 'SOT-223' | 'DIP-8' | 'DIP-4';

interface PinDef {
  num: number;
  symbol: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  descAr: string;
  descFr: string;
  descEn: string;
  color: string;
}

interface PinoutPart {
  id: string;
  partNumber: string;
  aliases: string;
  category: Exclude<PinoutCategory, 'all'>;
  pkg: PackageType;
  typeAr: string;
  typeFr: string;
  typeEn: string;
  specs: string;
  orientationAr: string;
  orientationFr: string;
  orientationEn: string;
  tabNoteAr?: string;
  tabNoteFr?: string;
  tabNoteEn?: string;
  warningAr?: string;
  warningFr?: string;
  warningEn?: string;
  pins: PinDef[];
}

const PINOUT_PARTS: PinoutPart[] = [
  {
    id: 'bc547',
    partNumber: 'BC547 / BC548',
    aliases: 'BC546 BC549 NPN',
    category: 'bjt',
    pkg: 'TO-92',
    typeAr: 'ترانزستور NPN للأغراض العامة',
    typeFr: 'Transistor NPN usage général',
    typeEn: 'General-Purpose NPN BJT',
    specs: '45V · 100mA · TO-92',
    orientationAr: 'النظر من الجهة الأمامية المسطحة المكتوب عليها (الأرجل للأسفل)',
    orientationFr: 'Vue de face (côté plat avec inscription face à vous)',
    orientationEn: 'Front view (flat printed side facing you, leads down)',
    warningAr: 'انتبه: ترتيب BC547 هو (C-B-E) عكس 2N2222 الذي ترتيبه (E-B-C)!',
    warningFr: 'Attention : le BC547 est C-B-E, inversé par rapport au 2N2222 (E-B-C) !',
    warningEn: 'Note: BC547 is C-B-E, reversed compared to PN2222 (E-B-C)!',
    pins: [
      { num: 1, symbol: 'C', nameAr: 'المجمع (Collector)', nameFr: 'Collecteur (C)', nameEn: 'Collector (C)', descAr: 'يتصل بالحمل أو القطب الموجب عبر الحمل.', descFr: 'Connecté à la charge.', descEn: 'Connected to load / positive supply side.', color: '#0EA5E9' },
      { num: 2, symbol: 'B', nameAr: 'القاعدة (Base)', nameFr: 'Base (B)', nameEn: 'Base (B)', descAr: 'مدخل إشارة التحكم بالتيار عبر مقاومة حماية.', descFr: 'Entrée de commande via résistance.', descEn: 'Control input driven through a base resistor.', color: '#F59E0B' },
      { num: 3, symbol: 'E', nameAr: 'الباعث (Emitter)', nameFr: 'Émetteur (E)', nameEn: 'Emitter (E)', descAr: 'يتصل عادةً بالأرضي (GND) في دوائر التبديل.', descFr: 'Relié à la masse (GND).', descEn: 'Usually connected to Ground (GND).', color: '#10B981' },
    ],
  },
  {
    id: 'bc557',
    partNumber: 'BC557 / BC558',
    aliases: 'PNP BC556',
    category: 'bjt',
    pkg: 'TO-92',
    typeAr: 'ترانزستور PNP مكمل لـ BC547',
    typeFr: 'Transistor PNP complémentaire',
    typeEn: 'General-Purpose PNP BJT',
    specs: '45V · 100mA · TO-92',
    orientationAr: 'النظر من الجهة الأمامية المسطحة المكتوب عليها (الأرجل للأسفل)',
    orientationFr: 'Vue de face (côté plat face à vous)',
    orientationEn: 'Front view (flat printed side facing you)',
    pins: [
      { num: 1, symbol: 'C', nameAr: 'المجمع (Collector)', nameFr: 'Collecteur (C)', nameEn: 'Collector (C)', descAr: 'خرج التيار إلى الحمل نحو الأرضي.', descFr: 'Sortie vers la charge.', descEn: 'Output feeding load toward ground.', color: '#0EA5E9' },
      { num: 2, symbol: 'B', nameAr: 'القاعدة (Base)', nameFr: 'Base (B)', nameEn: 'Base (B)', descAr: 'يتفعّل بسحب القاعدة لجهد أقل من الباعث بـ 0.7V.', descFr: 'Activé en tirant vers le bas (-0,7 V).', descEn: 'Turns ON when pulled 0.7V below Emitter.', color: '#F59E0B' },
      { num: 3, symbol: 'E', nameAr: 'الباعث (Emitter)', nameFr: 'Émetteur (E)', nameEn: 'Emitter (E)', descAr: 'يتصل بالتغذية الموجبة (+VCC).', descFr: 'Relié au +VCC.', descEn: 'Connected to positive supply (+VCC).', color: '#10B981' },
    ],
  },
  {
    id: '2n2222',
    partNumber: '2N2222 / PN2222',
    aliases: '2N2222A NPN',
    category: 'bjt',
    pkg: 'TO-92',
    typeAr: 'ترانزستور NPN للتيار المتوسط والتبديل السريع',
    typeFr: 'Transistor NPN commutation rapide',
    typeEn: 'NPN Switching Transistor',
    specs: '40V · 800mA · TO-92',
    orientationAr: 'النظر من الجهة الأمامية المسطحة المكتوب عليها (الأرجل للأسفل)',
    orientationFr: 'Vue de face (côté plat face à vous)',
    orientationEn: 'Front view (flat printed face toward you)',
    warningAr: 'تذكر: طرف 1 هو الباعث (E) وطرف 3 هو المجمع (C) — عكس عائلة BC547!',
    warningFr: 'Attention : Broche 1 = Émetteur (E) et Broche 3 = Collecteur (C).',
    warningEn: 'Remember: Pin 1 is Emitter (E) and Pin 3 is Collector (C) — opposite of BC547!',
    pins: [
      { num: 1, symbol: 'E', nameAr: 'الباعث (Emitter)', nameFr: 'Émetteur (E)', nameEn: 'Emitter (E)', descAr: 'يتصل بالأرضي (GND).', descFr: 'Connecté à GND.', descEn: 'Connect to Ground (GND).', color: '#10B981' },
      { num: 2, symbol: 'B', nameAr: 'القاعدة (Base)', nameFr: 'Base (B)', nameEn: 'Base (B)', descAr: 'مدخل إشارة التحكم عبر مقاومة (مثلاً 1kΩ).', descFr: 'Entrée de commande via résistance.', descEn: 'Control signal via series resistor.', color: '#F59E0B' },
      { num: 3, symbol: 'C', nameAr: 'المجمع (Collector)', nameFr: 'Collecteur (C)', nameEn: 'Collector (C)', descAr: 'يتصل بالطرف السالب للحمل أو الريليه.', descFr: 'Relié à la charge / relais.', descEn: 'Connect to load / relay negative side.', color: '#0EA5E9' },
    ],
  },
  {
    id: '2n3904',
    partNumber: '2N3904 / 2N3906',
    aliases: 'NPN PNP TO92',
    category: 'bjt',
    pkg: 'TO-92',
    typeAr: 'ترانزستور إشارة منخفضة الضوضاء',
    typeFr: 'Transistor petit signal',
    typeEn: 'Small-Signal Amplifier / Switch',
    specs: '40V · 200mA · TO-92',
    orientationAr: 'النظر من الجهة الأمامية المسطحة المكتوب عليها',
    orientationFr: 'Vue de face (côté plat face à vous)',
    orientationEn: 'Front view (flat side facing you)',
    pins: [
      { num: 1, symbol: 'E', nameAr: 'الباعث (Emitter)', nameFr: 'Émetteur (E)', nameEn: 'Emitter (E)', descAr: 'الطرف المرجعي للدائرة.', descFr: 'Borne de référence.', descEn: 'Reference terminal.', color: '#10B981' },
      { num: 2, symbol: 'B', nameAr: 'القاعدة (Base)', nameFr: 'Base (B)', nameEn: 'Base (B)', descAr: 'مدخل إشارة التضخيم أو التبديل.', descFr: 'Entrée du signal.', descEn: 'Signal / switching input.', color: '#F59E0B' },
      { num: 3, symbol: 'C', nameAr: 'المجمع (Collector)', nameFr: 'Collecteur (C)', nameEn: 'Collector (C)', descAr: 'طرف الخرج أو الحمل.', descFr: 'Sortie / Charge.', descEn: 'Output / load terminal.', color: '#0EA5E9' },
    ],
  },
  {
    id: 'tip122',
    partNumber: 'TIP122 / TIP31C',
    aliases: 'Darlington Power BJT TO220',
    category: 'bjt',
    pkg: 'TO-220',
    typeAr: 'ترانزستور قدرة / دارلنغتون NPN',
    typeFr: 'Transistor de puissance Darlington',
    typeEn: 'Power NPN / Darlington Transistor',
    specs: '100V · 5A · TO-220',
    orientationAr: 'واجهة الكتابة للأمام والمشتت المعدني للخلف',
    orientationFr: 'Face imprimée devant, semelle métallique derrière',
    orientationEn: 'Front label facing you, metal heatsink tab at back',
    tabNoteAr: 'المشتت المعدني متصل داخلياً بالطرف 2 (Collector)',
    tabNoteFr: 'La semelle métallique est reliée à la broche 2 (Collecteur)',
    tabNoteEn: 'Metal heatsink tab is internally connected to Pin 2 (Collector)',
    pins: [
      { num: 1, symbol: 'B', nameAr: 'القاعدة (Base)', nameFr: 'Base (B)', nameEn: 'Base (B)', descAr: 'إشارة التحكم من المتحكم عبر مقاومة.', descFr: 'Commande via résistance.', descEn: 'Control signal input.', color: '#F59E0B' },
      { num: 2, symbol: 'C', nameAr: 'المجمع (Collector)', nameFr: 'Collecteur (C)', nameEn: 'Collector (C)', descAr: 'متصل بالسطح المعدني الخلفي + الحمل.', descFr: 'Relié à la semelle + charge.', descEn: 'Connected to Tab + load.', color: '#0EA5E9' },
      { num: 3, symbol: 'E', nameAr: 'الباعث (Emitter)', nameFr: 'Émetteur (E)', nameEn: 'Emitter (E)', descAr: 'يتصل بالأرضي (GND).', descFr: 'Relié à la masse (GND).', descEn: 'Connected to Ground.', color: '#10B981' },
    ],
  },
  {
    id: 'irfz44n',
    partNumber: 'IRFZ44N / IRF540N',
    aliases: 'MOSFET N-Channel Power',
    category: 'mosfet',
    pkg: 'TO-220',
    typeAr: 'موسفت قدرة قناة N (N-Channel MOSFET)',
    typeFr: 'MOSFET de puissance canal N',
    typeEn: 'N-Channel Power MOSFET',
    specs: '55V · 49A · 17.5mΩ · TO-220',
    orientationAr: 'واجهة الكتابة للأمام والمشتت المعدني للخلف',
    orientationFr: 'Face imprimée devant, semelle derrière',
    orientationEn: 'Printed face toward you, metal tab at back',
    tabNoteAr: 'المشتت المعدني متصل بـ Drain (الطرف 2) — اعزله عند التثبيت!',
    tabNoteFr: 'La semelle est reliée au Drain (broche 2) — à isoler sur radiateur !',
    tabNoteEn: 'Metal Tab is connected to Drain (Pin 2) — insulate on shared heatsinks!',
    warningAr: 'استخدم مقاومة خفض (10kΩ بين Gate و Source) لمنع التشغيل العشوائي!',
    warningFr: 'Ajoutez une résistance pull-down (10 kΩ entre G et S) !',
    warningEn: 'Add a 10kΩ pull-down resistor between Gate and Source to prevent floating!',
    pins: [
      { num: 1, symbol: 'G', nameAr: 'البوابة (Gate)', nameFr: 'Grille (Gate)', nameEn: 'Gate (G)', descAr: 'تحكم بالجهد (5V–10V لتشغيل كامل بدون تسخين).', descFr: 'Commande en tension (5V–10V).', descEn: 'Voltage control input (10V for full saturation).', color: '#F59E0B' },
      { num: 2, symbol: 'D', nameAr: 'المصرف (Drain)', nameFr: 'Drain (D)', nameEn: 'Drain (D)', descAr: 'يتصل بالطرف السالب للحمل (المحرك / الليدات) والمشتت.', descFr: 'Relié à la charge et à la semelle.', descEn: 'Connect to load low-side; shared with Tab.', color: '#0EA5E9' },
      { num: 3, symbol: 'S', nameAr: 'المنبع (Source)', nameFr: 'Source (S)', nameEn: 'Source (S)', descAr: 'يتصل بالأرضي (GND).', descFr: 'Relié à la masse (GND).', descEn: 'Connect to Ground (GND).', color: '#10B981' },
    ],
  },
  {
    id: '2n7000',
    partNumber: '2N7000 / BS170',
    aliases: 'MOSFET Small Signal TO92',
    category: 'mosfet',
    pkg: 'TO-92',
    typeAr: 'موسفت إشارة صغير قناة N',
    typeFr: 'MOSFET petit signal canal N',
    typeEn: 'Small-Signal N-Channel MOSFET',
    specs: '60V · 200mA · TO-92',
    orientationAr: 'النظر من الجهة الأمامية المسطحة المكتوب عليها',
    orientationFr: 'Vue de face (côté plat face à vous)',
    orientationEn: 'Front view (flat printed side facing you)',
    warningAr: 'انتبه: ترتيب 2N7000 هو (S-G-D) بينما BS170 غالباً (D-G-S)!',
    warningFr: 'Attention : 2N7000 = S-G-D alors que BS170 = D-G-S !',
    warningEn: 'Note: 2N7000 is S-G-D whereas BS170 is typically D-G-S!',
    pins: [
      { num: 1, symbol: 'S', nameAr: 'المنبع (Source)', nameFr: 'Source (S)', nameEn: 'Source (S)', descAr: 'يتصل بالأرضي (GND).', descFr: 'Relié à GND.', descEn: 'Connect to Ground.', color: '#10B981' },
      { num: 2, symbol: 'G', nameAr: 'البوابة (Gate)', nameFr: 'Grille (G)', nameEn: 'Gate (G)', descAr: 'مدخل التحكم بالجهد (مباشر من الأردوينو).', descFr: 'Commande logique (3.3V / 5V).', descEn: 'Logic-level voltage control input.', color: '#F59E0B' },
      { num: 3, symbol: 'D', nameAr: 'المصرف (Drain)', nameFr: 'Drain (D)', nameEn: 'Drain (D)', descAr: 'يتصل بالحمل الصغير.', descFr: 'Relié à la charge.', descEn: 'Connect to load.', color: '#0EA5E9' },
    ],
  },
  {
    id: 'lm7805',
    partNumber: 'LM7805 / 7809 / 7812',
    aliases: '78xx Voltage Regulator',
    category: 'regulator',
    pkg: 'TO-220',
    typeAr: 'منظم جهد خطي موجب ثابت',
    typeFr: 'Régulateur de tension positif fixe',
    typeEn: 'Fixed Positive Linear Voltage Regulator',
    specs: 'Vin ≤ 35V · Vout 5V/9V/12V · 1.5A',
    orientationAr: 'واجهة الكتابة للأمام والمشتت المعدني للخلف',
    orientationFr: 'Face imprimée devant, semelle derrière',
    orientationEn: 'Label facing you, metal tab at back',
    tabNoteAr: 'المشتت المعدني متصل بالأرضي GND (الطرف 2)',
    tabNoteFr: 'La semelle est reliée à la masse GND (broche 2)',
    tabNoteEn: 'Metal heatsink tab is connected to GND (Pin 2)',
    pins: [
      { num: 1, symbol: 'IN', nameAr: 'الدخل الموجب (Input)', nameFr: 'Entrée (IN)', nameEn: 'Input (+Vin)', descAr: 'جهد دخل أعلى من الخرج بـ 2V على الأقل (مثلاً 9V لـ 7805).', descFr: 'Tension d’entrée ≥ Vout + 2V.', descEn: 'Unregulated DC input (at least Vout + 2V).', color: '#EF4444' },
      { num: 2, symbol: 'GND', nameAr: 'الأرضي (Ground)', nameFr: 'Masse (GND)', nameEn: 'Ground (GND)', descAr: 'المرجع السالب المشترك للدخل والخرج والمشتت.', descFr: 'Masse commune et semelle.', descEn: 'Common ground shared with heatsink tab.', color: '#10B981' },
      { num: 3, symbol: 'OUT', nameAr: 'الخرج المنظم (Output)', nameFr: 'Sortie régulée (OUT)', nameEn: 'Regulated Output', descAr: 'خرج ثابت نقي (5V أو 12V) — يوضع معه مكثف 100nF.', descFr: 'Tension fixe stabilisée (+ condensateur 100nF).', descEn: 'Stabilized output rail (+ 100nF decoupling cap).', color: '#0EA5E9' },
    ],
  },
  {
    id: 'lm7905',
    partNumber: 'LM7905 / 7912',
    aliases: '79xx Negative Regulator',
    category: 'regulator',
    pkg: 'TO-220',
    typeAr: 'منظم جهد سالب ثابت (-5V / -12V)',
    typeFr: 'Régulateur de tension négatif fixe',
    typeEn: 'Fixed Negative Linear Voltage Regulator',
    specs: 'Vout -5V / -12V · 1.5A · TO-220',
    orientationAr: 'واجهة الكتابة للأمام والمشتت المعدني للخلف',
    orientationFr: 'Face imprimée devant, semelle derrière',
    orientationEn: 'Label facing you, metal tab at back',
    tabNoteAr: 'انتبه: المشتت المعدني متصل بالدخل السالب IN (الطرف 2) وليس GND!',
    tabNoteFr: 'Attention : la semelle est reliée à l’entrée négative IN (broche 2) !',
    tabNoteEn: 'Warning: Metal tab is connected to negative INPUT (Pin 2), NOT GND!',
    warningAr: 'تختلف أطرافه عن 7805: الطرف 1 هو GND والطرف 2 هو الدخل السالب!',
    warningFr: 'Brochage différent du 7805 : 1 = GND et 2 = Entrée négative !',
    warningEn: 'Different pinout from 7805: Pin 1 is GND and Pin 2 is Negative Input!',
    pins: [
      { num: 1, symbol: 'GND', nameAr: 'الأرضي المرجعي (GND)', nameFr: 'Masse (GND)', nameEn: 'Ground (GND)', descAr: 'نقطة الصفر المرجعية.', descFr: 'Référence 0 V.', descEn: '0V ground reference.', color: '#10B981' },
      { num: 2, symbol: 'IN', nameAr: 'الدخل السالب (-Vin)', nameFr: 'Entrée négative (IN)', nameEn: 'Negative Input', descAr: 'متصل بالجهد السالب غير المنظم والمشتت.', descFr: 'Entrée négative et semelle.', descEn: 'Unregulated negative input & tab.', color: '#EF4444' },
      { num: 3, symbol: 'OUT', nameAr: 'الخرج السالب (-Vout)', nameFr: 'Sortie négative (OUT)', nameEn: 'Negative Output', descAr: 'خرج سالب مستقر (-5V أو -12V).', descFr: 'Sortie négative régulée.', descEn: 'Regulated negative output.', color: '#0EA5E9' },
    ],
  },
  {
    id: 'lm317',
    partNumber: 'LM317',
    aliases: 'Adjustable Regulator TO220',
    category: 'regulator',
    pkg: 'TO-220',
    typeAr: 'منظم جهد متغير (1.25V إلى 37V)',
    typeFr: 'Régulateur de tension ajustable',
    typeEn: 'Adjustable Positive Voltage Regulator',
    specs: '1.25V–37V · 1.5A · TO-220',
    orientationAr: 'واجهة الكتابة للأمام والمشتت المعدني للخلف',
    orientationFr: 'Face imprimée devant, semelle derrière',
    orientationEn: 'Label facing you, metal tab at back',
    tabNoteAr: 'المشتت المعدني متصل بـ OUT (الطرف 2)!',
    tabNoteFr: 'La semelle métallique est reliée à OUT (broche 2) !',
    tabNoteEn: 'Metal heatsink tab is connected to OUTPUT (Pin 2)!',
    warningAr: 'ترتيب الأرجل مختلف عن 7805: (1: ADJ | 2: OUT | 3: IN)',
    warningFr: 'Brochage différent du 7805 : 1=ADJ, 2=OUT, 3=IN !',
    warningEn: 'Pinout differs from 7805: 1=ADJ, 2=OUT, 3=IN!',
    pins: [
      { num: 1, symbol: 'ADJ', nameAr: 'الضبط (Adjust)', nameFr: 'Réglage (ADJ)', nameEn: 'Adjust (ADJ)', descAr: 'يتصل بمجزئ مقاومات لتحديد قيمة جهد الخرج.', descFr: 'Pont diviseur pour régler Vout.', descEn: 'Connected to resistor divider to set Vout.', color: '#F59E0B' },
      { num: 2, symbol: 'OUT', nameAr: 'الخرج (Output)', nameFr: 'Sortie (OUT)', nameEn: 'Output (OUT)', descAr: 'الجهد المنظم المتغير + متصل بالمشتت المعدني.', descFr: 'Sortie régulée + semelle.', descEn: 'Regulated output + heatsink tab.', color: '#0EA5E9' },
      { num: 3, symbol: 'IN', nameAr: 'الدخل (Input)', nameFr: 'Entrée (IN)', nameEn: 'Input (IN)', descAr: 'جهد الدخل المستمر غير المنظم.', descFr: 'Tension d’entrée DC.', descEn: 'Unregulated DC input.', color: '#EF4444' },
    ],
  },
  {
    id: 'ams1117',
    partNumber: 'AMS1117-3.3 / 5.0',
    aliases: 'LM1117 SOT223 LDO SMD',
    category: 'regulator',
    pkg: 'SOT-223',
    typeAr: 'منظم جهد سطحي LDO (3.3V / 5V)',
    typeFr: 'Régulateur LDO CMS (3.3V / 5V)',
    typeEn: 'LDO Surface-Mount Regulator',
    specs: 'Vin ≤ 15V · Vout 3.3V/5V · 1A',
    orientationAr: 'منظر علوي — الأرجل الثلاث في الأسفل والطرف العريض في الأعلى',
    orientationFr: 'Vue de dessus — 3 broches en bas, large patte en haut',
    orientationEn: 'Top view — 3 leads at bottom, wide tab at top',
    tabNoteAr: 'الطرف العريض العلوي متصل دائماً بالرجل الوسطى (2: OUT)',
    tabNoteFr: 'La large patte supérieure est reliée à la broche centrale (OUT)',
    tabNoteEn: 'Top wide tab is always connected to center Pin 2 (OUT)',
    pins: [
      { num: 1, symbol: 'GND', nameAr: 'الأرضي / الضبط', nameFr: 'GND / ADJ', nameEn: 'GND / ADJ', descAr: 'يتصل بالأرضي في النسخ الثابتة (3.3V / 5V).', descFr: 'Relié à la masse sur versions fixes.', descEn: 'Ground on fixed 3.3V / 5.0V versions.', color: '#10B981' },
      { num: 2, symbol: 'OUT', nameAr: 'الخرج المنظم (OUT)', nameFr: 'Sortie (OUT)', nameEn: 'Output (OUT)', descAr: 'خرج 3.3V مستقر لتغذية ESP32 والحساسات + الطرف العلوي.', descFr: 'Sortie stabilisée + patte supérieure.', descEn: 'Stabilized 3.3V/5V output + top tab.', color: '#0EA5E9' },
      { num: 3, symbol: 'IN', nameAr: 'الدخل (VIN)', nameFr: 'Entrée (VIN)', nameEn: 'Input (VIN)', descAr: 'تغذية الدخل (مثلاً 5V من USB).', descFr: 'Entrée d’alimentation (ex : 5V USB).', descEn: 'Input supply voltage (e.g. 5V USB).', color: '#EF4444' },
    ],
  },
  {
    id: 'ne555',
    partNumber: 'NE555 / LM555',
    aliases: 'Timer IC DIP8',
    category: 'ic_sensor',
    pkg: 'DIP-8',
    typeAr: 'دائرة المؤقت الشهيرة (Timer IC)',
    typeFr: 'Circuit temporisateur NE555',
    typeEn: 'Precision Timer IC',
    specs: '4.5V–16V · 200mA Out · DIP-8',
    orientationAr: 'منظر علوي — الثلمة (Notch) للأعلى والنقطة تشير للطرف 1',
    orientationFr: 'Vue de dessus — Encoche en haut, point sur la broche 1',
    orientationEn: 'Top view — Notch at top, dot marks Pin 1 (counter-clockwise)',
    pins: [
      { num: 1, symbol: 'GND', nameAr: 'الأرضي (GND)', nameFr: 'Masse (GND)', nameEn: 'Ground', descAr: 'القطب السالب للتغذية.', descFr: 'Borne négative.', descEn: 'Negative supply rail.', color: '#10B981' },
      { num: 2, symbol: 'TRIG', nameAr: 'القدح (Trigger)', nameFr: 'Déclenchement', nameEn: 'Trigger', descAr: 'يبدأ النبضة عند انخفاض جهده عن ⅓ VCC.', descFr: 'Déclenche sous 1/3 VCC.', descEn: 'Triggers output HIGH when < 1/3 VCC.', color: '#F59E0B' },
      { num: 3, symbol: 'OUT', nameAr: 'الخرج (Output)', nameFr: 'Sortie (OUT)', nameEn: 'Output', descAr: 'مخرج النبضة المربعة (حتى 200mA).', descFr: 'Sortie du signal carré.', descEn: 'Square wave / pulse output.', color: '#0EA5E9' },
      { num: 4, symbol: 'RST', nameAr: 'إعادة الضبط (Reset)', nameFr: 'Reset (RST)', nameEn: 'Reset', descAr: 'يربط بـ VCC في التشغيل الطبيعي (فعال بالمنخفض).', descFr: 'Relié à VCC en marche normale.', descEn: 'Tie to VCC for normal operation (active LOW).', color: '#8B5CF6' },
      { num: 5, symbol: 'CTRL', nameAr: 'جهد التحكم (Control)', nameFr: 'Contrôle', nameEn: 'Control Voltage', descAr: 'يوضع معه مكثف 10nF للأرضي لتثبيت العتبة.', descFr: 'Condensateur 10 nF vers GND.', descEn: 'Bypass to GND via 10nF capacitor.', color: '#64748B' },
      { num: 6, symbol: 'THR', nameAr: 'العتبة (Threshold)', nameFr: 'Seuil (Threshold)', nameEn: 'Threshold', descAr: 'ينهي النبضة عند وصول الجهد إلى ⅔ VCC.', descFr: 'Coupe la sortie à 2/3 VCC.', descEn: 'Resets output LOW when ≥ 2/3 VCC.', color: '#EC4899' },
      { num: 7, symbol: 'DIS', nameAr: 'التفريغ (Discharge)', nameFr: 'Décharge', nameEn: 'Discharge', descAr: 'يفرغ مكثف التوقيت في كل دورة.', descFr: 'Décharge le condensateur RC.', descEn: 'Discharges timing capacitor.', color: '#14B8A6' },
      { num: 8, symbol: 'VCC', nameAr: 'التغذية الموجبة (VCC)', nameFr: 'Alimentation +VCC', nameEn: 'Supply +VCC', descAr: 'الجهد الموجب (4.5V إلى 15V).', descFr: 'Tension positive (4,5V–15V).', descEn: 'Positive supply (4.5V–15V).', color: '#EF4444' },
    ],
  },
  {
    id: 'lm358',
    partNumber: 'LM358 / TL072',
    aliases: 'Dual OpAmp DIP8',
    category: 'ic_sensor',
    pkg: 'DIP-8',
    typeAr: 'مكبر عمليات مزدوج (Dual Op-Amp)',
    typeFr: 'Double amplificateur opérationnel',
    typeEn: 'Dual Operational Amplifier',
    specs: '3V–32V · 2 Channels · DIP-8',
    orientationAr: 'منظر علوي — الثلمة للأعلى والنقطة تشير للطرف 1',
    orientationFr: 'Vue de dessus — Encoche en haut',
    orientationEn: 'Top view — Notch at top',
    pins: [
      { num: 1, symbol: 'OUT A', nameAr: 'خرج المكبر A', nameFr: 'Sortie A', nameEn: 'Output A', descAr: 'مخرج القناة الأولى.', descFr: 'Sortie canal A.', descEn: 'Channel A output.', color: '#0EA5E9' },
      { num: 2, symbol: 'IN- A', nameAr: 'المدخل العاكس A', nameFr: 'Entrée - A', nameEn: 'Inverting - A', descAr: 'مدخل التغذية العكسية.', descFr: 'Entrée inverseuse A.', descEn: 'Inverting input A.', color: '#F59E0B' },
      { num: 3, symbol: 'IN+ A', nameAr: 'المدخل غير العاكس A', nameFr: 'Entrée + A', nameEn: 'Non-Inv + A', descAr: 'المدخل الموجب للقناة A.', descFr: 'Entrée non-inverseuse A.', descEn: 'Non-inverting input A.', color: '#14B8A6' },
      { num: 4, symbol: 'GND', nameAr: 'الأرضي / V-', nameFr: 'GND / V-', nameEn: 'GND / V-', descAr: 'التغذية السالبة أو الأرضي.', descFr: 'Masse ou rail négatif.', descEn: 'Ground or negative rail.', color: '#10B981' },
      { num: 5, symbol: 'IN+ B', nameAr: 'المدخل غير العاكس B', nameFr: 'Entrée + B', nameEn: 'Non-Inv + B', descAr: 'المدخل الموجب للقناة B.', descFr: 'Entrée non-inverseuse B.', descEn: 'Non-inverting input B.', color: '#14B8A6' },
      { num: 6, symbol: 'IN- B', nameAr: 'المدخل العاكس B', nameFr: 'Entrée - B', nameEn: 'Inverting - B', descAr: 'المدخل السالب للقناة B.', descFr: 'Entrée inverseuse B.', descEn: 'Inverting input B.', color: '#F59E0B' },
      { num: 7, symbol: 'OUT B', nameAr: 'خرج المكبر B', nameFr: 'Sortie B', nameEn: 'Output B', descAr: 'مخرج القناة الثانية.', descFr: 'Sortie canal B.', descEn: 'Channel B output.', color: '#0EA5E9' },
      { num: 8, symbol: 'VCC', nameAr: 'التغذية الموجبة', nameFr: 'Alimentation +VCC', nameEn: 'Supply +VCC', descAr: 'القطب الموجب للتغذية.', descFr: 'Alimentation positive.', descEn: 'Positive supply rail.', color: '#EF4444' },
    ],
  },
  {
    id: 'pc817',
    partNumber: 'PC817 / EL817',
    aliases: 'Optocoupler DIP4',
    category: 'ic_sensor',
    pkg: 'DIP-4',
    typeAr: 'عازل ضوئي (Optocoupler)',
    typeFr: 'Optocoupleur d’isolation',
    typeEn: 'Phototransistor Optocoupler',
    specs: '5kV Isolation · 50mA · DIP-4',
    orientationAr: 'منظر علوي — النقطة تشير إلى الطرف 1 (أنود الليد الداخلي)',
    orientationFr: 'Vue de dessus — Point sur la broche 1 (Anode LED)',
    orientationEn: 'Top view — Dot marks Pin 1 (Internal LED Anode)',
    pins: [
      { num: 1, symbol: 'A (+)', nameAr: 'أنود الليد (+)', nameFr: 'Anode LED (+)', nameEn: 'LED Anode (+)', descAr: 'مدخل إشارة الدخل الموجب عبر مقاومة.', descFr: 'Entrée positive via résistance.', descEn: 'Input LED positive terminal via resistor.', color: '#EF4444' },
      { num: 2, symbol: 'K (-)', nameAr: 'كاثود الليد (-)', nameFr: 'Cathode LED (-)', nameEn: 'LED Cathode (-)', descAr: 'الطرف السالب لليد الداخلي.', descFr: 'Borne négative LED.', descEn: 'Input LED negative terminal.', color: '#10B981' },
      { num: 3, symbol: 'E', nameAr: 'باعث الترانزستور (E)', nameFr: 'Émetteur (E)', nameEn: 'Emitter (E)', descAr: 'يتصل بالأرضي في جهة الخرج المعزولة.', descFr: 'Masse côté sortie isolée.', descEn: 'Isolated output side ground/emitter.', color: '#F59E0B' },
      { num: 4, symbol: 'C', nameAr: 'مجمع الترانزستور (C)', nameFr: 'Collecteur (C)', nameEn: 'Collector (C)', descAr: 'طرف الخرج المعزول ضوئياً.', descFr: 'Sortie isolée.', descEn: 'Optically isolated collector output.', color: '#0EA5E9' },
    ],
  },
  {
    id: 'lm35',
    partNumber: 'LM35',
    aliases: 'Temperature Sensor TO92',
    category: 'ic_sensor',
    pkg: 'TO-92',
    typeAr: 'حساس حرارة تناظري دقيق (10mV/°C)',
    typeFr: 'Capteur de température linéaire',
    typeEn: 'Precision Analog Temperature Sensor',
    specs: '4V–30V · 10mV/°C · TO-92',
    orientationAr: 'النظر من الجهة الأمامية المسطحة المكتوب عليها (الأرجل للأسفل)',
    orientationFr: 'Vue de face (côté plat face à vous)',
    orientationEn: 'Front view (flat printed side facing you)',
    warningAr: 'عكس القطبية يتلف الحساس أو يسخنه بشدة فوراً!',
    warningFr: 'L’inversion de polarité peut détruire le capteur immédiatement !',
    warningEn: 'Reverse polarity will overheat or permanently damage the sensor!',
    pins: [
      { num: 1, symbol: '+Vs', nameAr: 'التغذية (+Vs)', nameFr: 'Alimentation (+Vs)', nameEn: 'Supply (+Vs)', descAr: 'تغذية من 4V إلى 20V (عادة 5V).', descFr: 'Alimentation 5V.', descEn: '4V to 20V supply (typically 5V).', color: '#EF4444' },
      { num: 2, symbol: 'Vout', nameAr: 'خرج الجهد (Vout)', nameFr: 'Sortie (Vout)', nameEn: 'Analog Out', descAr: 'يعطي 10mV لكل درجة مئوية (25°C = 250mV).', descFr: '10 mV par °C (25°C = 250 mV).', descEn: 'Outputs 10mV per °C (25°C = 0.25V).', color: '#0EA5E9' },
      { num: 3, symbol: 'GND', nameAr: 'الأرضي (GND)', nameFr: 'Masse (GND)', nameEn: 'Ground (GND)', descAr: 'الطرف السالب المشترك.', descFr: 'Masse commune.', descEn: 'Common ground.', color: '#10B981' },
    ],
  },
];

interface PackageSvgProps {
  part: PinoutPart;
  activePin: number | null;
  onSelectPin: (num: number) => void;
}

const PackagePinoutSvg: React.FC<PackageSvgProps> = ({ part, activePin, onSelectPin }) => {
  if (part.pkg === 'TO-92') {
    const pinXs = [78, 120, 162];
    return (
      <svg viewBox="0 0 240 190" className="w-full max-w-[260px] h-48 mx-auto" direction="ltr">
        {/* Flat front plastic body */}
        <path
          d="M60 28 C60 16, 180 16, 180 28 L180 96 L60 96 Z"
          fill="#1E293B"
          stroke="#475569"
          strokeWidth="2.5"
        />
        <rect x="64" y="34" width="112" height="58" rx="4" fill="#0F172A" opacity="0.65" />
        <text x="120" y="60" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="monospace">
          {part.partNumber.split(' ')[0]}
        </text>
        <text x="120" y="78" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
          TO-92 FRONT
        </text>

        {part.pins.map((pin, idx) => {
          const x = pinXs[idx];
          const isHot = activePin === pin.num;
          return (
            <g
              key={pin.num}
              onClick={() => onSelectPin(pin.num)}
              onMouseEnter={() => onSelectPin(pin.num)}
              className="cursor-pointer"
            >
              <line
                x1={x}
                y1="96"
                x2={x}
                y2="146"
                stroke={isHot ? pin.color : '#CBD5E1'}
                strokeWidth={isHot ? 7 : 5}
                strokeLinecap="round"
              />
              <circle cx={x} cy="164" r="16" fill={isHot ? pin.color : '#1E293B'} stroke={pin.color} strokeWidth="2" />
              <text x={x} y="162" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800" fontFamily="monospace">
                {pin.symbol}
              </text>
              <text x={x} y="174" textAnchor="middle" fill="#CBD5E1" fontSize="8.5" fontFamily="monospace">
                P{pin.num}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (part.pkg === 'TO-220') {
    const pinXs = [78, 120, 162];
    return (
      <svg viewBox="0 0 240 205" className="w-full max-w-[260px] h-52 mx-auto" direction="ltr">
        {/* Metallic heatsink tab */}
        <rect x="66" y="10" width="108" height="44" rx="4" fill="#94A3B8" stroke="#CBD5E1" strokeWidth="1.5" />
        <circle cx="120" cy="30" r="11" fill="#0F172A" stroke="#64748B" strokeWidth="2" />
        <text x="120" y="18" textAnchor="middle" fill="#0F172A" fontSize="8" fontWeight="800" fontFamily="monospace">
          TAB = P2 ({part.pins[1].symbol})
        </text>
        {/* Epoxy Package Body */}
        <rect x="62" y="50" width="116" height="62" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="2" />
        <text x="120" y="79" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="monospace">
          {part.partNumber.split(' ')[0]}
        </text>
        <text x="120" y="97" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
          TO-220
        </text>

        {part.pins.map((pin, idx) => {
          const x = pinXs[idx];
          const isHot = activePin === pin.num;
          return (
            <g
              key={pin.num}
              onClick={() => onSelectPin(pin.num)}
              onMouseEnter={() => onSelectPin(pin.num)}
              className="cursor-pointer"
            >
              <rect x={x - 3} y="112" width="6" height="42" rx="2" fill={isHot ? pin.color : '#CBD5E1'} />
              <circle cx={x} cy="174" r="17" fill={isHot ? pin.color : '#1E293B'} stroke={pin.color} strokeWidth="2" />
              <text x={x} y="172" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800" fontFamily="monospace">
                {pin.symbol}
              </text>
              <text x={x} y="184" textAnchor="middle" fill="#CBD5E1" fontSize="8.5" fontFamily="monospace">
                P{pin.num}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  if (part.pkg === 'SOT-223') {
    const pinXs = [74, 120, 166];
    return (
      <svg viewBox="0 0 240 190" className="w-full max-w-[260px] h-48 mx-auto" direction="ltr">
        {/* Top wide thermal tab (Pin 2 OUT) */}
        <rect x="86" y="20" width="68" height="28" rx="3" fill="#CBD5E1" />
        <text x="120" y="38" textAnchor="middle" fill="#0F172A" fontSize="9.5" fontWeight="800" fontFamily="monospace">
          TAB = {part.pins[1].symbol}
        </text>
        <rect x="54" y="46" width="132" height="62" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="2" />
        <text x="120" y="78" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="monospace">
          AMS1117
        </text>
        <text x="120" y="95" textAnchor="middle" fill="#94A3B8" fontSize="9.5" fontFamily="monospace">
          SOT-223
        </text>

        {part.pins.map((pin, idx) => {
          const x = pinXs[idx];
          const isHot = activePin === pin.num;
          return (
            <g
              key={pin.num}
              onClick={() => onSelectPin(pin.num)}
              onMouseEnter={() => onSelectPin(pin.num)}
              className="cursor-pointer"
            >
              <rect x={x - 5} y="108" width="10" height="32" rx="2" fill={isHot ? pin.color : '#CBD5E1'} />
              <circle cx={x} cy="160" r="16" fill={isHot ? pin.color : '#1E293B'} stroke={pin.color} strokeWidth="2" />
              <text x={x} y="158" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="800" fontFamily="monospace">
                {pin.symbol}
              </text>
              <text x={x} y="170" textAnchor="middle" fill="#CBD5E1" fontSize="8.5" fontFamily="monospace">
                P{pin.num}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }

  // DIP-8 or DIP-4 top view
  const half = part.pins.length / 2;
  const rowStartY = half === 2 ? 68 : 48;
  const rowGap = half === 2 ? 56 : 36;
  const boxHeight = half === 2 ? 110 : 158;

  return (
    <svg viewBox="0 0 280 215" className="w-full max-w-[290px] h-52 mx-auto" direction="ltr">
      {/* IC Body */}
      <rect x="92" y="26" width="96" height={boxHeight} rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2.5" />
      {/* Notch */}
      <path d="M126 26 A14 14 0 0 0 154 26" fill="#0F172A" stroke="#475569" strokeWidth="2" />
      {/* Pin 1 dot */}
      <circle cx="106" cy="44" r="4.5" fill="#F59E0B" />
      <text x="140" y="106" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="monospace">
        {part.partNumber.split(' ')[0]}
      </text>
      <text x="140" y="124" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">
        {part.pkg}
      </text>

      {part.pins.map((pin) => {
        const isLeft = pin.num <= half;
        const rowIdx = isLeft ? pin.num - 1 : part.pins.length - pin.num;
        const y = rowStartY + rowIdx * rowGap;
        const isHot = activePin === pin.num;
        const legX = isLeft ? 72 : 188;
        const badgeX = isLeft ? 36 : 244;

        return (
          <g
            key={pin.num}
            onClick={() => onSelectPin(pin.num)}
            onMouseEnter={() => onSelectPin(pin.num)}
            className="cursor-pointer"
          >
            <rect x={legX} y={y - 6} width="20" height="12" rx="2" fill={isHot ? pin.color : '#CBD5E1'} />
            <rect
              x={badgeX - 30}
              y={y - 12}
              width="60"
              height="24"
              rx="6"
              fill={isHot ? pin.color : '#0F172A'}
              stroke={pin.color}
              strokeWidth="1.5"
            />
            <text x={badgeX} y={y + 4} textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="800" fontFamily="monospace">
              {pin.num}:{pin.symbol}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const PinoutGuideView: React.FC = () => {
  const { pick } = useLanguage();
  const [category, setCategory] = useState<PinoutCategory>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>('bc547');
  const [activePin, setActivePin] = useState<number | null>(1);

  const categories: { id: PinoutCategory; label: string }[] = [
    { id: 'all', label: pick('الكل', 'Tous', 'All') },
    { id: 'bjt', label: pick('ترانزستورات BJT', 'Transistors BJT', 'BJT Transistors') },
    { id: 'mosfet', label: pick('موسفت MOSFET', 'MOSFET', 'MOSFETs') },
    { id: 'regulator', label: pick('منظمات الجهد', 'Régulateurs', 'Regulators') },
    { id: 'ic_sensor', label: pick('دوائر وحساسات', 'CI & Capteurs', 'ICs & Sensors') },
  ];

  const filteredParts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PINOUT_PARTS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      return (
        p.partNumber.toLowerCase().includes(q) ||
        p.aliases.toLowerCase().includes(q) ||
        p.typeAr.toLowerCase().includes(q) ||
        p.typeEn.toLowerCase().includes(q) ||
        p.pkg.toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  const selectedPart = useMemo(
    () => filteredParts.find((p) => p.id === selectedId) || filteredParts[0] || PINOUT_PARTS[0],
    [filteredParts, selectedId]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {pick('دليل أطراف العناصر الإلكترونية (Pinout)', 'Guide de brochage (Pinout)', 'Component Pinout Visual Reference')}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {pick(
            'مرجع سريع وتفاعلي لمعرفة ترتيب الأرجل لأشهر الترانزستورات والموسفت ومنظمات الجهد والدوائر المتكاملة.',
            'Référence visuelle rapide pour identifier le brochage des transistors, MOSFET, régulateurs et circuits intégrés.',
            'Quick visual pinout reference for popular BJT transistors, MOSFETs, voltage regulators, and ICs.'
          )}
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={pick('ابحث برقم العنصر (مثلاً 7805، BC547)...', 'Rechercher (7805, BC547, IRFZ44N)...', 'Search part (7805, BC547, NE555)...')}
            className="w-full min-h-[42px] rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] ps-10 pe-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#059669] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-200/70 dark:bg-[#0F172A] p-1 border border-[#E2E8F0] dark:border-[#334155]">
          {categories.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Part Selection Pills */}
      <div className="flex flex-wrap gap-2">
        {filteredParts.map((part) => {
          const active = selectedPart.id === part.id;
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => {
                setSelectedId(part.id);
                setActivePin(1);
              }}
              className={`min-h-[40px] rounded-xl px-3.5 py-2 text-xs font-bold border transition-colors ${
                active
                  ? 'border-[#059669] bg-[#059669] text-white shadow-sm'
                  : 'border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-200 hover:border-[#059669]'
              }`}
              dir="ltr"
            >
              <span>{part.partNumber.split(' ')[0]}</span>
              <span className="ms-1.5 opacity-80 font-mono-num text-[10px]">({part.pkg})</span>
            </button>
          );
        })}
      </div>

      {/* Two-Zone Visual Pinout Inspector */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        {/* Left: SVG Package Diagram */}
        <section className="lg:col-span-5 rounded-2xl border border-[#334155] bg-[#1E293B] text-white p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-extrabold font-mono-num text-white" dir="ltr">
                {selectedPart.partNumber}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {pick(selectedPart.typeAr, selectedPart.typeFr, selectedPart.typeEn)}
              </p>
            </div>
            <span className="font-mono-num text-xs font-bold text-emerald-400" dir="ltr">
              {selectedPart.pkg}
            </span>
          </div>

          <div className="rounded-xl bg-[#0F172A] border border-[#334155] p-4 flex flex-col items-center justify-center">
            <PackagePinoutSvg part={selectedPart} activePin={activePin} onSelectPin={setActivePin} />
            <p className="mt-2 text-[11px] text-center text-slate-400 leading-relaxed">
              {pick(selectedPart.orientationAr, selectedPart.orientationFr, selectedPart.orientationEn)}
            </p>
          </div>

          <div className="text-xs font-mono-num text-slate-300 text-center" dir="ltr">
            {selectedPart.specs}
          </div>
        </section>

        {/* Right: Pin Functions & Safety Warnings */}
        <section className="lg:col-span-7 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {pick('وظيفة كل طرف (اضغط أو مرر لتحديد الطرف)', 'Fonction de chaque broche', 'Pin Functions (Tap a pin to highlight)')}
              </h4>
            </div>

            <div className="space-y-2">
              {selectedPart.pins.map((pin) => {
                const isHot = activePin === pin.num;
                return (
                  <button
                    key={pin.num}
                    type="button"
                    onClick={() => setActivePin(pin.num)}
                    onMouseEnter={() => setActivePin(pin.num)}
                    className={`w-full flex items-start gap-3 rounded-xl border p-3 text-start transition-colors ${
                      isHot
                        ? 'border-[#059669] bg-emerald-50/70 dark:bg-[#0F172A] ring-1 ring-[#059669]/30'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]/60 hover:border-[#059669]'
                    }`}
                  >
                    <span
                      className="inline-flex h-8 min-w-[3.25rem] items-center justify-center rounded-lg px-2 font-mono-num text-xs font-extrabold text-white shrink-0"
                      style={{ backgroundColor: pin.color }}
                      dir="ltr"
                    >
                      {pin.num}: {pin.symbol}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {pick(pin.nameAr, pin.nameFr, pin.nameEn)}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {pick(pin.descAr, pin.descFr, pin.descEn)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {(selectedPart.tabNoteAr || selectedPart.warningAr) && (
            <div className="space-y-2 pt-3 border-t border-[#E2E8F0] dark:border-[#334155]">
              {selectedPart.tabNoteAr && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 px-3.5 py-2.5 text-xs font-semibold text-[#059669] dark:text-emerald-300">
                  {pick(selectedPart.tabNoteAr, selectedPart.tabNoteFr || selectedPart.tabNoteAr, selectedPart.tabNoteEn || selectedPart.tabNoteAr)}
                </div>
              )}
              {selectedPart.warningAr && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3.5 py-2.5 text-xs font-semibold text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-[#D97706] dark:text-amber-400 mt-0.5" />
                  <span>{pick(selectedPart.warningAr, selectedPart.warningFr || selectedPart.warningAr, selectedPart.warningEn || selectedPart.warningAr)}</span>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
