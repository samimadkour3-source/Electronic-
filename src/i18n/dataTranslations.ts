import { ElectronicComponent, QuizLevel, QuizQuestion, QuizRank } from '../types/electronics';
import { ElectronicProject } from '../data/projectsData';
import { AppLanguage } from './uiTranslations';

interface ComponentLocaleOverride {
  nameFr: string;
  nameEn: string;
  unitFr: string;
  unitEn: string;
  shortRoleFr: string;
  shortRoleEn: string;
  fullRoleFr: string;
  fullRoleEn: string;
  howItWorksFr: string;
  howItWorksEn: string;
  formulaMeaningFr?: string;
  formulaMeaningEn?: string;
  pinoutNotesFr: string[];
  pinoutNotesEn: string[];
  commonTypesFr: string[];
  commonTypesEn: string[];
  realWorldUsesFr: string[];
  realWorldUsesEn: string[];
  visualFaultSignsFr: string[];
  visualFaultSignsEn: string[];
  recommendedModeLabelFr: string;
  recommendedModeLabelEn: string;
  safetyNoteFr: string;
  safetyNoteEn: string;
  stepsFr: string[];
  stepsEn: string[];
  goodReadingFr: string;
  goodReadingEn: string;
  openFaultReadingFr: string;
  openFaultReadingEn: string;
  shortFaultReadingFr: string;
  shortFaultReadingEn: string;
  degradedReadingFr: string;
  degradedReadingEn: string;
}

const CATEGORY_MAP: Record<ElectronicComponent['category'], { fr: string; en: string }> = {
  passive: { fr: 'Passifs', en: 'Passive' },
  semiconductor: { fr: 'Semi-conducteurs', en: 'Semiconductors' },
  power: { fr: 'Puissance & Protection', en: 'Power & Protection' },
  sensor: { fr: 'Capteurs & Contrôle', en: 'Sensors & Control' },
};

const COMP_TRANSLATIONS: Record<string, ComponentLocaleOverride> = {
  resistor: {
    nameFr: 'Résistance électrique',
    nameEn: 'Resistor',
    unitFr: 'Ohm',
    unitEn: 'Ohm',
    shortRoleFr: 'Limite l’intensité du courant et divise la tension pour protéger les composants sensibles.',
    shortRoleEn: 'Limits electric current flow and divides voltage to protect sensitive components.',
    fullRoleFr:
      'La résistance est le composant le plus courant en électronique. Elle contrôle le courant traversant les LED et circuits intégrés, forme des ponts diviseurs de tension et règle les constantes de temps RC.',
    fullRoleEn:
      'The resistor is the most ubiquitous component in electronics. It limits current for LEDs and microcontrollers, creates voltage dividers, and sets RC timing delays.',
    howItWorksFr:
      'Elle dissipe une partie de l’énergie électrique en chaleur grâce à son matériau résistif (carbone ou film métallique). Non polarisée, elle obéit linéairement à la loi d’Ohm.',
    howItWorksEn:
      'It converts part of the electrical energy into heat through a resistive carbon or metal film element. It obeys Ohm’s law linearly and is non-polarized.',
    formulaMeaningFr: 'Tension (V) = Courant (A) × Résistance (Ω), puissance dissipée en Watts.',
    formulaMeaningEn: 'Voltage (V) = Current (A) × Resistance (Ω), and power dissipation is measured in Watts.',
    pinoutNotesFr: ['Composant non polarisé (sens indifférent).', 'Valeur lue par code à 4/5 anneaux ou marquage CMS (ex : 103 = 10 kΩ).'],
    pinoutNotesEn: ['Non-polarized component (both leads are identical).', 'Value read via 4/5 color bands or SMD digits (e.g., 103 = 10 kΩ).'],
    commonTypesFr: ['Couche carbone ±5% (usage général)', 'Film métallique ±1% (précision)', 'Bobinée de puissance (≥5W)', 'CMS/SMD'],
    commonTypesEn: ['Carbon film ±5% (general purpose)', 'Metal film ±1% (high precision)', 'Wirewound power (≥5W)', 'SMD chip resistors'],
    realWorldUsesFr: ['Protection des LED contre la surintensité', 'Résistances Pull-up/Pull-down pour microcontrôleurs', 'Ponts diviseurs de capteurs'],
    realWorldUsesEn: ['Protecting LEDs from burning out', 'Pull-up / pull-down logic lines', 'Op-amp gain and sensor voltage dividers'],
    visualFaultSignsFr: ['Corps noirci ou fissuré', 'Dérive importante de valeur', 'Odeur de brûlé après surcharge'],
    visualFaultSignsEn: ['Charred or cracked body', 'Value drifted far above rated bands', 'Burnt odor from exceeding watt rating'],
    recommendedModeLabelFr: 'Mode Ohmmètre (Ω)',
    recommendedModeLabelEn: 'Ohm Mode (Ω)',
    safetyNoteFr: 'Coupez l’alimentation et dessoudez une patte si nécessaire pour éviter les mesures en parallèle.',
    safetyNoteEn: 'Power off the circuit completely and lift one lead from the PCB to avoid parallel reading errors.',
    stepsFr: [
      'Placez le sélecteur sur Ω et choisissez la bonne gamme.',
      'Branchez la sonde rouge sur VΩmA et la noire sur COM.',
      'Mesurez aux bornes sans toucher les pointes métalliques avec les doigts.',
    ],
    stepsEn: [
      'Set the multimeter dial to Resistance (Ω) or Auto Range.',
      'Plug red probe into VΩmA and black probe into COM.',
      'Touch both leads without holding the metal tips with your fingers.',
    ],
    goodReadingFr: 'Lecture proche de la valeur nominale (dans la tolérance ±1% ou ±5%).',
    goodReadingEn: 'Matches nominal band value within its tolerance (±1% or ±5%).',
    openFaultReadingFr: 'Affiche OL (coupure interne).',
    openFaultReadingEn: 'Displays OL (internal open circuit).',
    shortFaultReadingFr: 'Proche de 0 Ω (rare, généralement dû à un pont de soudure externe).',
    shortFaultReadingEn: 'Near 0 Ω (usually external solder bridge or PCB carbonization).',
    degradedReadingFr: 'Résistance beaucoup plus élevée que la valeur annoncée.',
    degradedReadingEn: 'Resistance drifted significantly higher than the rated code.',
  },
  capacitor: {
    nameFr: 'Condensateur électrolytique',
    nameEn: 'Electrolytic Capacitor',
    unitFr: 'Microfarad',
    unitEn: 'µF',
    shortRoleFr: 'Stocke l’énergie, lisse la tension redressée et filtre les fluctuations d’alimentation.',
    shortRoleEn: 'Stores electrical charge, smooths rectified DC voltage, and filters power ripples.',
    fullRoleFr:
      'Essentiel dans les alimentations et amplificateurs audio : il maintient la tension stable lors des pics de courant et bloque le courant continu tout en laissant passer l’alternatif.',
    fullRoleEn:
      'Vital in power supplies and audio stages: it absorbs voltage dips, smooths AC-to-DC ripple after bridge rectifiers, and blocks DC while passing AC signals.',
    howItWorksFr:
      'Deux armatures séparées par un diélectrique imprégné d’électrolyte. La bande grise indique toujours la borne négative (-).',
    howItWorksEn:
      'Stores energy in an electric field between two aluminum foils separated by an electrolyte oxide layer. The printed stripe marks the negative (-) pin.',
    formulaMeaningFr: 'Charge (Coulombs) = Capacité (Farads) × Tension (Volts).',
    formulaMeaningEn: 'Charge (C) = Capacitance (F) × Voltage (V).',
    pinoutNotesFr: ['Polarisé : patte courte + bande blanche/grise = Négatif (-).', 'Respectez la tension max inscrite (ex : 25V, 400V).'],
    pinoutNotesEn: ['Polarized: shorter lead and body stripe indicate Negative (-).', 'Never exceed its rated working voltage (e.g., 25V, 400V).'],
    commonTypesFr: ['Électrolytique aluminium radial', 'Faible ESR (Low-ESR) pour alimentations à découpage', 'Tantale'],
    commonTypesEn: ['Radial aluminum electrolytic', 'Low-ESR for switching power supplies', 'Tantalum'],
    realWorldUsesFr: ['Lissage après pont de diodes', 'Découplage des étages audio', 'Temporisation avec résistance'],
    realWorldUsesEn: ['Smoothing power supply outputs', 'Audio coupling & decoupling', 'Timing circuits with resistors'],
    visualFaultSignsFr: ['Sommet bombé ou fendu', 'Fuite d’électrolyte brunâtre', 'Gaine plastique rétractée par la chaleur'],
    visualFaultSignsEn: ['Bulged or vented aluminum top', 'Leaking brown electrolyte residue', 'Shrunk outer plastic sleeve from heat'],
    recommendedModeLabelFr: 'Capacimètre (┤├) et Ω',
    recommendedModeLabelEn: 'Capacitance (┤├) & Ohm',
    safetyNoteFr: 'Déchargez impérativement les gros condensateurs (via une résistance de 1kΩ) avant de mesurer !',
    safetyNoteEn: 'Always discharge large high-voltage capacitors through a bleed resistor before testing!',
    stepsFr: [
      'Déchargez le condensateur en toute sécurité.',
      'En mode Capacité (┤├), mesurez la valeur en µF.',
      'En mode Ohmmètre, la résistance doit monter progressivement vers OL.',
    ],
    stepsEn: [
      'Safely discharge the capacitor before probing.',
      'Switch to Capacitance (┤├) mode and verify the µF reading.',
      'On Ohm mode, resistance should climb steadily toward OL.',
    ],
    goodReadingFr: 'Capacité proche de l’étiquette (±20%) et aucune fuite continue.',
    goodReadingEn: 'Capacitance within ±20% of label and climbs to OL on resistance check.',
    openFaultReadingFr: 'Capacité nulle ou très faible (condensateur asséché).',
    openFaultReadingEn: 'Near 0 µF reading (dried electrolyte or broken lead).',
    shortFaultReadingFr: 'Bip continu (~0 Ω) en test de continuité.',
    shortFaultReadingEn: 'Continuous beep (~0 Ω) on diode/continuity mode.',
    degradedReadingFr: 'Perte de capacité >30% ou résistance interne (ESR) élevée.',
    degradedReadingEn: 'Capacitance dropped over 30% or high internal ESR leakage.',
  },
  inductor: {
    nameFr: 'Inductance / Bobine',
    nameEn: 'Inductor / Coil',
    unitFr: 'Henry / mH / µH',
    unitEn: 'H / mH / µH',
    shortRoleFr: 'Stocke l’énergie dans un champ magnétique, s’oppose aux variations brusques de courant et filtre les hautes fréquences.',
    shortRoleEn: 'Stores energy in a magnetic field, opposes sudden current changes, and filters high-frequency noise.',
    fullRoleFr:
      'Indispensable dans les convertisseurs Buck/Boost, filtres antiparasites EMI et circuits radio. Laisse passer le courant continu presque sans chute tout en bloquant les parasites haute fréquence.',
    fullRoleEn:
      'Essential in Buck/Boost converters, EMI mains filters, and RF tuners. Passes DC easily while choking rapid AC spikes.',
    howItWorksFr:
      'Un fil de cuivre émaillé enroulé sur air ou ferrite génère une force contre-électromotrice proportionnelle à la vitesse de variation du courant.',
    howItWorksEn:
      'Coiled enameled copper wire creates a magnetic flux that resists sudden changes in current (V = L × dI/dt).',
    formulaMeaningFr: 'Tension induite = Inductance (H) × Variation du courant par seconde.',
    formulaMeaningEn: 'Induced voltage equals inductance (H) multiplied by rate of current change.',
    pinoutNotesFr: ['Composant non polarisé (deux bornes symétriques).', 'Certaines bobines à anneaux ressemblent à des résistances vertes.'],
    pinoutNotesEn: ['Non-polarized two-terminal wire coil.', 'Color-coded axial inductors look similar to green resistors.'],
    commonTypesFr: ['Bobine tore ferrite', 'Self de puissance blindée SMD', 'Bobine à air RF'],
    commonTypesEn: ['Toroidal ferrite inductor', 'Shielded SMD power inductor', 'Air-core RF coil'],
    realWorldUsesFr: ['Convertisseurs DC-DC Buck/Boost', 'Filtres secteur EMI', 'Filtres audio passe-bas'],
    realWorldUsesEn: ['Buck/Boost DC-DC voltage converters', 'AC mains EMI chokes', 'Speaker crossover filters'],
    visualFaultSignsFr: ['Vernis du cuivre brûlé ou noirci', 'Noyau ferrite fissuré', 'Soudure sèche ou fil cassé'],
    visualFaultSignsEn: ['Dark burnt copper enamel', 'Cracked ferrite core', 'Broken wire lead at solder pad'],
    recommendedModeLabelFr: 'Continuité / Ohmmètre (Ω)',
    recommendedModeLabelEn: 'Continuity / Ohm Mode',
    safetyNoteFr: 'Une bobine saine bippe au testeur de continuité car ce n’est qu’un fil de cuivre continu ; cela est normal !',
    safetyNoteEn: 'A healthy inductor beeps on continuity mode because it is a continuous copper wire—this is normal!',
    stepsFr: [
      'Placez le multimètre en mode Ω ou Continuité.',
      'Mesurez entre les deux bornes : résistance faible normale (0.1Ω à quelques Ω).',
    ],
    stepsEn: [
      'Set meter to low Ohm (200Ω) or Continuity mode.',
      'Probe both ends: a healthy coil shows low resistance (0.1Ω to a few Ω).',
    ],
    goodReadingFr: 'Continuité franche avec faible résistance (0.2Ω–5Ω).',
    goodReadingEn: 'Low continuous resistance (0.2Ω–5Ω) with continuity beep.',
    openFaultReadingFr: 'Affiche OL (fil coupé).',
    openFaultReadingEn: 'Reads OL (broken internal winding).',
    shortFaultReadingFr: 'Court-circuit entre spires détectable uniquement au LCR-mètre (inductance effondrée).',
    shortFaultReadingEn: 'Shorted turns require an inductance/LCR meter (inductance drops sharply).',
    degradedReadingFr: 'Surchauffe rapide due à une perte d’isolement entre spires.',
    degradedReadingEn: 'Overheating caused by degraded enamel insulation between turns.',
  },
  diode: {
    nameFr: 'Diode de redressement',
    nameEn: 'Rectifier Diode',
    unitFr: 'Volt direct (Vf)',
    unitEn: 'Vf / A',
    shortRoleFr: 'Laisse passer le courant dans un seul sens et bloque le sens inverse (redressement et protection).',
    shortRoleEn: 'Allows current flow in one direction only, used for AC rectification and reverse-polarity protection.',
    fullRoleFr:
      'La diode (ex : 1N4007) est une valve unidirectionnelle. Elle transforme le courant alternatif en continu, protège les circuits contre l’inversion de batterie et absorbe les pics inductifs des relais.',
    fullRoleEn:
      'A diode (such as 1N4007) acts as a one-way check valve for electricity. It converts AC to DC, prevents battery reversal damage, and clamps relay flyback spikes.',
    howItWorksFr:
      'Jonction P-N au silicium présentant un seuil d’environ 0.7V en direct entre Anode (+) et Cathode (-) (marquée par l’anneau argenté).',
    howItWorksEn:
      'A silicon P-N junction that conducts above ~0.7V when forward-biased from Anode (+) to the silver-striped Cathode (-), blocking reverse voltage.',
    pinoutNotesFr: ['Anneau argenté = Cathode (-).', 'Côté opposé noir = Anode (+).'],
    pinoutNotesEn: ['Silver/white band marks the Cathode (-).', 'Opposite black end is the Anode (+).'],
    commonTypesFr: ['1N4007 (1A 1000V redressement)', '1N4148 (signal rapide)', '1N5408 (3A puissance)'],
    commonTypesEn: ['1N4007 (1A 1000V rectifier)', '1N4148 (fast switching signal)', '1N5408 (3A power rectifier)'],
    realWorldUsesFr: ['Redresseurs AC→DC', 'Protection contre inversion de polarité', 'Diode de roue libre sur relais/moteurs'],
    realWorldUsesEn: ['AC-to-DC power supplies', 'Reverse battery polarity protection', 'Relay coil flyback clamping'],
    visualFaultSignsFr: ['Fissure ou éclatement du boîtier', 'Noircissement autour des soudures'],
    visualFaultSignsEn: ['Cracked or split epoxy package', 'Scorch marks on PCB pads'],
    recommendedModeLabelFr: 'Mode Diode (⊳|)',
    recommendedModeLabelEn: 'Diode Mode (⊳|)',
    safetyNoteFr: 'Testez hors tension avec au moins une patte dessoudée pour une lecture fiable.',
    safetyNoteEn: 'Test with power off and at least one lead lifted from the circuit.',
    stepsFr: [
      'Sélectionnez le mode Diode (⊳|).',
      'Sonde rouge sur Anode (+), noire sur Cathode (anneau) : ~0.5V à 0.7V.',
      'Inversez les sondes : doit afficher OL.',
    ],
    stepsEn: [
      'Select Diode (⊳|) mode.',
      'Red probe on Anode, black on striped Cathode: reads ~0.5V–0.7V.',
      'Reverse probes: must read OL.',
    ],
    goodReadingFr: 'Direct : 0.50V–0.72V | Inverse : OL.',
    goodReadingEn: 'Forward: 0.50V–0.72V | Reverse: OL.',
    openFaultReadingFr: 'OL dans les deux sens.',
    openFaultReadingEn: 'OL in both directions.',
    shortFaultReadingFr: '0.000V et bip continu dans les deux sens.',
    shortFaultReadingEn: '0.000V with continuous beep in both directions.',
    degradedReadingFr: 'Fuite inverse détectable (lecture < 2.0V en sens inverse).',
    degradedReadingEn: 'Reverse leakage reading instead of clean OL.',
  },
  led: {
    nameFr: 'Diode électroluminescente (LED)',
    nameEn: 'Light Emitting Diode (LED)',
    unitFr: 'Volt direct (Vf)',
    unitEn: 'Vf / mA',
    shortRoleFr: 'Émet de la lumière visible lorsqu’elle est traversée par un faible courant direct.',
    shortRoleEn: 'Emits visible light efficiently when forward biased through a current-limiting resistor.',
    fullRoleFr:
      'Utilisée comme témoin lumineux, rétroéclairage d’écran ou éclairage principal. Nécessite toujours une résistance en série pour limiter le courant autour de 10–20mA.',
    fullRoleEn:
      'Serves as status indicators, displays, and lighting. Always requires a series resistor to regulate current (typically 10–20mA for standard 5mm LEDs).',
    howItWorksFr:
      'Les électrons traversant la jonction libèrent des photons. La tension directe varie selon la couleur (~1.8–2.1V rouge/jaune, ~3.0–3.3V bleu/blanc).',
    howItWorksEn:
      'Recombining electrons emit photons across a semiconductor bandgap (~2.0V for red/yellow, ~3.2V for blue/white).',
    pinoutNotesFr: ['Patte longue = Anode (+).', 'Patte courte et méplat sur le bord = Cathode (-).'],
    pinoutNotesEn: ['Longer lead = Anode (+).', 'Shorter lead and flat lens rim = Cathode (-).'],
    commonTypesFr: ['LED 5mm/3mm traversantes', 'LED CMS haute luminosité', 'LED RGB'],
    commonTypesEn: ['5mm/3mm through-hole LEDs', 'High-power SMD LEDs', 'RGB LEDs'],
    realWorldUsesFr: ['Témoins de charge et fonctionnement', 'Éclairage domestique LED', 'Afficheurs numériques'],
    realWorldUsesEn: ['Power and status indicators', 'LED lighting', 'Optoelectronic displays'],
    visualFaultSignsFr: ['Point noir brûlé au centre de la lentille', 'Aucune lueur en mode Diode'],
    visualFaultSignsEn: ['Dark burn spot inside the epoxy dome', 'Fails to glow weakly on Diode test'],
    recommendedModeLabelFr: 'Mode Diode (⊳|)',
    recommendedModeLabelEn: 'Diode Mode (⊳|)',
    safetyNoteFr: 'Ne connectez jamais une LED directement sur 5V ou 9V sans résistance série.',
    safetyNoteEn: 'Never connect an LED directly across a battery without a current-limiting resistor.',
    stepsFr: [
      'En mode Diode, placez la sonde rouge sur la patte longue (+) et la noire sur la courte (-).',
      'La LED s’allume faiblement et affiche ~1.8V à 3.1V selon la couleur.',
    ],
    stepsEn: [
      'In Diode mode, touch red probe to Anode (+) and black to Cathode (-).',
      'A good LED glows dimly and displays ~1.8V to 3.1V depending on color.',
    ],
    goodReadingFr: 'Faible lueur en direct (~1.8–3.0V) et OL en inverse.',
    goodReadingEn: 'Dim glow in forward (~1.8–3.0V) and OL in reverse.',
    openFaultReadingFr: 'OL dans les deux sens sans aucune lumière.',
    openFaultReadingEn: 'OL in both directions with no glow.',
    shortFaultReadingFr: '0.00V et bip sans éclairage.',
    shortFaultReadingEn: '0.00V and beep with no light.',
    degradedReadingFr: 'Lueur très faible ou clignotement instable.',
    degradedReadingEn: 'Very dim or flickering glow under normal current.',
  },
  transistor: {
    nameFr: 'Transistor bipolaire (BJT)',
    nameEn: 'Bipolar Transistor (NPN / PNP)',
    unitFr: 'Gain (hFE)',
    unitEn: 'hFE / A',
    shortRoleFr: 'Amplifie les signaux faibles et agit comme interrupteur électronique rapide.',
    shortRoleEn: 'Amplifies weak signals and acts as a fast electronic switch controlled by Base current.',
    fullRoleFr:
      'Permet à un faible courant sur la Base (B) d’un microcontrôleur de commander un courant beaucoup plus fort entre Collecteur (C) et Émetteur (E) pour piloter relais, moteurs ou amplis audio.',
    fullRoleEn:
      'Allows a tiny microcontroller Base current to switch or amplify a much larger load current flowing between Collector (C) and Emitter (E).',
    howItWorksFr:
      'Composé de trois couches (NPN ou PNP). Dans un NPN (ex : 2N2222, BC547), un courant positif sur B débloque le passage C→E.',
    howItWorksEn:
      'Contains two back-to-back P-N junctions (Base-Emitter and Base-Collector). In an NPN, forward-biasing Base-Emitter turns on Collector-Emitter conduction.',
    pinoutNotesFr: ['3 broches : Base (B), Collecteur (C), Émetteur (E).', 'Vérifiez le brochage selon le boîtier (2N2222 vs BC547).'],
    pinoutNotesEn: ['3 pins: Base (B), Collector (C), Emitter (E).', 'Always verify pin order by part number (TO-92 vs TO-220).'],
    commonTypesFr: ['NPN petits signaux (BC547, 2N2222)', 'PNP complémentaires (BC557, 2N2907)', 'Transistors de puissance (TIP122)'],
    commonTypesEn: ['NPN small-signal (BC547, 2N2222)', 'PNP complementary (BC557)', 'Power Darlington (TIP122)'],
    realWorldUsesFr: ['Pilotage de relais et buzzers', 'Amplificateurs audio', 'Capteurs crépusculaires automatiques'],
    realWorldUsesEn: ['Driving relays and buzzers from MCUs', 'Audio amplification stages', 'Automatic night-light switches'],
    visualFaultSignsFr: ['Boîtier éclaté ou fissuré', 'Court-circuit franc entre C, E et B'],
    visualFaultSignsEn: ['Cracked or blistered plastic package', 'Direct short between Collector, Emitter, and Base'],
    recommendedModeLabelFr: 'Mode Diode (⊳|)',
    recommendedModeLabelEn: 'Diode Mode (⊳|)',
    safetyNoteFr: 'Traitez le transistor comme deux diodes reliées par la Base pour le vérifier au multimètre.',
    safetyNoteEn: 'Test a BJT as two diodes sharing the Base terminal.',
    stepsFr: [
      'NPN : sonde rouge sur Base (B), noire sur Collecteur (C) puis Émetteur (E) → ~0.65V chacun.',
      'Inversez (noire sur B) → OL. Entre C et E → OL dans les deux sens.',
    ],
    stepsEn: [
      'For NPN: Red probe on Base, black on Collector and Emitter → ~0.65V each (B-E slightly higher than B-C).',
      'Reverse (black on Base) → OL. Between C and E → OL in both directions.',
    ],
    goodReadingFr: 'B→C ~0.65V, B→E ~0.68V (NPN) et OL entre C et E.',
    goodReadingEn: 'B→C ~0.65V, B→E ~0.68V (NPN) and OL between C and E.',
    openFaultReadingFr: 'OL sur une jonction B-E ou B-C.',
    openFaultReadingEn: 'OL on either B-E or B-C junction.',
    shortFaultReadingFr: '0.00V et bip entre C et E ou toutes les broches.',
    shortFaultReadingEn: '0.00V beep between Collector and Emitter.',
    degradedReadingFr: 'Forte fuite entre C et E ou gain hFE effondré.',
    degradedReadingEn: 'Leakage current between C and E or severely dropped hFE.',
  },
  relay: {
    nameFr: 'Relais électromagnétique',
    nameEn: 'Electromagnetic Relay',
    unitFr: 'Volt bobine / Ampère',
    unitEn: 'V Coil / A',
    shortRoleFr: 'Commande une charge haute tension (220V AC) grâce à un signal basse tension isolé (5V/12V).',
    shortRoleEn: 'Safely switches high-voltage AC/DC loads using an isolated low-voltage control signal.',
    fullRoleFr:
      'Assure une isolation galvanique totale entre la carte de commande électronique et les appareils domestiques (pompes, lampes 220V, compresseurs).',
    fullRoleEn:
      'Provides full galvanic isolation between delicate 5V/12V logic boards and heavy 220V AC appliances.',
    howItWorksFr:
      'Un électroaimant interne attire un contact mobile mécanique entre COM, NC (normalement fermé) et NO (normalement ouvert).',
    howItWorksEn:
      'Energizing the internal copper coil creates a magnetic field that snaps an armature contact from NC (Normally Closed) to NO (Normally Open).',
    pinoutNotesFr: ['2 broches pour la bobine (non polarisée).', '3 broches de contact : COM, NC (fermé au repos), NO (ouvert au repos).'],
    pinoutNotesEn: ['2 coil pins (non-polarized).', '3 switch pins: COM, NC (connected at rest), NO (connects when energized).'],
    commonTypesFr: ['Relais PCB 5V / 12V (SRD-05VDC)', 'Relais statique (SSR)'],
    commonTypesEn: ['5V / 12V PCB SPDT relay', 'Solid-State Relay (SSR)'],
    realWorldUsesFr: ['Domotique et cartes Arduino', 'Climatiseurs, réfrigérateurs et onduleurs'],
    realWorldUsesEn: ['Smart home automation', 'Appliance compressors and automotive starters'],
    visualFaultSignsFr: ['Contacts soudés restant fermés en permanence', 'Clic audible absent lorsque la bobine est alimentée'],
    visualFaultSignsEn: ['Welded contacts stuck permanently closed', 'No audible click when coil voltage is applied'],
    recommendedModeLabelFr: 'Ohmmètre (Ω) & Continuité',
    recommendedModeLabelEn: 'Ohm (Ω) & Continuity',
    safetyNoteFr: 'Coupez impérativement le secteur 220V avant de sonder les broches COM/NO/NC.',
    safetyNoteEn: 'Disconnect mains AC power completely before testing relay contacts.',
    stepsFr: [
      'Mesurez la bobine en Ω : valeur typique ~70Ω (5V) ou ~350Ω (12V).',
      'Au repos, COM–NC doit bipper et COM–NO doit afficher OL.',
    ],
    stepsEn: [
      'Measure coil resistance: ~70Ω (5V relay) or ~350Ω (12V relay).',
      'At rest: COM–NC beeps (0Ω), COM–NO reads OL.',
    ],
    goodReadingFr: 'Bobine continue (~70–400Ω), COM-NC fermé au repos, bascule vers NO sous tension.',
    goodReadingEn: 'Healthy coil resistance, COM-NC closed at rest, switches to NO when powered.',
    openFaultReadingFr: 'OL sur la bobine (fil brûlé) ou COM-NO ne ferme jamais.',
    openFaultReadingEn: 'OL across coil or contacts fail to close when energized.',
    shortFaultReadingFr: 'COM-NO bippe au repos (contacts soudés).',
    shortFaultReadingEn: 'COM-NO shorted continuously at rest (welded contacts).',
    degradedReadingFr: 'Résistance de contact élevée (>2Ω) provoquant un échauffement.',
    degradedReadingEn: 'Pitted contacts showing >2Ω resistance when closed.',
  },
  regulator: {
    nameFr: 'Régulateur de tension (LM7805)',
    nameEn: 'Voltage Regulator (LM7805)',
    unitFr: 'Volt fixe',
    unitEn: 'V DC',
    shortRoleFr: 'Maintient une tension de sortie continue fixe et stable (ex : +5V) malgré les variations d’entrée.',
    shortRoleEn: 'Produces a rock-steady fixed DC output voltage (e.g. +5V) from a higher fluctuating input.',
    fullRoleFr:
      'Protège les microcontrôleurs et capteurs numériques contre les surtensions et ondulations en fournissant une tension précise (7805 = 5V, 7812 = 12V, AMS1117 = 3.3V).',
    fullRoleEn:
      'Protects microcontrollers and logic chips by delivering a clean regulated rail (7805 gives +5V, 7812 gives +12V, AMS1117 gives +3.3V).',
    howItWorksFr:
      'Un transistor interne ajuste automatiquement sa chute de tension en dissipant l’excédent sous forme de chaleur pour garder Vout constant.',
    howItWorksEn:
      'An internal pass transistor and bandgap reference continuously regulate excess voltage into heat so the output remains fixed.',
    pinoutNotesFr: ['LM7805 face avant (gauche→droite) : 1 IN, 2 GND, 3 OUT (+5V).', 'La semelle métallique est reliée à GND.'],
    pinoutNotesEn: ['LM7805 front view (left→right): 1 IN, 2 GND, 3 OUT (+5V).', 'Metal tab connects to GND on 78xx series.'],
    commonTypesFr: ['Série linéaire 78xx / 79xx', 'Régulateurs LDO (AMS1117-3.3)', 'Modules abaisseurs Buck (LM2596)'],
    commonTypesEn: ['78xx positive linear regulators', 'Low-Dropout LDO (AMS1117-3.3)', 'Buck switching regulators (LM2596)'],
    realWorldUsesFr: ['Alimentation +5V Arduino et logique', 'Cartes électroniques d’appareils ménagers'],
    realWorldUsesEn: ['5V & 3.3V microcontroller power rails', 'Automotive 12V-to-5V adapters'],
    visualFaultSignsFr: ['Surchauffe anormale sans charge', 'Sortie égale à la tension d’entrée (court-circuit interne)'],
    visualFaultSignsEn: ['Extreme overheating with light load', 'Output equals input voltage (internal pass short)'],
    recommendedModeLabelFr: 'Voltmètre DC (V DC)',
    recommendedModeLabelEn: 'DC Voltage (V DC)',
    safetyNoteFr: 'Vérifiez l’absence de court-circuit entre OUT et GND avant la mise sous tension.',
    safetyNoteEn: 'Check for shorts between OUT and GND before powering up.',
    stepsFr: [
      'Sous tension : mesurez IN par rapport à GND (doit être >7V pour un 7805).',
      'Mesurez OUT par rapport à GND : doit afficher +5.00V ±0.2V.',
    ],
    stepsEn: [
      'Powered on: measure IN to GND (must be ≥7V for a 7805).',
      'Measure OUT to GND: must read a steady +5.00V ±0.2V.',
    ],
    goodReadingFr: 'Sortie stable à +5.00V (tolérance ±4%).',
    goodReadingEn: 'Steady +5.00V output within ±4% under load.',
    openFaultReadingFr: 'Sortie 0.00V malgré une entrée valide.',
    openFaultReadingEn: '0.00V at OUT despite valid input voltage.',
    shortFaultReadingFr: '0Ω entre OUT et GND ou IN relié directement à OUT.',
    shortFaultReadingEn: '0Ω short from OUT to GND or IN shorted straight to OUT.',
    degradedReadingFr: 'Tension de sortie instable (<4.5V) ou chute dès la moindre charge.',
    degradedReadingEn: 'Output sags below 4.5V when loaded.',
  },
  potentiometer: {
    nameFr: 'Potentiomètre (Résistance variable)',
    nameEn: 'Potentiometer',
    unitFr: 'Ohm / kΩ',
    unitEn: 'Ω / kΩ',
    shortRoleFr: 'Permet de faire varier manuellement une résistance ou une tension (volume, luminosité, réglage).',
    shortRoleEn: 'Manually varies resistance or output voltage using a rotating knob or slider.',
    fullRoleFr:
      'Utilisé pour régler le volume sonore, le contraste des écrans LCD, le seuil de déclenchement des capteurs ou la vitesse des moteurs.',
    fullRoleEn:
      'Used as audio volume knobs, LCD contrast trimmers, sensor threshold adjusters, and dimmer controls.',
    howItWorksFr:
      'Un curseur mobile (broche centrale 2) glisse sur une piste résistive fixe entre les broches 1 et 3, formant un diviseur de tension mécanique.',
    howItWorksEn:
      'A sliding wiper (center pin 2) moves across a fixed resistive track between outer pins 1 and 3, creating an adjustable voltage divider.',
    pinoutNotesFr: ['1 et 3 : résistance totale fixe (ex : 10kΩ).', '2 (centre) : curseur variable.'],
    pinoutNotesEn: ['Outer pins 1 & 3: fixed total resistance.', 'Center pin 2: movable wiper terminal.'],
    commonTypesFr: ['Rotatif à axe', 'Trimpot bleu de précision (103 = 10kΩ)', 'Linéaire à glissière'],
    commonTypesEn: ['Panel-mount rotary pot', 'Blue multi-turn trimpot', 'Linear slide fader'],
    realWorldUsesFr: ['Réglage de volume et tonalité', 'Calibration des capteurs et contraste LCD'],
    realWorldUsesEn: ['Audio volume & tone knobs', 'Sensor calibration & LCD contrast'],
    visualFaultSignsFr: ['Craquements audio lors de la rotation', 'Sauts brusques ou coupures de lecture'],
    visualFaultSignsEn: ['Scratchy audio static when turned', 'Sudden OL dropouts while rotating'],
    recommendedModeLabelFr: 'Mode Ohmmètre (Ω)',
    recommendedModeLabelEn: 'Ohm Mode (Ω)',
    safetyNoteFr: 'Tournez lentement le curseur pendant la mesure pour détecter les zones usées.',
    safetyNoteEn: 'Rotate the shaft slowly during measurement to catch dead spots on the track.',
    stepsFr: [
      'Mesurez entre 1 et 3 : doit rester fixe à la valeur inscrite (ex : 10kΩ).',
      'Mesurez entre 1 et 2 tout en tournant : doit varier progressivement de ~0Ω à 10kΩ.',
    ],
    stepsEn: [
      'Measure between outer pins 1 & 3: must stay constant (e.g., 10kΩ).',
      'Measure between pin 1 & center pin 2 while turning: must sweep smoothly from ~0Ω to 10kΩ.',
    ],
    goodReadingFr: '1–3 fixe à la valeur nominale ; 1–2 varie sans sauts.',
    goodReadingEn: 'Outer pins steady at rated value; wiper sweeps smoothly without dropouts.',
    openFaultReadingFr: 'OL sur la broche centrale (curseur cassé ou piste usée).',
    openFaultReadingEn: 'OL on wiper pin or intermittent spikes while turning.',
    shortFaultReadingFr: '0Ω permanent quelle que soit la position du bouton.',
    shortFaultReadingEn: 'Stuck near 0Ω regardless of shaft position.',
    degradedReadingFr: 'Valeurs saccadées dues à l’encrassement de la piste carbone.',
    degradedReadingEn: 'Jumpy or erratic resistance caused by worn/dirty carbon track.',
  },
  ic_chip: {
    nameFr: 'Circuit intégré (IC)',
    nameEn: 'Integrated Circuit (IC)',
    unitFr: 'Broches / Logique',
    unitEn: 'Pins / V',
    shortRoleFr: 'Regroupe des milliers ou millions de composants microscopiques dans un seul boîtier pour exécuter des fonctions logiques ou de commande.',
    shortRoleEn: 'Packs complete electronic circuits—microcontrollers, timers, or logic gates—inside a single silicon chip.',
    fullRoleFr:
      'Véritable cerveau des appareils électroniques : contrôle des moteurs, gestion d’écrans, traitement numérique, temporisation et régulation PWM.',
    fullRoleEn:
      'Serves as the brain of modern devices—handling timing, PWM regulation, digital communication, and system control.',
    howItWorksFr:
      'Une puce de silicium gravée est reliée par de fins fils d’or aux broches externes du boîtier DIP ou SMD. L’encoche ou le point indique toujours la broche 1.',
    howItWorksEn:
      'Microscopic transistors etched on silicon connect to external DIP or SMD pins. A notch or recessed dot always marks Pin 1.',
    pinoutNotesFr: ['Placez l’encoche à gauche/haut : la broche 1 est juste dessous, puis comptez en U dans le sens anti-horaire.'],
    pinoutNotesEn: ['With the notch facing up/left, Pin 1 is top-left and numbering runs counter-clockwise in a U-shape.'],
    commonTypesFr: ['Microcontrôleurs (ATmega328P)', 'Portes logiques (74HCxx)', 'CI PWM d’alimentation'],
    commonTypesEn: ['Microcontrollers (ATmega328P)', 'Logic gates (74HCxx)', 'Power PWM controllers'],
    realWorldUsesFr: ['Cartes mères et Arduino', 'Téléviseurs, chargeurs et électroménager'],
    realWorldUsesEn: ['Motherboards and Arduino controllers', 'Chargers, TVs, and smart appliances'],
    visualFaultSignsFr: ['Cratère brûlé sur le dessus', 'Échauffement immédiat au démarrage'],
    visualFaultSignsEn: ['Blister hole or scorched crater on package', 'Instant overheating when powered'],
    recommendedModeLabelFr: 'Diode (⊳|) & Voltmètre',
    recommendedModeLabelEn: 'Diode (⊳|) & V DC',
    safetyNoteFr: 'Vérifiez en priorité l’absence de court-circuit entre VCC et GND.',
    safetyNoteEn: 'First test VCC to GND for shorts before applying power.',
    stepsFr: [
      'Hors tension en mode Diode/Ω : vérifiez que VCC et GND ne sont pas en court-circuit.',
      'Sous tension : vérifiez que la tension d’alimentation (5V ou 3.3V) atteint bien VCC.',
    ],
    stepsEn: [
      'Power off (Diode/Ohm): confirm VCC and GND are not shorted.',
      'Power on (V DC): confirm nominal supply voltage arrives at VCC pin.',
    ],
    goodReadingFr: 'Pas de court-circuit VCC–GND et alimentation stable sur VCC.',
    goodReadingEn: 'No VCC–GND short and stable supply voltage present.',
    openFaultReadingFr: 'Sorties inactives (0V) malgré une alimentation correcte.',
    openFaultReadingEn: 'Dead outputs despite clean VCC supply.',
    shortFaultReadingFr: '0Ω entre VCC et GND provoquant la chute de l’alimentation.',
    shortFaultReadingEn: '0Ω short between VCC and GND rails.',
    degradedReadingFr: 'Surchauffe rapide ou broche I/O bloquée à l’état bas.',
    degradedReadingEn: 'Overheating or stuck I/O pin.',
  },
  ldr: {
    nameFr: 'Photorésistance (LDR)',
    nameEn: 'Light Dependent Resistor (LDR)',
    unitFr: 'Ohm / Lux',
    unitEn: 'Ω / Lux',
    shortRoleFr: 'Capteur dont la résistance chute fortement à la lumière et augmente dans l’obscurité.',
    shortRoleEn: 'Light sensor whose resistance drops sharply in bright light and rises in darkness.',
    fullRoleFr:
      'Utilisée dans les lampadaires automatiques, veilleuses nocturnes, capteurs d’alarme et réglage automatique de luminosité.',
    fullRoleEn:
      'Used in automatic street lamps, night lights, laser tripwires, and automatic screen brightness sensors.',
    howItWorksFr:
      'Les photons incidents libèrent des électrons dans la piste de sulfure de cadmium (CdS), abaissant la résistance de plusieurs centaines de kΩ à quelques centaines d’ohms.',
    howItWorksEn:
      'Incoming photons free charge carriers in the cadmium-sulfide track, dropping resistance from hundreds of kΩ in darkness to a few hundred Ω in daylight.',
    pinoutNotesFr: ['Composant non polarisé (sens de montage indifférent).'],
    pinoutNotesEn: ['Non-polarized two-terminal sensor.'],
    commonTypesFr: ['GL5528 / GL5516 (diamètre 5mm)', 'Modules LDR avec comparateur LM393'],
    commonTypesEn: ['GL5528 / GL5516 5mm cells', 'LM393 LDR sensor modules'],
    realWorldUsesFr: ['Éclairage public automatique', 'Robots suiveurs de lumière'],
    realWorldUsesEn: ['Automatic outdoor lighting', 'Light-seeking robots'],
    visualFaultSignsFr: ['Fissure sur la face supérieure', 'Aucune variation de résistance entre ombre et lumière'],
    visualFaultSignsEn: ['Cracked window coating', 'Resistance stays constant between dark and light'],
    recommendedModeLabelFr: 'Mode Ohmmètre (Ω)',
    recommendedModeLabelEn: 'Ohm Mode (Ω)',
    safetyNoteFr: 'Couvrez le capteur avec votre doigt puis exposez-le à une lampe pendant la lecture.',
    safetyNoteEn: 'Cover the cell with your hand and then expose it to light while watching the ohmmeter.',
    stepsFr: [
      'Mesurez en mode Ohmmètre à la lumière ambiante (~1kΩ–10kΩ).',
      'Couvrez le capteur : la valeur doit grimper au-delà de 100kΩ.',
    ],
    stepsEn: [
      'Measure in Ohm mode under room light (~1kΩ–10kΩ).',
      'Cover completely: resistance must jump past 100kΩ.',
    ],
    goodReadingFr: 'Lumière : ~400Ω–5kΩ | Obscurité : >150kΩ.',
    goodReadingEn: 'Bright: ~400Ω–5kΩ | Dark: >150kΩ.',
    openFaultReadingFr: 'Reste à OL même en plein éclairage.',
    openFaultReadingEn: 'Remains OL even under direct bright light.',
    shortFaultReadingFr: '0Ω permanent même dans le noir total.',
    shortFaultReadingEn: 'Reads ~0Ω even in complete darkness.',
    degradedReadingFr: 'Réponse très lente ou faible écart entre jour et nuit.',
    degradedReadingEn: 'Narrow resistance swing between dark and light.',
  },
  fuse: {
    nameFr: 'Fusible de protection',
    nameEn: 'Protection Fuse',
    unitFr: 'Ampère (A)',
    unitEn: 'A / mA',
    shortRoleFr: 'Élément sacrificiel qui fond et coupe le circuit en cas de surintensité ou de court-circuit.',
    shortRoleEn: 'Sacrificial safety link that melts open during overcurrent or short circuits to prevent fires.',
    fullRoleFr:
      'Première ligne de défense dans chaque appareil électrique : coupe instantanément l’alimentation avant que les pistes ou le transformateur ne prennent feu.',
    fullRoleEn:
      'First line of defense in electronics: breaks the circuit immediately when current exceeds safe limits.',
    howItWorksFr:
      'Un fil calibré à point de fusion précis s’échauffe par effet Joule (I²R) et fond en quelques millisecondes lorsque le courant nominal est dépassé.',
    howItWorksEn:
      'A precision metal filament heats up via I²R losses and melts open when current exceeds its rated amperage.',
    pinoutNotesFr: ['Non polarisé, toujours monté en série sur l’entrée d’alimentation.'],
    pinoutNotesEn: ['Non-polarized, always wired in series on the power input rail.'],
    commonTypesFr: ['Fusible verre rapide/temporisé (5×20mm)', 'Fusible céramique haute capacité', 'Fusible réarmable PTC'],
    commonTypesEn: ['Glass tube fast/slow blow (5×20mm)', 'Ceramic high-rupture fuse', 'Resettable PTC polyfuse'],
    realWorldUsesFr: ['Alimentations 220V et chargeurs', 'Automobile et multimètres numériques'],
    realWorldUsesEn: ['Mains power supplies and chargers', 'Automotive fuse boxes and multimeters'],
    visualFaultSignsFr: ['Fil interne fondu ou coupé', 'Verre noirci (court-circuit franc en aval)'],
    visualFaultSignsEn: ['Broken internal wire', 'Blackened glass tube (severe downstream short)'],
    recommendedModeLabelFr: 'Mode Continuité / Ω',
    recommendedModeLabelEn: 'Continuity / Ohm Mode',
    safetyNoteFr: 'Si un fusible neuf grille immédiatement, cherchez le court-circuit en aval (varistance, pont, MOSFET).',
    safetyNoteEn: 'If a replacement fuse blows immediately, troubleshoot downstream shorts first.',
    stepsFr: [
      'Retirez le fusible du support hors tension.',
      'Testez en mode Continuité : le bip franc confirme qu’il est intact.',
    ],
    stepsEn: [
      'Remove the fuse from its holder with power off.',
      'Check on Continuity mode: a solid beep (<0.5Ω) means it is good.',
    ],
    goodReadingFr: 'Bip continu et résistance < 0.5Ω.',
    goodReadingEn: 'Continuous beep and resistance below 0.5Ω.',
    openFaultReadingFr: 'OL sans aucun bip (fusible grillé).',
    openFaultReadingEn: 'OL with no beep (blown fuse).',
    shortFaultReadingFr: 'Le fusible sain est un court-circuit voulu (0Ω).',
    shortFaultReadingEn: 'A healthy fuse naturally acts as a ~0Ω link.',
    degradedReadingFr: 'Oxydation des embouts augmentant la résistance (>2Ω).',
    degradedReadingEn: 'Corroded end caps causing >2Ω contact drop.',
  },
  zener: {
    nameFr: 'Diode Zener',
    nameEn: 'Zener Diode',
    unitFr: 'Tension Zener (Vz)',
    unitEn: 'Vz',
    shortRoleFr: 'Maintient une tension de référence stable grâce à une conduction inverse contrôlée.',
    shortRoleEn: 'Regulates and clamps voltage by conducting cleanly in reverse at a precise Zener voltage (Vz).',
    fullRoleFr:
      'Utilisée dans les alimentations comme référence de tension ou limiteur de surtension, toujours accompagnée d’une résistance série.',
    fullRoleEn:
      'Used as voltage references and overvoltage clamps when wired in reverse bias with a series current-limiting resistor.',
    howItWorksFr:
      'En sens direct elle se comporte comme une diode normale (~0.7V), mais en inverse elle stabilise la tension exactement à Vz (3.3V, 5.1V, 12V...).',
    howItWorksEn:
      'Conducts like a normal diode (~0.7V) forward, and enters safe avalanche/Zener breakdown in reverse to hold voltage steady at Vz.',
    pinoutNotesFr: ['Anneau noir = Cathode (-), branchée vers le côté positif (+) pour stabiliser Vz.'],
    pinoutNotesEn: ['Black band = Cathode (-), connected toward the positive rail via a resistor when regulating.'],
    commonTypesFr: ['1N4733A (5.1V 1W)', 'BZX55C (0.5W petit signal)'],
    commonTypesEn: ['1N4733A (5.1V 1W)', 'BZX55C (0.5W signal Zener)'],
    realWorldUsesFr: ['Référence de tension', 'Protection des entrées analogiques et portes MOSFET'],
    realWorldUsesEn: ['Voltage references', 'MOSFET gate and MCU input overvoltage protection'],
    visualFaultSignsFr: ['Corps en verre orange fissuré', 'Court-circuit permanent bloquant la ligne à 0V'],
    visualFaultSignsEn: ['Cracked glass body', 'Short-circuit clamping rail to 0V'],
    recommendedModeLabelFr: 'Diode (⊳|) & V DC',
    recommendedModeLabelEn: 'Diode (⊳|) & V DC',
    safetyNoteFr: 'Pour mesurer Vz réel, alimentez la Zener en inverse via une résistance de 1kΩ.',
    safetyNoteEn: 'To verify actual Vz, reverse-bias through a 1kΩ resistor from a higher DC supply.',
    stepsFr: [
      'En mode Diode : ~0.7V en direct et OL en inverse (comme une diode saine).',
      'Sous tension avec résistance 1kΩ en inverse : le voltmètre lit exactement Vz.',
    ],
    stepsEn: [
      'On Diode mode: reads ~0.7V forward and OL reverse.',
      'Under reverse test with 1kΩ resistor: voltmeter reads exact Vz.',
    ],
    goodReadingFr: 'Direct ~0.70V, Inverse OL ; régule à Vz sous test en circuit.',
    goodReadingEn: 'Forward ~0.70V, Reverse OL; clamps accurately at Vz when biased.',
    openFaultReadingFr: 'OL en direct comme en inverse.',
    openFaultReadingEn: 'OL in both directions or fails to clamp.',
    shortFaultReadingFr: '0.00V et bip dans les deux sens.',
    shortFaultReadingEn: '0.00V beep in both directions.',
    degradedReadingFr: 'Fuite importante en dessous de Vz.',
    degradedReadingEn: 'Soft knee / leakage well below Vz.',
  },
  bridge_rectifier: {
    nameFr: 'Pont de diodes (Redresseur)',
    nameEn: 'Bridge Rectifier (RS207 / KBP)',
    unitFr: 'Ampère / Volt',
    unitEn: 'A / V',
    shortRoleFr: 'Convertit le courant alternatif (AC) en courant continu pulsé (DC) grâce à 4 diodes internes.',
    shortRoleEn: 'Converts AC input into full-wave DC output using 4 internal diodes in one package.',
    fullRoleFr:
      'Premier étage de conversion après le secteur ou le transformateur dans tous les chargeurs et alimentations.',
    fullRoleEn:
      'First conversion block after the AC mains or transformer in virtually every DC power supply.',
    howItWorksFr:
      'Aiguille les deux alternances (positive et négative) de la sinusoïde AC vers les bornes (+) et (-) pour exploiter 100% du cycle.',
    howItWorksEn:
      'Steers both positive and negative AC half-cycles so current always exits the (+) terminal and returns to (-).',
    pinoutNotesFr: ['2 broches centrales (~ ~) pour l’entrée AC.', '2 broches externes (+) et (-) pour la sortie DC.'],
    pinoutNotesEn: ['Middle (~ ~) pins: AC input.', 'Outer (+) and (-) pins: DC output.'],
    commonTypesFr: ['RS207 / KBP206 (2A)', 'DB107 (1A DIP-4)', 'KBPC5010 (50A carré)'],
    commonTypesEn: ['RS207 / KBP206 (2A)', 'DB107 (1A DIP-4)', 'KBPC5010 (50A metal)'],
    realWorldUsesFr: ['Chargeurs de téléphone et alimentations TV', 'Sorties de transformateurs 12V/24V'],
    realWorldUsesEn: ['Phone chargers & TV power boards', '12V/24V linear power supplies'],
    visualFaultSignsFr: ['Boîtier éclaté après surtension', 'Court-circuit entre ~ et + ou -'],
    visualFaultSignsEn: ['Split package after mains surge', 'Shorted diodes blowing input fuse'],
    recommendedModeLabelFr: 'Mode Diode (⊳|)',
    recommendedModeLabelEn: 'Diode Mode (⊳|)',
    safetyNoteFr: 'Testez chacune des 4 diodes internes individuellement en mode Diode.',
    safetyNoteEn: 'Verify all 4 internal diodes individually using Diode mode.',
    stepsFr: [
      'Noire sur (+) et rouge sur chaque (~) : ~0.55V ; inverse → OL.',
      'Rouge sur (-) et noire sur chaque (~) : ~0.55V ; inverse → OL.',
    ],
    stepsEn: [
      'Black probe on (+) and red on each (~): ~0.55V; reverse → OL.',
      'Red probe on (-) and black on each (~): ~0.55V; reverse → OL.',
    ],
    goodReadingFr: '4 lectures à ~0.55V en direct, OL en inverse et OL entre les deux (~).',
    goodReadingEn: '4 healthy ~0.55V junctions forward, OL reverse, and OL between (~) pins.',
    openFaultReadingFr: 'Une des 4 branches donne OL dans les deux sens.',
    openFaultReadingEn: 'Any internal diode reads OL both ways.',
    shortFaultReadingFr: '0.00V et bip entre (~) et (+) ou (-).',
    shortFaultReadingEn: '0.00V beep between (~) and (+) or (-).',
    degradedReadingFr: 'Chute anormale ou déséquilibre entre les branches.',
    degradedReadingEn: 'Uneven forward drops or reverse leakage.',
  },
  crystal: {
    nameFr: 'Quartz oscillateur (Cristal)',
    nameEn: 'Crystal Oscillator',
    unitFr: 'Mégahertz / kHz',
    unitEn: 'MHz / kHz',
    shortRoleFr: 'Génère une fréquence d’horloge ultra-précise pour synchroniser microcontrôleurs et montres.',
    shortRoleEn: 'Produces an ultra-stable clock frequency to synchronize microcontrollers and real-time clocks.',
    fullRoleFr:
      'Sans le quartz (ex : 16MHz pour Arduino ou 32.768kHz pour les montres), un processeur ne peut ni exécuter ses instructions ni garder l’heure exacte.',
    fullRoleEn:
      'Provides the precise heartbeat for microcontrollers (16MHz), USB controllers (12MHz), and digital watches (32.768kHz).',
    howItWorksFr:
      'Utilise l’effet piézoélectrique d’une lame de quartz taillée qui vibre mécaniquement à une fréquence fixe dès qu’elle reçoit un signal électrique.',
    howItWorksEn:
      'Piezoelectric quartz resonates mechanically at a fixed frequency when excited electrically, with ppm-level accuracy.',
    pinoutNotesFr: ['2 broches non polarisées, accompagnées de deux petits condensateurs de 22pF vers GND.'],
    pinoutNotesEn: ['Two non-polarized pins, typically paired with two 22pF load capacitors to ground.'],
    commonTypesFr: ['HC-49S 16MHz / 8MHz / 12MHz', 'Cylindrique 32.768kHz horloger'],
    commonTypesEn: ['HC-49S MHz metal can', '32.768kHz RTC watch cylinder'],
    realWorldUsesFr: ['Cartes Arduino et microcontrôleurs', 'Montres et cartes mères PC'],
    realWorldUsesEn: ['Arduino & MCU clocks', 'Motherboards & digital clocks'],
    visualFaultSignsFr: ['Choc violent cassant le cristal interne', 'Carte figée ne démarrant plus'],
    visualFaultSignsEn: ['Physical drop cracking internal quartz wafer', 'Dead device with good power rails'],
    recommendedModeLabelFr: 'Ohmmètre / Fréquencemètre',
    recommendedModeLabelEn: 'Ohm / Frequency Meter',
    safetyNoteFr: 'Un quartz sain est un isolant parfait en continu (OL à l’ohmmètre) !',
    safetyNoteEn: 'A healthy crystal reads OL (open circuit) on DC Ohm mode—a beep means it is shorted!',
    stepsFr: [
      'Hors carte en mode Ω : doit impérativement afficher OL entre les 2 pattes.',
      'Sous tension avec fréquencemètre/oscilloscope : affiche la fréquence nominale (ex : 16.000MHz).',
    ],
    stepsEn: [
      'Out-of-circuit Ohm check: must read OL between both pins and to the metal case.',
      'Under power with frequency counter/scope: reads exact MHz oscillation.',
    ],
    goodReadingFr: 'OL à l’ohmmètre (aucun court-circuit) et oscillation exacte sous tension.',
    goodReadingEn: 'OL on Ohm mode; clean oscillation under power.',
    openFaultReadingFr: 'Absence d’oscillation sous tension (remplacement nécessaire).',
    openFaultReadingEn: 'No oscillation under power despite intact load capacitors.',
    shortFaultReadingFr: 'Lecture ohmique faible ou bip entre pattes ou vers le boîtier.',
    shortFaultReadingEn: 'Low ohms or beep across pins or to metal can.',
    degradedReadingFr: 'Dérive de fréquence entraînant des erreurs de communication.',
    degradedReadingEn: 'Frequency drift causing timing/communication failures.',
  },
  buzzer: {
    nameFr: 'Buzzer piézoélectrique',
    nameEn: 'Buzzer',
    unitFr: 'Décibel / Volt',
    unitEn: 'dB / V',
    shortRoleFr: 'Convertit un signal électrique en son d’alerte ou tonalité dans les appareils et alarmes.',
    shortRoleEn: 'Converts electrical power into clear audible beeps or alert tones.',
    fullRoleFr:
      'Le buzzer actif sonne dès qu’on lui applique une tension continue (5V), tandis que le buzzer passif nécessite un signal PWM pour jouer différentes notes.',
    fullRoleEn:
      'Active buzzers beep immediately on DC power; passive buzzers play variable musical tones when driven by PWM.',
    howItWorksFr:
      'Une pastille piézoélectrique ou une micro-bobine fait vibrer une membrane à fréquence audible (~2–4kHz).',
    howItWorksEn:
      'A piezoelectric disc flexes rapidly under voltage to produce crisp ~2–4kHz sound waves.',
    pinoutNotesFr: ['Polarisé (+ souvent marqué sur le dessus et patte la plus longue).'],
    pinoutNotesEn: ['Polarized (+ marked on top housing and longer lead).'],
    commonTypesFr: ['Buzzer actif (avec oscillateur interne)', 'Buzzer passif (piézo nu ou boîtier ouvert)'],
    commonTypesEn: ['Active DC buzzer', 'Passive piezo transducer'],
    realWorldUsesFr: ['Bip des multimètres et micro-ondes', 'Systèmes d’alarme et capteurs de recul'],
    realWorldUsesEn: ['Multimeter continuity beeps', 'Microwave alerts and alarms'],
    visualFaultSignsFr: ['Son très faible ou muet', 'Membrane piézo fissurée'],
    visualFaultSignsEn: ['Silent or severely distorted sound', 'Cracked piezo element'],
    recommendedModeLabelFr: 'Mode Diode / Ω',
    recommendedModeLabelEn: 'Diode / Ohm Mode',
    safetyNoteFr: 'Respectez la tension nominale (5V ou 12V) lors d’un test direct.',
    safetyNoteEn: 'Respect the rated DC voltage (e.g., 5V or 12V) when testing.',
    stepsFr: [
      'Un buzzer actif alimenté en 5V doit émettre un bip franc immédiat.',
      'Sur un buzzer piézo passif en Ω : il affiche OL (capacitif) et cliquette légèrement au contact des sondes.',
    ],
    stepsEn: [
      'Apply rated 5V DC to an active buzzer: emits clear continuous tone.',
      'Passive piezo reads OL on Ohm mode and clicks lightly when probed.',
    ],
    goodReadingFr: 'Son net sous tension nominale ; électromagnétique ~16–40Ω.',
    goodReadingEn: 'Clear tone at rated voltage; electromagnetic type reads ~16–40Ω.',
    openFaultReadingFr: 'Muet et OL même sous tension correcte.',
    openFaultReadingEn: 'Silent and OL under rated voltage.',
    shortFaultReadingFr: '0.0Ω provoquant une surconsommation sans son.',
    shortFaultReadingEn: '0.0Ω dead short with no sound.',
    degradedReadingFr: 'Son grésillant ou très faible.',
    degradedReadingEn: 'Weak or raspy sound output.',
  },
  push_button: {
    nameFr: 'Bouton-poussoir (Tactile)',
    nameEn: 'Push Button (Tactile Switch)',
    unitFr: 'Contact momentané',
    unitEn: 'NO Momentary',
    shortRoleFr: 'Interrupteur momentané qui ferme le circuit uniquement pendant la pression du doigt.',
    shortRoleEn: 'Momentary switch that closes the circuit only while pressed and springs back open.',
    fullRoleFr:
      'Bouton de commande universel pour Reset, réglage d’heure, claviers d’appareils et entrées numériques Arduino.',
    fullRoleEn:
      'Universal user input for device power/reset buttons, appliance panels, and microcontroller inputs.',
    howItWorksFr:
      'Une coupelle métallique élastique sous le bouton vient ponter les deux paires de broches dès l’appui, puis rebondit en position ouverte.',
    howItWorksEn:
      'A snap-dome metal disc bridges the two terminal pairs when pressed and springs open on release.',
    pinoutNotesFr: ['Dans les boutons à 4 pattes, chaque côté forme une paire reliée en permanence ; l’appui relie les deux côtés opposés.'],
    pinoutNotesEn: ['On 4-pin tactile switches, pins on the same side are internally connected; pressing bridges across opposite sides.'],
    commonTypesFr: ['Bouton tactile 6×6mm à 4 pattes', 'Bouton poussoir panneau'],
    commonTypesEn: ['6×6mm 4-pin tactile switch', 'Panel-mount momentary button'],
    realWorldUsesFr: ['Boutons Reset et façade TV/micro-ondes', 'Claviers de commande Arduino'],
    realWorldUsesEn: ['Reset & control buttons on electronics', 'Arduino digital inputs'],
    visualFaultSignsFr: ['Double clic involontaire ou besoin d’appuyer très fort', 'Bouton bloqué mécaniquement'],
    visualFaultSignsEn: ['Requires heavy force to trigger', 'Stuck physically closed'],
    recommendedModeLabelFr: 'Mode Continuité / Ω',
    recommendedModeLabelEn: 'Continuity / Ohm Mode',
    safetyNoteFr: 'Placez toujours les sondes sur deux broches de côtés opposés.',
    safetyNoteEn: 'Always probe across opposite sides of the 4-pin switch.',
    stepsFr: [
      'Au repos sur deux broches opposées : affiche OL.',
      'Appuyez sur le bouton : bip immédiat (~0.1Ω), puis retour à OL au relâchement.',
    ],
    stepsEn: [
      'Unpressed across opposite pins: reads OL.',
      'Press button: immediate continuity beep (~0.1Ω), returns to OL on release.',
    ],
    goodReadingFr: 'OL au repos, <0.5Ω net pendant l’appui.',
    goodReadingEn: 'OL unpressed, <0.5Ω crisp contact when pressed.',
    openFaultReadingFr: 'Reste OL même en appuyant fort (contacts oxydés).',
    openFaultReadingEn: 'Stays OL even when pressed firmly.',
    shortFaultReadingFr: 'Bip continu même sans appuyer (coupelle écrasée).',
    shortFaultReadingEn: 'Beeps continuously while unpressed.',
    degradedReadingFr: 'Résistance instable (>10Ω) lors de l’appui.',
    degradedReadingEn: 'High/fluctuating contact resistance (>10Ω) when pressed.',
  },
  rocker_switch: {
    nameFr: 'Interrupteur à bascule (ON/OFF)',
    nameEn: 'Rocker / Toggle Switch',
    unitFr: 'Ampère / Volt',
    unitEn: 'A / VAC',
    shortRoleFr: 'Interrupteur mécanique maintenu pour allumer ou couper durablement l’alimentation d’un appareil.',
    shortRoleEn: 'Latching mechanical switch that stays ON or OFF to control main power.',
    fullRoleFr:
      'Utilisé comme interrupteur secteur principal sur les multiprises, alimentations de laboratoire et appareils ménagers.',
    fullRoleEn:
      'Commonly used as main power switches on power strips, bench supplies, and appliances.',
    howItWorksFr:
      'Un levier à bascule déplace un contact cuivré entre les positions (I) fermé et (O) ouvert, maintenant mécaniquement l’état choisi.',
    howItWorksEn:
      'A rocking actuator snaps internal brass contacts between (I) ON and (O) OFF positions.',
    pinoutNotesFr: ['SPST à 2 broches : coupe un fil.', 'Version 3 broches : la 3e sert souvent au voyant néon interne.'],
    pinoutNotesEn: ['2-pin SPST breaks one line.', '3-pin lighted versions use the 3rd pin for the internal neon lamp.'],
    commonTypesFr: ['SPST 2 broches 6A/250V', 'DPST 4 broches (coupe phase et neutre)'],
    commonTypesEn: ['2-pin SPST rocker', '4-pin DPST dual-pole power switch'],
    realWorldUsesFr: ['Multiprises et blocs secteur', 'Coffrets et projets DIY'],
    realWorldUsesEn: ['Power strips & PSU panels', 'DIY enclosures'],
    visualFaultSignsFr: ['Levier mou ne tenant plus en position', 'Plastique fondu autour des cosses'],
    visualFaultSignsEn: ['Loose actuator failing to latch', 'Melted plastic around terminals'],
    recommendedModeLabelFr: 'Mode Continuité / Ω',
    recommendedModeLabelEn: 'Continuity / Ohm Mode',
    safetyNoteFr: 'Débranchez totalement le câble secteur avant de tester.',
    safetyNoteEn: 'Unplug AC mains completely before probing.',
    stepsFr: [
      'Position (O) OFF : doit afficher OL.',
      'Position (I) ON : doit bipper franchement (~0.05Ω).',
    ],
    stepsEn: [
      'In (O) OFF position: reads OL.',
      'In (I) ON position: beeps cleanly (~0.05Ω).',
    ],
    goodReadingFr: 'OL sur O, bip franc (<0.1Ω) sur I.',
    goodReadingEn: 'OL on O, <0.1Ω continuity on I.',
    openFaultReadingFr: 'Reste OL même en position I.',
    openFaultReadingEn: 'Stays OL even when switched to I.',
    shortFaultReadingFr: 'Reste fermé sur I et O.',
    shortFaultReadingEn: 'Remains shorted in both positions.',
    degradedReadingFr: 'Résistance de contact >1Ω provoquant un échauffement.',
    degradedReadingEn: 'High contact resistance (>1Ω) causing arcing/heat.',
  },
  seven_segment: {
    nameFr: 'Afficheur 7 segments',
    nameEn: '7-Segment Display',
    unitFr: 'Segments LED',
    unitEn: 'LED Segments',
    shortRoleFr: 'Affiche les chiffres de 0 à 9 à l’aide de 7 barres LED disposées en forme de 8.',
    shortRoleEn: 'Displays decimal digits 0–9 using 7 bar LEDs plus a decimal point.',
    fullRoleFr:
      'Présent sur les horloges numériques, micro-ondes, compteurs, balances et voltmètres de tableau.',
    fullRoleEn:
      'Found on digital clocks, microwaves, industrial counters, and panel voltmeters.',
    howItWorksFr:
      'Chaque barre (a à g + dp) est une LED reliée à une broche commune, soit Anode commune (+), soit Cathode commune (-).',
    howItWorksEn:
      'Each segment (a–g and dp) is an individual LED sharing either a Common Anode (+) or Common Cathode (-) pin.',
    pinoutNotesFr: ['10 broches : les 2 broches centrales (haut et bas) sont le Commun (COM).', 'Utilisez une résistance sur chaque segment.'],
    pinoutNotesEn: ['10 pins: middle pins top & bottom are the Common (COM) terminal.', 'Use current-limiting resistors on segments.'],
    commonTypesFr: ['Cathode commune (COM négatif)', 'Anode commune (COM positif)', 'Multi-chiffres multiplexés'],
    commonTypesEn: ['Common Cathode', 'Common Anode', 'Multi-digit multiplexed modules'],
    realWorldUsesFr: ['Horloges et minuteurs', 'Voltmètres numériques et compteurs'],
    realWorldUsesEn: ['Clocks & kitchen timers', 'Panel meters & counters'],
    visualFaultSignsFr: ['Un segment reste éteint (ex : barre centrale g)', 'Chiffre incomplet'],
    visualFaultSignsEn: ['One bar stays dead while others light', 'Missing decimal point'],
    recommendedModeLabelFr: 'Mode Diode (⊳|)',
    recommendedModeLabelEn: 'Diode Mode (⊳|)',
    safetyNoteFr: 'Le test en mode Diode permet d’allumer et d’identifier instantanément chaque segment.',
    safetyNoteEn: 'Diode mode safely lights each individual segment without external resistors.',
    stepsFr: [
      'Placez une sonde sur la broche centrale COM et balayez les autres broches avec l’autre sonde.',
      'Si la rouge sur COM allume les barres → Anode commune ; si la noire sur COM → Cathode commune.',
    ],
    stepsEn: [
      'Hold one probe on center COM pin and sweep the remaining pins.',
      'Lights with black on COM = Common Cathode; red on COM = Common Anode.',
    ],
    goodReadingFr: 'Chaque segment s’allume clairement (~1.8–2.1V).',
    goodReadingEn: 'All 7 segments + DP light evenly at ~1.8–2.1V.',
    openFaultReadingFr: 'Un segment ne s’allume pas (OL).',
    openFaultReadingEn: 'Dead segment reads OL and stays dark.',
    shortFaultReadingFr: '0.00V sur une broche (segment en court-circuit).',
    shortFaultReadingEn: '0.00V short across a segment.',
    degradedReadingFr: 'Luminosité très faible sur un segment usé.',
    degradedReadingEn: 'Noticeably dimmer segment.',
  },
  battery: {
    nameFr: 'Batterie & Accumulateur',
    nameEn: 'Battery & Rechargeable Cell',
    unitFr: 'Volt / mAh',
    unitEn: 'V / mAh',
    shortRoleFr: 'Source d’énergie chimique fournissant une tension continue portable aux circuits.',
    shortRoleEn: 'Electrochemical energy source providing portable DC power to electronic devices.',
    fullRoleFr:
      'Alimente tout système autonome : piles alcalines jetables (1.5V, 9V) ou accumulateurs rechargeables Li-Ion 18650 (3.7V nominal, 4.2V chargé).',
    fullRoleEn:
      'Powers portable electronics—either disposable alkaline cells (1.5V, 9V) or rechargeable Li-Ion 18650 cells (3.7V nominal, 4.2V full).',
    howItWorksFr:
      'Une réaction électrochimique crée une différence de potentiel entre Anode et Cathode. En fin de décharge, la résistance interne augmente et la tension s’effondre en charge.',
    howItWorksEn:
      'Internal chemical reactions maintain voltage between (+) and (-) poles; as a cell ages or depletes, internal resistance rises.',
    pinoutNotesFr: ['(+) Rouge / pôle positif, (-) Noir / pôle négatif.', 'Les accus Li-Ion nécessitent un circuit de protection BMS/TP4056.'],
    pinoutNotesEn: ['(+) Red positive terminal, (-) Black negative terminal.', 'Li-Ion cells require a BMS/TP4056 charger circuit.'],
    commonTypesFr: ['Pile 9V / AA 1.5V alcaline', 'Accumulateur Li-Ion 18650 (3.7V)', 'Batterie Plomb 12V'],
    commonTypesEn: ['Alkaline 9V / AA 1.5V', '18650 Li-Ion 3.7V rechargeable', '12V Lead-Acid / LiFePO4'],
    realWorldUsesFr: ['Multimètres et télécommandes', 'Powerbanks, outils sans fil et robots'],
    realWorldUsesEn: ['Multimeters & remotes', 'Power banks, power tools & robotics'],
    visualFaultSignsFr: ['Cellule gonflée (Li-Po dangereuse !)', 'Oxydation blanche aux bornes', 'Chute brutale de tension sous charge'],
    visualFaultSignsEn: ['Swollen Li-Po pouch (hazard!)', 'White/green terminal corrosion', 'Voltage collapses under load'],
    recommendedModeLabelFr: 'Voltmètre DC (V DC)',
    recommendedModeLabelEn: 'DC Voltage (V DC)',
    safetyNoteFr: 'Ne mettez JAMAIS le multimètre en mode Ω ou Ampèremètre directement aux bornes d’une batterie !',
    safetyNoteEn: 'NEVER probe a battery on Ohm (Ω) or Current (A) mode—always use DC Voltage (V DC)!',
    stepsFr: [
      'Sélectionnez V DC (gamme 20V).',
      'Sonde rouge sur (+) et noire sur (-) : lisez la tension.',
      'Vérifiez aussi la tension avec une petite charge branchée (LED/moteur).',
    ],
    stepsEn: [
      'Turn dial strictly to V DC (20V range).',
      'Red probe on (+), black on (-): read open-circuit voltage.',
      'Verify voltage stays steady under a light test load.',
    ],
    goodReadingFr: 'Alcaline 9V : 8.8–9.6V | Li-Ion 18650 : 3.7–4.2V.',
    goodReadingEn: '9V Alkaline: 8.8–9.6V | 18650 Li-Ion: 3.7–4.2V.',
    openFaultReadingFr: '0.00V (cellule complètement morte ou protection BMS coupée).',
    openFaultReadingEn: '0.00V (dead cell or tripped internal BMS protection).',
    shortFaultReadingFr: 'Proche de 0V avec échauffement anormal (ne plus charger).',
    shortFaultReadingEn: 'Near 0V with heat (internal short—do not recharge).',
    degradedReadingFr: 'Tension à vide correcte qui s’effondre sous charge.',
    degradedReadingEn: 'Acceptable idle voltage that collapses immediately under load.',
  },
  pcb: {
    nameFr: 'Circuit imprimé (PCB)',
    nameEn: 'Printed Circuit Board (PCB)',
    unitFr: 'Continuité pistes',
    unitEn: 'Ω Continuity',
    shortRoleFr: 'Support isolant reliant mécaniquement et électriquement tous les composants par des pistes de cuivre.',
    shortRoleEn: 'Insulating fiberglass board that mounts and interconnects all components via etched copper traces.',
    fullRoleFr:
      'Remplace les faisceaux de câbles désordonnés par des pistes de cuivre précises recouvertes d’un vernis épargne vert anti-oxydation.',
    fullRoleEn:
      'Replaces messy point-to-point wiring with precision copper tracks, vias, and protective solder mask.',
    howItWorksFr:
      'Des couches de cuivre collées sur de la fibre de verre FR4 sont gravées selon le schéma, percées de trous métallisés (Vias) et étamées pour souder les pièces.',
    howItWorksEn:
      'Copper foil bonded to FR4 fiberglass is etched into conductive traces and plated pads for soldering components.',
    pinoutNotesFr: ['Les lignes blanches (Silkscreen) indiquent l’emplacement, le numéro (R1, C2) et la polarité de chaque pièce.'],
    pinoutNotesEn: ['White silkscreen labels show component designators (R1, C2) and polarity marks.'],
    commonTypesFr: ['PCB simple/double face', 'PCB multicouche (cartes mères)', 'Plaque d’essai à pastilles'],
    commonTypesEn: ['Single/Double-sided FR4 PCB', 'Multi-layer PCBs', 'Perfboard / Stripboard'],
    realWorldUsesFr: ['Tous les appareils électroniques modernes'],
    realWorldUsesEn: ['All modern electronic hardware'],
    visualFaultSignsFr: ['Piste de cuivre coupée ou brûlée', 'Soudure froide fissurée autour d’une patte', 'Pont d’étain entre deux pistes'],
    visualFaultSignsEn: ['Burnt or lifted copper trace', 'Cracked cold solder joint', 'Accidental solder bridge between pads'],
    recommendedModeLabelFr: 'Mode Continuité (🔊)',
    recommendedModeLabelEn: 'Continuity Beep (🔊)',
    safetyNoteFr: 'Testez toujours hors tension après décharge des condensateurs.',
    safetyNoteEn: 'Test trace continuity only with power off and capacitors discharged.',
    stepsFr: [
      'Placez les deux sondes aux extrémités d’une même piste : doit bipper (<0.3Ω).',
      'Vérifiez qu’aucun bip n’apparaît entre deux pistes voisines séparées.',
    ],
    stepsEn: [
      'Probe both ends of the same trace: must beep (<0.3Ω).',
      'Probe adjacent separate traces: must read OL (no unintended bridge).',
    ],
    goodReadingFr: '<0.3Ω le long d’une piste et OL entre pistes distinctes.',
    goodReadingEn: '<0.3Ω along a single trace and OL between separate traces.',
    openFaultReadingFr: 'OL sur une piste censée être continue (micro-coupure).',
    openFaultReadingEn: 'OL along a connected trace (hairline crack or corroded via).',
    shortFaultReadingFr: 'Bip entre deux pistes voisines (pont de soudure).',
    shortFaultReadingEn: 'Beep between isolated neighboring traces (solder bridge).',
    degradedReadingFr: 'Résistance >2Ω qui fluctue en appuyant sur la soudure (soudure sèche).',
    degradedReadingEn: 'Fluctuating >2Ω reading from cracked cold solder joint.',
  },
  optocoupler: {
    nameFr: 'Optocoupleur (PC817)',
    nameEn: 'Optocoupler (PC817)',
    unitFr: 'CTR % / Isolation kV',
    unitEn: 'CTR % / kV',
    shortRoleFr: 'Transmet un signal par faisceau lumineux interne entre deux circuits totalement isolés électriquement.',
    shortRoleEn: 'Transfers control signals using internal infrared light while keeping high and low voltage sides isolated.',
    fullRoleFr:
      'Élément clé de sécurité dans les alimentations à découpage (Feedback) pour réguler la tension secondaire sans relier électriquement la sortie au secteur 220V.',
    fullRoleEn:
      'Safety bridge in switching power supplies (feedback loop) and industrial PLC inputs to protect low-voltage logic from high-voltage spikes.',
    howItWorksFr:
      'Contient une LED infrarouge face à un phototransistor dans un boîtier opaque. Quand la LED (1-2) s’allume, le transistor (3-4) conduit sans aucun fil commun.',
    howItWorksEn:
      'Combines an IR LED (pins 1-2) facing an optically coupled phototransistor (pins 3-4) inside a light-tight package.',
    pinoutNotesFr: ['Point gravé = Broche 1 (Anode LED +), 2 = Cathode (-), 3 = Émetteur, 4 = Collecteur.'],
    pinoutNotesEn: ['Dot marks Pin 1 (LED Anode +), 2 (LED Cathode -), 3 (Emitter), 4 (Collector).'],
    commonTypesFr: ['PC817 / EL817 (à transistor)', 'MOC3021 (Opto-Triac pour 220V)'],
    commonTypesEn: ['PC817 phototransistor optocoupler', 'MOC3021 opto-triac'],
    realWorldUsesFr: ['Boucle de rétroaction des chargeurs', 'Isolation des entrées automates/Arduino'],
    realWorldUsesEn: ['SMPS charger feedback loops', 'Industrial MCU input isolation'],
    visualFaultSignsFr: ['Tension de sortie qui oscille ou s’effondre', 'Court-circuit sur le côté sortie 3-4'],
    visualFaultSignsEn: ['Pulsing or missing SMPS output voltage', 'Shorted phototransistor pins 3-4'],
    recommendedModeLabelFr: 'Diode (⊳|) & Ohmmètre',
    recommendedModeLabelEn: 'Diode (⊳|) & Ohm',
    safetyNoteFr: 'Dessoudez au moins 2 pattes pour réaliser un test fiable hors carte.',
    safetyNoteEn: 'Remove from circuit or lift two pins for accurate dynamic testing.',
    stepsFr: [
      'Côté LED (1-2) en mode Diode : ~1.1V en direct, OL en inverse.',
      'Côté sortie (3-4) au repos : OL. En alimentant (1-2) avec 5V via 330Ω, (3-4) chute à quelques centaines d’ohms !',
    ],
    stepsEn: [
      'Test LED side (1-2) on Diode mode: ~1.1V forward, OL reverse.',
      'Output (3-4) reads OL at rest, then drops sharply when pins 1-2 are powered via 330Ω.',
    ],
    goodReadingFr: 'LED ~1.1V et sortie OL au repos qui conduit lorsque la LED est alimentée.',
    goodReadingEn: 'LED ~1.1V forward; output OL idle and conducts when LED is lit.',
    openFaultReadingFr: 'OL sur la LED (1-2) ou sortie (3-4) ne conduisant jamais.',
    openFaultReadingEn: 'Open LED (1-2) or unresponsive output (3-4).',
    shortFaultReadingFr: '0.00V entre 1-2 ou entre 3-4.',
    shortFaultReadingEn: '0.00V short on pins 1-2 or 3-4.',
    degradedReadingFr: 'Faible taux de transfert (CTR) empêchant la régulation.',
    degradedReadingEn: 'Low CTR causing poor output conduction.',
  },
  ceramic_cap: {
    nameFr: 'Condensateur céramique / film',
    nameEn: 'Ceramic / Film Capacitor',
    unitFr: 'pF / nF',
    unitEn: 'pF / nF',
    shortRoleFr: 'Filtre les bruits haute fréquence (découplage) et stabilise la tension logique sans polarité.',
    shortRoleEn: 'Filters high-frequency noise (decoupling) and stabilizes digital voltage rails without polarity.',
    fullRoleFr:
      'Le modèle 104 (100nF) est placé au plus près de chaque circuit intégré pour absorber les parasites rapides et coupler les signaux audio ou radio.',
    fullRoleEn:
      'Placed right next to every IC (such as 104 = 100nF) to suppress high-frequency switching noise and couple AC/RF signals.',
    howItWorksFr:
      'Couches céramiques diélectriques entre plaques métalliques ; sans électrolyte liquide, il ne sèche pas et n’a aucune polarité.',
    howItWorksEn:
      'Ceramic dielectric layers between metal electrodes; non-polarized, fast at high frequencies, and never dries out.',
    formulaMeaningFr: 'Les 2 premiers chiffres donnent la base et le 3e le nombre de zéros en picofarads.',
    formulaMeaningEn: 'First two digits give base value and third digit is multiplier zeros in picofarads.',
    pinoutNotesFr: ['Totalement non polarisé.', 'Code 104 = 100nF = 0.1µF ; 103 = 10nF.'],
    pinoutNotesEn: ['Completely non-polarized.', 'Code 104 = 100nF = 0.1µF; 103 = 10nF.'],
    commonTypesFr: ['Céramique disque (orange/bleu)', 'Film polyester/Mylar (vert/jaune)'],
    commonTypesEn: ['Disc ceramic capacitors', 'Polyester / Mylar film capacitors'],
    realWorldUsesFr: ['Découplage 0.1µF sur broches VCC', 'Condensateurs 22pF autour des quartz'],
    realWorldUsesEn: ['0.1µF IC decoupling', '22pF crystal load capacitors'],
    visualFaultSignsFr: ['Fissure ou point noir brûlé', 'Court-circuit franc sur le rail d’alimentation'],
    visualFaultSignsEn: ['Cracked disc or burn mark', 'Dead short on power supply rail'],
    recommendedModeLabelFr: 'Capacimètre (┤├) & Ω',
    recommendedModeLabelEn: 'Capacitance (┤├) & Ohm',
    safetyNoteFr: 'Isolez une patte de la carte pour éviter l’addition des capacités parallèles.',
    safetyNoteEn: 'Lift one leg before measuring so parallel board capacitors do not skew the value.',
    stepsFr: [
      'Mesurez en mode Capacité (┤├) et comparez au code inscrit.',
      'Vérifiez en Ω qu’il n’est pas en court-circuit (doit afficher OL).',
    ],
    stepsEn: [
      'Measure in Capacitance mode and match against the printed 3-digit code.',
      'Verify OL (no short) on Ohm/Continuity mode.',
    ],
    goodReadingFr: 'Valeur conforme (ex : 100nF pour 104) et OL à l’ohmmètre.',
    goodReadingEn: 'Matches code (e.g. 100nF for 104) and reads OL in resistance mode.',
    openFaultReadingFr: '0.00 nF (armature déconnectée).',
    openFaultReadingEn: '0.00 nF reading.',
    shortFaultReadingFr: '0.02Ω et bip continu (panne fréquente sur cartes mères).',
    shortFaultReadingEn: '0.02Ω continuous beep (very common motherboard rail fault).',
    degradedReadingFr: 'Capacité divisée par deux ou fuite ohmique.',
    degradedReadingEn: 'Reduced capacitance or resistive leakage.',
  },
  mosfet: {
    nameFr: 'Transistor MOSFET de puissance',
    nameEn: 'Power MOSFET (IRFZ44N)',
    unitFr: 'mΩ / Ampère',
    unitEn: 'mΩ / A',
    shortRoleFr: 'Interrupteur électronique très haute efficacité commandé en tension par sa grille (Gate).',
    shortRoleEn: 'Ultra-efficient voltage-controlled switch handling high currents with minimal heat loss.',
    fullRoleFr:
      'Cœur des alimentations à découpage, onduleurs et variateurs PWM de moteurs : sa très faible résistance interne Rds(on) limite l’échauffement même à plusieurs dizaines d’ampères.',
    fullRoleEn:
      'Backbone of modern SMPS chargers, inverters, and PWM motor controllers thanks to milliohm on-resistance.',
    howItWorksFr:
      'Une tension positive sur la Grille (G) par rapport à la Source (S) crée un champ électrique ouvrant le canal entre Drain (D) et Source sans consommer de courant continu.',
    howItWorksEn:
      'Applying gate voltage relative to Source forms an electric field channel between Drain and Source with virtually zero gate current.',
    formulaMeaningFr: 'Pertes thermiques = Courant² × Résistance interne du canal.',
    formulaMeaningEn: 'Conduction heat loss equals I² multiplied by channel Rds(on).',
    pinoutNotesFr: ['Boîtier TO-220 de face (gauche→droite) : Gate (1), Drain (2), Source (3).', 'La semelle arrière est reliée au Drain.'],
    pinoutNotesEn: ['TO-220 front (left→right): Gate (1), Drain (2), Source (3).', 'Metal heatsink tab connects to Drain.'],
    commonTypesFr: ['Canal N (IRFZ44N, IRF540)', 'Canal P (IRF9540)'],
    commonTypesEn: ['N-Channel (IRFZ44N, IRF540)', 'P-Channel (IRF9540)'],
    realWorldUsesFr: ['Alimentations Buck/Boost et onduleurs', 'Variateurs PWM moteurs et rubans LED'],
    realWorldUsesEn: ['Switch-mode power supplies & inverters', 'PWM motor speed & LED dimmers'],
    visualFaultSignsFr: ['Boîtier éclaté dans un chargeur', 'Court-circuit complet entre G, D et S'],
    visualFaultSignsEn: ['Exploded epoxy case', 'Dead short across G, D, and S'],
    recommendedModeLabelFr: 'Mode Diode (⊳|)',
    recommendedModeLabelEn: 'Diode Mode (⊳|)',
    safetyNoteFr: 'Déchargez la grille en reliant G et S avant de mesurer (sensible à l’électricité statique).',
    safetyNoteEn: 'Short Gate to Source momentarily to discharge static charge before probing.',
    stepsFr: [
      'Déchargez G–S. Noire sur Drain et rouge sur Source : diode interne ~0.50V ; inverse OL.',
      'Test de déclenchement : touchez G avec la sonde rouge (noire sur S), puis passez la rouge sur D → le canal reste conducteur jusqu’à décharge de G !',
    ],
    stepsEn: [
      'Discharge G–S. Black on Drain, red on Source: internal body diode reads ~0.50V; reverse OL.',
      'Latch test: touch red probe to Gate (black on Source), then move red to Drain → channel conducts until Gate is discharged!',
    ],
    goodReadingFr: 'Diode interne ~0.50V entre S→D, isolation totale sur Gate, verrouillage fonctionnel.',
    goodReadingEn: 'Body diode ~0.50V S→D, open Gate, and clean latching response.',
    openFaultReadingFr: 'OL dans les deux sens ou canal ne s’ouvrant pas.',
    openFaultReadingEn: 'OL both ways or fails to latch on.',
    shortFaultReadingFr: '0.00V et bip entre G, D et S.',
    shortFaultReadingEn: '0.00V short across G, D, and S.',
    degradedReadingFr: 'Fuite résistive entre Gate et Source.',
    degradedReadingEn: 'Resistive leakage between Gate and Source.',
  },
  scr: {
    nameFr: 'Thyristor (SCR)',
    nameEn: 'Thyristor / SCR (BT151)',
    unitFr: 'Ampère / Volt',
    unitEn: 'A / V',
    shortRoleFr: 'Interrupteur de puissance unidirectionnel qui reste enclenché après une seule impulsion sur la gâchette.',
    shortRoleEn: 'One-way power switch that latches ON after a single Gate pulse until current drops to zero.',
    fullRoleFr:
      'Utilisé dans les protections Crowbar contre les surtensions, les chargeurs de batteries industriels et les alarmes à verrouillage continu.',
    fullRoleEn:
      'Used in Crowbar overvoltage protection, battery chargers, and latching alarm sirens.',
    howItWorksFr:
      'Reste bloqué entre Anode (A) et Cathode (K) jusqu’à l’arrivée d’une impulsion positive sur la Gâchette (G), puis conduit jusqu’à coupure du courant.',
    howItWorksEn:
      'Four-layer PNPN switch blocking A–K until a small Gate trigger current latches it into full conduction.',
    pinoutNotesFr: ['BT151 de face : Cathode (K), Anode (A), Gate (G).'],
    pinoutNotesEn: ['BT151 front view: Cathode (K), Anode (A), Gate (G).'],
    commonTypesFr: ['MCR100 faible puissance', 'BT151 / TYN612 puissance'],
    commonTypesEn: ['MCR100 small-signal', 'BT151 / TYN612 power SCR'],
    realWorldUsesFr: ['Protection Crowbar', 'Chargeurs et systèmes d’alarme'],
    realWorldUsesEn: ['Overvoltage Crowbar circuits', 'Industrial battery chargers'],
    visualFaultSignsFr: ['Charge alimentée en permanence sans signal Gate'],
    visualFaultSignsEn: ['Load stays permanently energized without Gate trigger'],
    recommendedModeLabelFr: 'Diode / Ohmmètre',
    recommendedModeLabelEn: 'Diode / Ohm Mode',
    safetyNoteFr: 'Le courant du multimètre en mode Diode suffit à amorcer la plupart des petits SCR.',
    safetyNoteEn: 'Diode mode supplies enough current to latch small/medium SCRs during testing.',
    stepsFr: [
      'A–K doit lire OL dans les deux sens au repos.',
      'G–K lit comme une diode (~0.7V). En touchant G avec A sous sonde rouge sur A et noire sur K, le SCR s’amorce.',
    ],
    stepsEn: [
      'A–K reads OL in both directions at rest.',
      'G–K reads ~0.7V; jumping A to G with red on A & black on K latches conduction.',
    ],
    goodReadingFr: 'OL entre A–K au repos ; jonction G–K ~0.7V et verrouillage fonctionnel.',
    goodReadingEn: 'OL A–K idle, ~0.7V G–K junction, latches when triggered.',
    openFaultReadingFr: 'Ne s’amorce pas lors de l’impulsion Gate.',
    openFaultReadingEn: 'Fails to trigger or open Gate.',
    shortFaultReadingFr: '0.00V permanent entre A et K.',
    shortFaultReadingEn: 'Permanent 0.00V short A–K.',
    degradedReadingFr: 'Ne maintient pas l’état conducteur.',
    degradedReadingEn: 'Drops out of latch prematurely.',
  },
  triac: {
    nameFr: 'Triac (BT136)',
    nameEn: 'TRIAC (BT136)',
    unitFr: 'Ampère / Volt AC',
    unitEn: 'A / V',
    shortRoleFr: 'Interrupteur bidirectionnel pour courant alternatif (220V) : variateurs de lumière et vitesse moteurs AC.',
    shortRoleEn: 'Bidirectional AC power switch used for light dimmers, fan speed controllers, and appliances.',
    fullRoleFr:
      'Équivalent bidirectionnel du thyristor : conduit pendant les deux alternances du secteur 220V AC pour moduler la puissance envoyée aux lampes et moteurs.',
    fullRoleEn:
      'Conducts both positive and negative AC half-cycles when triggered at the Gate, enabling smooth AC phase control.',
    howItWorksFr:
      'Équivaut à deux thyristors tête-bêche commandés par une gâchette commune (Gate) entre MT1 et MT2.',
    howItWorksEn:
      'Acts like two inverse-parallel SCRs sharing one Gate terminal between MT1 and MT2.',
    pinoutNotesFr: ['BT136 de face : MT1 (gauche), MT2 (centre), Gate (droite).'],
    pinoutNotesEn: ['BT136 front: MT1 (left), MT2 (center), Gate (right).'],
    commonTypesFr: ['BT136 (4A 600V)', 'BTA16 / BTA41 (16–40A isolés)'],
    commonTypesEn: ['BT136 (4A 600V)', 'BTA16 / BTA41 (16–40A)'],
    realWorldUsesFr: ['Variateurs d’éclairage (Dimmer)', 'Cartes de lave-linge et ventilateurs'],
    realWorldUsesEn: ['AC light dimmers & drill speed controls', 'Washing machine pump/valve boards'],
    visualFaultSignsFr: ['Charge bloquée à pleine puissance', 'Boîtier fissuré'],
    visualFaultSignsEn: ['Load stuck at full power', 'Cracked housing'],
    recommendedModeLabelFr: 'Ohmmètre (Ω) & Diode',
    recommendedModeLabelEn: 'Ohm (Ω) & Diode',
    safetyNoteFr: 'Débranchez totalement le secteur 220V avant de toucher au Triac.',
    safetyNoteEn: 'Disconnect 220V AC mains completely before testing.',
    stepsFr: [
      'Entre MT1 et MT2 : doit lire OL dans les deux sens.',
      'Entre MT1 et Gate : résistance faible (~40Ω–300Ω) dans les deux sens.',
    ],
    stepsEn: [
      'MT1 to MT2: must read OL both ways.',
      'MT1 to Gate: reads low resistance (~40Ω–300Ω) both ways.',
    ],
    goodReadingFr: 'OL MT1–MT2 et ~80–250Ω entre MT1 et Gate.',
    goodReadingEn: 'OL across MT1–MT2; ~80–250Ω between MT1 and Gate.',
    openFaultReadingFr: 'OL même entre MT1 et Gate.',
    openFaultReadingEn: 'OL even between MT1 and Gate.',
    shortFaultReadingFr: '0.0Ω entre MT1 et MT2.',
    shortFaultReadingEn: '0.0Ω short between MT1 and MT2.',
    degradedReadingFr: 'Fuite provoquant le scintillement de la charge.',
    degradedReadingEn: 'Leakage between MT1 and MT2 causing flicker.',
  },
  schottky_diode: {
    nameFr: 'Diode Schottky rapide',
    nameEn: 'Schottky Diode (SR560)',
    unitFr: 'Vf / Ampère',
    unitEn: 'Vf / A',
    shortRoleFr: 'Diode ultra-rapide à très faible chute de tension (~0.25V) pour chargeurs et panneaux solaires.',
    shortRoleEn: 'Ultra-fast diode with low forward voltage drop (~0.25V) ideal for SMPS chargers and solar panels.',
    fullRoleFr:
      'Divise par deux les pertes thermiques par rapport à une diode silicium classique (0.25V vs 0.7V) et commute sans délai dans les alimentations haute fréquence.',
    fullRoleEn:
      'Cuts forward voltage heat loss nearly in half versus standard silicon diodes and switches cleanly at high frequencies.',
    howItWorksFr:
      'Jonction métal–semi-conducteur éliminant le temps de recouvrement inverse.',
    howItWorksEn:
      'Uses a metal-semiconductor barrier instead of a P-N junction, eliminating reverse recovery delay.',
    pinoutNotesFr: ['Anneau argenté = Cathode (-), côté noir = Anode (+).'],
    pinoutNotesEn: ['Silver stripe = Cathode (-), black end = Anode (+).'],
    commonTypesFr: ['1N5819 (1A 40V)', 'SR560 / MBR20100 (5–20A)'],
    commonTypesEn: ['1N5819 (1A 40V)', 'SR560 / MBR20100 (5–20A)'],
    realWorldUsesFr: ['Sortie secondaire des chargeurs', 'Protection anti-retour solaire'],
    realWorldUsesEn: ['SMPS output rectifiers', 'Solar panel reverse blocking'],
    visualFaultSignsFr: ['Court-circuit complet en sortie de chargeur'],
    visualFaultSignsEn: ['Dead short on charger DC output rail'],
    recommendedModeLabelFr: 'Mode Diode (⊳|)',
    recommendedModeLabelEn: 'Diode Mode (⊳|)',
    safetyNoteFr: 'Une lecture de 0.18V–0.35V en mode Diode est parfaitement normale pour une Schottky !',
    safetyNoteEn: 'A low reading of 0.18V–0.35V on Diode mode is completely normal for Schottky diodes!',
    stepsFr: [
      'Sonde rouge sur Anode, noire sur Cathode (anneau) : ~0.18V à 0.38V.',
      'En inverse : OL.',
    ],
    stepsEn: [
      'Red on Anode, black on striped Cathode: ~0.18V–0.38V.',
      'Reverse probes: OL.',
    ],
    goodReadingFr: 'Direct : 0.18V–0.38V | Inverse : OL.',
    goodReadingEn: 'Forward: 0.18V–0.38V | Reverse: OL.',
    openFaultReadingFr: 'OL dans les deux sens.',
    openFaultReadingEn: 'OL both ways.',
    shortFaultReadingFr: '0.000V et bip continu.',
    shortFaultReadingEn: '0.000V continuous beep.',
    degradedReadingFr: 'Fuite notable en sens inverse.',
    degradedReadingEn: 'Reverse leakage reading.',
  },
  timer_555: {
    nameFr: 'Temporisateur NE555',
    nameEn: '555 Timer IC (NE555)',
    unitFr: 'Seconde / Hz',
    unitEn: 's / Hz',
    shortRoleFr: 'Le circuit intégré le plus célèbre pour générer des impulsions, clignotants et temporisations.',
    shortRoleEn: 'The most iconic 8-pin IC for generating square-wave pulses, timers, flashers, and PWM.',
    fullRoleFr:
      'Génère des oscillations stables (mode Astable) ou des délais précis (mode Monostable) et peut piloter directement une LED ou un petit relais jusqu’à 200mA.',
    fullRoleEn:
      'Creates steady oscillations (Astable) or single-shot delays (Monostable) with up to 200mA output drive.',
    howItWorksFr:
      'Des comparateurs internes surveillent la charge d’un condensateur entre 1/3 et 2/3 de Vcc pour basculer la sortie (broche 3).',
    howItWorksEn:
      'Internal comparators monitor an external capacitor charging between 1/3 and 2/3 Vcc, toggling Pin 3 Output.',
    formulaMeaningFr: 'Fréquence d’oscillation déterminée par R1, R2 et le condensateur C.',
    formulaMeaningEn: 'Oscillation frequency set by R1, R2, and capacitor C.',
    pinoutNotesFr: ['1: GND | 2: Trigger | 3: Output | 4: Reset', '5: Control | 6: Threshold | 7: Discharge | 8: VCC (4.5–16V)'],
    pinoutNotesEn: ['1: GND | 2: Trigger | 3: Output | 4: Reset', '5: Control | 6: Threshold | 7: Discharge | 8: VCC (4.5–16V)'],
    commonTypesFr: ['NE555 bipolaire standard', 'TLC555 CMOS basse consommation'],
    commonTypesEn: ['Standard NE555 bipolar', 'TLC555 low-power CMOS'],
    realWorldUsesFr: ['Clignotants LED et sirènes', 'Variateurs PWM et minuteries'],
    realWorldUsesEn: ['LED flashers & sirens', 'PWM controllers & delay timers'],
    visualFaultSignsFr: ['Surchauffe au démarrage', 'Sortie (3) bloquée fixe'],
    visualFaultSignsEn: ['Overheating on power-up', 'Pin 3 stuck permanently'],
    recommendedModeLabelFr: 'V DC & Ohmmètre',
    recommendedModeLabelEn: 'V DC & Ohm Mode',
    safetyNoteFr: 'Contrôlez l’absence de court-circuit entre 8 (VCC) et 1 (GND) avant d’alimenter.',
    safetyNoteEn: 'Verify Pin 8 (VCC) and Pin 1 (GND) are not shorted before powering.',
    stepsFr: [
      'Hors tension : pas de bip entre broche 8 et 1.',
      'Sous tension : mesurez +5V/+12V sur (8-1) et observez l’oscillation sur la broche 3.',
    ],
    stepsEn: [
      'Power off: ensure no short between Pin 8 and Pin 1.',
      'Power on: verify Vcc on Pin 8 and pulsing voltage on Pin 3 Output.',
    ],
    goodReadingFr: 'Vcc sain et tension variable sur la sortie 3.',
    goodReadingEn: 'Clean Vcc on Pin 8 and toggling output on Pin 3.',
    openFaultReadingFr: 'Sortie 0V fixe malgré Vcc présent.',
    openFaultReadingEn: 'Output dead at 0V despite good Vcc.',
    shortFaultReadingFr: '0.4Ω entre broches 8 et 1.',
    shortFaultReadingEn: 'Short <2Ω across Pin 8 and Pin 1.',
    degradedReadingFr: 'Étage de sortie faible (<Vcc/2).',
    degradedReadingEn: 'Weak output stage unable to reach high rail.',
  },
  opamp: {
    nameFr: 'Amplificateur opérationnel (LM358)',
    nameEn: 'Operational Amplifier (LM358)',
    unitFr: 'Gain / Volt',
    unitEn: 'Av / V',
    shortRoleFr: 'Amplifie des signaux analogiques très faibles ou compare deux tensions avec précision.',
    shortRoleEn: 'Amplifies weak analog sensor signals or compares two voltages for automatic control.',
    fullRoleFr:
      'Utilisé comme préamplificateur micro/capteurs ou comparateur de seuil (ex : couper un chargeur dès que la batterie atteint 14.4V).',
    fullRoleEn:
      'Essential analog building block for amplifying microphone/sensor signals or building precision voltage comparators.',
    howItWorksFr:
      'Possède deux entrées (+ non-inverseuse et - inverseuse) et une sortie qui amplifie leur différence selon les résistances de contre-réaction.',
    howItWorksEn:
      'Amplifies the differential voltage between its (+) and (-) inputs according to external feedback resistors.',
    formulaMeaningFr: 'Gain non-inverseur déterminé par le rapport Rf / Rin.',
    formulaMeaningEn: 'Non-inverting voltage gain equals 1 + (Rf / Rin).',
    pinoutNotesFr: ['LM358 contient 2 AOP en boîtier DIP-8 ; 4 = GND, 8 = VCC.'],
    pinoutNotesEn: ['LM358 houses 2 op-amps in DIP-8; Pin 4 = GND, Pin 8 = VCC.'],
    commonTypesFr: ['LM358 double alimentation simple', 'LM324 quadruple / TL072 audio'],
    commonTypesEn: ['LM358 dual single-supply', 'LM324 quad / TL072 low-noise audio'],
    realWorldUsesFr: ['Coupe-charge automatique', 'Préamplis et capteurs de poids/température'],
    realWorldUsesEn: ['Auto battery cut-off circuits', 'Audio pre-amps & sensor bridges'],
    visualFaultSignsFr: ['Sortie saturée fixe sans réaction aux entrées'],
    visualFaultSignsEn: ['Output pinned at rail regardless of inputs'],
    recommendedModeLabelFr: 'Voltmètre DC (V DC)',
    recommendedModeLabelEn: 'DC Voltage (V DC)',
    safetyNoteFr: 'Vérifiez d’abord la tension d’alimentation entre les broches 8 et 4.',
    safetyNoteEn: 'Confirm power supply voltage across Pin 8 and Pin 4 first.',
    stepsFr: [
      'Mesurez VCC (8-4).',
      'Comparez (+) et (-) : si V+ > V-, la sortie doit monter vers le haut.',
    ],
    stepsEn: [
      'Check VCC across Pins 8 & 4.',
      'Compare (+) and (-) inputs: if V+ > V-, output should swing high.',
    ],
    goodReadingFr: 'Alimentation valide et sortie répondant aux variations des entrées.',
    goodReadingEn: 'Clean VCC and output responds logically to input differential.',
    openFaultReadingFr: 'Sortie bloquée à 0V malgré V+ > V-.',
    openFaultReadingEn: 'Output stuck at 0V even when V+ > V-.',
    shortFaultReadingFr: 'Court-circuit VCC–GND.',
    shortFaultReadingEn: 'VCC–GND short.',
    degradedReadingFr: 'Forte erreur d’offset ou distorsion.',
    degradedReadingEn: 'Excessive input offset or distorted output.',
  },
  thermistor: {
    nameFr: 'Thermistance (NTC / PTC)',
    nameEn: 'Thermistor (NTC / PTC)',
    unitFr: 'Ohm / °C',
    unitEn: 'Ω / °C',
    shortRoleFr: 'Capteur de température précis ou limiteur de courant d’appel à la mise sous tension.',
    shortRoleEn: 'Measures temperature or limits high inrush surge current when switching power supplies on.',
    fullRoleFr:
      'La NTC voit sa résistance baisser quand la température monte (sondes climatiseurs, batteries, entrées 220V de chargeurs) ; la PTC fait l’inverse.',
    fullRoleEn:
      'NTC resistance drops as heat rises (used in temperature probes and SMPS inrush limiters); PTC resistance rises sharply when hot.',
    howItWorksFr:
      'Oxyde semi-conducteur sensible à la chaleur ; réchauffer une NTC 10kΩ entre les doigts fait chuter sa valeur visiblement.',
    howItWorksEn:
      'Temperature-sensitive ceramic semiconductor; warming a 10kΩ NTC with your fingers drops its resistance right away.',
    pinoutNotesFr: ['Non polarisée ; souvent en forme de disque vert/noir ou petite goutte époxy.'],
    pinoutNotesEn: ['Non-polarized; shaped as a green/black disc in PSUs or small epoxy bead probe.'],
    commonTypesFr: ['NTC 10K sonde thermique', 'NTC 5D-9 / 10D-9 anti-appel 220V'],
    commonTypesEn: ['NTC 10K temp sensor', 'NTC 5D-9 / 10D-9 PSU inrush limiter'],
    realWorldUsesFr: ['Thermostats et batteries Li-Ion', 'Entrée secteur des alimentations PC/TV'],
    realWorldUsesEn: ['Battery thermal protection & HVAC', 'PSU AC input surge limiting'],
    visualFaultSignsFr: ['Disque fissuré ou explosé après court-circuit en aval'],
    visualFaultSignsEn: ['Cracked or shattered disc after downstream PSU short'],
    recommendedModeLabelFr: 'Mode Ohmmètre (Ω)',
    recommendedModeLabelEn: 'Ohm Mode (Ω)',
    safetyNoteFr: 'Laissez refroidir à 25°C avant de mesurer.',
    safetyNoteEn: 'Allow thermistor to cool to room temperature (25°C) before testing.',
    stepsFr: [
      'Mesurez en Ω à 25°C (~10kΩ pour sonde 10K ou 5–10Ω pour NTC d’alimentation).',
      'Réchauffez doucement avec les doigts : la valeur NTC doit diminuer nettement.',
    ],
    stepsEn: [
      'Read Ohms at 25°C (~10kΩ for probe or ~5–10Ω for power NTC).',
      'Warm gently with fingers: NTC resistance drops steadily.',
    ],
    goodReadingFr: 'Valeur nominale à 25°C avec chute nette à la chaleur.',
    goodReadingEn: 'Matches nominal value at 25°C and drops smoothly when warmed.',
    openFaultReadingFr: 'OL (disque fendu).',
    openFaultReadingEn: 'OL (cracked internal disc).',
    shortFaultReadingFr: '0.0Ω permanent même à froid.',
    shortFaultReadingEn: '0.0Ω permanent short even when cold.',
    degradedReadingFr: 'Résistance figée ne réagissant plus à la chaleur.',
    degradedReadingEn: 'Value stuck and unresponsive to temperature change.',
  },
  ir_receiver: {
    nameFr: 'Récepteur infrarouge (TSOP1838)',
    nameEn: 'IR Receiver (TSOP1838)',
    unitFr: 'kHz / Volt',
    unitEn: '38 kHz / V',
    shortRoleFr: 'Capte et décode les signaux infrarouges 38kHz des télécommandes vers le processeur.',
    shortRoleEn: 'Receives and demodulates 38kHz infrared remote-control pulses into clean digital data.',
    fullRoleFr:
      'Présent en façade de chaque TV, décodeur ou climatiseur ; filtre la lumière ambiante pour ne transmettre que les impulsions codées.',
    fullRoleEn:
      'Built into every TV, receiver, and AC front panel to filter daylight and output clean remote commands.',
    howItWorksFr:
      'Intègre photodiode IR, amplificateur et filtre 38kHz dans un petit boîtier à 3 broches (OUT, GND, VCC).',
    howItWorksEn:
      'Combines an IR photodiode, AGC amplifier, and 38kHz bandpass demodulator into 3 pins.',
    pinoutNotesFr: ['VS1838B de face (dôme vers vous) : Gauche OUT, Centre GND, Droite VCC (5V).'],
    pinoutNotesEn: ['VS1838B facing the dome: Left OUT, Center GND, Right VCC (5V).'],
    commonTypesFr: ['TSOP1838 / VS1838B (38kHz)'],
    commonTypesEn: ['TSOP1838 / VS1838B (38kHz)'],
    realWorldUsesFr: ['Récepteurs TV/climatiseurs', 'Projets télécommandés Arduino'],
    realWorldUsesEn: ['TV & AC remote receivers', 'Arduino IR control projects'],
    visualFaultSignsFr: ['Aucune réaction à une télécommande fonctionnelle'],
    visualFaultSignsEn: ['Device ignores working remote controls'],
    recommendedModeLabelFr: 'Voltmètre DC (V DC)',
    recommendedModeLabelEn: 'DC Voltage (V DC)',
    safetyNoteFr: 'Testez avec n’importe quelle télécommande en mesurant la broche OUT.',
    safetyNoteEn: 'Test easily by pointing any TV remote while probing the OUT pin.',
    stepsFr: [
      'Vérifiez +5V entre VCC et GND.',
      'Mesurez OUT : ~5V au repos, chute/oscille entre 3V et 4.5V dès qu’on appuie sur une touche de télécommande.',
    ],
    stepsEn: [
      'Confirm +5V between VCC and GND.',
      'Measure OUT: ~5V idle, dips/pulses between 3V and 4.5V when pressing any remote button.',
    ],
    goodReadingFr: 'VCC 5V stable et baisse/oscillation sur OUT lors d’un signal IR.',
    goodReadingEn: '5V VCC and clear voltage dip on OUT during IR bursts.',
    openFaultReadingFr: 'OUT reste figé à 5V ou 0V.',
    openFaultReadingEn: 'OUT stays frozen regardless of remote input.',
    shortFaultReadingFr: 'Court-circuit VCC–GND.',
    shortFaultReadingEn: 'VCC–GND short.',
    degradedReadingFr: 'Portée réduite à quelques centimètres.',
    degradedReadingEn: 'Receives only from inches away.',
  },
  reed_switch: {
    nameFr: 'Interrupteur magnétique (Reed)',
    nameEn: 'Magnetic Reed Switch',
    unitFr: 'Contact ON/OFF',
    unitEn: 'ON / OFF',
    shortRoleFr: 'Ampoule en verre contenant deux lames qui ferment le circuit sans contact à l’approche d’un aimant.',
    shortRoleEn: 'Hermetic glass switch whose internal reeds snap closed whenever a magnet comes near.',
    fullRoleFr:
      'Très utilisé dans les capteurs d’ouverture de portes/fenêtres, compteurs de vitesse et flotteurs de niveau d’eau.',
    fullRoleEn:
      'Widely used in door/window security sensors, bicycle speedometers, and magnetic water-level floats.',
    howItWorksFr:
      'Deux lames ferromagnétiques sous vide s’aimantent et s’attirent pour fermer le circuit dès qu’un champ magnétique approche.',
    howItWorksEn:
      'Two ferromagnetic blades inside a sealed glass tube magnetize and snap together near any magnet.',
    pinoutNotesFr: ['2 broches non polarisées ; pliez les pattes à la pince pour ne pas fendre le verre.'],
    pinoutNotesEn: ['Two non-polarized leads; bend carefully with pliers to avoid cracking the glass.'],
    commonTypesFr: ['NO normalement ouvert', 'SPDT inverseur 3 broches'],
    commonTypesEn: ['Normally Open (NO)', '3-pin SPDT changeover'],
    realWorldUsesFr: ['Alarmes portes/fenêtres', 'Détecteurs de niveau à flotteur'],
    realWorldUsesEn: ['Door/window alarm contacts', 'Liquid level float switches'],
    visualFaultSignsFr: ['Tube en verre fendu', 'Lames collées en permanence'],
    visualFaultSignsEn: ['Cracked glass envelope', 'Reeds welded closed'],
    recommendedModeLabelFr: 'Continuité / Ω',
    recommendedModeLabelEn: 'Continuity / Ohm',
    safetyNoteFr: 'Ne dépassez pas le courant max (~0.5A) sous peine de souder les lames.',
    safetyNoteEn: 'Keep load current under 0.5A so internal blades do not weld shut.',
    stepsFr: [
      'Sans aimant en mode Continuité : affiche OL.',
      'Approchez un aimant : bip immédiat (~0.1Ω), retour à OL en l’éloignant.',
    ],
    stepsEn: [
      'Without magnet: reads OL.',
      'Bring magnet close: immediate beep (~0.1Ω), returns to OL when removed.',
    ],
    goodReadingFr: 'OL seul, bip franc avec aimant.',
    goodReadingEn: 'OL idle, clean beep near magnet.',
    openFaultReadingFr: 'Reste OL même avec un aimant puissant.',
    openFaultReadingEn: 'Stays OL even against a strong magnet.',
    shortFaultReadingFr: 'Bip permanent sans aimant.',
    shortFaultReadingEn: 'Beeps permanently with no magnet.',
    degradedReadingFr: 'Contact oxydé (>15Ω).',
    degradedReadingEn: 'High/noisy contact resistance (>15Ω).',
  },
  transformer: {
    nameFr: 'Transformateur abaisseur',
    nameEn: 'Step-Down Transformer',
    unitFr: 'Volt / VA',
    unitEn: 'V / VA',
    shortRoleFr: 'Abaisse ou élève une tension alternative (ex : 220V→12V AC) avec isolation galvanique sûre.',
    shortRoleEn: 'Steps AC voltage up or down (e.g. 220V→12V AC) with safe electrical isolation.',
    fullRoleFr:
      'Abaisse la tension secteur vers une valeur sûre pour les alimentations linéaires et isole l’utilisateur contre l’électrocution.',
    fullRoleEn:
      'Steps mains AC down to safe low voltage via magnetic induction while isolating the user from mains shock.',
    howItWorksFr:
      'Un courant alternatif au primaire crée un champ magnétique variable dans le noyau de fer qui induit une tension au secondaire selon N1/N2.',
    howItWorksEn:
      'Alternating current in the primary winding induces a proportional AC voltage in the isolated secondary winding.',
    formulaMeaningFr: 'Le rapport des tensions primaire/secondaire est égal au rapport du nombre de spires.',
    formulaMeaningEn: 'Primary-to-secondary voltage ratio equals the winding turns ratio.',
    pinoutNotesFr: ['Primaire (220V) : fils fins à résistance plus élevée.', 'Secondaire (12V) : fils épais à faible résistance.'],
    pinoutNotesEn: ['Primary (220V): thinner wire, higher Ohms.', 'Secondary (12V): thicker wire, low Ohms.'],
    commonTypesFr: ['Noyau fer 50/60Hz', 'Transformateur ferrite haute fréquence (SMPS)'],
    commonTypesEn: ['50/60Hz iron-core transformer', 'High-frequency SMPS ferrite chopper'],
    realWorldUsesFr: ['Alimentations linéaires et amplis audio', 'Isolation galvanique industrielle'],
    realWorldUsesEn: ['Linear power supplies & audio amps', 'Mains isolation'],
    visualFaultSignsFr: ['Vernis fondu et odeur de brûlé', 'Fusible thermique primaire coupé'],
    visualFaultSignsEn: ['Melted bobbin / burnt varnish smell', 'Open internal thermal fuse in primary'],
    recommendedModeLabelFr: 'Ohmmètre (Ω)',
    recommendedModeLabelEn: 'Ohm Mode (Ω)',
    safetyNoteFr: 'Débranchez totalement le secteur 220V avant de mesurer les enroulements.',
    safetyNoteEn: 'Unplug AC mains completely before probing windings.',
    stepsFr: [
      'Mesurez le primaire : ~50Ω à 600Ω (OL = coupé).',
      'Mesurez le secondaire : ~0.5Ω à 15Ω.',
      'Vérifiez l’isolation (OL) entre primaire, secondaire et carcasse.',
    ],
    stepsEn: [
      'Measure primary winding: ~50Ω–600Ω (OL = open).',
      'Measure secondary winding: ~0.5Ω–15Ω.',
      'Verify OL isolation between primary, secondary, and metal frame.',
    ],
    goodReadingFr: 'Primaire et secondaire continus ; isolation OL entre bobinages.',
    goodReadingEn: 'Both windings continuous; OL isolation between primary & secondary.',
    openFaultReadingFr: 'OL sur le primaire (fusible thermique interne fondu).',
    openFaultReadingEn: 'OL across primary winding.',
    shortFaultReadingFr: 'Fuite/court-circuit vers le secondaire ou le châssis.',
    shortFaultReadingEn: 'Short between primary/secondary or to metal frame.',
    degradedReadingFr: 'Spires en court-circuit causant une chauffe rapide.',
    degradedReadingEn: 'Shorted winding turns causing severe heating.',
  },
  varistor: {
    nameFr: 'Varistance (MOV)',
    nameEn: 'Metal Oxide Varistor (MOV)',
    unitFr: 'Tension de blocage',
    unitEn: 'V Clamp',
    shortRoleFr: 'Parafoudre d’entrée qui absorbe les surtensions brutales pour faire sauter le fusible et sauver l’appareil.',
    shortRoleEn: 'Input surge protector that clamps dangerous voltage spikes to trip the fuse and save the circuit.',
    fullRoleFr:
      'Disque bleu ou jaune placé juste après le fusible en parallèle sur le 220V : invisible en usage normal, il court-circuite toute pointe dépassant son seuil.',
    fullRoleEn:
      'Placed across the mains input right after the fuse: stays open at normal voltage and shorts out dangerous surges.',
    howItWorksFr:
      'Résistance très élevée (>MΩ) sous 220V, s’effondrant instantanément au-dessus de son seuil (ex : 471 = 470V DC / ~300V AC).',
    howItWorksEn:
      'High impedance (>MΩ) at normal line voltage, dropping sharply to near zero when voltage exceeds its rated breakdown (e.g., 471 = 470V).',
    pinoutNotesFr: ['Non polarisée, branchée en parallèle après le fusible.'],
    pinoutNotesEn: ['Non-polarized, connected in parallel across AC input after the fuse.'],
    commonTypesFr: ['10D471K / 14D471K pour 220V AC'],
    commonTypesEn: ['10D471K / 14D471K for 220V AC'],
    realWorldUsesFr: ['Multiprises parasurtenseurs', 'Entrées d’alimentations TV/PC'],
    realWorldUsesEn: ['Surge-protected power strips', 'TV & appliance power inputs'],
    visualFaultSignsFr: ['Disque explosé ou noirci (surtension 380V/foudre)', 'Court-circuit franc'],
    visualFaultSignsEn: ['Exploded or scorched blue disc', 'Dead short blowing every new fuse'],
    recommendedModeLabelFr: 'Mode Ohmmètre (Ω)',
    recommendedModeLabelEn: 'Ohm Mode (Ω)',
    safetyNoteFr: 'Si la varistance est éclatée, remplacez-la impérativement en même temps que le fusible.',
    safetyNoteEn: 'Always replace both the blown fuse and a damaged MOV together.',
    stepsFr: [
      'Hors tension en mode Ω : une varistance saine doit afficher OL.',
      'Si elle bippe en continuité, elle est détruite et en court-circuit.',
    ],
    stepsEn: [
      'Power off in Ohm mode: a healthy MOV must read OL.',
      'Any low resistance or beep means it is shorted and must be replaced.',
    ],
    goodReadingFr: 'OL dans les deux sens.',
    goodReadingEn: 'OL in both directions.',
    openFaultReadingFr: 'Visuellement fendue ou carbonisée (remplacement obligatoire).',
    openFaultReadingEn: 'Physically blown apart (replace immediately).',
    shortFaultReadingFr: '0.0Ω et bip continu faisant sauter le fusible.',
    shortFaultReadingEn: '0.0Ω dead short tripping the input fuse.',
    degradedReadingFr: 'Résistance abaissée (<1MΩ) causant un échauffement.',
    degradedReadingEn: 'Degraded insulation (<1MΩ) causing warm disc.',
  },
  dc_motor: {
    nameFr: 'Moteur à courant continu (DC)',
    nameEn: 'DC Motor',
    unitFr: 'Volt / RPM',
    unitEn: 'V / RPM',
    shortRoleFr: 'Convertit l’énergie électrique continue en rotation mécanique pour ventilateurs et robots.',
    shortRoleEn: 'Converts DC electrical power into rotational mechanical motion for fans and robotics.',
    fullRoleFr:
      'Tourne dès qu’il est alimenté et inverse son sens en inversant la polarité. Sa vitesse se règle facilement par PWM via MOSFET.',
    fullRoleEn:
      'Spins on DC power, reverses direction when polarity is swapped, and supports smooth PWM speed control.',
    howItWorksFr:
      'Le courant passe par les balais (charbons) vers le rotor bobiné qui tourne face aux aimants permanents du stator.',
    howItWorksEn:
      'Current enters armature coils through brushes and commutator, interacting with permanent magnets to spin the shaft.',
    pinoutNotesFr: ['2 bornes ; inverser + et - inverse le sens de rotation.', 'Ajoutez une diode de roue libre sur transistor.'],
    pinoutNotesEn: ['2 terminals; reversing polarity reverses spin direction.', 'Use a flyback diode when driven by transistors.'],
    commonTypesFr: ['Moteur DC à balais 3–12V', 'Moteur Brushless (BLDC)'],
    commonTypesEn: ['Brushed DC 3–12V motor', 'Brushless BLDC fan motor'],
    realWorldUsesFr: ['Ventilateurs, pompes et robots', 'Lève-vitres automobiles'],
    realWorldUsesEn: ['Cooling fans, pumps & robotics', 'Automotive actuators'],
    visualFaultSignsFr: ['Étincelles et odeur de brûlé aux charbons', 'Blocage mécanique ou coupure OL'],
    visualFaultSignsEn: ['Heavy brush sparking & burnt smell', 'Seized shaft or open winding'],
    recommendedModeLabelFr: 'Mode Ohmmètre (Ω)',
    recommendedModeLabelEn: 'Ohm Mode (Ω)',
    safetyNoteFr: 'Faites tourner lentement l’axe à la main pendant la mesure en Ω pour vérifier chaque lamelle du collecteur.',
    safetyNoteEn: 'Spin the shaft slowly by hand during Ohm measurement to check all commutator segments.',
    stepsFr: [
      'Débranchez le moteur et mesurez en Ω (gamme 200Ω) : ~2Ω à 40Ω.',
      'Tournez l’arbre doucement : aucune coupure OL ne doit apparaître.',
    ],
    stepsEn: [
      'Disconnect motor and measure on 200Ω range: reads ~2Ω–40Ω.',
      'Rotate shaft slowly: resistance should stay continuous without OL dropouts.',
    ],
    goodReadingFr: 'Faible résistance stable (~4Ω–25Ω) sur tout le tour.',
    goodReadingEn: 'Low steady resistance (~4Ω–25Ω) across full rotation.',
    openFaultReadingFr: 'OL (bobinage coupé ou balais usés).',
    openFaultReadingEn: 'OL (open winding or worn brushes).',
    shortFaultReadingFr: 'Proche de 0.1Ω avec couple nul et surchauffe.',
    shortFaultReadingEn: 'Near 0.1Ω with excessive heat and no torque.',
    degradedReadingFr: 'Pics >100Ω par angle (collecteur encrassé).',
    degradedReadingEn: 'High resistance spikes at certain angles.',
  },
  speaker: {
    nameFr: 'Haut-parleur dynamique',
    nameEn: 'Dynamic Speaker (8Ω)',
    unitFr: 'Ohm / Watt',
    unitEn: 'Ω / W',
    shortRoleFr: 'Transforme les signaux audio amplifiés en ondes sonores audibles.',
    shortRoleEn: 'Converts amplified electrical audio signals into audible sound waves.',
    fullRoleFr:
      'Fait vibrer une membrane conique au rythme des variations de courant pour restituer voix et musique avec fidélité.',
    fullRoleEn:
      'Drives a paper or polymer cone back and forth to reproduce speech, music, and complex audio.',
    howItWorksFr:
      'Une bobine mobile solidaire du cône se déplace dans le champ d’un aimant permanent selon le courant audio.',
    howItWorksEn:
      'A lightweight voice coil attached to the cone moves inside a permanent magnet gap when driven by audio current.',
    pinoutNotesFr: ['Impédance et puissance inscrites au dos (ex : 8Ω 2W).', 'Respectez (+) et (-) pour la phase stéréo.'],
    pinoutNotesEn: ['Impedance and wattage printed on magnet (e.g., 8Ω 2W).', 'Match (+) and (-) markings for proper stereo phase.'],
    commonTypesFr: ['Mini haut-parleurs 8Ω 0.5–3W', 'Enceintes 4Ω / 8Ω haute puissance'],
    commonTypesEn: ['Mini 8Ω 0.5–3W speakers', 'High-power 4Ω / 8Ω drivers'],
    realWorldUsesFr: ['Téléviseurs, radios et interphones', 'Systèmes de sonorisation'],
    realWorldUsesEn: ['TVs, radios, and intercoms', 'Audio amplifiers'],
    visualFaultSignsFr: ['Membrane déchirée', 'Frottement de la bobine ou silence complet'],
    visualFaultSignsEn: ['Torn cone', 'Rubbing voice coil or dead silence'],
    recommendedModeLabelFr: 'Mode Ohmmètre (Ω)',
    recommendedModeLabelEn: 'Ohm Mode (Ω)',
    safetyNoteFr: 'En mode Ohmmètre/Diode, un petit claquement audible de la membrane confirme son bon fonctionnement.',
    safetyNoteEn: 'A soft audible click/pop when probing on Diode/Ohm mode confirms cone movement.',
    stepsFr: [
      'Débranchez un fil de l’ampli.',
      'Mesurez en Ω : un HP 8Ω lit ~6.5Ω–7.8Ω en continu (et 4Ω lit ~3.2Ω).',
    ],
    stepsEn: [
      'Disconnect from amplifier.',
      'Measure Ohms: an 8Ω speaker reads ~6.5Ω–7.8Ω DC resistance (4Ω reads ~3.2Ω).',
    ],
    goodReadingFr: 'Résistance DC proche de l’impédance (~7.2Ω pour 8Ω) + petit clic audible.',
    goodReadingEn: 'DC resistance near rating (~7.2Ω for 8Ω) with audible click.',
    openFaultReadingFr: 'OL (bobine grillée) et aucun bruit.',
    openFaultReadingEn: 'OL (burnt open voice coil).',
    shortFaultReadingFr: '0.2Ω (vernis de bobine fondu).',
    shortFaultReadingEn: '0.2Ω (shorted voice coil).',
    degradedReadingFr: 'Bobine qui frotte ou grésille.',
    degradedReadingEn: 'Raspy output or rubbing coil.',
  },
  microphone: {
    nameFr: 'Microphone électret',
    nameEn: 'Electret Condenser Microphone',
    unitFr: 'mV / kΩ',
    unitEn: 'mV / kΩ',
    shortRoleFr: 'Capte la voix et convertit les vibrations de l’air en faible signal électrique.',
    shortRoleEn: 'Captures sound waves and converts acoustic vibrations into tiny electrical signals.',
    fullRoleFr:
      'Intégré dans téléphones, casques et interrupteurs sonores : contient un minuscule transistor JFET nécessitant une résistance de polarisation.',
    fullRoleEn:
      'Used in phones, headsets, and sound sensors; houses a tiny JFET buffer requiring a bias pull-up resistor.',
    howItWorksFr:
      'La membrane vibre face à une plaque chargée et module la tension à travers le JFET interne.',
    howItWorksEn:
      'Acoustic pressure vibrates a thin diaphragm, changing capacitance and modulating the internal JFET.',
    pinoutNotesFr: ['Polarisé : la patte reliée au boîtier métallique externe est le (-) GND.', 'L’autre broche isolée est le (+).'],
    pinoutNotesEn: ['Polarized: the pin connected to the outer aluminum shell is (-) GND.', 'The insulated pad is (+).'],
    commonTypesFr: ['Capsule électret 6×5mm / 9×7mm', 'Micro MEMS numérique'],
    commonTypesEn: ['6×5mm / 9×7mm electret capsules', 'Digital MEMS mics'],
    realWorldUsesFr: ['Téléphones et interphones', 'Détecteurs de claquement sonore'],
    realWorldUsesEn: ['Phones & intercoms', 'Clap switches & audio recorders'],
    visualFaultSignsFr: ['Feutre protecteur percé ou oxydation humide', 'Absence totale de son'],
    visualFaultSignsEn: ['Torn dust felt or moisture damage', 'Dead audio pickup'],
    recommendedModeLabelFr: 'Ohmmètre (Ω 20k)',
    recommendedModeLabelEn: 'Ohm Mode (20kΩ)',
    safetyNoteFr: 'Soufflez doucement près du micro en mesurant sa résistance : elle doit fluctuer.',
    safetyNoteEn: 'Blow gently near the mic while watching the Ohm reading fluctuate.',
    stepsFr: [
      'Repérez la masse (-) reliée au boîtier métal.',
      'Sur gamme 20kΩ, rouge sur (+) et noire sur (-) : ~1kΩ à 3kΩ qui fluctue à la voix.',
    ],
    stepsEn: [
      'Identify (-) connected to outer metal casing.',
      'On 20kΩ range, red on (+) and black on (-): reads ~1kΩ–3kΩ and fluctuates when spoken into.',
    ],
    goodReadingFr: '1kΩ–3kΩ variant légèrement au souffle/son.',
    goodReadingEn: '1kΩ–3kΩ fluctuating slightly with sound.',
    openFaultReadingFr: 'OL (JFET interne détruit).',
    openFaultReadingEn: 'OL (dead internal JFET).',
    shortFaultReadingFr: '0.0Ω entre + et -.',
    shortFaultReadingEn: '0.0Ω short across pins.',
    degradedReadingFr: 'Valeur figée ne réagissant pas au son.',
    degradedReadingEn: 'Static resistance unresponsive to sound.',
  },
  lcd_display: {
    nameFr: 'Écran LCD alphanumérique 16×2',
    nameEn: 'Character LCD Display (16x2)',
    unitFr: '16×2 / 5V',
    unitEn: '16×2 / 5V',
    shortRoleFr: 'Affiche textes, mesures et messages système sur 2 lignes de 16 caractères.',
    shortRoleEn: 'Displays readable text, numbers, and system measurements across 2 rows of 16 characters.',
    fullRoleFr:
      'Interface visuelle classique des appareils de laboratoire et projets Arduino, dotée d’un contrôleur HD44780 et d’un rétroéclairage LED.',
    fullRoleEn:
      'Classic alphanumeric readout with built-in HD44780 controller and LED backlight for embedded projects and test gear.',
    howItWorksFr:
      'Des cristaux liquides polarisent la lumière du rétroéclairage par matrice de points selon les commandes reçues en 4/8 bits ou via module I2C.',
    howItWorksEn:
      'Liquid crystal cells twist light from the LED backlight under digital control via 4/8 data lines or an I2C backpack.',
    pinoutNotesFr: ['1: VSS (GND), 2: VDD (+5V), 3: V0 (contraste via potentiomètre), 15/16: Rétroéclairage A/K.'],
    pinoutNotesEn: ['1: VSS (GND), 2: VDD (+5V), 3: V0 (contrast pot), 15/16: Backlight A/K.'],
    commonTypesFr: ['LCD 16×2 verte/bleue parallèle 16 broches', 'LCD avec adaptateur I2C 4 fils'],
    commonTypesEn: ['16-pin parallel 16×2 LCD', '4-wire I2C LCD module'],
    realWorldUsesFr: ['Multimètres/alimentations DIY et imprimantes 3D', 'Stations météo Arduino'],
    realWorldUsesEn: ['Bench power supplies & 3D printers', 'Arduino telemetry displays'],
    visualFaultSignsFr: ['Verre fissuré avec tache noire', 'Rétroéclairage allumé sans aucun caractère'],
    visualFaultSignsEn: ['Cracked glass leaking black liquid', 'Backlight on with blank squares only'],
    recommendedModeLabelFr: 'V DC & Mode Diode',
    recommendedModeLabelEn: 'V DC & Diode Mode',
    safetyNoteFr: 'Inverser +5V (broche 2) et GND (broche 1) détruit instantanément le contrôleur LCD !',
    safetyNoteEn: 'Reversing +5V (Pin 2) and GND (Pin 1) instantly destroys the LCD controller!',
    stepsFr: [
      'Hors tension : pas de court-circuit entre broches 2 et 1.',
      'Mode Diode sur 15 (+) et 16 (-) : le rétroéclairage s’allume (~2.8V).',
      'Sous tension : vérifiez +5V sur (2-1) et ~0.5V sur V0 (3) pour le contraste.',
    ],
    stepsEn: [
      'Power off: check Pins 2 & 1 are not shorted.',
      'Diode mode on Pins 15 (+) and 16 (-): backlight glows (~2.8V).',
      'Power on: verify +5V on (2-1) and ~0.5V on Pin 3 (V0) for visible text.',
    ],
    goodReadingFr: '+5V valide, rétroéclairage actif et contraste V0 ~0.6V.',
    goodReadingEn: 'Valid +5V rail, working backlight, V0 contrast ~0.6V.',
    openFaultReadingFr: 'Rétroéclairage mort (OL sur 15-16).',
    openFaultReadingEn: 'Dead backlight (OL on 15-16).',
    shortFaultReadingFr: 'Court-circuit VDD–VSS surchauffant la puce.',
    shortFaultReadingEn: 'VDD–VSS short overheating driver.',
    degradedReadingFr: 'Colonnes ou lignes de pixels manquantes.',
    degradedReadingEn: 'Missing character columns or dead lines.',
  },
  igbt: {
    nameFr: 'Transistor IGBT de puissance',
    nameEn: 'IGBT Transistor (FGA25N120)',
    unitFr: 'Volt / Ampère',
    unitEn: 'Vces / Ic',
    shortRoleFr: 'Interrupteur haute puissance combinant grille isolée type MOSFET et forte capacité en courant/tension type bipolaire.',
    shortRoleEn: 'High-power switch combining a voltage-driven MOSFET gate with high-current, high-voltage BJT conduction.',
    fullRoleFr:
      'Cœur des postes à souder Inverter, plaques à induction et variateurs de moteurs industriels (600V–1200V), l’IGBT pilote de lourds courants avec une simple commande en tension sur la grille.',
    fullRoleEn:
      'Core power switch in inverter welders, induction cooktops, UPS units, and VFD motor drives—handling 600V–1200V and high currents with low conduction loss.',
    howItWorksFr:
      'Une tension positive (~15V) entre Grille (G) et Émetteur (E) ouvre la conduction entre Collecteur (C) et Émetteur ; la plupart intègrent une diode de roue libre E→C.',
    howItWorksEn:
      'Applying ~15V between Gate (G) and Emitter (E) turns on conduction from Collector (C) to Emitter; most discrete IGBTs include an internal E→C flyback diode.',
    formulaMeaningFr: 'Entre en conduction au-dessus de Vge(th) (~5V, piloté à 15V) avec une chute Vce(sat) quasi constante.',
    formulaMeaningEn: 'Turns ON above gate threshold (~5V, typically driven at 15V) with low saturation drop Vce(sat).',
    pinoutNotesFr: [
      'Boîtier TO-247 / TO-220 de face : Gauche = Grille (G), Centre + semelle = Collecteur (C), Droite = Émetteur (E).',
      'Déchargez toujours la grille avant mesure pour éviter un déclenchement statique.',
    ],
    pinoutNotesEn: [
      'TO-247 / TO-220 front view: Left = Gate (G), Center & metal tab = Collector (C), Right = Emitter (E).',
      'Short all three pins momentarily before testing to discharge static gate capacitance.',
    ],
    commonTypesFr: ['FGA25N120 / IHW20N120 (1200V 25A induction/soudure)', '40N60 / IRG4PC50U (600V onduleurs/VFD)'],
    commonTypesEn: ['FGA25N120 / IHW20N120 (1200V 25A induction/welding)', '40N60 / IRG4PC50U (600V inverters & VFD)'],
    realWorldUsesFr: ['Postes à souder Inverter et onduleurs UPS', 'Plaques à induction et climatiseurs Inverter'],
    realWorldUsesEn: ['Inverter welders & high-power UPS systems', 'Induction cooktops and inverter motor drives'],
    visualFaultSignsFr: ['Boîtier éclaté ou fissuré suite à un court-circuit', 'Court-circuit franc entre les 3 broches G-C-E'],
    visualFaultSignsEn: ['Exploded or cracked epoxy body', 'Dead short across all three pins (G-C-E) blowing main fuse'],
    recommendedModeLabelFr: 'Mode Diode (⊳|) & Ω',
    recommendedModeLabelEn: 'Diode Mode (⊳|) & Ohm',
    safetyNoteFr: 'Court-circuitez brièvement G-C-E au doigt ou au tournevis avant le test pour vider la charge statique de la grille !',
    safetyNoteEn: 'Touch all three leads together first to discharge any static voltage stored on the insulated Gate!',
    stepsFr: [
      'Déchargez les pattes et passez en mode Diode.',
      'Vérifiez que la Grille (G) lit OL par rapport à C et E dans les deux sens.',
      'Entre Émetteur (rouge sur E) et Collecteur (noir sur C), la diode interne lit ~0.45V–0.60V (OL en inverse).',
    ],
    stepsEn: [
      'Discharge the leads first, then select Diode mode.',
      'Verify complete Gate isolation: OL between G and both C & E in both polarities.',
      'Probe internal diode: red on Emitter (E) and black on Collector (C) reads ~0.45V–0.60V; reverse reads OL.',
    ],
    goodReadingFr: 'Grille isolée (OL), diode E→C ~0.48V, et C→E bloqué (OL) hors amorçage.',
    goodReadingEn: 'Gate isolated (OL), E→C body diode ~0.48V, and C→E reads OL when discharged.',
    openFaultReadingFr: 'OL partout même entre E et C ou aucune réponse à l’amorçage.',
    openFaultReadingEn: 'OL everywhere including E→C diode or fails to latch on Gate pulse.',
    shortFaultReadingFr: '0.000V et bip continu entre G, C et E.',
    shortFaultReadingEn: '0.000V continuous short across G, C, and E.',
    degradedReadingFr: 'Fuite ohmique sur la grille G-E provoquant un échauffement immédiat.',
    degradedReadingEn: 'Gate-Emitter resistive leakage causing rapid thermal runaway.',
  },
  dual_schottky: {
    nameFr: 'Double Diode Schottky',
    nameEn: 'Dual Schottky Diode (MBR20100CT)',
    unitFr: 'Vf / Ampère',
    unitEn: 'Vf / A',
    shortRoleFr: 'Deux diodes Schottky rapides à cathode commune (10A–40A) pour redressement secondaire des alimentations à découpage.',
    shortRoleEn: 'Dual common-cathode fast Schottky rectifier (10A–40A) built for switching power supply secondary rails.',
    fullRoleFr:
      'Regroupe deux diodes Schottky dans un boîtier TO-220/TO-247 monté sur radiateur afin de redresser efficacement les rails +5V, +12V et +24V des alimentations PC et chargeurs de puissance.',
    fullRoleEn:
      'Houses two high-current Schottky diodes sharing a Common Cathode center pin & heatsink tab, delivering cool high-frequency rectification on +5V/+12V/+24V SMPS outputs.',
    howItWorksFr:
      'Chaque alternance entre par les anodes latérales (A1 et A2) et ressort redressée par la cathode centrale (K) avec une très faible chute de tension.',
    howItWorksEn:
      'Alternating transformer pulses feed outer Anodes (A1, A2) and exit rectified through the shared center Cathode (K) and back metal tab.',
    formulaMeaningFr: 'Faible chute directe Vf par branche et partage du courant total sur les deux diodes.',
    formulaMeaningEn: 'Low forward voltage drop per leg while sharing total load current across both internal diodes.',
    pinoutNotesFr: [
      'Boîtier TO-220AB cathode commune : 1 (gauche) = A1, 2 (centre & dos métal) = K commun, 3 (droite) = A2.',
      'Le schéma interne des deux diodes face à face est généralement gravé sur le boîtier.',
    ],
    pinoutNotesEn: [
      'Common-Cathode TO-220AB: Pin 1 = Anode 1 (A1), Pin 2 & back tab = Common Cathode (K), Pin 3 = Anode 2 (A2).',
      'The opposing dual-diode schematic is usually laser-marked on the front face.',
    ],
    commonTypesFr: ['MBR20100CT (20A 100V rails 12V/24V)', 'SBL3040PT (30A 40V alim PC ATX 5V)'],
    commonTypesEn: ['MBR20100CT (20A 100V for 12V/24V PSUs)', 'SBL3040PT (30A 40V for ATX 5V/3.3V rails)'],
    realWorldUsesFr: ['Étage secondaire des alims ATX et chargeurs PC portable', 'Couplage OU (ORing) de deux alimentations'],
    realWorldUsesEn: ['ATX PC power supplies & laptop chargers', 'Redundant power supply ORing circuits'],
    visualFaultSignsFr: ['Alimentation en sécurité (tic-tic) due à une branche en court-circuit', 'Boîtier fendu au centre'],
    visualFaultSignsEn: ['Power supply stuck in hiccup protection mode', 'Cracked center tab epoxy from overload'],
    recommendedModeLabelFr: 'Mode Diode (⊳|)',
    recommendedModeLabelEn: 'Diode Mode (⊳|)',
    safetyNoteFr: 'Dessoudez le composant pour le tester hors circuit : l’enroulement du transformateur parallèle fausserait la mesure.',
    safetyNoteEn: 'Remove from the PCB before testing so the secondary transformer winding does not mimic a short.',
    stepsFr: [
      'Mode Diode : rouge sur A1 (1), noire sur K (2) → ~0.22V–0.45V.',
      'Rouge sur A2 (3), noire sur K (2) → valeur quasi identique (~0.22V–0.45V).',
      'En sens inverse et entre A1–A2 directement : doit afficher OL.',
    ],
    stepsEn: [
      'Diode mode: red on A1 (Pin 1), black on center K (Pin 2) → ~0.22V–0.45V.',
      'Red on A2 (Pin 3), black on K (Pin 2) → matching ~0.22V–0.45V reading.',
      'Reversed probes and directly across A1–A2 must both read OL.',
    ],
    goodReadingFr: 'A1→K et A2→K symétriques (~0.25V–0.42V) ; OL en inverse et entre A1–A2.',
    goodReadingEn: 'Balanced ~0.25V–0.42V on A1→K and A2→K; OL reversed and across A1–A2.',
    openFaultReadingFr: 'OL sur une ou les deux branches en sens direct.',
    openFaultReadingEn: 'One or both legs read OL in forward bias.',
    shortFaultReadingFr: '0.000V et bip continu entre A1/A2 et K.',
    shortFaultReadingEn: '0.000V continuous beep between A1 or A2 and center K.',
    degradedReadingFr: 'Déséquilibre important entre les deux diodes ou fuite inverse.',
    degradedReadingEn: 'Mismatched forward drops or reverse leakage across legs.',
  },
  ultrasonic_hcsr04: {
    nameFr: 'Capteur à ultrasons (HC-SR04)',
    nameEn: 'Ultrasonic Distance Sensor (HC-SR04)',
    unitFr: 'cm / µs',
    unitEn: 'cm / µs',
    shortRoleFr: 'Mesure la distance sans contact (2 cm à 400 cm) par émission et réflexion d’ondes ultrasonores à 40 kHz.',
    shortRoleEn: 'Measures contactless distance (2 cm to 400 cm) by timing 40 kHz ultrasonic sonar pulses and echoes.',
    fullRoleFr:
      'Le module HC-SR04 émet 8 salves ultrasonores par sa capsule T et mesure le temps de retour de l’écho sur la capsule R pour calculer la distance avec une précision de ~3 mm.',
    fullRoleEn:
      'Fires an 8-cycle 40 kHz acoustic burst from transmitter (T) and raises the Echo pin proportional to round-trip travel time at ~3 mm resolution.',
    howItWorksFr:
      'Une impulsion de 10 µs sur Trig déclenche l’émission ; Echo reste à +5V pendant tout l’aller-retour de l’onde sonore.',
    howItWorksEn:
      'A 10 µs pulse on Trig fires the sonar; Echo stays HIGH (+5V) until the reflected sound wave returns.',
    formulaMeaningFr: 'Distance = (Temps Echo µs × vitesse du son 0,0343 cm/µs) / 2.',
    formulaMeaningEn: 'Distance equals Echo pulse duration times speed of sound (0.0343 cm/µs) divided by 2.',
    pinoutNotesFr: [
      '4 broches : VCC (+5V), Trig (entrée déclenchement), Echo (sortie impulsion), GND (masse).',
      'Utilisez un pont diviseur sur Echo pour les cartes 3.3V (ESP32).',
    ],
    pinoutNotesEn: [
      '4 Pins: VCC (+5V), Trig (10µs trigger input), Echo (distance pulse output), GND.',
      'Use a voltage divider on Echo when wiring to 3.3V MCUs like ESP32.',
    ],
    commonTypesFr: ['HC-SR04 standard (5V, 2–400cm)', 'JSN-SR04T étanche pour cuves et véhicules'],
    commonTypesEn: ['Standard HC-SR04 (5V, 2–400cm)', 'Waterproof JSN-SR04T probe'],
    realWorldUsesFr: ['Robots éviteurs d’obstacles et radars de recul', 'Mesure de niveau d’eau sans contact'],
    realWorldUsesEn: ['Obstacle-avoiding robots & parking aids', 'Non-contact water tank level sensing'],
    visualFaultSignsFr: ['Grille métallique enfoncée ou membrane déchirée', 'Quartz 4 MHz cassé ou dessoudé'],
    visualFaultSignsEn: ['Dented transducer mesh or torn cone', 'Damaged or cracked 4 MHz crystal'],
    recommendedModeLabelFr: 'V DC & Ohmmètre (Ω)',
    recommendedModeLabelEn: 'V DC & Ohm Mode',
    safetyNoteFr: 'Inverser +5V et GND grille instantanément le circuit MAX232 et les amplis arrière !',
    safetyNoteEn: 'Reversing +5V and GND instantly damages the onboard MAX232 and receiver ICs!',
    stepsFr: [
      'Hors tension : vérifiez l’absence de court-circuit entre VCC et GND.',
      'Sous 5V : contrôlez +5.00V stable sur VCC–GND.',
      'Avec déclenchement Trig actif, la tension moyenne sur Echo varie selon la distance (ou observez l’impulsion à l’oscilloscope).',
    ],
    stepsEn: [
      'Power off: confirm no short circuit between VCC and GND.',
      'Powered at 5V: verify steady +5.00V across VCC and GND.',
      'With Trig pulses running, average Echo DC voltage shifts with hand distance (inspect pulse width on scope).',
    ],
    goodReadingFr: 'Pas de court-circuit VCC–GND, +5.00V valide et tension/impulsion Echo réactive.',
    goodReadingEn: 'No power short, steady +5.00V rail, and responsive Echo pulse voltage.',
    openFaultReadingFr: 'Echo figé à 0.00V malgré +5V et impulsions Trig.',
    openFaultReadingEn: 'Echo stuck at 0.00V despite +5V supply and Trig pulses.',
    shortFaultReadingFr: 'Court-circuit direct VCC–GND (0.05Ω).',
    shortFaultReadingEn: 'Dead VCC–GND short (0.05Ω) overheating board.',
    degradedReadingFr: 'Echo bloqué à +5V en permanence ou lectures erratiques.',
    degradedReadingEn: 'Echo latched permanently at +5V or erratic noise spikes.',
  },
  dht_sensor: {
    nameFr: 'Capteur Température & Humidité (DHT11 / DHT22)',
    nameEn: 'Temp & Humidity Sensor (DHT11 / DHT22)',
    unitFr: '°C / %RH',
    unitEn: '°C / %RH',
    shortRoleFr: 'Capteur numérique pré-calibré mesurant la température et l’humidité ambiante sur un seul fil de données.',
    shortRoleEn: 'Pre-calibrated digital sensor measuring ambient temperature and relative humidity over a 1-Wire data pin.',
    fullRoleFr:
      'Intègre un élément capacitif d’humidité et une thermistance NTC avec puce 8 bits interne envoyant des trames numériques calibrées sans besoin de convertisseur ADC.',
    fullRoleEn:
      'Combines a capacitive humidity polymer and NTC thermistor with an internal 8-bit MCU outputting calibrated 40-bit digital packets.',
    howItWorksFr:
      'Communication série 1-fil : le microcontrôleur envoie une impulsion de départ et le capteur répond par 40 bits (humidité, température et checksum).',
    howItWorksEn:
      'Single-wire protocol: host pulls DATA low to request a reading, and sensor replies with 40 calibrated bits plus checksum.',
    formulaMeaningFr: 'DHT11 : 0–50°C (±2°C) | DHT22 : -40–80°C (±0.5°C, bien plus précis).',
    formulaMeaningEn: 'DHT11 covers 0–50°C (±2°C), while DHT22 expands to -40–80°C at ±0.5°C accuracy.',
    pinoutNotesFr: [
      'Capteur nu 4 broches (grille de face, de gauche à droite) : 1 VCC (3.3–5V), 2 DATA, 3 NC, 4 GND.',
      'Ajoutez une résistance Pull-up de 4.7kΩ–10kΩ entre DATA et VCC sur les modèles nus.',
    ],
    pinoutNotesEn: [
      'Bare 4-pin (front grille left-to-right): 1 VCC (3.3–5V), 2 DATA, 3 NC, 4 GND.',
      'Add a 4.7kΩ–10kΩ pull-up resistor between DATA and VCC if using a bare 4-pin unit.',
    ],
    commonTypesFr: ['DHT11 bleu économique (1 Hz)', 'DHT22 / AM2302 blanc haute précision (0.5 Hz)'],
    commonTypesEn: ['Blue DHT11 budget sensor (1 Hz)', 'White DHT22 / AM2302 precision sensor'],
    realWorldUsesFr: ['Couveuses et serres agricoles automatisées', 'Stations météo et suivi de salles serveurs'],
    realWorldUsesEn: ['Incubators & smart greenhouses', 'Weather stations & server room monitoring'],
    visualFaultSignsFr: ['Corrosion des pattes due à la condensation d’eau', 'Erreurs NaN/Timeout ou surchauffe après inversion'],
    visualFaultSignsEn: ['Corroded leads from direct water condensation', 'NaN / timeout errors or hot housing after reverse wiring'],
    recommendedModeLabelFr: 'V DC & Ohmmètre (Ω)',
    recommendedModeLabelEn: 'V DC & Ohm Mode',
    safetyNoteFr: 'Attention à l’ordre des broches sur les petits modules PCB 3 broches : vérifiez toujours la sérigraphie (+, OUT, -) !',
    safetyNoteEn: 'Always check silkscreen labels on 3-pin breakout boards as pin ordering varies by manufacturer!',
    stepsFr: [
      'Hors tension : contrôlez qu’il n’y a aucun court-circuit entre VCC (1) et GND (4).',
      'Sous 5V : vérifiez +5.0V sur VCC et ~4.95V au repos sur DATA (avec Pull-up).',
    ],
    stepsEn: [
      'Power off: ensure no short circuit between VCC (Pin 1) and GND (Pin 4).',
      'Powered at 5V: verify +5.0V supply and ~4.95V idle pull-up voltage on DATA.',
    ],
    goodReadingFr: '+5.0V stable et ligne DATA à ~4.95V avec brèves chutes lors des trames.',
    goodReadingEn: 'Steady +5.0V rail and ~4.95V pulled-up DATA line with periodic data dips.',
    openFaultReadingFr: 'Ligne DATA à 0V malgré la résistance Pull-up ou absence de réponse.',
    openFaultReadingEn: 'DATA stuck at 0V or completely unresponsive to start pulse.',
    shortFaultReadingFr: 'Court-circuit VCC–GND (~0Ω) provoquant un échauffement.',
    shortFaultReadingEn: 'VCC–GND short (~0Ω) causing overheating.',
    degradedReadingFr: 'Capteur saturé affichant une humidité figée aberrante (ex : 99%).',
    degradedReadingEn: 'Contaminated polymer element stuck at an unrealistic reading (e.g., 99% RH).',
  },
  pir_sensor: {
    nameFr: 'Capteur de mouvement PIR (HC-SR501)',
    nameEn: 'PIR Motion Sensor (HC-SR501)',
    unitFr: '3.3V / mètre',
    unitEn: '3.3V / m',
    shortRoleFr: 'Détecte les mouvements de corps chauds (humains/animaux) jusqu’à 7 m pour déclencher éclairage et alarmes.',
    shortRoleEn: 'Detects warm moving bodies up to 7 meters away via passive infrared changes for auto-lighting & security alarms.',
    fullRoleFr:
      'Capteur infrarouge passif équipé d’une lentille de Fresnel blanche focalisant le rayonnement thermique sur un élément pyroélectrique double, produisant un signal logique 3.3V fiable.',
    fullRoleEn:
      'Uses a multi-faceted Fresnel dome to focus body heat onto a dual pyroelectric element, outputting a clean 3.3V digital trigger via its BISS0001 controller.',
    howItWorksFr:
      'Le passage d’une personne crée une différence de chaleur infrarouge entre les deux fentes ; la sortie OUT passe à 3.3V pendant la durée réglée par le potentiomètre Tx.',
    howItWorksEn:
      'Moving infrared heat creates a differential voltage across dual sensor elements, latching OUT HIGH (3.3V) for the Tx timer duration.',
    formulaMeaningFr: 'Sortie OUT = 3.3V lors d’une détection, 0V au repos ; portée 3 à 7 mètres.',
    formulaMeaningEn: 'Outputs 3.3V HIGH on motion detection and 0V when idle, covering 3–7 meters.',
    pinoutNotesFr: [
      '3 broches (potentiomètres en haut) : Gauche VCC (4.5–20V), Centre OUT (3.3V), Droite GND.',
      'Potentiomètre Sx = Sensibilité/Portée ; Tx = Temporisation de maintien (5s–300s).',
    ],
    pinoutNotesEn: [
      '3 Pins (trimpots at top): Left VCC (4.5–20V), Center OUT (3.3V), Right GND.',
      'Trimpots: Sx adjusts detection distance; Tx sets output hold delay (5s–300s).',
    ],
    commonTypesFr: ['HC-SR501 standard avec régulateur et réglages Sx/Tx', 'Mini module AM312 (3.3V basse conso)'],
    commonTypesEn: ['Standard HC-SR501 adjustable module', 'Compact AM312 low-power 3.3V module'],
    realWorldUsesFr: ['Éclairage automatique de couloirs et escaliers', 'Alarmes anti-intrusion et caméras'],
    realWorldUsesEn: ['Automatic hallway & staircase lights', 'Burglar alarms & motion-triggered cameras'],
    visualFaultSignsFr: ['Lentille blanche Fresnel percée ou manquante', 'Régulateur 7133 brûlé au dos'],
    visualFaultSignsEn: ['Punctured or missing white Fresnel dome', 'Burnt 7133 voltage regulator on back PCB'],
    recommendedModeLabelFr: 'Voltmètre (V DC)',
    recommendedModeLabelEn: 'DC Voltage (V DC)',
    safetyNoteFr: 'Patientez 30–60 s de chauffe après mise sous tension ; utilisez toujours un transistor pour commander un relais depuis OUT !',
    safetyNoteEn: 'Allow 30–60 s warm-up after power-on; always drive relays through a transistor rather than directly from OUT!',
    stepsFr: [
      'Vérifiez l’absence de court-circuit VCC–GND hors tension.',
      'Alimentez entre 5V et 12V et placez le voltmètre entre OUT (+) et GND (-).',
      'Immobile : lit 0.00V. Passez la main devant le dôme : bondit à ~3.30V !',
    ],
    stepsEn: [
      'Check VCC–GND off-power to ensure no dead short.',
      'Power with 5V–12V and probe OUT (+) to GND (-) on V DC.',
      'While still: reads 0.00V; wave hand in front of dome → jumps cleanly to ~3.30V!',
    ],
    goodReadingFr: '0.00V au repos et saut franc à ~3.30V dès qu’un mouvement passe devant la lentille.',
    goodReadingEn: '0.00V idle and crisp jump to ~3.30V upon hand motion.',
    openFaultReadingFr: 'OUT reste bloqué à 0.00V malgré le mouvement.',
    openFaultReadingEn: 'OUT stays stuck at 0.00V even when motion passes in front.',
    shortFaultReadingFr: 'Court-circuit d’entrée détruisant le régulateur 7133.',
    shortFaultReadingEn: 'Power rail short destroying the 7133 regulator.',
    degradedReadingFr: 'Faux déclenchements permanents (OUT bloqué à 3.3V).',
    degradedReadingEn: 'Continuous false triggers keeping OUT stuck at 3.3V.',
  },
  servo_sg90: {
    nameFr: 'Servomoteur Micro SG90',
    nameEn: 'Micro Servo Motor (SG90)',
    unitFr: '0–180° / 50Hz',
    unitEn: '0–180° / 50Hz',
    shortRoleFr: 'Actionneur de précision orientant son axe à un angle exact (0° à 180°) selon la largeur d’impulsion PWM.',
    shortRoleEn: 'Closed-loop geared actuator rotating precisely to any commanded angle (0°–180°) via 50 Hz PWM pulses.',
    fullRoleFr:
      'Combine moteur DC, réducteur à engrenages, potentiomètre de recopie interne et électronique d’asservissement pour maintenir exactement l’angle demandé.',
    fullRoleEn:
      'Integrates a DC motor, reduction gearbox, internal feedback potentiometer, and control IC to hold any commanded shaft angle accurately.',
    howItWorksFr:
      'Reçoit une impulsion toutes les 20 ms (50 Hz) sur le fil orange : 1 ms = 0°, 1,5 ms = 90° (neutre), 2 ms = 180°.',
    howItWorksEn:
      'Reads a 50 Hz (20 ms period) pulse on the orange wire: 1.0 ms sets 0°, 1.5 ms centers at 90°, and 2.0 ms moves to 180°.',
    formulaMeaningFr: 'Fréquence 50 Hz (période 20 ms) : largeur d’impulsion 1 à 2 ms définit la position.',
    formulaMeaningEn: '50 Hz carrier (20 ms period): pulse width between 1.0 ms and 2.0 ms commands 0°–180°.',
    pinoutNotesFr: [
      'Code couleur : Marron = GND (-), Rouge = +5V (VCC), Orange/Jaune = Signal PWM.',
      'Pic de courant jusqu’à 600 mA : utilisez une alimentation 5V dédiée pour plusieurs servos.',
    ],
    pinoutNotesEn: [
      'Wire colors: Brown = GND (-), Red = +5V (VCC), Orange/Yellow = PWM Signal.',
      'Draws up to ~600 mA under stall/load—power multiple servos from an external 5V supply.',
    ],
    commonTypesFr: ['SG90 pignons plastique 9g', 'MG90S / MG996R pignons métal fort couple'],
    commonTypesEn: ['SG90 nylon-gear 9g micro servo', 'MG90S / MG996R metal-gear high-torque servos'],
    realWorldUsesFr: ['Bras robotiques et pinces articulées', 'Serrures intelligentes, tourelles caméra et aéromodélisme'],
    realWorldUsesEn: ['Robotic arms & hexapod legs', 'Smart door locks, pan-tilt camera mounts & RC planes'],
    visualFaultSignsFr: ['Craquement d’engrenages cassés ou rotation continue sans butée', 'Surchauffe et tremblement continu (Jitter)'],
    visualFaultSignsEn: ['Stripped gear clicking or endless spinning', 'Hot housing and continuous jittering'],
    recommendedModeLabelFr: 'V DC & Ohmmètre (Ω)',
    recommendedModeLabelEn: 'V DC & Ohm Mode',
    safetyNoteFr: 'Ne forcez jamais le palonnier à la main lorsqu’il est sous tension au risque de briser les pignons plastique.',
    safetyNoteEn: 'Never force the servo horn sharply by hand while powered or you may strip the internal nylon gears.',
    stepsFr: [
      'Hors tension : mesurez entre Marron (GND) et Rouge (+5V) → plusieurs centaines d’Ω à quelques kΩ (pas 0Ω).',
      'En fonctionnement 5V : vérifiez que la tension Rouge–Marron reste >4.7V pendant le mouvement.',
      'Observez l’impulsion PWM 50 Hz sur le fil Orange à l’oscilloscope.',
    ],
    stepsEn: [
      'Unplugged: measure Ohm between Brown (GND) and Red (+5V) → typically hundreds of Ω to kΩ (never 0Ω).',
      'Powered at 5V: check supply holds >4.7V under movement without sagging.',
      'Inspect the 50 Hz (1–2 ms) PWM pulse train on the Orange signal wire via oscilloscope.',
    ],
    goodReadingFr: 'Résistance d’alim saine (>200Ω), tension ~5.0V stable en charge et PWM propre.',
    goodReadingEn: 'Healthy supply impedance (>200Ω), steady ~5.0V rail under load, crisp PWM signal.',
    openFaultReadingFr: 'Aucune réaction ni consommation (fil coupé ou moteur/carte HS).',
    openFaultReadingEn: 'No movement or current draw (broken wire, motor brushes, or dead IC).',
    shortFaultReadingFr: 'Court-circuit franc (~0.1Ω) entre Rouge et Marron (pont en H brûlé).',
    shortFaultReadingEn: 'Dead short (~0.1Ω) across Red–Brown from burnt internal H-bridge.',
    degradedReadingFr: 'Chute de tension sous charge et tremblement dû au potentiomètre interne usé.',
    degradedReadingEn: 'Voltage sag with erratic jitter from worn internal feedback pot.',
  },
  supercapacitor: {
    nameFr: 'Supercondensateur (EDLC)',
    nameEn: 'Supercapacitor / EDLC (2.7V / 5.5V)',
    unitFr: 'Farad (F)',
    unitEn: 'F',
    shortRoleFr: 'Stocke des capacités gigantesques en Farads entiers (1F à 3000F) avec recharge en quelques secondes et plus de 500 000 cycles.',
    shortRoleEn: 'Stores massive capacitance in full Farads (1F–3000F), charging in seconds for backup power and high peak bursts.',
    fullRoleFr:
      'Fait le pont entre condensateur et batterie : capacité des milliers de fois supérieure à un électrolytique classique, durée de vie extrême, mais tension max par cellule limitée à 2.7V.',
    fullRoleEn:
      'Bridges electrolytic capacitors and batteries with thousands of times higher capacitance and 500k+ cycle life, though single cells top out at 2.7V.',
    howItWorksFr:
      'Stocke l’énergie électrostatiquement dans une double couche électrique à surface nanométrique de charbon actif sans réaction chimique destructive.',
    howItWorksEn:
      'Stores charge electrostatically across a nanometer-thin Electric Double Layer on high-surface-area activated carbon.',
    formulaMeaningFr: 'Énergie (J) = ½ × C (Farads) × V² ; ex : 10F à 2.7V stocke 36,45 Joules.',
    formulaMeaningEn: 'Stored energy E = ½CV² (e.g., 10F at 2.7V holds 36.45 Joules).',
    pinoutNotesFr: [
      'Polarisé : bande latérale (-) et patte courte = Négatif ; patte longue = Positif (+).',
      'Danger critique : 2.7V max par cellule (ou 5.5V pour module double) — toute surtension le gonfle et le détruit !',
    ],
    pinoutNotesEn: [
      'Polarized: negative body stripe & shorter lead = (-); longer lead = (+).',
      'Critical limit: 2.7V max per single cell (5.5V dual pack)—overvoltage destroys the electrolyte!',
    ],
    commonTypesFr: ['Format bouton 5.5V (0.22F–1.5F) pour sauvegarde horloge RTC', 'Cylindrique 2.7V (1F–3000F) énergie solaire/auto'],
    commonTypesEn: ['5.5V coin cells (0.22F–1.5F) for RTC memory backup', '2.7V radial/cylindrical cells (1F–3000F)'],
    realWorldUsesFr: ['Maintien mémoire/horloge RTC et caméras embarquées Dashcam', 'Tampon de pointe pour panneaux solaires'],
    realWorldUsesEn: ['RTC memory backup & automotive dashcams', 'Solar peak-current buffering & regenerative energy'],
    visualFaultSignsFr: ['Sommet bombé ou fuite d’électrolyte à odeur chimique', 'Perte totale de tension en quelques secondes'],
    visualFaultSignsEn: ['Swollen vent cap or pungent electrolyte leak', 'Rapid self-discharge dropping to 0V within seconds'],
    recommendedModeLabelFr: 'V DC & Ohmmètre (Charge)',
    recommendedModeLabelEn: 'V DC & Ohm Charge Test',
    safetyNoteFr: 'Sa capacité en Farads dépasse la limite des capacimètres ordinaires (>CAP) ; testez-le par charge à 2.5V via une résistance de 10Ω puis maintien en V DC !',
    safetyNoteEn: 'Capacitance exceeds standard multimeter ranges (>CAP); test via 2.5V charge through a 10Ω resistor and monitor voltage retention!',
    stepsFr: [
      'Déchargez complètement le supercondensateur via une résistance de 22Ω jusqu’à 0.0V.',
      'En mode Ohmmètre, la résistance doit monter très lentement (beaucoup plus lentement qu’un condensateur µF).',
      'Chargez-le à 2.5V via 10Ω puis mesurez en V DC : un élément sain conserve ~2.50V avec une chute infime sur 60 secondes.',
    ],
    stepsEn: [
      'Discharge completely through a 22Ω resistor to 0.0V first.',
      'On Ohm mode, resistance climbs very slowly toward OL due to massive Farad capacity.',
      'Charge to 2.5V via a 10Ω resistor, disconnect, and monitor V DC: healthy units hold ~2.50V steadily.',
    ],
    goodReadingFr: 'Charge régulière et maintien stable de ~2.50V après déconnexion.',
    goodReadingEn: 'Smooth charging and steady ~2.50V retention after disconnecting supply.',
    openFaultReadingFr: 'Chute immédiate à 0.00V dès l’arrêt de la charge.',
    openFaultReadingEn: 'Drops instantly to 0.00V as soon as charging source is removed.',
    shortFaultReadingFr: 'Reste bloqué à 0.00V et bippe en continu.',
    shortFaultReadingEn: 'Stays dead at 0.00V with continuous short beep.',
    degradedReadingFr: 'ESR élevé et autodécharge rapide (chute de 2.5V à ~1.1V en quelques secondes).',
    degradedReadingEn: 'High ESR and rapid self-discharge (collapsing from 2.5V toward ~1V quickly).',
  },
};

export interface LocalizedComponentView {
  name: string;
  secondaryName: string;
  categoryLabel: string;
  unit: string;
  shortRole: string;
  fullRole: string;
  howItWorks: string;
  formulaMeaning?: string;
  pinoutNotes: string[];
  commonTypes: string[];
  realWorldUses: string[];
  visualFaultSigns: string[];
  recommendedModeLabel: string;
  safetyNote: string;
  steps: string[];
  goodReading: string;
  openFaultReading: string;
  shortFaultReading: string;
  degradedReading: string;
}

export function getLocalizedComponent(
  comp: ElectronicComponent,
  lang: AppLanguage
): LocalizedComponentView {
  if (lang === 'ar') {
    return {
      name: comp.nameAr,
      secondaryName: comp.nameEn,
      categoryLabel: comp.categoryLabelAr,
      unit: comp.unitAr,
      shortRole: comp.shortRoleAr,
      fullRole: comp.fullRoleAr,
      howItWorks: comp.howItWorksAr,
      formulaMeaning: comp.formula?.meaningAr,
      pinoutNotes: comp.pinoutNotesAr,
      commonTypes: comp.commonTypesAr,
      realWorldUses: comp.realWorldUsesAr,
      visualFaultSigns: comp.visualFaultSignsAr,
      recommendedModeLabel: comp.measurement.recommendedModeLabel,
      safetyNote: comp.measurement.safetyNote,
      steps: comp.measurement.steps,
      goodReading: comp.measurement.goodReading,
      openFaultReading: comp.measurement.openFaultReading,
      shortFaultReading: comp.measurement.shortFaultReading,
      degradedReading: comp.measurement.degradedReading,
    };
  }

  const tr = COMP_TRANSLATIONS[comp.id];
  const isFr = lang === 'fr';
  return {
    name: tr ? (isFr ? tr.nameFr : tr.nameEn) : comp.nameEn,
    secondaryName: comp.nameEn,
    categoryLabel: CATEGORY_MAP[comp.category][lang],
    unit: tr ? (isFr ? tr.unitFr : tr.unitEn) : comp.unitSymbol,
    shortRole: tr ? (isFr ? tr.shortRoleFr : tr.shortRoleEn) : comp.shortRoleAr,
    fullRole: tr ? (isFr ? tr.fullRoleFr : tr.fullRoleEn) : comp.fullRoleAr,
    howItWorks: tr ? (isFr ? tr.howItWorksFr : tr.howItWorksEn) : comp.howItWorksAr,
    formulaMeaning: tr ? (isFr ? tr.formulaMeaningFr : tr.formulaMeaningEn) : comp.formula?.meaningAr,
    pinoutNotes: tr ? (isFr ? tr.pinoutNotesFr : tr.pinoutNotesEn) : comp.pinoutNotesAr,
    commonTypes: tr ? (isFr ? tr.commonTypesFr : tr.commonTypesEn) : comp.commonTypesAr,
    realWorldUses: tr ? (isFr ? tr.realWorldUsesFr : tr.realWorldUsesEn) : comp.realWorldUsesAr,
    visualFaultSigns: tr ? (isFr ? tr.visualFaultSignsFr : tr.visualFaultSignsEn) : comp.visualFaultSignsAr,
    recommendedModeLabel: tr ? (isFr ? tr.recommendedModeLabelFr : tr.recommendedModeLabelEn) : comp.measurement.recommendedModeLabel,
    safetyNote: tr ? (isFr ? tr.safetyNoteFr : tr.safetyNoteEn) : comp.measurement.safetyNote,
    steps: tr ? (isFr ? tr.stepsFr : tr.stepsEn) : comp.measurement.steps,
    goodReading: tr ? (isFr ? tr.goodReadingFr : tr.goodReadingEn) : comp.measurement.goodReading,
    openFaultReading: tr ? (isFr ? tr.openFaultReadingFr : tr.openFaultReadingEn) : comp.measurement.openFaultReading,
    shortFaultReading: tr ? (isFr ? tr.shortFaultReadingFr : tr.shortFaultReadingEn) : comp.measurement.shortFaultReading,
    degradedReading: tr ? (isFr ? tr.degradedReadingFr : tr.degradedReadingEn) : comp.measurement.degradedReading,
  };
}

// =======================================
// PROJECTS TRANSLATIONS
// =======================================
interface ProjectTranslation {
  titleFr: string;
  titleEn: string;
  levelFr: string;
  levelEn: string;
  summaryFr: string;
  summaryEn: string;
  howCircuitWorksFr: string;
  howCircuitWorksEn: string;
  partsFr: { name: string; role: string }[];
  partsEn: { name: string; role: string }[];
  stepsFr: string[];
  stepsEn: string[];
  tipFr: string;
  tipEn: string;
}

const PROJECT_TRANSLATIONS: Record<string, ProjectTranslation> = {
  night_light: {
    titleFr: 'Veilleuse nocturne automatique (LDR + NPN)',
    titleEn: 'Automatic Night Light (LDR + NPN)',
    levelFr: 'Débutant',
    levelEn: 'Beginner',
    summaryFr: 'Allume automatiquement une LED dans l’obscurité et l’éteint le jour grâce à une photorésistance LDR et un transistor NPN.',
    summaryEn: 'Automatically turns on an LED in the dark and switches it off in daylight using an LDR and NPN transistor.',
    howCircuitWorksFr:
      'La LDR et la résistance de 10kΩ forment un diviseur de tension sur la Base du transistor. Le jour, la faible résistance de la LDR maintient la Base sous 0.6V (LED éteinte). Dans le noir, la LDR grimpe et la tension de Base dépasse 0.7V, saturant le transistor pour allumer la LED.',
    howCircuitWorksEn:
      'The LDR and 10kΩ resistor form a voltage divider feeding the transistor Base. In daylight, low LDR resistance keeps Base below 0.6V (LED off). In darkness, LDR resistance rises sharply, raising Base voltage above 0.7V to switch the transistor and LED on.',
    partsFr: [
      { name: 'Pile 9V avec coupleur', role: 'Fournit l’énergie continue au montage.' },
      { name: 'Photorésistance (LDR)', role: 'Détecte la luminosité ambiante en variant sa résistance.' },
      { name: 'Transistor NPN (BC547)', role: 'Interrupteur électronique piloté par la tension de Base.' },
      { name: 'Résistance de polarisation 10kΩ', role: 'Fixe le seuil de sensibilité avec la LDR.' },
      { name: 'Résistance de protection 330Ω', role: 'Limite le courant de la LED autour de 15mA.' },
      { name: 'LED 5mm', role: 'Charge lumineuse qui s’éclaire la nuit.' },
    ],
    partsEn: [
      { name: '9V Battery & Snap', role: 'Supplies DC power to the circuit.' },
      { name: 'Photoresistor (LDR)', role: 'Senses ambient light level by changing resistance.' },
      { name: 'NPN Transistor (BC547)', role: 'Electronic switch triggered by Base voltage.' },
      { name: '10kΩ Bias Resistor', role: 'Forms the voltage divider with the LDR.' },
      { name: '330Ω Limiting Resistor', role: 'Limits LED current safely to ~15mA.' },
      { name: '5mm LED', role: 'Output light illuminated at night.' },
    ],
    stepsFr: [
      'Placez le BC547 sur la breadboard et identifiez E, B, C.',
      'Reliez l’Émetteur au rail négatif (-) et le Collecteur via la 330Ω puis la LED vers (+).',
      'Connectez la 10kΩ entre (+) et la Base, et la LDR entre la Base et (-).',
      'Branchez la pile 9V et couvrez la LDR avec la main : la LED s’allume immédiatement !',
    ],
    stepsEn: [
      'Insert the BC547 onto the breadboard and verify E, B, C pins.',
      'Connect Emitter to (-) rail, and wire Collector → LED → 330Ω resistor → (+) rail.',
      'Wire the 10kΩ resistor from (+) to Base, and the LDR from Base to (-).',
      'Connect the 9V battery and cover the LDR with your hand to see the LED turn on.',
    ],
    tipFr: 'Pour régler précisément le seuil de déclenchement, remplacez la 10kΩ par un potentiomètre de 50kΩ.',
    tipEn: 'Swap the fixed 10kΩ resistor for a 50kΩ potentiometer to fine-tune the darkness threshold.',
  },
  regulated_power: {
    titleFr: 'Alimentation stabilisée +5V (LM7805)',
    titleEn: 'Regulated 5V Power Supply (LM7805)',
    levelFr: 'Débutant',
    levelEn: 'Beginner',
    summaryFr: 'Convertit une entrée 9V–12V en sortie propre et stable de +5V pour alimenter Arduino et capteurs.',
    summaryEn: 'Converts a 9V–12V input into a clean, regulated +5V rail safe for Arduino and digital sensors.',
    howCircuitWorksFr:
      'Le 7805 abaisse et régule l’entrée à exactement +5V. Le condensateur d’entrée lisse les variations et celui de sortie stabilise la réponse face aux appels de courant, tandis que la diode 1N4007 protège contre l’inversion de polarité.',
    howCircuitWorksEn:
      'The LM7805 clamps the output at a rock-steady +5V. Input and output capacitors filter ripples and transient spikes, while the 1N4007 series diode blocks accidental reverse polarity.',
    partsFr: [
      { name: 'Régulateur de tension LM7805', role: 'Abaisse et stabilise la sortie à +5.0V.' },
      { name: 'Condensateur d’entrée 100µF', role: 'Lisse et stabilise la tension brute d’entrée.' },
      { name: 'Condensateur de sortie 10µF / 0.1µF', role: 'Élimine les ondulations rapides en sortie +5V.' },
      { name: 'Diode 1N4007', role: 'Protège le régulateur contre toute inversion de batterie.' },
      { name: 'LED + Résistance 220Ω', role: 'Témoin lumineux de présence du +5V.' },
    ],
    partsEn: [
      { name: 'LM7805 Voltage Regulator', role: 'Regulates input voltage down to a steady +5.0V.' },
      { name: '100µF Input Capacitor', role: 'Smooths raw DC input fluctuations.' },
      { name: '10µF / 0.1µF Output Capacitors', role: 'Removes fast ripple and keeps +5V clean.' },
      { name: '1N4007 Protection Diode', role: 'Blocks reverse polarity mistakes.' },
      { name: 'LED + 220Ω Resistor', role: 'Indicates active +5V output rail.' },
    ],
    stepsFr: [
      'Montez le 7805 en vérifiant : 1 IN, 2 GND, 3 OUT.',
      'Placez le condensateur 100µF sur IN–GND et le 10µF sur OUT–GND en respectant la bande (-).',
      'Ajoutez la diode 1N4007 en série sur l’entrée positive puis la LED + 220Ω en sortie.',
      'Vérifiez au multimètre la présence exacte de +5.00V en sortie.',
    ],
    stepsEn: [
      'Place the LM7805 on the breadboard: Pin 1 IN, Pin 2 GND, Pin 3 OUT.',
      'Install 100µF on IN–GND and 10µF on OUT–GND observing (-) stripe polarity.',
      'Add the 1N4007 protection diode in series with input (+) and wire indicator LED + 220Ω at output.',
      'Confirm exact +5.00V DC output with a multimeter before connecting any MCU.',
    ],
    tipFr: 'Ajoutez un petit dissipateur en aluminium sur le 7805 si votre montage consomme plus de 200mA.',
    tipEn: 'Bolt a small aluminum heatsink onto the LM7805 tab when drawing over 200mA.',
  },
  ne555_flasher: {
    titleFr: 'Clignotant périodique à NE555',
    titleEn: 'NE555 Periodic LED Flasher',
    levelFr: 'Intermédiaire',
    levelEn: 'Intermediate',
    summaryFr: 'Génère une impulsion carrée régulière faisant clignoter deux LED en alternance grâce au célèbre circuit NE555.',
    summaryEn: 'Generates continuous square-wave clock pulses to blink LEDs rhythmically using the classic NE555 timer.',
    howCircuitWorksFr:
      'En mode Astable, le condensateur de 10µF se charge via R1+R2 jusqu’à 2/3 Vcc puis se décharge via R2 jusqu’à 1/3 Vcc à travers la broche 7, basculant sans fin la sortie (broche 3) entre Haut et Bas.',
    howCircuitWorksEn:
      'In Astable mode, the 10µF capacitor charges through R1+R2 up to 2/3 Vcc and discharges through R2 into Pin 7 down to 1/3 Vcc, endlessly toggling Pin 3 Output between HIGH and LOW.',
    partsFr: [
      { name: 'Circuit intégré NE555P', role: 'Génère les impulsions rectangulaires sur la broche 3.' },
      { name: 'Condensateur 10µF', role: 'Détermine la durée de charge/décharge du cycle.' },
      { name: 'Résistance R1 (1kΩ) & R2 (47kΩ)', role: 'Règlent la vitesse de clignotement.' },
      { name: '2 × LED + 2 × 330Ω', role: 'Clignotent en alternance entre VCC et GND.' },
    ],
    partsEn: [
      { name: 'NE555P Timer IC', role: 'Generates oscillating square waves at Pin 3.' },
      { name: '10µF Timing Capacitor', role: 'Sets the charge/discharge cycle timing.' },
      { name: 'R1 (1kΩ) & R2 (47kΩ) Resistors', role: 'Control blink rate and duty cycle.' },
      { name: '2 × LEDs + 2 × 330Ω Resistors', role: 'Flash alternately from Pin 3 output.' },
    ],
    stepsFr: [
      'Placez le NE555 à cheval sur la rainure centrale ; reliez 1 à GND, 4 et 8 à +9V.',
      'Reliez les broches 2 et 6 ensemble ; mettez le 10µF entre (2-6) et GND.',
      'Placez R1 (1kΩ) entre VCC et broche 7, puis R2 (47kΩ) entre 7 et 6.',
      'Connectez deux LED avec leurs 330Ω à la sortie (3) et observez le clignotement.',
    ],
    stepsEn: [
      'Straddle NE555 across the breadboard center trench; tie Pin 1 to GND, Pins 4 & 8 to +9V.',
      'Bridge Pin 2 to Pin 6 and connect the 10µF capacitor from (2-6) to GND.',
      'Wire R1 (1kΩ) from VCC to Pin 7, and R2 (47kΩ) from Pin 7 to Pin 6.',
      'Wire two LEDs with 330Ω resistors to Pin 3 Output and watch them alternate.',
    ],
    tipFr: 'Remplacez R2 par un potentiomètre 100kΩ pour ajuster la vitesse de clignotement en direct.',
    tipEn: 'Swap R2 for a 100kΩ potentiometer to adjust blinking speed on the fly.',
  },
  mosfet_dimmer: {
    titleFr: 'Variateur de puissance par MOSFET',
    titleEn: 'MOSFET Dimmer & Load Controller',
    levelFr: 'Intermédiaire',
    levelEn: 'Intermediate',
    summaryFr: 'Pilote la luminosité de lampes LED ou la vitesse d’un moteur DC sans échauffement à l’aide d’un MOSFET canal N.',
    summaryEn: 'Smoothly adjusts high-power LED brightness or DC motor speed using a low-loss N-Channel MOSFET.',
    howCircuitWorksFr:
      'Le potentiomètre applique une tension variable sur la Grille (Gate) du MOSFET. En réglant ce champ électrique, le MOSFET contrôle l’intensité traversant Drain–Source avec un courant de commande quasi nul.',
    howCircuitWorksEn:
      'The potentiometer sets a variable voltage on the MOSFET Gate. Modulating this electric field smoothly throttles Drain-to-Source load current with zero continuous Gate drive current.',
    partsFr: [
      { name: 'MOSFET Canal N (IRFZ44N)', role: 'Interrupteur de puissance commandé en tension.' },
      { name: 'Potentiomètre 10kΩ', role: 'Fait varier la tension appliquée sur la Grille.' },
      { name: 'Résistance Pull-Down 10kΩ', role: 'Décharge la Grille pour garantir la coupure.' },
      { name: 'Charge (Bandeau LED ou moteur) + 1N4007', role: 'Charge commandée et diode de roue libre.' },
    ],
    partsEn: [
      { name: 'N-Channel MOSFET (IRFZ44N)', role: 'Voltage-controlled high-current power switch.' },
      { name: '10kΩ Potentiometer', role: 'Adjusts Gate control voltage smoothly.' },
      { name: '10kΩ Pull-Down Resistor', role: 'Ensures Gate discharges cleanly to turn off.' },
      { name: 'Load (LED strip / Motor) + 1N4007', role: 'Output load with inductive flyback protection.' },
    ],
    stepsFr: [
      'Montez l’IRFZ44N (1: Gate, 2: Drain, 3: Source) et reliez Source au (-).',
      'Branchez le curseur central du potentiomètre sur Gate et ajoutez la 10kΩ entre Gate et GND.',
      'Reliez le (+) de la charge au +12V et son (-) au Drain du MOSFET.',
      'Tournez le bouton pour faire varier la luminosité ou la vitesse.',
    ],
    stepsEn: [
      'Insert IRFZ44N (1: Gate, 2: Drain, 3: Source) and tie Source to (-).',
      'Connect the potentiometer center wiper to Gate and add the 10kΩ pull-down to GND.',
      'Wire load (+) to +12V and load (-) to the MOSFET Drain.',
      'Turn the knob smoothly to vary brightness or motor speed.',
    ],
    tipFr: 'Ajoutez un condensateur de 100µF près du moteur si vous utilisez un moteur DC pour supprimer les parasites.',
    tipEn: 'Add a 100µF decoupling capacitor across the supply rails when driving inductive DC motors.',
  } as ProjectTranslation,
};

export function getLocalizedProject(project: ElectronicProject, lang: AppLanguage) {
  if (lang === 'ar') {
    return {
      title: project.titleAr,
      secondaryTitle: project.titleEn,
      level: project.levelAr,
      summary: project.summaryAr,
      howCircuitWorks: project.howCircuitWorksAr,
      parts: project.parts.map((p) => ({
        ...p,
        name: p.nameAr,
        role: p.roleInProjectAr,
      })),
      assemblySteps: project.assemblyStepsAr,
      troubleshootingTip: project.troubleshootingTipAr,
    };
  }
  const tr = PROJECT_TRANSLATIONS[project.id];
  const isFr = lang === 'fr';
  return {
    title: tr ? (isFr ? tr.titleFr : tr.titleEn) : project.titleEn,
    secondaryTitle: project.titleEn,
    level: tr ? (isFr ? tr.levelFr : tr.levelEn) : project.levelAr,
    summary: tr ? (isFr ? tr.summaryFr : tr.summaryEn) : project.summaryAr,
    howCircuitWorks: tr ? (isFr ? tr.howCircuitWorksFr : tr.howCircuitWorksEn) : project.howCircuitWorksAr,
    parts: project.parts.map((p, idx) => {
      const pTr = tr ? (isFr ? tr.partsFr[idx] : tr.partsEn[idx]) : undefined;
      return {
        ...p,
        name: pTr ? pTr.name : p.nameAr,
        role: pTr ? pTr.role : p.roleInProjectAr,
      };
    }),
    assemblySteps: tr ? (isFr ? tr.stepsFr : tr.stepsEn) : project.assemblyStepsAr,
    troubleshootingTip: tr ? (isFr ? tr.tipFr : tr.tipEn) : project.troubleshootingTipAr,
  };
}

// =======================================
// QUIZ TRANSLATIONS
// =======================================
const LEVEL_TRANSLATIONS: Record<QuizLevel, { labelFr: string; labelEn: string; descFr: string; descEn: string }> = {
  beginner: {
    labelFr: 'Débutant',
    labelEn: 'Beginner',
    descFr: 'Reconnaissance des composants, polarité et code des couleurs.',
    descEn: 'Component identification, polarity rules, and color codes.',
  },
  intermediate: {
    labelFr: 'Intermédiaire',
    labelEn: 'Intermediate',
    descFr: 'Mesures pratiques au multimètre, brochage et diagnostic de pannes.',
    descEn: 'Practical multimeter measurements, pinouts, and common fault detection.',
  },
  expert: {
    labelFr: 'Expert',
    labelEn: 'Expert',
    descFr: 'Analyse avancée de circuits, calculs de puissance et pannes complexes.',
    descEn: 'Advanced circuit analysis, power calculations, and complex diagnostics.',
  },
};

const RANK_TRANSLATIONS: Record<string, { titleFr: string; titleEn: string; descFr: string; descEn: string }> = {
  hobbyist: {
    titleFr: 'Amateur en électronique',
    titleEn: 'Electronics Hobbyist',
    descFr: 'Début du parcours sur les bases des composants.',
    descEn: 'Starting out on core electronic components.',
  },
  technician: {
    titleFr: 'Technicien de mesure',
    titleEn: 'Measurement Technician',
    descFr: 'Maîtrise du multimètre et des pannes classiques.',
    descEn: 'Proficient in multimeter testing and standard faults.',
  },
  engineer: {
    titleFr: 'Ingénieur circuits avancé',
    titleEn: 'Circuit Engineer',
    descFr: 'Analyse solide des semi-conducteurs et schémas.',
    descEn: 'Strong grasp of semiconductors and circuit analysis.',
  },
  expert_master: {
    titleFr: 'Expert diagnostic & conception',
    titleEn: 'Master Diagnostics Expert',
    descFr: 'Maîtrise complète des calculs et du dépannage précis.',
    descEn: 'Full mastery of circuit math and precision fault diagnosis.',
  },
};

interface QuizQTranslation {
  topicFr: string;
  topicEn: string;
  qFr: string;
  qEn: string;
  optsFr: [string, string, string, string];
  optsEn: [string, string, string, string];
  expFr: string;
  expEn: string;
}

const QUIZ_Q_TRANSLATIONS: Record<string, QuizQTranslation> = {
  b1: {
    topicFr: 'Polarité',
    topicEn: 'Polarity',
    qFr: 'Comment identifier la borne négative (Cathode) d’une LED 5mm standard sans multimètre ?',
    qEn: 'How can you identify the negative terminal (Cathode) of a standard 5mm LED without a meter?',
    optsFr: ['Patte la plus longue et bord arrondi', 'Patte la plus courte et méplat sur le bord du boîtier', 'Patte centrale', 'Une LED n’est pas polarisée'],
    optsEn: ['Longer lead and smooth round rim', 'Shorter lead and flat rim edge on the lens', 'Center lead', 'LEDs are non-polarized'],
    expFr: 'La Cathode (-) a la patte la plus courte et un bord plat sur le plastique de la LED.',
    expEn: 'The Cathode (-) has the shorter leg and a flat edge on the plastic rim.',
  },
  b2: {
    topicFr: 'Code couleurs',
    topicEn: 'Color Codes',
    qFr: 'Quelle est la valeur d’une résistance aux anneaux : (Marron - Noir - Rouge - Or) ?',
    qEn: 'What is the value of a resistor with color bands: (Brown - Black - Red - Gold)?',
    optsFr: ['100 Ω ±5%', '10 kΩ ±5%', '1 kΩ (1000 Ω) ±5%', '470 Ω ±1%'],
    optsEn: ['100 Ω ±5%', '10 kΩ ±5%', '1 kΩ (1000 Ω) ±5%', '470 Ω ±1%'],
    expFr: 'Marron (1) + Noir (0) = 10, multiplié par Rouge (×100) = 1000 Ω = 1kΩ ±5%.',
    expEn: 'Brown (1) + Black (0) = 10, multiplied by Red (×100) = 1000 Ω = 1kΩ ±5%.',
  },
  b3: {
    topicFr: 'Capteurs de lumière',
    topicEn: 'Light Sensors',
    qFr: 'Que devient la résistance d’une LDR (photorésistance) lorsqu’on la couvre complètement dans le noir ?',
    qEn: 'What happens to an LDR’s resistance when completely covered in darkness?',
    optsFr: ['Chute près de 0 Ω', 'Augmente fortement (centaines de kΩ ou MΩ)', 'Reste figée à 100 Ω', 'Émet un son'],
    optsEn: ['Drops close to 0 Ω', 'Rises sharply to hundreds of kΩ or MΩ', 'Stays fixed at 100 Ω', 'Emits a sound'],
    expFr: 'La LDR a une relation inverse avec la lumière : moins il y a de lumière, plus sa résistance augmente.',
    expEn: 'LDR resistance rises dramatically as ambient light decreases.',
  },
  b4: {
    topicFr: 'Régulateurs',
    topicEn: 'Voltage Regulators',
    qFr: 'Quel est le rôle principal du régulateur LM7805 dans un circuit électronique ?',
    qEn: 'What is the primary role of an LM7805 voltage regulator?',
    optsFr: ['Élever 5V vers 220V AC', 'Mesurer le courant', 'Fournir une tension continue fixe et stable de +5V', 'Stocker l’énergie sans pile'],
    optsEn: ['Boost 5V to 220V AC', 'Measure current', 'Output a steady, regulated +5V DC rail', 'Store energy permanently'],
    expFr: 'La série 78xx régule la tension d’entrée à une sortie fixe indiquée par les deux derniers chiffres (+5V pour 7805).',
    expEn: 'The 7805 regulates higher DC input down to a rock-steady +5V output.',
  },
  b5: {
    topicFr: 'Condensateurs',
    topicEn: 'Capacitors',
    qFr: 'Que représente la bande grise/blanche imprimée sur le côté d’un condensateur électrolytique ?',
    qEn: 'What does the grey/white vertical stripe printed on an electrolytic capacitor indicate?',
    optsFr: ['La borne positive (+)', 'La borne négative (-)', 'La tolérance 10%', 'Que le composant est non polarisé'],
    optsEn: ['The positive (+) terminal', 'The negative (-) terminal', '10% tolerance', 'Non-polarized orientation'],
    expFr: 'La bande verticale avec signes (-) indique toujours la patte négative du condensateur électrolytique.',
    expEn: 'The stripe always identifies the negative (-) lead of an electrolytic capacitor.',
  },
  b6: {
    topicFr: 'Sécurité de mesure',
    topicEn: 'Meter Safety',
    qFr: 'Quelle erreur dangereuse faut-il absolument éviter en mesurant une batterie au multimètre ?',
    qEn: 'What dangerous mistake must you avoid when checking a battery with a multimeter?',
    optsFr: ['Utiliser le mode V DC', 'Mettre la sonde noire sur COM', 'Tester directement en mode Ohmmètre (Ω) ou Ampèremètre (A)', 'Choisir la gamme 20V'],
    optsEn: ['Using V DC mode', 'Plugging black probe into COM', 'Connecting directly on Ohm (Ω) or Current (A) mode', 'Selecting the 20V range'],
    expFr: 'Les modes Ω et A sur une batterie peuvent faire sauter le fusible du multimètre ou l’endommager.',
    expEn: 'Probing a live voltage source on Ohm or Current mode can blow the meter fuse or damage it.',
  },
  b7: {
    topicFr: 'Protection',
    topicEn: 'Protection',
    qFr: 'Quel résultat attendez-vous en testant un fusible sain en mode Continuité (Bip) ?',
    qEn: 'What do you expect when testing a healthy glass fuse on Continuity mode?',
    optsFr: ['OL sans aucun son', 'Un bip continu et une résistance proche de 0.1 Ω', 'Une lecture de +5V', 'Un échauffement du fusible'],
    optsEn: ['OL with no beep', 'Continuous beep and ~0.1 Ω reading', '+5V reading', 'Fuse heats up'],
    expFr: 'Un fusible intact est un fil continu à résistance quasi nulle qui bippe franchement.',
    expEn: 'A good fuse is a continuous metal link that beeps near 0.1 Ω.',
  },
  m1: {
    topicFr: 'Diagnostic Diodes',
    topicEn: 'Diode Faults',
    qFr: 'En mode Diode sur une 1N4007, vous obtenez 0.000V et un bip dans les deux sens. Quel est le diagnostic ?',
    qEn: 'Testing a 1N4007 in Diode mode gives 0.000V and a continuous beep in both directions. What is its condition?',
    optsFr: ['Parfait état', 'Court-circuit interne (Short) — à remplacer', 'Circuit ouvert', 'Résistance variable'],
    optsEn: ['Healthy diode', 'Short-circuited (dead short) — must be replaced', 'Open fault', 'Variable resistor'],
    expFr: 'Une diode saine lit ~0.6V dans un sens et OL dans l’autre. 0.000V des deux côtés = court-circuit.',
    expEn: 'A good diode reads ~0.6V one way and OL the other; 0.000V both ways indicates a short.',
  },
  m2: {
    topicFr: 'Condensateurs HV',
    topicEn: 'HV Capacitors',
    qFr: 'Quelle action est obligatoire avant de mesurer un gros condensateur 470µF 400V ?',
    qEn: 'What mandatory step must be taken before testing a large 470µF 400V capacitor?',
    optsFr: ['Chauffer au sèche-cheveux', 'Régler le multimètre sur 20A', 'Le décharger en sécurité via une résistance', 'Inverser les sondes'],
    optsEn: ['Warm it up', 'Switch meter to 20A', 'Safely discharge it through a resistor', 'Swap probes'],
    expFr: 'Un condensateur haute tension chargé conserve plus de 300V dangereux et peut détruire le multimètre.',
    expEn: 'Charged high-voltage capacitors hold lethal voltage and can destroy a multimeter.',
  },
  m3: {
    topicFr: 'Inductances',
    topicEn: 'Inductors',
    qFr: 'En testant une bobine de cuivre saine en mode Continuité, que se passe-t-il et pourquoi ?',
    qEn: 'When probing a healthy copper inductor on Continuity mode, what happens and why?',
    optsFr: ['Il bippe (<5Ω) car la bobine est un fil de cuivre continu', 'Affiche toujours OL', 'Lit 0.7V', 'Change selon la lumière'],
    optsEn: ['It beeps (<5Ω) because it is a continuous copper winding', 'Always reads OL', 'Reads 0.7V', 'Varies with light'],
    expFr: 'En courant continu, une inductance n’est qu’un fil de cuivre continu à très faible résistance.',
    expEn: 'At DC, an inductor is simply a continuous copper wire with very low resistance.',
  },
  m4: {
    topicFr: 'Relais',
    topicEn: 'Relays',
    qFr: 'Sur un relais à 5 broches au repos (bobine non alimentée), quelles bornes sont reliées ?',
    qEn: 'On a 5-pin relay at rest (coil unpowered), which two contact pins are connected?',
    optsFr: ['COM et NO', 'COM et NC (Normalement Fermé)', 'Bobine 1 et COM', 'NO et NC'],
    optsEn: ['COM and NO', 'COM and NC (Normally Closed)', 'Coil and COM', 'NO and NC'],
    expFr: 'Au repos, COM touche NC (Normally Closed) et bascule vers NO lorsque la bobine est alimentée.',
    expEn: 'At rest, COM rests against NC (Normally Closed) and switches to NO when energized.',
  },
  m5: {
    topicFr: 'Potentiomètres',
    topicEn: 'Potentiometers',
    qFr: 'En mesurant entre les deux pattes extérieures (1 et 3) d’un potentiomètre 10kΩ tout en tournant l’axe, qu’observez-vous ?',
    qEn: 'Measuring across the two outer pins (1 & 3) of a healthy 10kΩ pot while turning the shaft shows:',
    optsFr: ['Varie de 0 à 10kΩ', 'Reste fixe près de 10kΩ (piste totale)', 'Bascule vers OL', 'Change avec la température'],
    optsEn: ['Sweeps from 0 to 10kΩ', 'Stays constant near 10kΩ (full track)', 'Switches to OL', 'Changes with heat'],
    expFr: 'La résistance entre les bornes extérieures 1 et 3 reste fixe ; seule la borne centrale 2 varie.',
    expEn: 'Outer pins 1 & 3 measure the fixed track; only center pin 2 (wiper) varies.',
  },
  m6: {
    topicFr: 'Afficheurs 7-Seg',
    topicEn: '7-Segment',
    qFr: 'En mode Diode : sonde rouge sur COM et noire sur les segments, les barres s’allument. Quel type d’afficheur est-ce ?',
    qEn: 'On Diode mode: red probe on COM and black on segment pins lights them up. Which type is it?',
    optsFr: ['Cathode commune', 'Anode commune (+)', 'Écran LCD I2C', 'Afficheur AC'],
    optsEn: ['Common Cathode', 'Common Anode (+)', 'I2C LCD', 'AC Display'],
    expFr: 'La sonde rouge (+) étant sur le commun pour allumer les LED, c’est une Anode Commune.',
    expEn: 'Because the positive red probe sits on COM to forward-bias the segments, it is Common Anode.',
  },
  m7: {
    topicFr: 'Quartz oscillateur',
    topicEn: 'Crystals',
    qFr: 'Quelle est la lecture correcte à l’ohmmètre (Ω) d’un quartz 16MHz sain hors carte ?',
    qEn: 'What is the proper Ohm (Ω) reading across a healthy 16MHz crystal out of circuit?',
    optsFr: ['Bip ~0.2Ω', '16 Ω exact', 'OL (circuit ouvert en continu)', '100 Ω'],
    optsEn: ['Beeps at ~0.2Ω', '16 Ω exact', 'OL (DC open circuit)', '100 Ω'],
    expFr: 'Le cristal est isolant en courant continu et doit afficher OL ; s’il bippe, il est en court-circuit.',
    expEn: 'A crystal acts as a DC insulator and must read OL; a low-ohm beep means it is shorted.',
  },
  e1: {
    topicFr: 'Redressement & Lissage',
    topicEn: 'Rectifier Math',
    qFr: 'Un transformateur 12V AC alimente un pont de diodes et un gros condensateur de filtrage. Quelle tension DC approximative obtient-on à vide ?',
    qEn: 'A 12V AC transformer feeds a bridge rectifier and large filter capacitor. What is the approximate no-load DC voltage?',
    optsFr: ['10.5V DC', '~15.5V DC (12 × √2 − 1.4V de diodes)', '24V DC', '6V DC'],
    optsEn: ['10.5V DC', '~15.5V DC (12 × √2 − 1.4V diode drops)', '24V DC', '6V DC'],
    expFr: 'Le condensateur se charge à la tension crête Vpeak = 12 × 1.414 ≈ 17V moins ~1.4V pour deux diodes ≈ 15.5V DC.',
    expEn: 'The capacitor charges to peak voltage (12 × 1.414 ≈ 17V) minus two diode drops (~1.4V) ≈ 15.5V DC.',
  },
  e2: {
    topicFr: 'Optocoupleurs',
    topicEn: 'Optocouplers',
    qFr: 'En alimentant l’entrée (1-2) d’un PC817 sous 5V via une résistance, que doit faire la sortie (3-4) ?',
    qEn: 'When powering pins 1-2 of a PC817 optocoupler with 5V via a resistor, what should happen across pins 3-4?',
    optsFr: ['Rester toujours à OL', 'Sa résistance chute brutalement de OL à quelques centaines d’ohms', 'Produire 220V', 'Déclencher un bip sur 1-2'],
    optsEn: ['Stay OL permanently', 'Resistance drops sharply from OL to a few hundred Ohms', 'Output 220V', 'Beep across 1-2'],
    expFr: 'La LED interne éclaire le phototransistor (3-4), rendant la sortie conductrice sans contact électrique.',
    expEn: 'The internal IR LED illuminates the phototransistor (3-4), dropping its resistance sharply.',
  },
  e3: {
    topicFr: 'Régulation Zener',
    topicEn: 'Zener Regulation',
    qFr: 'Pour stabiliser à 5.1V depuis 12V avec une Zener 5.1V, où relie-t-on sa Cathode (anneau noir) et à quoi sert la résistance série ?',
    qEn: 'In a 5.1V Zener regulator from 12V, where does the black-striped Cathode connect and why use a series resistor?',
    optsFr: ['Cathode au (-) sans résistance', 'Cathode vers le (+) après la résistance qui absorbe l’excédent (6.9V) et limite le courant', 'En parallèle sur la pile sans résistance', 'Sur la sortie AC'],
    optsEn: ['Cathode to (-) without resistor', 'Cathode toward (+) after the resistor, which drops excess 6.9V and limits current', 'Across battery with no resistor', 'On AC lines only'],
    expFr: 'La Zener régule en polarisation inverse (Cathode vers +) et la résistance série empêche sa destruction.',
    expEn: 'A Zener regulates in reverse bias (Cathode toward +) while the series resistor limits current and drops excess voltage.',
  },
  e4: {
    topicFr: 'Test MOSFET',
    topicEn: 'MOSFET Diagnostics',
    qFr: 'Un MOSFET IRFZ44N conduit soudainement entre Drain et Source hors circuit bien que la Grille soit débranchée. Cause la plus fréquente ?',
    qEn: 'An IRFZ44N MOSFET reads shorted Drain-to-Source out of circuit even with Gate disconnected. Most likely reason before declaring it dead?',
    optsFr: ['La Grille (Gate) a gardé une charge statique ; déchargez G avec S avant de retester', 'Le multimètre est à l’envers', 'Manque de lumière', 'Capacité interne trop basse'],
    optsEn: ['Gate still holds capacitive static charge; short G to S and retest', 'Probes upside down', 'Needs light exposure', 'Low capacitance'],
    expFr: 'La Grille d’un MOSFET se comporte comme un petit condensateur et reste verrouillée passante tant qu’on ne relie pas G à S.',
    expEn: 'A MOSFET Gate acts like a tiny capacitor and stays latched ON until you short Gate to Source.',
  },
  e5: {
    topicFr: 'Minuterie NE555',
    topicEn: '555 Thresholds',
    qFr: 'En mode Astable sur 9V, entre quelles deux tensions oscille le condensateur d’un NE555 ?',
    qEn: 'Running a NE555 in Astable mode at 9V, between what two voltages does the timing capacitor cycle?',
    optsFr: ['0V et 9V', '3V (1/3 Vcc) et 6V (2/3 Vcc)', '1V et 2V', '4.5V et 9V'],
    optsEn: ['0V and 9V', '3V (1/3 Vcc) and 6V (2/3 Vcc)', '1V and 2V', '4.5V and 9V'],
    expFr: 'Le NE555 déclenche toujours à 1/3 Vcc (3V) et réinitialise à 2/3 Vcc (6V).',
    expEn: 'The NE555 internal divider trips between 1/3 Vcc (3V) and 2/3 Vcc (6V).',
  },
  e6: {
    topicFr: 'Calcul puissance',
    topicEn: 'Power Calculation',
    qFr: 'Alimenter un module LED 3V / 100mA depuis 12V via une résistance unique : quelle valeur et puissance minimale ?',
    qEn: 'Powering a 3V / 100mA LED array from 12V via one series resistor: what resistance and safe wattage rating?',
    optsFr: ['90 Ω / 0.25W', '90 Ω / ≥2W (car P = 9V × 0.1A = 0.9W)', '120 Ω / 0.1W', '330 Ω / 0.25W'],
    optsEn: ['90 Ω / 0.25W', '90 Ω / ≥2W (since P = 9V × 0.1A = 0.9W)', '120 Ω / 0.1W', '330 Ω / 0.25W'],
    expFr: 'R = (12 − 3) / 0.1 = 90 Ω, puissance P = 9V × 0.1A = 0.9W ; une 0.25W brûlerait immédiatement, il faut ≥2W.',
    expEn: 'R = (12 − 3) / 0.1 = 90 Ω and P = 9V × 0.1A = 0.9W; a 0.25W resistor would burn, so choose ≥2W.',
  },
  e7: {
    topicFr: 'Analyse de panne',
    topicEn: 'PSU Failure Analysis',
    qFr: 'Le fusible d’un bloc secteur a grillé et la varistance (MOV) en parallèle derrière lui bippe à 0.01Ω. Diagnostic exact ?',
    qEn: 'A power supply input fuse blew and the parallel MOV behind it beeps at 0.01Ω. Exact diagnosis?',
    optsFr: ['C’est normal pour une MOV', 'Une forte surtension a fait court-circuiter la MOV exprès pour faire sauter le fusible ; il faut changer les deux', 'Changer juste le fusible suffit', 'Le condensateur principal est sec'],
    optsEn: ['Normal MOV behavior', 'A surge shorted the sacrificial MOV to trip the fuse; replace both MOV and fuse', 'Just swap the fuse', 'Dried filter cap'],
    expFr: 'Une varistance saine affiche OL. Si elle est à 0.01Ω, elle a sacrifié sa jonction face à une surtension et doit être remplacée avec le fusible.',
    expEn: 'A healthy MOV reads OL. A 0.01Ω short means it sacrificed itself during a surge and must be replaced with the fuse.',
  },
};

export function getLocalizedQuizLevelMeta(
  level: QuizLevel,
  meta: { labelAr: string; pointsPerQ: number; unlockPoints: number; descriptionAr: string },
  lang: AppLanguage
) {
  if (lang === 'ar') return { label: meta.labelAr, description: meta.descriptionAr };
  const tr = LEVEL_TRANSLATIONS[level];
  return {
    label: lang === 'fr' ? tr.labelFr : tr.labelEn,
    description: lang === 'fr' ? tr.descFr : tr.descEn,
  };
}

export function getLocalizedRank(rank: QuizRank, lang: AppLanguage) {
  if (lang === 'ar') return { title: rank.titleAr, description: rank.descriptionAr };
  const tr = RANK_TRANSLATIONS[rank.id];
  if (!tr) return { title: rank.titleAr, description: rank.descriptionAr };
  return {
    title: lang === 'fr' ? tr.titleFr : tr.titleEn,
    description: lang === 'fr' ? tr.descFr : tr.descEn,
  };
}

export function getLocalizedQuizQuestion(q: QuizQuestion, lang: AppLanguage) {
  if (lang === 'ar') {
    return {
      topic: q.topicAr,
      question: q.questionAr,
      options: q.options,
      explanation: q.explanationAr,
    };
  }
  const tr = QUIZ_Q_TRANSLATIONS[q.id];
  if (!tr) {
    return {
      topic: q.topicAr,
      question: q.questionAr,
      options: q.options,
      explanation: q.explanationAr,
    };
  }
  const isFr = lang === 'fr';
  return {
    topic: isFr ? tr.topicFr : tr.topicEn,
    question: isFr ? tr.qFr : tr.qEn,
    options: isFr ? tr.optsFr : tr.optsEn,
    explanation: isFr ? tr.expFr : tr.expEn,
  };
}
