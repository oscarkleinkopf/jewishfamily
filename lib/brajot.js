/**
 * lib/brajot.js
 * Catálogo de brajot y utilidades de filtrado/copia (sin DOM).
 */
(function (global) {
  const kernel = global.DorLdorKernel || {};

  kernel.BRAJOT_DATABASE = [
    {
      id: 'birkat-habanim-niños',
      title: 'Birkat HaBanim (Para los Hijos - Hombres)',
      hebrew: 'יְשִׂימְךָ אֱלֹהִים כְּאֶפְרַיִם וְכִמְנַשֶּׁה.',
      transliteration: 'Yisimjá Elohim ke-Efráyim veji-Menashé.',
      translation: 'Que Dios te haga como a Efraín y como a Manasés.',
      category: 'Vida Familiar',
      description:
        'Tradicional bendición que los padres recitan a sus hijos varones los viernes por la noche (antes de la cena de Shabat) y en eventos importantes como su Brit Milá o Bar Mitzvá.'
    },
    {
      id: 'birkat-habanim-niñas',
      title: 'Birkat HaBanim (Para las Hijas - Mujeres)',
      hebrew: 'יְשִׂימֵךְ אֱלֹהִים כְּשָׂרָה רִבְקָה רָחֵל וְלֵאָה.',
      transliteration: 'Yisimej Elohim ke-Sará, Rivká, Rajél ve-Leá.',
      translation: 'Que Dios te haga como a Sara, Rebeca, Rajel y Leá.',
      category: 'Vida Familiar',
      description:
        'Tradicional bendición que los padres recitan a sus hijas mujeres los viernes por la noche (antes de la cena de Shabat) y en eventos importantes como su Simjat Bat o Bat Mitzvá.'
    },
    {
      id: 'birkat-cohanim',
      title: 'Birkat Cohanim (Bendición Sacerdotal)',
      hebrew:
        'יְבָרֶכְךָ יְהוָה וְיִשְׁמְרֶךָ. יָאֵר יְהוָה פָּנָיו אֵלֶיךָ וִיחֻנֶּךָ. יִשָּׂא יְהוָה פָּנָיו אֵלֶיךָ וְיָשֵׂם לְךָ שָׁלוֹם.',
      transliteration:
        'Yevarejejá Adonai ve-yishmeréja. Yaér Adonai panáv eléja viyjunéja. Yisá Adonai panáv eléja veyásem lejá shalóm.',
      translation:
        'Que el Eterno te bendiga y te guarde. Que el Eterno haga resplandecer Su rostro sobre ti y te agracie. Que el Eterno eleve Su rostro hacia ti y te conceda la paz.',
      category: 'Vida Familiar',
      description:
        'La bendición más antigua de la Torá. Se recita a los niños, novios bajo la Jupá y en momentos de transición y regocijo espiritual.'
    },
    {
      id: 'shehecheyanu',
      title: 'Brajá Shehejeianu (Agradecimiento por Nuevos Momentos)',
      hebrew:
        'בָּרוּךְ אַתָּה יְהוָה אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, שֶׁהֶחֱיָנוּ וְקִיְּמָנוּ וְהִגִּיעָנוּ לַזְּמַן הַזֶּה.',
      transliteration:
        'Barúj Atá Adonai, Elohéinu Mélej HaOlám, shejejiánu vekiyamánu vejigiánu lazmán hazé.',
      translation:
        'Bendito eres Tú, Eterno Dios nuestro, Rey del Universo, que nos ha mantenido con vida, nos ha sostenido y nos ha permitido llegar a este momento único.',
      category: 'Vida Familiar',
      description:
        'Bendición de agradecimiento recitada al experimentar algo nuevo o después de mucho tiempo. Ideal para nacimientos, inauguraciones de hogares, bodas, Bar/Bat Mitzvás y festividades.'
    },
    {
      id: 'birkat-habayit',
      title: 'Birkat HaBayit (Bendición del Hogar)',
      hebrew:
        'בְּזֶה הַשַּׁעַר לֹא יָבוֹא צַעַר. בְּזֹאת הַדִּירָה לֹא תָבוֹא צָרָה. בְּזֹאת הַדֶּלֶת לֹא תָבוֹא בֶּהָלָה. בְּזֹאת הַמַּחְלָקָה לֹא תָבוֹא מַחְלֹקֶת. בְּזֶה הַמָּקוֹם תְּהִי בְרָכָה וְשָׁלוֹם.',
      transliteration:
        "Bezé hasha'ar lo yavó tza'ar. Bezót hadirá lo tavó tzará. Bezót hadélet lo tavó behalá. Bezót hamajlaká lo tavó majlóket. Bezé hamakóm tejí verajá veshalóm.",
      translation:
        'Que por esta puerta no entre la tristeza. Que en esta morada no haya angustias. Que tras esta puerta no haya sobresaltos. Que en este espacio no haya disputas. Que en este lugar haya bendición y paz.',
      category: 'Shabat y Festividades',
      description:
        'Bendición tradicional que se coloca en el hogar para atraer armonía, paz, salud y sustento espiritual para toda la familia.'
    },
    {
      id: 'tefilat-haderej',
      title: 'Tefilat HaDerej (Plegaria del Viajero)',
      hebrew:
        'יְהִי רָצוֹן מִלְּפָנֶיךָ יְהוָה אֱלֹהֵינוּ וֵאלֹהֵי אֲבוֹתֵינוּ שֶׁתּוֹלִיכֵנוּ לְשָׁלוֹם וְתַצְעִידֵנוּ לְשָׁלוֹם... וְתַצִּילֵנוּ מִכַּף כָּל אוֹיֵב וְאוֹרֵב בַּדֶּרֶךְ...',
      transliteration:
        "Yehí ratzón milefanéja Adonai Elohéinu ve-Elohéi avotéinu she-tolijénu leshalóm ve-tatz'idénu leshalóm... ve-tatzilénu mikáf kol oyév ve-orév badérej...",
      translation:
        'Sea Tu voluntad, Eterno Dios nuestro y de nuestros antepasados, guiarnos en paz, dirigir nuestros pasos en paz... y librarnos de las manos de cualquier enemigo o acechanza en el camino...',
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
      description:
        'La bendición que se recita sobre el pan o las Jalot tradicionales los viernes por la noche en Shabat y los días de festividades antes de la cena familiar.'
    },
    {
      id: 'baruj-shepetarani',
      title: 'Bendición del Padre en Bar Mitzvá (Baruj Sheptarani)',
      hebrew: 'בָּרוּךְ שֶׁפְּטָרַנִי מֵעָנְשִׁוֹ שֶׁל זֶה.',
      transliteration: 'Barúj she-petaráni me-onshó shel ze.',
      translation: 'Bendito es Aquel que me ha liberado de la responsabilidad legal de este niño.',
      category: 'Vida Familiar',
      description:
        'Bendición pronunciada tradicionalmente por el padre del niño el día de su Bar Mitzvá cuando lee la Torá por primera vez, marcando la transición del joven hacia la madurez espiritual y su propia responsabilidad por sus mitzvot.'
    }
  ];

  kernel.LITE_BRAJOT_CATEGORIES = ['Vida Familiar', 'Shabat y Festividades'];

  kernel.filterBrajot = function filterBrajot(category, list) {
    const source = list || kernel.BRAJOT_DATABASE;
    if (!category || category === 'all') return source.slice();
    return source.filter((braja) => braja.category === category);
  };

  kernel.getLiteBrajot = function getLiteBrajot() {
    return kernel.BRAJOT_DATABASE.filter((braja) =>
      kernel.LITE_BRAJOT_CATEGORIES.includes(braja.category)
    );
  };

  kernel.formatBrajaCopyText = function formatBrajaCopyText(braja) {
    if (!braja) return '';
    return `${braja.title}\n\nHebreo:\n${braja.hebrew}\n\nFonetica:\n${braja.transliteration}\n\nTraduccion:\n${braja.translation}`;
  };

  global.DorLdorKernel = kernel;
})(typeof globalThis !== 'undefined' ? globalThis : window);
