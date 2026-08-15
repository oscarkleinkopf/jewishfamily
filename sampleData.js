/**
 * sampleData.js
 * Datos semilla (miembros y eventos). El catálogo de brajot vive en lib/brajot.js.
 */

const BRAJOT_DATABASE =
  (typeof globalThis !== 'undefined' &&
    globalThis.DorLdorKernel &&
    globalThis.DorLdorKernel.BRAJOT_DATABASE) ||
  [];

const INITIAL_MEMBERS = [
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

const INITIAL_EVENTS = [
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
    date: '2026-06-18',
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
