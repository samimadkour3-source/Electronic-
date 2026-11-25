import React, { useMemo, useState } from 'react';
import {
  Cpu,
  Eye,
  EyeOff,
  Layers,
  Maximize2,
  Minimize2,
  Ruler,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

type LayerId =
  | 'silkscreen'
  | 'soldermask_top'
  | 'copper_top'
  | 'prepreg_top'
  | 'inner_gnd'
  | 'core_fr4'
  | 'inner_pwr'
  | 'copper_bot'
  | 'soldermask_bot';

type BoardHotspotId =
  | 'ic_soic'
  | 'smd_resistor'
  | 'smd_cap'
  | 'sot23'
  | 'pwr_trace'
  | 'sig_trace'
  | 'via_hole'
  | 'gnd_pour';

type SmdPackageId = '0402' | '0603' | '0805' | '1206' | 'sot23' | 'soic8';

interface PcbLayerMeta {
  id: LayerId;
  fourLayerOnly?: boolean;
  color: string;
  stroke: string;
  thickness: string;
  materialAr: string;
  materialFr: string;
  materialEn: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  descAr: string;
  descFr: string;
  descEn: string;
  tipAr: string;
  tipFr: string;
  tipEn: string;
}

const PCB_LAYERS: PcbLayerMeta[] = [
  {
    id: 'silkscreen',
    color: '#f8fafc',
    stroke: '#cbd5e1',
    thickness: '0.02 mm',
    materialAr: 'حبر إيبوكسي أبيض مقاوم للحرارة',
    materialFr: 'Encre époxy blanche thermique',
    materialEn: 'Heat-resistant white epoxy ink',
    titleAr: 'طبقة الطباعة والرموز (Silkscreen)',
    titleFr: 'Sérigraphie (Silkscreen)',
    titleEn: 'Top Silkscreen (Legend)',
    descAr: 'تُطبع فوق قناع اللحام لعرض أسماء العناصر (R1, C1, U1) وعلامات القطبية (+ / −) واتجاه الشرائح لتسهيل التجميع والصيانة.',
    descFr: 'Imprimée sur le vernis épargne pour indiquer les repères (R1, C1, U1), la polarité et l’orientation des puces.',
    descEn: 'Printed on top of the solder mask to show reference designators (R1, U1), polarity marks, and pin-1 dots.',
    tipAr: 'ابحث دائماً عن النقطة أو الشطفة على طبقة Silkscreen لتحديد الرجل رقم 1 في الشرائح.',
    tipFr: 'Repérez toujours le point ou l’encoche sur la sérigraphie pour identifier la broche 1.',
    tipEn: 'Always check the silkscreen dot or notch to locate Pin 1 on SMD ICs.',
  },
  {
    id: 'soldermask_top',
    color: '#059669',
    stroke: '#047857',
    thickness: '0.025 mm',
    materialAr: 'طلاء بوليمر أخضر عازل (LPI)',
    materialFr: 'Vernis épargne LPI émeraude',
    materialEn: 'Emerald LPI solder mask polymer',
    titleAr: 'قناع اللحام العلوي (Solder Mask)',
    titleFr: 'Vernis épargne supérieur',
    titleEn: 'Top Solder Mask',
    descAr: 'الطبقة الخضراء الشهيرة التي تغطي النحاس وتمنع تأكسده وتمنع تكوّن جسور القصدير (Short) بين الأرجل المتقاربة أثناء اللحام، مع ترك فتحات ذهبية فقط عند نقاط التوصيل.',
    descFr: 'Couche verte isolante qui protège le cuivre de l’oxydation et empêche les ponts de soudure entre broches proches.',
    descEn: 'Protective emerald coating insulating copper traces from oxidation and solder bridges while exposing only solder pads.',
    tipAr: 'عند إصلاح مسار مقطوع، يتم كشط هذه الطبقة الخضراء برفق للوصول إلى النحاس اللامع تحتها.',
    tipFr: 'Pour réparer une piste coupée, grattez délicatement ce vernis vert afin d’exposer le cuivre.',
    tipEn: 'To repair a broken trace, gently scrape away this green mask to expose bare copper underneath.',
  },
  {
    id: 'copper_top',
    color: '#D97706',
    stroke: '#b45309',
    thickness: '35 µm (1 oz)',
    materialAr: 'رقاقة نحاس نقي + طلاء ذهب ENIG على البادات',
    materialFr: 'Feuille de cuivre pur + finition or ENIG',
    materialEn: 'Pure etched copper foil + ENIG gold pads',
    titleAr: 'طبقة النحاس العلوية (Top Copper & Pads)',
    titleFr: 'Cuivre supérieur & Pastilles CMS',
    titleEn: 'Top Copper Traces & SMD Pads',
    descAr: 'شبكة المسارات النحاسية التي تنقل الإشارات والقدرة، وتحتوي على الوسادات (Pads) المسطحة التي تُلحم فوقها العناصر السطحية SMD دون ثقب اللوحة.',
    descFr: 'Réseau de pistes conductrices transportant signaux et énergie, incluant les pastilles plates où sont soudés les composants CMS.',
    descEn: 'Etched copper highways carrying signals and power, with flat landing pads where SMD components solder directly to the surface.',
    tipAr: 'المسارات العريضة مخصصة للتيار العالي (التغذية)، أما المسارات الرفيعة فللإشارات المنطقية.',
    tipFr: 'Les pistes larges transportent le courant d’alimentation ; les pistes fines acheminent les signaux.',
    tipEn: 'Wide traces carry high power current while narrow traces carry low-current logic signals.',
  },
  {
    id: 'prepreg_top',
    fourLayerOnly: true,
    color: '#cbd5e1',
    stroke: '#94a3b8',
    thickness: '0.18 mm',
    materialAr: 'ألياف زجاجية مشبعة بالإيبوكسي (Prepreg)',
    materialFr: 'Fibre de verre pré-imprégnée (Prepreg)',
    materialEn: 'Epoxy-impregnated fiberglass (Prepreg)',
    titleAr: 'عازل بين الطبقات (Prepreg Dielectric)',
    titleFr: 'Isolant Prepreg intermédiaire',
    titleEn: 'Top Prepreg Insulation',
    descAr: 'طبقة عازلة رقيقة جداً تُكبس بالحرارة لتلصق طبقة النحاس العلوية بطبقة الأرضي الداخلية وتضبط الممانعة الكهربائية للمسارات عالية السرعة.',
    descFr: 'Couche isolante mince pressée à chaud séparant le cuivre externe du plan de masse interne.',
    descEn: 'Thin heat-bonded dielectric insulating Top Copper from the inner Ground plane and controlling signal impedance.',
    tipAr: 'كلما قلّ سمك العازل بين الإشارة والأرضي، قلّ التداخل الكهرومغناطيسي EMI.',
    tipFr: 'Plus le diélectrique vers la masse est fin, plus les interférences EMI diminuent.',
    tipEn: 'Thinner prepreg spacing between signals and GND reduces electromagnetic interference.',
  },
  {
    id: 'inner_gnd',
    fourLayerOnly: true,
    color: '#b45309',
    stroke: '#92400e',
    thickness: '35 µm (1 oz)',
    materialAr: 'صفيحة نحاس متصلة (Ground Plane)',
    materialFr: 'Plan de masse cuivre continu (GND)',
    materialEn: 'Solid copper Ground Plane',
    titleAr: 'طبقة الأرضي الداخلية (Inner GND Plane)',
    titleFr: 'Plan de masse interne (GND)',
    titleEn: 'Inner Ground Plane (Layer 2)',
    descAr: 'صفيحة نحاس كاملة متصلة بالسالب (GND) تمنح كل إشارة مسار عودة قصيراً جداً، وتعمل كدرع واقٍ يمتص الضوضاء ويبدد حرارة المعالجات.',
    descFr: 'Feuille de cuivre quasi continue reliée à la masse offrant un retour de courant court et un blindage anti-bruit.',
    descEn: 'Dedicated continuous copper sheet tied to GND, providing low-impedance return paths, EMI shielding, and heat spreading.',
    tipAr: 'تُترك فتحات دائرية معزولة (Anti-pads) حول الثقوب غير المتصلة بالأرضي لمنع التماس.',
    tipFr: 'Des anneaux isolants (anti-pads) entourent les vias non reliés à la masse.',
    tipEn: 'Clearance rings (anti-pads) isolate non-GND vias passing through this solid copper plane.',
  },
  {
    id: 'core_fr4',
    color: '#d9c58d',
    stroke: '#b39c5d',
    thickness: '1.10 – 1.50 mm',
    materialAr: 'ألياف زجاجية FR-4 مثبطة للّهب',
    materialFr: 'Composite fibre de verre FR-4 ignifugé',
    materialEn: 'Flame-retardant FR-4 fiberglass core',
    titleAr: 'اللب العازل الصلب (FR-4 Core)',
    titleFr: 'Cœur isolant rigide (FR-4)',
    titleEn: 'FR-4 Fiberglass Core Substrate',
    descAr: 'العمود الفقري الميكانيكي للوحة الذي يمنحها الصلابة والعزل الكهربائي التام بين الطبقات النحاسية العلوية والسفلية، ويتحمل حرارة اللحام حتى 260°C.',
    descFr: 'Support mécanique rigide en fibre de verre et résine époxy assurant l’isolation électrique entre faces.',
    descEn: 'Rigid structural backbone giving mechanical strength and high-voltage dielectric isolation up to 260°C soldering.',
    tipAr: 'السمك القياسي الأكثر شيوعاً للوحات الإلكترونية هو 1.6 مم.',
    tipFr: 'L’épaisseur standard la plus courante d’un PCB est de 1,6 mm.',
    tipEn: 'Standard PCB finished thickness is 1.6 mm (about 63 mils).',
  },
  {
    id: 'inner_pwr',
    fourLayerOnly: true,
    color: '#d97706',
    stroke: '#b45309',
    thickness: '35 µm (1 oz)',
    materialAr: 'صفيحة نحاس مقسّمة للتغذية (+5V / +3.3V)',
    materialFr: 'Plan d’alimentation (+5V / +3.3V)',
    materialEn: 'Split copper Power Plane (+5V / +3.3V)',
    titleAr: 'طبقة التغذية الداخلية (Inner Power Plane)',
    titleFr: 'Plan d’alimentation interne',
    titleEn: 'Inner Power Plane (Layer 3)',
    descAr: 'توزع جهود التغذية المستقرة (+5V و+3.3V) أسفل اللوحة بالكامل لتصل إلى كل شريحة عبر ثقب Via قصير دون تزاحم المسارات على السطح.',
    descFr: 'Distribue les rails +5V et +3,3V sous toute la carte afin d’alimenter chaque puce via un simple via.',
    tipAr: 'وجود طبقة تغذية موازية لطبقة الأرضي يشكّل مكثف ترشيح طبيعي عالي التردد.',
    tipFr: 'Le couplage face à face entre les plans Power et GND forme une capacité de découplage naturelle.',
    tipEn: 'Facing Power and GND planes create natural high-frequency decoupling capacitance.',
    descEn: 'Distributes clean +5V and +3.3V power across the board so any chip taps power through a short vertical via.',
  },
  {
    id: 'copper_bot',
    color: '#c26805',
    stroke: '#9a3412',
    thickness: '35 µm (1 oz)',
    materialAr: 'رقاقة نحاس سفلية للمسارات المتقاطعة',
    materialFr: 'Cuivre inférieur pour routage croisé',
    materialEn: 'Bottom etched copper traces & ground pour',
    titleAr: 'طبقة النحاس السفلية (Bottom Copper)',
    titleFr: 'Cuivre inférieur (Bottom)',
    titleEn: 'Bottom Copper Layer',
    descAr: 'تسمح بعبور المسارات تحت المسارات العلوية دون تقاطع أو تلامس، عبر النزول من السطح إلى الأسفل باستخدام ثقوب التوصيل المعدنية (Vias).',
    descFr: 'Permet aux pistes de se croiser sans court-circuit en passant d’une face à l’autre via des trous métallisés (Vias).',
    descEn: 'Lets signals cross cleanly underneath top traces without shorting by jumping through copper-plated vias.',
    tipAr: 'تُفرَش المساحات الفارغة عادةً بالنحاس المتصل بالأرضي لتقليل استهلاك محلول الحفر وتحسين التبريد.',
    tipFr: 'Les zones vides sont remplies d’un plan de masse pour faciliter la gravure et refroidir la carte.',
    tipEn: 'Unused areas are flooded with a ground pour to improve thermal dissipation and shielding.',
  },
  {
    id: 'soldermask_bot',
    color: '#047857',
    stroke: '#065f46',
    thickness: '0.025 mm',
    materialAr: 'طلاء عازل سفلي يحمي المسارات',
    materialFr: 'Vernis épargne inférieur protecteur',
    materialEn: 'Bottom protective solder mask',
    titleAr: 'قناع اللحام السفلي (Bottom Solder Mask)',
    titleFr: 'Vernis épargne inférieur',
    titleEn: 'Bottom Solder Mask',
    descAr: 'يحمي الجهة السفلية للوحة من الرطوبة والخدوش والتماس العرضي عند وضع اللوحة على سطح معدني أو داخل العلبة.',
    descFr: 'Protège la face inférieure contre l’humidité, les rayures et les contacts accidentels sur châssis.',
    descEn: 'Shields bottom-side copper traces against humidity, scratches, and accidental metallic enclosure shorts.',
    tipAr: 'عند استخدام مكونات ثقب نافذ THT، تبقى حلقات نحاسية مكشوفة هنا للحام الأرجل من الأسفل.',
    tipFr: 'Les composants traversants (THT) conservent ici des pastilles ouvertes pour la soudure.',
    tipEn: 'Through-hole components leave annular pads exposed here for bottom-side soldering.',
  },
];

interface BoardHotspotMeta {
  id: BoardHotspotId;
  linkedLayer: LayerId;
  badge: string;
  titleAr: string;
  titleFr: string;
  titleEn: string;
  detailAr: string;
  detailFr: string;
  detailEn: string;
  specs: { labelAr: string; labelFr: string; labelEn: string; value: string }[];
}

const BOARD_HOTSPOTS: BoardHotspotMeta[] = [
  {
    id: 'ic_soic',
    linkedLayer: 'copper_top',
    badge: 'SOIC-8 IC',
    titleAr: 'دائرة متكاملة سطحية (SOIC-8 SMD IC)',
    titleFr: 'Circuit intégré CMS (SOIC-8)',
    titleEn: 'Surface-Mount IC (SOIC-8)',
    detailAr: 'تُلحَم أرجلها المنحنية (Gull-wing) مباشرةً على الوسادات الذهبية العلوية بمسافة 1.27 مم بين كل رجل وأخرى، وتُحدد الرجل رقم 1 بنقطة بيضاء على طبقة Silkscreen.',
    detailFr: 'Ses pattes en aile de mouette (pas 1,27 mm) se soudent directement sur les pastilles dorées sans percer le PCB.',
    detailEn: 'Gull-wing leads (1.27 mm pitch) solder directly onto top ENIG pads without drilling holes through the board.',
    specs: [
      { labelAr: 'المسافة بين الأرجل', labelFr: 'Pas des broches', labelEn: 'Pin Pitch', value: '1.27 mm' },
      { labelAr: 'توفير المساحة', labelFr: 'Gain d’espace', labelEn: 'Space Saved', value: '~65% vs DIP-8' },
    ],
  },
  {
    id: 'smd_resistor',
    linkedLayer: 'copper_top',
    badge: '0805 · 330Ω (331)',
    titleAr: 'مقاومة سطحية SMD (غلاف 0805)',
    titleFr: 'Résistance CMS (Boîtier 0805)',
    titleEn: 'SMD Chip Resistor (0805 Package)',
    detailAr: 'مقاومة مستطيلة بطول 2.0 مم وعرض 1.25 مم، خالية من الأرجل السلكية. يُطبع عليها الرمز الرقمي 331 (أي 33 متبوعة بصفر واحد = 330Ω) وتُلصق طرفاها المعدنيان بالقصدير.',
    detailFr: 'Composant miniature (2,0 × 1,25 mm) sans pattes. Le marquage 331 signifie 33 × 10¹ = 330 Ω.',
    detailEn: 'Leadless 2.0 × 1.25 mm chip resistor. Code 331 reads 33 × 10¹ = 330Ω across end terminations.',
    specs: [
      { labelAr: 'الأبعاد', labelFr: 'Dimensions', labelEn: 'Dimensions', value: '2.0 × 1.25 mm' },
      { labelAr: 'القدرة', labelFr: 'Puissance', labelEn: 'Power Rating', value: '0.125 W (1/8W)' },
    ],
  },
  {
    id: 'smd_cap',
    linkedLayer: 'copper_top',
    badge: '0805 MLCC 100nF',
    titleAr: 'مكثف سيراميكي سطحي (MLCC Decoupling)',
    titleFr: 'Condensateur céramique CMS (MLCC)',
    titleEn: 'SMD Ceramic Capacitor (MLCC 100nF)',
    detailAr: 'يتكون من عشرات الطبقات الداخلية الدقيقة، ويُوضع ملاصقاً تماماً لأرجل تغذية الشريحة (VCC/GND) لامتصاص نبضات الضوضاء السريعة لأن غياب الأرجل يلغي الحث الطفيلي.',
    detailFr: 'Placé au plus près des broches d’alimentation du CI pour filtrer les parasites haute fréquence sans inductance de patte.',
    detailEn: 'Placed tightly beside IC power pins; zero wire leads eliminate parasitic inductance for crisp high-frequency filtering.',
    specs: [
      { labelAr: 'السعة الشائعة', labelFr: 'Capacité type', labelEn: 'Typical Value', value: '100 nF (104)' },
      { labelAr: 'القطبية', labelFr: 'Polarité', labelEn: 'Polarity', value: 'Non-Polarized' },
    ],
  },
  {
    id: 'sot23',
    linkedLayer: 'silkscreen',
    badge: 'SOT-23',
    titleAr: 'ترانزستور سطحي (SOT-23 Package)',
    titleFr: 'Transistor CMS (Boîtier SOT-23)',
    titleEn: 'SMD Transistor (SOT-23)',
    detailAr: 'النسخة المصغّرة للترانزستور بثلاث وسادات فقط (B, E, C)؛ يُطبع عليه كود مختصر مثل 1AM (وهو المكافئ السطحي لـ 2N3904) لتوفير 80% من مساحة اللوحة.',
    detailFr: 'Version miniature à 3 plages (B, E, C) identifiée par un marquage court (ex. 1AM pour 2N3904).',
    detailEn: 'Ultra-compact 3-pad transistor package (e.g. marking 1AM = 2N3904) saving ~80% PCB footprint.',
    specs: [
      { labelAr: 'الأبعاد', labelFr: 'Dimensions', labelEn: 'Footprint', value: '2.9 × 1.3 mm' },
      { labelAr: 'الترتيب القياسي', labelFr: 'Brochage standard', labelEn: 'Standard Pins', value: '1:B · 2:E · 3:C' },
    ],
  },
  {
    id: 'pwr_trace',
    linkedLayer: 'copper_top',
    badge: '+5V Power Trace',
    titleAr: 'مسار تغذية عريض (Power Copper Trace)',
    titleFr: 'Piste d’alimentation large',
    titleEn: 'Wide Copper Power Trace',
    detailAr: 'تُصمّم مسارات الطاقة (+5V / +12V) بعرض أكبر (0.8–1.5 مم) لتقليل مقاومتها الأومية ومنع هبوط الجهد أو سخونة النحاس عند مرور تيار مرتفع.',
    detailFr: 'Tracée plus large (0,8–1,5 mm) pour réduire la résistance électrique, éviter la chute de tension et limiter l’échauffement.',
    detailEn: 'Routed wider (0.8–1.5 mm) to lower trace resistance, prevent voltage drop, and stay cool under load current.',
    specs: [
      { labelAr: 'العرض النموذجي', labelFr: 'Largeur typique', labelEn: 'Typical Width', value: '1.0 mm (~40 mil)' },
      { labelAr: 'التيار الآمن (1oz)', labelFr: 'Courant sûr (1oz)', labelEn: 'Safe Current', value: '~2.2 A' },
    ],
  },
  {
    id: 'sig_trace',
    linkedLayer: 'soldermask_top',
    badge: 'Signal 0.25mm',
    titleAr: 'مسار إشارة رفيع (Signal Trace)',
    titleFr: 'Piste signal fine (0,25 mm)',
    titleEn: 'Fine Signal Trace (0.25 mm)',
    detailAr: 'ينقل إشارات البيانات والتحكم ذات التيار الضعيف (أقل من 20mA)، ويكون محمياً بالكامل تحت طبقة قناع اللحام الخضراء مع ترك انحناءات بزاوية 45° لتقليل انعكاس الإشارة.',
    detailFr: 'Achemine les signaux logiques faible courant sous le vernis vert, avec des coudes à 45° pour préserver l’intégrité.',
    detailEn: 'Carries low-current logic signals beneath green solder mask using 45° bends to avoid sharp impedance discontinuities.',
    specs: [
      { labelAr: 'العرض النموذجي', labelFr: 'Largeur typique', labelEn: 'Typical Width', value: '0.25 mm (10 mil)' },
      { labelAr: 'زاوية الانحناء', labelFr: 'Angles de routage', labelEn: 'Bend Angle', value: '45° Mitered' },
    ],
  },
  {
    id: 'via_hole',
    linkedLayer: 'core_fr4',
    badge: 'Plated Via',
    titleAr: 'ثقب الربط بين الطبقات (Plated Via)',
    titleFr: 'Via métallisé inter-couches',
    titleEn: 'Copper-Plated Interlayer Via',
    detailAr: 'ثقب صغير محفور بالليزر أو المثقاب ومطلي من الداخل بالنحاس، يعمل كمصعد كهربائي ينقل المسار من الطبقة العلوية إلى الطبقات الداخلية أو السفلية لتفادي تقاطع الأسلاك.',
    detailFr: 'Micro-trou métallisé intérieurement qui fait office d’ascenseur électrique entre la face supérieure, interne et inférieure.',
    detailEn: 'Copper-plated barrel drilled through the FR-4 substrate acting as a vertical electrical elevator between layers.',
    specs: [
      { labelAr: 'قطر الثقب', labelFr: 'Diamètre perçage', labelEn: 'Drill Size', value: '0.3 mm' },
      { labelAr: 'قطر الحلقة النحاسية', labelFr: 'Pastille cuivre', labelEn: 'Pad Ring', value: '0.6 mm' },
    ],
  },
  {
    id: 'gnd_pour',
    linkedLayer: 'copper_bot',
    badge: 'GND Pour',
    titleAr: 'مساحة الأرضي النحاسية (Copper GND Pour)',
    titleFr: 'Plan de masse cuivre (GND Pour)',
    titleEn: 'Ground Copper Pour & Thermal Relief',
    detailAr: 'مساحة نحاسية واسعة متصلة بالأرضي تحيط بالمسارات، وتُربط بالوسادات عبر 4 جسور رفيعة (Thermal Relief) كي لا يسحب النحاس حرارة الكاوية أثناء اللحام.',
    detailFr: 'Large zone de cuivre reliée à la masse ; les freins thermiques (4 ponts fins) facilitent la soudure sans dissiper toute la chaleur.',
    detailEn: 'Surrounds traces with low-noise ground copper, connecting to pads via 4 thermal-relief spokes so soldering irons stay hot.',
    specs: [
      { labelAr: 'العزل حول المسارات', labelFr: 'Isolation pistes', labelEn: 'Clearance', value: '0.25 mm' },
      { labelAr: 'الربط الحراري', labelFr: 'Frein thermique', labelEn: 'Thermal Spokes', value: '4 Bridges' },
    ],
  },
];

const SMD_PACKAGES: {
  id: SmdPackageId;
  name: string;
  sizeMm: string;
  powerOrPins: string;
  scalePx: { w: number; h: number };
  noteAr: string;
  noteFr: string;
  noteEn: string;
}[] = [
  {
    id: '0402',
    name: '0402',
    sizeMm: '1.0 × 0.5 mm',
    powerOrPins: '0.063 W',
    scalePx: { w: 18, h: 10 },
    noteAr: 'صغير جداً للهواتف — يُفضّل لحامه بالهواء الساخن ومجهر.',
    noteFr: 'Très petit (smartphones) — soudure à l’air chaud recommandée.',
    noteEn: 'Ultra-tiny smartphone scale — best soldered with hot air & tweezers.',
  },
  {
    id: '0603',
    name: '0603',
    sizeMm: '1.6 × 0.8 mm',
    powerOrPins: '0.10 W',
    scalePx: { w: 28, h: 15 },
    noteAr: 'الأكثر انتشاراً في الدوائر المدمجة الحديثة والأردوينو.',
    noteFr: 'Le plus répandu sur les cartes modernes compactes.',
    noteEn: 'Most popular compact package on modern controller boards.',
  },
  {
    id: '0805',
    name: '0805',
    sizeMm: '2.0 × 1.25 mm',
    powerOrPins: '0.125 W',
    scalePx: { w: 36, h: 22 },
    noteAr: 'مثالي للمبتدئين بالكاوية العادية والملقط لقراءة رمزه بسهولة.',
    noteFr: 'Idéal pour souder manuellement au fer grâce à sa bonne prise.',
    noteEn: 'Beginner-friendly SMD size—easy to hand-solder and read codes.',
  },
  {
    id: '1206',
    name: '1206',
    sizeMm: '3.2 × 1.6 mm',
    powerOrPins: '0.25 W',
    scalePx: { w: 54, h: 28 },
    noteAr: 'قدرة ربع واط كاملة ويسهل لحامه حتى بدون مجهر.',
    noteFr: 'Supporte 0,25 W et se soude très facilement à la main.',
    noteEn: 'Full 1/4W power rating and effortless manual soldering.',
  },
  {
    id: 'sot23',
    name: 'SOT-23',
    sizeMm: '2.9 × 1.3 mm',
    powerOrPins: '3 Pins',
    scalePx: { w: 46, h: 26 },
    noteAr: 'غلاف الترانزستورات والدايودات المزدوجة السطحية.',
    noteFr: 'Boîtier standard des transistors et doubles diodes CMS.',
    noteEn: 'Standard 3-terminal package for SMD transistors & dual diodes.',
  },
  {
    id: 'soic8',
    name: 'SOIC-8',
    sizeMm: '4.9 × 3.9 mm',
    powerOrPins: '8 Pins (1.27mm)',
    scalePx: { w: 68, h: 52 },
    noteAr: 'شرائح مثل NE555 و LM358 و EEPROM بنسخة سطحية.',
    noteFr: 'Version CMS des puces NE555, LM358 ou mémoires EEPROM.',
    noteEn: 'Surface-mount counterpart of classic DIP-8 ICs like NE555 & LM358.',
  },
];

export const PcbExplorerView: React.FC = () => {
  const { pick } = useLanguage();

  const [layerCount, setLayerCount] = useState<2 | 4>(4);
  const [exploded, setExploded] = useState<boolean>(true);
  const [selectedLayerId, setSelectedLayerId] = useState<LayerId>('copper_top');
  const [hiddenLayers, setHiddenLayers] = useState<Record<string, boolean>>({});
  const [selectedHotspotId, setSelectedHotspotId] = useState<BoardHotspotId>('ic_soic');
  const [selectedSmdId, setSelectedSmdId] = useState<SmdPackageId>('0805');
  const [traceCurrentAmps, setTraceCurrentAmps] = useState<number>(1.5);
  const [copperOz, setCopperOz] = useState<1 | 2>(1);

  const visibleStack = useMemo(
    () => PCB_LAYERS.filter((l) => (layerCount === 4 ? true : !l.fourLayerOnly)),
    [layerCount]
  );

  const activeLayer = useMemo(
    () => visibleStack.find((l) => l.id === selectedLayerId) || visibleStack[2] || visibleStack[0],
    [selectedLayerId, visibleStack]
  );

  const activeHotspot = useMemo(
    () => BOARD_HOTSPOTS.find((h) => h.id === selectedHotspotId) || BOARD_HOTSPOTS[0],
    [selectedHotspotId]
  );

  const activeSmd = useMemo(
    () => SMD_PACKAGES.find((p) => p.id === selectedSmdId) || SMD_PACKAGES[2],
    [selectedSmdId]
  );

  // IPC-2221 approximate external trace width for ΔT = 10°C rise
  const recommendedTraceMm = useMemo(() => {
    const k = 0.048;
    const areaMil2 = Math.pow(traceCurrentAmps / (k * Math.pow(10, 0.44)), 1 / 0.725);
    const thicknessMils = copperOz === 1 ? 1.378 : 2.756;
    const widthMils = areaMil2 / thicknessMils;
    const widthMm = Math.max(0.2, widthMils * 0.0254);
    return {
      widthMm: Number(widthMm.toFixed(2)),
      widthMil: Math.max(8, Math.round(widthMils)),
    };
  }, [copperOz, traceCurrentAmps]);

  const toggleLayerVisibility = (id: LayerId) => {
    setHiddenLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectHotspot = (spot: BoardHotspotMeta) => {
    setSelectedHotspotId(spot.id);
    if (visibleStack.some((l) => l.id === spot.linkedLayer)) {
      setSelectedLayerId(spot.linkedLayer);
    }
  };

  // Stackup vertical spacing
  const layerStepY = exploded ? (layerCount === 4 ? 36 : 46) : layerCount === 4 ? 13 : 16;
  const stackStartY = exploded ? 30 : 120;

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#059669] dark:text-emerald-400 mb-1">
              <Layers className="h-4 w-4" />
              <span>
                {pick(
                  'مختبر هندسة اللوحات المطبوعة',
                  'Laboratoire d’ingénierie PCB',
                  'PCB Stackup & SMD Engineering Lab'
                )}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {pick(
                'مستكشف الطبقات الداخلية للوحة PCB والمكونات السطحية SMD',
                'Explorateur de couches internes PCB et composants CMS (SMD)',
                'Interactive PCB Internal Layers & SMD Explorer'
              )}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {pick(
                'اضغط على أي طبقة في المقطع الثلاثي الأبعاد أو على أي مكون فوق اللوحة لفهم مسارات النحاس، ثقوب الربط Vias، وتقنية SMD.',
                'Cliquez sur une couche de l’empilement ou sur un composant de la carte pour explorer pistes cuivre, vias et CMS.',
                'Tap any layer in the stackup or any hotspot on the PCB surface to inspect copper routing, vias, and SMD parts.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 2-Layer vs 4-Layer Switch */}
            <div className="flex items-center gap-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] p-1 border border-[#E2E8F0] dark:border-[#334155]">
              {([2, 4] as const).map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => {
                    setLayerCount(cnt);
                    if (cnt === 2 && visibleStack.every((l) => l.id === selectedLayerId && l.fourLayerOnly)) {
                      setSelectedLayerId('copper_top');
                    }
                  }}
                  className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    layerCount === cnt
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="font-mono-num" dir="ltr">{cnt}</span>{' '}
                  {pick('طبقات نحاس', 'Couches', 'Layers')}
                </button>
              ))}
            </div>

            {/* Explode / Collapse Stackup */}
            <button
              type="button"
              onClick={() => setExploded((e) => !e)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] px-3.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 hover:border-[#059669] transition-colors whitespace-nowrap"
            >
              {exploded ? (
                <Minimize2 className="h-3.5 w-3.5 text-[#059669] dark:text-emerald-400" />
              ) : (
                <Maximize2 className="h-3.5 w-3.5 text-[#059669] dark:text-emerald-400" />
              )}
              <span>
                {exploded
                  ? pick('ضم الطبقات', 'Compresser', 'Collapse Stack')
                  : pick('تفكيك الطبقات', 'Vue éclatée', 'Explode Layers')}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Part 1: Interactive Multi-Layer Stackup + Layer Inspector */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
        {/* Isometric Stackup Visualization */}
        <section className="lg:col-span-7 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
              <span>
                {pick(
                  'مقطع الطبقات الداخلية (PCB Layer Stackup)',
                  'Empilement interne du PCB',
                  'Internal PCB Stackup Anatomy'
                )}
              </span>
            </h3>
            <span className="text-xs font-mono-num font-semibold text-[#D97706] dark:text-amber-400" dir="ltr">
              {layerCount === 4 ? '4-Layer · 1.60 mm' : '2-Layer · 1.60 mm'}
            </span>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#0F172A] p-3 overflow-x-auto">
            <svg
              viewBox="0 0 660 390"
              className="w-full h-auto min-w-[480px] select-none"
              role="img"
              aria-label={pick('رسم تفاعلي لطبقات لوحة PCB', 'Schéma des couches PCB', 'Interactive PCB stackup diagram')}
            >
              {/* Subtle vertical Via axis line showing how copper barrel connects layers */}
              <g opacity={exploded ? 0.85 : 0.45}>
                <line
                  x1="210"
                  y1={stackStartY + 12}
                  x2="210"
                  y2={stackStartY + (visibleStack.length - 1) * layerStepY + 46}
                  stroke="#D97706"
                  strokeWidth="3.5"
                  strokeDasharray="4 3"
                />
                <rect
                  x="412"
                  y={stackStartY + 28}
                  width="6"
                  height={(visibleStack.length - 2) * layerStepY}
                  rx="2"
                  fill="#f59e0b"
                  opacity="0.75"
                />
                <text x="424" y={stackStartY + 26} className="fill-amber-300 text-[9.5px] font-bold">
                  PTH Via (Copper Barrel)
                </text>
              </g>

              {/* Render layers bottom-to-top so top layers overlap cleanly */}
              {[...visibleStack].reverse().map((layer, revIdx) => {
                const idx = visibleStack.length - 1 - revIdx;
                const y = stackStartY + idx * layerStepY;
                const isSelected = activeLayer.id === layer.id;
                const isHidden = Boolean(hiddenLayers[layer.id]);
                const polyPoints = `95,${y + 28} 310,${y - 8} 480,${y + 28} 265,${y + 64}`;
                const slabDepth = layer.id === 'core_fr4' ? 14 : 6;

                return (
                  <g
                    key={layer.id}
                    onClick={() => setSelectedLayerId(layer.id)}
                    style={{ cursor: 'pointer' }}
                    opacity={isHidden ? 0.16 : 1}
                    className="transition-opacity duration-200"
                  >
                    {/* Front thickness edge for realism */}
                    <polygon
                      points={`95,${y + 28} 265,${y + 64} 265,${y + 64 + slabDepth} 95,${y + 28 + slabDepth}`}
                      fill={layer.stroke}
                      opacity={0.95}
                    />
                    <polygon
                      points={`265,${y + 64} 480,${y + 28} 480,${y + 28 + slabDepth} 265,${y + 64 + slabDepth}`}
                      fill={layer.stroke}
                      opacity={0.78}
                    />

                    {/* Main isometric layer plane */}
                    <polygon
                      points={polyPoints}
                      fill={layer.color}
                      stroke={isSelected ? '#34d399' : layer.stroke}
                      strokeWidth={isSelected ? 2.8 : 1.2}
                    />

                    {/* Layer-specific surface texture details */}
                    {layer.id === 'copper_top' && (
                      <g stroke="#fde68a" strokeWidth="2.2" fill="none" opacity="0.9">
                        <path d={`M 165 ${y + 30} L 245 ${y + 18} L 315 ${y + 32} L 380 ${y + 22}`} />
                        <path d={`M 210 ${y + 42} L 280 ${y + 50} L 350 ${y + 36}`} />
                        <circle cx="210" cy={y + 24} r="4.5" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
                        <circle cx="315" cy={y + 32} r="4" fill="#fef08a" stroke="#b45309" strokeWidth="1" />
                      </g>
                    )}

                    {layer.id === 'silkscreen' && (
                      <g stroke="#0f172a" strokeWidth="1.2" fill="none" opacity="0.55">
                        <rect x="255" y={y + 18} width="32" height="16" rx="2" transform={`skewY(-8) skewX(24)`} />
                        <text x="276" y={y + 32} className="fill-slate-700 text-[8.5px] font-mono font-bold">
                          U1 · R1 · C1
                        </text>
                      </g>
                    )}

                    {layer.id === 'soldermask_top' && (
                      <g>
                        {/* Exposed gold pad windows */}
                        <ellipse cx="210" cy={y + 24} rx="5.5" ry="3" fill="#fbbf24" />
                        <ellipse cx="255" cy={y + 30} rx="6" ry="3.2" fill="#fbbf24" />
                        <ellipse cx="290" cy={y + 26} rx="6" ry="3.2" fill="#fbbf24" />
                      </g>
                    )}

                    {(layer.id === 'inner_gnd' || layer.id === 'inner_pwr') && (
                      <g stroke="#fef3c7" strokeWidth="1" opacity="0.55">
                        <ellipse cx="210" cy={y + 24} rx="7" ry="4" fill="#0f172a" />
                        {layer.id === 'inner_pwr' && (
                          <line x1="255" y1={y + 5} x2="310" y2={y + 52} stroke="#0f172a" strokeWidth="2.5" />
                        )}
                      </g>
                    )}

                    {/* Callout line to right-side label */}
                    <line
                      x1="482"
                      y1={y + 30}
                      x2="515"
                      y2={y + 30}
                      stroke={isSelected ? '#34d399' : '#475569'}
                      strokeWidth={isSelected ? 1.8 : 1}
                    />
                    <circle
                      cx="515"
                      cy={y + 30}
                      r={isSelected ? 4 : 2.5}
                      fill={isSelected ? '#34d399' : '#64748b'}
                    />
                    <text
                      x="524"
                      y={y + 33}
                      className={`text-[10.5px] font-bold ${
                        isSelected ? 'fill-emerald-300' : 'fill-slate-300'
                      }`}
                    >
                      {layer.id.replace('_top', ' (Top)').replace('_bot', ' (Bot)').replace('_', ' ').toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Layer Visibility Strip */}
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleStack.map((layer) => {
              const isSelected = activeLayer.id === layer.id;
              const isHidden = Boolean(hiddenLayers[layer.id]);
              return (
                <div
                  key={layer.id}
                  className={`inline-flex items-center rounded-xl border transition-colors ${
                    isSelected
                      ? 'border-[#059669] bg-emerald-50 dark:bg-emerald-950/50'
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedLayerId(layer.id)}
                    className={`flex min-h-[36px] items-center gap-1.5 px-2.5 py-1 text-xs font-bold ${
                      isSelected
                        ? 'text-[#059669] dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-sm border border-black/20 shrink-0"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="truncate max-w-[140px]">
                      {pick(layer.titleAr, layer.titleFr, layer.titleEn).split('(')[0].trim()}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLayerVisibility(layer.id)}
                    aria-label={isHidden ? pick('إظهار الطبقة', 'Afficher', 'Show layer') : pick('إخفاء الطبقة', 'Masquer', 'Hide layer')}
                    className="flex min-h-[36px] min-w-[32px] items-center justify-center border-s border-[#E2E8F0] dark:border-[#334155] text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  >
                    {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected Layer Engineering Card + Copper Trace Width Calculator */}
        <aside className="lg:col-span-5 space-y-4">
          <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm space-y-3.5">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-[#334155]">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-6 w-6 rounded-lg border border-black/15 shrink-0"
                  style={{ backgroundColor: activeLayer.color }}
                />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {pick(activeLayer.titleAr, activeLayer.titleFr, activeLayer.titleEn)}
                  </h3>
                  <div className="text-xs font-mono-num font-bold text-[#059669] dark:text-emerald-400" dir="ltr">
                    {pick('السُمك:', 'Épaisseur :', 'Thickness:')} {activeLayer.thickness}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              <strong className="text-slate-800 dark:text-slate-200">
                {pick('المادة: ', 'Matériau : ', 'Material: ')}
              </strong>
              {pick(activeLayer.materialAr, activeLayer.materialFr, activeLayer.materialEn)}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {pick(activeLayer.descAr, activeLayer.descFr, activeLayer.descEn)}
            </p>

            <div className="rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 p-3 flex items-start gap-2 text-xs leading-relaxed text-amber-950 dark:text-amber-100">
              <Sparkles className="h-4 w-4 text-[#D97706] dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{pick(activeLayer.tipAr, activeLayer.tipFr, activeLayer.tipEn)}</span>
            </div>
          </section>

          {/* Interactive Copper Trace Width Mini-Lab */}
          <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                <Ruler className="h-4 w-4 text-[#D97706] dark:text-amber-400" />
                <span>
                  {pick('حاسبة عرض المسار النحاسي', 'Largeur de piste cuivre', 'Copper Trace Width Lab')}
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] p-0.5 border border-[#E2E8F0] dark:border-[#334155]">
                {([1, 2] as const).map((oz) => (
                  <button
                    key={oz}
                    type="button"
                    onClick={() => setCopperOz(oz)}
                    className={`min-h-[30px] rounded-md px-2 text-[11px] font-bold font-mono-num ${
                      copperOz === oz
                        ? 'bg-[#059669] text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                    dir="ltr"
                  >
                    {oz} oz
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-300">
                  {pick('شدة التيار المطلوب تمريره', 'Courant cible', 'Target Current')}
                </span>
                <span className="font-mono-num text-[#059669] dark:text-emerald-400" dir="ltr">
                  {traceCurrentAmps.toFixed(1)} A
                </span>
              </div>
              <input
                type="range"
                min={0.2}
                max={6}
                step={0.2}
                value={traceCurrentAmps}
                onChange={(e) => setTraceCurrentAmps(Number(e.target.value))}
                className="w-full accent-[#059669]"
              />
            </div>

            {/* Live Trace Width Result + Visual Scale */}
            <div className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {pick('أقل عرض آمن للمسار', 'Largeur minimale sûre', 'Min Safe Trace Width')}
                </div>
                <div className="text-base font-extrabold font-mono-num text-[#059669] dark:text-emerald-400" dir="ltr">
                  {recommendedTraceMm.widthMm} mm ({recommendedTraceMm.widthMil} mil)
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div
                  className="rounded-sm bg-[#D97706] transition-all"
                  style={{
                    width: '88px',
                    height: `${Math.min(20, Math.max(3, recommendedTraceMm.widthMm * 5))}px`,
                  }}
                />
                <span className="text-[10px] font-mono-num text-slate-400" dir="ltr">
                  {copperOz === 1 ? '35 µm copper' : '70 µm copper'}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Part 2: Interactive PCB Surface & SMD Layout Explorer */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
        <section className="lg:col-span-7 rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
              <span>
                {pick(
                  'خريطة لوحة PCB التفاعلية (اضغط على أي عنصر أو مسار)',
                  'Carte PCB interactive (cliquez sur un élément)',
                  'Interactive PCB Surface Map (Tap Any Feature)'
                )}
              </span>
            </h3>
            <span className="text-xs font-mono-num font-bold text-[#059669] dark:text-emerald-400" dir="ltr">
              ENIG Gold · FR-4 Emerald
            </span>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#0F172A] p-3 overflow-x-auto">
            <svg
              viewBox="0 0 720 340"
              className="w-full h-auto min-w-[520px] select-none"
              role="img"
              aria-label={pick('خريطة المكونات السطحية ومسارات النحاس على PCB', 'Carte des pistes et composants CMS', 'PCB SMD and copper trace explorer')}
            >
              {/* PCB Emerald Solder Mask Board */}
              <rect x="20" y="18" width="680" height="304" rx="16" fill="#064e3b" stroke="#059669" strokeWidth="2.5" />

              {/* Copper GND Pour Zone (Bottom-left hatched area) */}
              <g
                onClick={() => handleSelectHotspot(BOARD_HOTSPOTS.find((h) => h.id === 'gnd_pour')!)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x="42"
                  y="196"
                  width="225"
                  height="104"
                  rx="8"
                  fill="#047857"
                  stroke={selectedHotspotId === 'gnd_pour' ? '#fbbf24' : '#10b981'}
                  strokeWidth={selectedHotspotId === 'gnd_pour' ? 2.5 : 1.2}
                  strokeDasharray="6 3"
                />
                <text x="154" y="286" textAnchor="middle" className="fill-emerald-200 text-[10px] font-bold font-mono-num">
                  GND COPPER POUR + THERMAL RELIEF
                </text>
                {/* Thermal relief pad illustration */}
                <circle cx="95" cy="242" r="14" fill="#064e3b" />
                <line x1="81" y1="242" x2="109" y2="242" stroke="#D97706" strokeWidth="3.5" />
                <line x1="95" y1="228" x2="95" y2="256" stroke="#D97706" strokeWidth="3.5" />
                <circle cx="95" cy="242" r="8" fill="#fbbf24" />
                <circle cx="95" cy="242" r="3.5" fill="#0f172a" />
              </g>

              {/* Wide Power Copper Trace */}
              <g
                onClick={() => handleSelectHotspot(BOARD_HOTSPOTS.find((h) => h.id === 'pwr_trace')!)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d="M 60 66 L 235 66 L 265 96 L 360 96"
                  fill="none"
                  stroke={selectedHotspotId === 'pwr_trace' ? '#fbbf24' : '#D97706'}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="60" cy="66" r="10" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
                <circle cx="60" cy="66" r="4" fill="#0f172a" />
                <text x="145" y="50" textAnchor="middle" className="fill-amber-200 text-[10px] font-bold font-mono-num">
                  +5V POWER TRACE (1.0mm)
                </text>
              </g>

              {/* Fine Signal Trace (45-degree mitered bend) */}
              <g
                onClick={() => handleSelectHotspot(BOARD_HOTSPOTS.find((h) => h.id === 'sig_trace')!)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d="M 418 148 L 485 148 L 515 178 L 595 178"
                  fill="none"
                  stroke={selectedHotspotId === 'sig_trace' ? '#fde047' : '#34d399'}
                  strokeWidth="4.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text x="515" y="138" textAnchor="middle" className="fill-emerald-200 text-[10px] font-bold font-mono-num">
                  SIGNAL TRACE (0.25mm · 45°)
                </text>
              </g>

              {/* Copper-Plated Via Hole */}
              <g
                onClick={() => handleSelectHotspot(BOARD_HOTSPOTS.find((h) => h.id === 'via_hole')!)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d="M 380 220 L 470 220"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 470 220 L 560 262"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                />
                {selectedHotspotId === 'via_hole' && (
                  <circle cx="470" cy="220" r="17" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="3 2" />
                )}
                <circle cx="470" cy="220" r="10.5" fill="#fbbf24" stroke="#92400e" strokeWidth="1.5" />
                <circle cx="470" cy="220" r="4.8" fill="#0f172a" />
                <text x="470" y="250" textAnchor="middle" className="fill-amber-200 text-[10px] font-bold font-mono-num">
                  VIA (TOP ⇄ BOT)
                </text>
              </g>

              {/* SOIC-8 SMD IC */}
              <g
                onClick={() => handleSelectHotspot(BOARD_HOTSPOTS.find((h) => h.id === 'ic_soic')!)}
                style={{ cursor: 'pointer' }}
              >
                {selectedHotspotId === 'ic_soic' && (
                  <rect x="314" y="92" width="112" height="106" rx="10" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="5 3" />
                )}
                {/* Top & bottom ENIG gold pads */}
                {[0, 1, 2, 3].map((p) => {
                  const px = 334 + p * 22;
                  return (
                    <g key={p}>
                      <rect x={px - 6} y="100" width="12" height="22" rx="2" fill="#fbbf24" />
                      <rect x={px - 6} y="168" width="12" height="22" rx="2" fill="#fbbf24" />
                      {/* Gull-wing silver pins */}
                      <rect x={px - 3.5} y="110" width="7" height="12" fill="#cbd5e1" />
                      <rect x={px - 3.5} y="168" width="7" height="12" fill="#cbd5e1" />
                    </g>
                  );
                })}
                {/* IC Epoxy Body */}
                <rect x="324" y="121" width="92" height="48" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                {/* Pin 1 silkscreen dot */}
                <circle cx="334" cy="158" r="3.2" fill="#f8fafc" />
                <text x="370" y="149" textAnchor="middle" className="fill-slate-100 text-[11px] font-bold font-mono-num">
                  U1 · SOIC-8
                </text>
              </g>

              {/* SMD 0805 Resistor (331) */}
              <g
                onClick={() => handleSelectHotspot(BOARD_HOTSPOTS.find((h) => h.id === 'smd_resistor')!)}
                style={{ cursor: 'pointer' }}
              >
                {selectedHotspotId === 'smd_resistor' && (
                  <rect x="530" y="54" width="92" height="50" rx="8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4 3" />
                )}
                <rect x="540" y="66" width="20" height="26" rx="2.5" fill="#fbbf24" />
                <rect x="592" y="66" width="20" height="26" rx="2.5" fill="#fbbf24" />
                <rect x="548" y="69" width="10" height="20" fill="#cbd5e1" />
                <rect x="594" y="69" width="10" height="20" fill="#cbd5e1" />
                <rect x="558" y="69" width="36" height="20" fill="#0f172a" />
                <text x="576" y="83" textAnchor="middle" className="fill-white text-[10px] font-bold font-mono-num">
                  331
                </text>
                <text x="576" y="50" textAnchor="middle" className="fill-slate-100 text-[9.5px] font-bold font-mono-num">
                  R1 (0805)
                </text>
              </g>

              {/* SMD MLCC Ceramic Capacitor (100nF) */}
              <g
                onClick={() => handleSelectHotspot(BOARD_HOTSPOTS.find((h) => h.id === 'smd_cap')!)}
                style={{ cursor: 'pointer' }}
              >
                {selectedHotspotId === 'smd_cap' && (
                  <rect x="196" y="122" width="84" height="48" rx="8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4 3" />
                )}
                <rect x="206" y="133" width="18" height="24" rx="2.5" fill="#fbbf24" />
                <rect x="252" y="133" width="18" height="24" rx="2.5" fill="#fbbf24" />
                <rect x="214" y="136" width="9" height="18" fill="#cbd5e1" />
                <rect x="253" y="136" width="9" height="18" fill="#cbd5e1" />
                <rect x="223" y="136" width="30" height="18" fill="#c28e5c" />
                <text x="238" y="120" textAnchor="middle" className="fill-slate-100 text-[9.5px] font-bold font-mono-num">
                  C1 (100nF MLCC)
                </text>
              </g>

              {/* SOT-23 SMD Transistor */}
              <g
                onClick={() => handleSelectHotspot(BOARD_HOTSPOTS.find((h) => h.id === 'sot23')!)}
                style={{ cursor: 'pointer' }}
              >
                {selectedHotspotId === 'sot23' && (
                  <rect x="572" y="218" width="92" height="72" rx="8" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="4 3" />
                )}
                <rect x="584" y="232" width="16" height="12" rx="2" fill="#fbbf24" />
                <rect x="584" y="264" width="16" height="12" rx="2" fill="#fbbf24" />
                <rect x="636" y="248" width="16" height="12" rx="2" fill="#fbbf24" />
                <rect x="594" y="235" width="10" height="6" fill="#cbd5e1" />
                <rect x="594" y="267" width="10" height="6" fill="#cbd5e1" />
                <rect x="632" y="251" width="10" height="6" fill="#cbd5e1" />
                <rect x="602" y="230" width="32" height="48" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.4" />
                <text x="618" y="258" textAnchor="middle" className="fill-white text-[9.5px] font-bold font-mono-num">
                  1AM
                </text>
                <text x="618" y="220" textAnchor="middle" className="fill-slate-100 text-[9.5px] font-bold font-mono-num">
                  Q1 (SOT-23)
                </text>
              </g>
            </svg>
          </div>

          {/* Hotspot Quick Selector Pills */}
          <div className="flex flex-wrap gap-1.5">
            {BOARD_HOTSPOTS.map((spot) => {
              const isSelected = spot.id === selectedHotspotId;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleSelectHotspot(spot)}
                  className={`min-h-[38px] rounded-xl border px-3 py-1.5 text-xs font-bold font-mono-num transition-colors ${
                    isSelected
                      ? 'border-[#059669] bg-[#059669] text-white shadow-sm'
                      : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-[#059669]'
                  }`}
                >
                  {spot.badge}
                </button>
              );
            })}
          </div>
        </section>

        {/* Hotspot Inspector + SMD Package Scale Comparison */}
        <aside className="lg:col-span-5 space-y-4">
          <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0] dark:border-[#334155]">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                {pick(activeHotspot.titleAr, activeHotspot.titleFr, activeHotspot.titleEn)}
              </h3>
              <span className="text-xs font-mono-num font-bold text-[#D97706] dark:text-amber-400 shrink-0" dir="ltr">
                {activeHotspot.badge}
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {pick(activeHotspot.detailAr, activeHotspot.detailFr, activeHotspot.detailEn)}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {activeHotspot.specs.map((sp, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-3"
                >
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {pick(sp.labelAr, sp.labelFr, sp.labelEn)}
                  </div>
                  <div className="mt-0.5 text-sm font-extrabold font-mono-num text-[#059669] dark:text-emerald-400" dir="ltr">
                    {sp.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Interactive SMD Package Size Scale */}
          <section className="rounded-2xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] p-4 sm:p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white">
                <Zap className="h-4 w-4 text-[#059669] dark:text-emerald-400" />
                <span>
                  {pick('مقارنة أحجام المكونات السطحية (SMD)', 'Comparateur de tailles CMS (SMD)', 'SMD Package Size Scale')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {SMD_PACKAGES.map((pkg) => {
                const isSel = pkg.id === selectedSmdId;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedSmdId(pkg.id)}
                    className={`min-h-[38px] rounded-xl border px-2 py-1.5 text-xs font-bold font-mono-num transition-colors ${
                      isSel
                        ? 'border-[#059669] bg-[#059669] text-white'
                        : 'border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-[#059669]'
                    }`}
                  >
                    {pkg.name}
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] p-3.5 flex items-center justify-between gap-4">
              <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-[#064e3b] border border-[#059669]/50">
                <div
                  className="flex items-center justify-between rounded-[2px] bg-[#1e293b] border border-slate-400"
                  style={{ width: `${activeSmd.scalePx.w}px`, height: `${activeSmd.scalePx.h}px` }}
                >
                  <span className="h-full w-1.5 bg-slate-300" />
                  <span className="h-full w-1.5 bg-slate-300" />
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2 text-xs font-mono-num font-extrabold text-slate-900 dark:text-white" dir="ltr">
                  <span>{activeSmd.sizeMm}</span>
                  <span className="text-[#059669] dark:text-emerald-400">{activeSmd.powerOrPins}</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {pick(activeSmd.noteAr, activeSmd.noteFr, activeSmd.noteEn)}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
