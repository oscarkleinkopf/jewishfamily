/**
 * sampleData.js
 * Base de datos de Brajot (bendiciones) precargadas y datos iniciales (semilla) para la app Dor L'Dor.
 */

export const BRAJOT_DATABASE = [
  {
    id: 'birkat-habanim-niños',
    title: 'Birkat HaBanim (Para los Hijos - Hombres)',
    hebrew: 'יְשִׂימְךָ אֱלֹהִים כְּאֶפְרַיִם וְכִמְנַשֶּׁה.',
    transliteration: 'Yisimjá Elohim ke-Efráyim veji-Menashé.',
    translation: 'Que Dios te haga como a Efraín y como a Manasés.',
    category: 'Vida Familiar',
    description: 'Tradicional bendición que los padres recitan a sus hijos varones los viernes por la noche (antes de la cena de Shabat) y en eventos importantes como su Brit Milá o Bar Mitzvá.'
  },
  {
    id: 'birkat-habanim-niñas',
    title: 'Birkat HaBanim (Para las Hijas - Mujeres)',
    hebrew: 'יְשִׂימֵךְ אֱלֹהִים כְּשָׂרָה רִבְקָה רָחֵל וְלֵאָה.',
    transliteration: 'Yisimej Elohim ke-Sará, Rivká, Rajél ve-Leá.',
    translation: 'Que Dios te haga como a Sara, Rebeca, Rajel y Leá.',
    category: 'Vida Familiar',
    description: 'Tradicional bendición que los padres recitan a sus hijas mujeres los viernes por la noche (antes de la cena de Shabat) y en eventos importantes como su Simjat Bat o Bat Mitzvá.'
  },
  {
    id: 'birkat-cohanim',
    title: 'Birkat Cohanim (Bendición Sacerdotal)',
    hebrew: 'יְבָרֶכְךָ יְהוָה וְיִשְׁמְרֶךָ. יָאֵר יְהוָה פָּנָיו אֵלֶיךָ וִיחֻנֶּךָ. יִשָּׂא יְהוָה פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם.',
    transliteration: 'Yevarejejá Adonai ve-yishmeréja. Yaér Adonai panáv eléja viyjunéja. Yisá Adonai panáv eléja veyásem lejá shalóm.',
    translation: 'Que el Eterno te bendiga y te guarde. Que el Eterno haga resplandecer Su rostro sobre ti y te agracie. Que el Eterno eleve Su rostro hacia ti y te conceda la paz.',
    category: 'Vida Familiar',
    description: 'La bendición más antigua de la Torá. Se recita a los niños, novios bajo la Jupá y en momentos de transición y regocijo espiritual.'
  },
  {
    id: 'shehecheyanu',
    title: 'Brajá Shehejeianu (Agradecimiento por Nuevos Momentos)',
    hebrew: 'בָּרוּךְ אַתָּה יְהוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, שֶׁהֶחֱיָנוּ וְקִיְּמָנוּ וְהִגִּיעָנוּ לַזְּמַן הַזֶּה.',
    transliteration: 'Barúj Atá Adonai, Elohéinu Mélej HaOlám, shejejiánu vekiyamánu vejigiánu lazmán hazé.',
    translation: 'Bendito eres Tú, Eterno Dios nuestro, Rey del Universo, que nos ha mantenido con vida, nos ha sostenido y nos ha permitido llegar a este momento único.',
    category: 'Vida Familiar',
    description: 'Bendición de agradecimiento recitada al experimentar algo nuevo o después de mucho tiempo. Ideal para nacimientos, inauguraciones de hogares, bodas, Bar/Bat Mitzvás y festividades.'
  },
  {
    id: 'birkat-habayit',
    title: 'Birkat HaBayit (Bendición del Hogar)',
    hebrew: 'בְּזֶה הַשַּׁעַר לֹא יָבוֹא צַעַר. בְּזֹאת הַדִּירָה לֹא תָבוֹא צָרָה. בְּזֹאת הַדֶּלֶת לֹא תָבוֹא בֶּהָלָה. בְּזֹאת הַמַּחְלָקָה לֹא תָבוֹא מַחְלֹקֶת. בְּזֶה הַמָּקוֹם תְּהִי בְרָכָה וְשָׁלוֹם.',
    transliteration: 'Bezé hasha\'ar lo yavó tza\'ar. Bezót hadirá lo tavó tzará. Bezót hadélet lo tavó behalá. Bezót hamajlaká lo tavó majlóket. Bezé hamakóm tejí verajá veshalóm.',
    translation: 'Que por esta puerta no entre la tristeza. Que en esta morada no haya angustias. Que tras esta puerta no haya sobresaltos. Que en este espacio no haya disputas. Que en este lugar haya bendición y paz.',
    category: 'Shabat y Festividades',
    description: 'Bendición tradicional que se coloca en el hogar para atraer armonía, paz, salud y sustento espiritual para toda la familia.'
  },
  {
    id: 'tefilat-haderej',
    title: 'Tefilat HaDerej (Plegaria del Viajero)',
    hebrew: 'יְהִי רָצוֹן מִלְּפָנֶיךָ יְהוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ שֶׁתּוֹלִיכֵנוּ לְשָׁלוֹם וְתַצְעִידֵנוּ לְשָׁלוֹם... וְתַצִּילֵנוּ מִכַּף כָּל אוֹיֵב וְאוֹרֵב בַּדֶּרֶךְ...',
    transliteration: 'Yehí ratzón milefanéja Adonai Elohéinu ve-Elohéi avotéinu she-tolijénu leshalóm ve-tatz\'idénu leshalóm... ve-tatzilénu mikáf kol oyév ve-orév badérej...',
    translation: 'Sea Tu voluntad, Eterno Dios nuestro y de nuestros antepasados, guiarnos en paz, dirigir nuestros pasos en paz... y librarnos de las manos de cualquier enemigo o acechanza en el camino...',
    category: 'Diario',
    description: 'Plegaria recitada al iniciar un viaje largo, para pedir protección y un regreso a salvo con la familia.'
  },
  {
    id: 'hamotzi-lejem',
    title: 'Brajá Hamotzí (Bendición del Pan)',
    hebrew: 'בָּרוּךְ אַתָּה יְהוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, הַמּוֹצִיא לֶחֶם מִן הָאָרֶץ.',
    transliteration: 'Barúj Atá Adonai, Elohéinu Mélej HaOlám, jamotzí léjem min jaáretz.',
    translation: 'Bendito eres Tú, Eterno Dios nuestro, Rey del Universo, que extrae el pan de la tierra.',
    category: 'Comida',
    description: 'La bendición que se recita sobre el pan o las Jalot tradicionales los viernes por la noche en Shabat y los días de festividades antes de la cena familiar.'
  },
  {
    id: 'baruj-shepetarani',
    title: 'Bendición del Padre en Bar Mitzvá (Baruj Sheptarani)',
    hebrew: 'בָּרוּךְ שֶׁפְּטָרַנִי מֵעָנְשִׁוֹ שֶׁל זֶה.',
    transliteration: 'Barúj she-petaráni me-onshó shel ze.',
    translation: 'Bendito es Aquel que me ha liberado de la responsabilidad legal de este niño.',
    category: 'Vida Familiar',
    description: 'Bendición pronunciada tradicionalmente por el padre del niño el día de su Bar Mitzvá cuando lee la Torá por primera vez, marcando la transición del joven hacia la madurez espiritual y su propia responsabilidad por sus mitzvot.'
  }
];

export const INITIAL_MEMBERS = [
  {
    id: 'member-abraham',
    name: 'Abraham Levy',
    hebrewName: 'Avraham ben Itzjak',
    relationship: 'Abuelo',
    birthDate: '1945-05-14',
    hebrewBirthDate: '2 de Sivan, 5705',
    imageUrl: 'https://images.unsplash.com/photo-1472417583565-62e7bded8390?w=150&h=150&fit=crop'
  },
  {
    id: 'member-sara',
    name: 'Sara Levy',
    hebrewName: 'Sara bat Moshe',
    relationship: 'Abuela',
    birthDate: '1948-09-22',
    hebrewBirthDate: '18 de Elul, 5708',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop'
  },
  {
    id: 'member-moises',
    name: 'Moisés Levy',
    hebrewName: 'Moshe ben Avraham',
    relationship: 'Padre',
    birthDate: '1975-03-12',
    hebrewBirthDate: '29 de Adar, 5735',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
  },
  {
    id: 'member-rajel',
    name: 'Rajel Levy',
    hebrewName: 'Rajel bat Yaakov',
    relationship: 'Madre',
    birthDate: '1978-08-05',
    hebrewBirthDate: '2 de Av, 5738',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop'
  },
  {
    id: 'member-david',
    name: 'David Levy',
    hebrewName: 'David ben Moshe',
    relationship: 'Hijo',
    birthDate: '2013-06-18',
    hebrewBirthDate: '10 de Tamuz, 5773',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop'
  },
  {
    id: 'member-miriam',
    name: 'Miriam Levy',
    hebrewName: 'Miriam bat Moshe',
    relationship: 'Hija',
    birthDate: '2016-11-20',
    hebrewBirthDate: '19 de Jeshvan, 5777',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  }
];

export const INITIAL_EVENTS = [
  {
    id: 'event-wedding',
    title: 'Jupá de Moisés y Rajel',
    description: 'La bendecida unión de Moisés y Rajel bajo la Jupá en la Sinagoga de la Comunidad. Estuvieron rodeados de toda la familia en una noche mágica y llena de bendiciones. Bailamos los bailes tradicionales y rompimos la copa recordando la reconstrucción de Jerusalén.',
    category: 'Jupá / Boda',
    date: '2008-06-15',
    hebrewDate: '12 de Sivan, 5768',
    location: 'Sinagoga Central de la Comunidad, Buenos Aires',
    taggedMembers: ['member-moises', 'member-rajel', 'member-abraham', 'member-sara'],
    linkedBlessings: ['shehecheyanu', 'birkat-cohanim'],
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=500&fit=crop',
    media: []
  },
  {
    id: 'event-david-birth',
    title: 'Nacimiento y Brit Milá de David',
    description: 'El nacimiento de nuestro primer hijo, David, y su posterior pacto de Brit Milá en el octavo día. Su abuelo Abraham fue el Sandak, cargando con orgullo a su nieto que continuará nuestra cadena generacional.',
    category: 'Brit Milá / Simjat Bat',
    date: '2013-06-26',
    hebrewDate: '18 de Tamuz, 5773',
    location: 'Salón Comunitario Beth El',
    taggedMembers: ['member-david', 'member-moises', 'member-rajel', 'member-abraham'],
    linkedBlessings: ['birkat-habanim-niños', 'shehecheyanu'],
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=500&fit=crop',
    media: []
  },
  {
    id: 'event-miriam-birth',
    title: 'Nacimiento y Simjat Bat de Miriam',
    description: 'Llegó al mundo nuestra hermosa Miriam. Celebramos su Simjat Bat en Shabat, donde fue nombrada formalmente frente a la congregación familiar. Su nombre honra a la hermana de Moisés y a la alegría del agua en el desierto.',
    category: 'Brit Milá / Simjat Bat',
    date: '2016-12-03',
    hebrewDate: '3 de Kislev, 5777',
    location: 'Sinagoga Comunidad Bet El',
    taggedMembers: ['member-miriam', 'member-moises', 'member-rajel', 'member-sara'],
    linkedBlessings: ['birkat-habanim-niñas', 'shehecheyanu'],
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=500&fit=crop',
    media: []
  },
  {
    id: 'event-david-bar-mitzvah',
    title: 'Bar Mitzvá de David en el Muro Occidental',
    description: 'David subió a la Torá por primera vez, leyendo con perfecta entonación su Parashá en el Muro de los Lamentos (Kotel) en Jerusalén. Un viaje familiar inolvidable donde David asumió el yugo de los preceptos ante toda la congregación de generaciones pasadas.',
    category: 'Bar / Bat Mitzvá',
    date: '2026-06-18', // Fecha ficticia cercana al tiempo del modelo
    hebrewDate: '3 de Tamuz, 5786',
    location: 'Muro Occidental (Kotel), Jerusalén',
    taggedMembers: ['member-david', 'member-moises', 'member-rajel', 'member-abraham', 'member-sara'],
    linkedBlessings: ['baruj-shepetarani', 'birkat-cohanim'],
    imageUrl: 'https://images.unsplash.com/photo-1609137144813-2be42571fa4f?w=800&h=500&fit=crop',
    media: []
  },
  {
    id: 'event-shabat-cooking',
    title: 'Preparación Comunitaria de Jalá',
    description: 'Rajel y Miriam participaron en el "Mega Jalá Bake" de la comunidad, donde cientos de mujeres se reunieron para amasar y recitar la bendición especial de separar la Jalá. Trajimos a casa panes trenzados deliciosos para nuestro Shabat familiar.',
    category: 'Actividad Comunitaria',
    date: '2026-04-10',
    hebrewDate: '23 de Nisan, 5786',
    location: 'Gimnasio del Centro Comunitario',
    taggedMembers: ['member-rajel', 'member-miriam'],
    linkedBlessings: ['hamotzi-lejem'],
    imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=500&fit=crop',
    media: []
  }
];
