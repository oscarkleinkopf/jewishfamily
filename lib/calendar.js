/**
 * lib/calendar.js
 * Calendario hebreo, zmanim (Hebcal) y generación de archivos .ics.
 * Script clásico: adjunta API en globalThis.DorLdorKernel.
 */
(function (global) {
  const kernel = global.DorLdorKernel || {};

  kernel.HEBREW_MONTHS_ES = {
    Nisan: 'Nisán',
    Iyyar: 'Iyar',
    Sivan: 'Siván',
    Tamuz: 'Tamuz',
    Av: 'Av',
    Elul: 'Elul',
    Tishrei: 'Tishrei',
    Cheshvan: 'Jeshván',
    Kislev: 'Kislev',
    Tevet: 'Tevet',
    Shvat: 'Shvat',
    Adar: 'Adar',
    'Adar I': 'Adar I',
    'Adar II': 'Adar II'
  };

  kernel.ZMANIM_CITIES = [
    { code: 'BU', label: 'Buenos Aires, Argentina' },
    { code: 'IL-Jerusalem', label: 'Jerusalén, Israel' },
    { code: 'MX-Mexico City', label: 'Ciudad de México' },
    { code: 'US-New York-NY', label: 'Nueva York, EE.UU.' },
    { code: 'CL-Santiago', label: 'Santiago, Chile' }
  ];

  kernel.DEFAULT_ZMANIM_CITY = 'BU';

  kernel.getZmanimCity = function getZmanimCity(code) {
    return (
      kernel.ZMANIM_CITIES.find((city) => city.code === code) ||
      kernel.ZMANIM_CITIES.find((city) => city.code === kernel.DEFAULT_ZMANIM_CITY)
    );
  };

  kernel.formatHebrewDateFromHebcal = function formatHebrewDateFromHebcal(data) {
    if (!data || !data.hd) return '';
    const monthEs = kernel.HEBREW_MONTHS_ES[data.hm] || data.hm;
    return `${data.hd} de ${monthEs}, ${data.hy}`;
  };

  kernel.fetchHebrewDate = async function fetchHebrewDate(gregorianDateString) {
    if (!gregorianDateString) return '';
    try {
      const response = await fetch(
        `https://www.hebcal.com/converter?cfg=json&date=${gregorianDateString}&g2h=1`
      );
      if (!response.ok) throw new Error('hebcal-converter');
      const data = await response.json();
      return kernel.formatHebrewDateFromHebcal(data);
    } catch (error) {
      console.error('Error al consultar Hebcal API:', error);
      return '';
    }
  };

  kernel.extractClockFromIso = function extractClockFromIso(iso) {
    if (!iso) return '';
    const match = String(iso).match(/T(\d{2}:\d{2})/);
    return match ? match[1] : String(iso).slice(11, 16);
  };

  kernel.fetchZmanim = async function fetchZmanim(options) {
    const cityCode = (options && options.city) || kernel.DEFAULT_ZMANIM_CITY;
    const cityInfo = kernel.getZmanimCity(cityCode);

    try {
      const response = await fetch(
        `https://www.hebcal.com/zmanim?cfg=json&city=${encodeURIComponent(cityInfo.code)}&g2h=1`
      );
      if (!response.ok) throw new Error('hebcal-zmanim');
      const data = await response.json();
      const locationCity = data.location && data.location.city;
      const locationCc = data.location && data.location.cc;
      return {
        ok: true,
        city: cityInfo,
        candles: kernel.extractClockFromIso(data.times && data.times.candles) || '18:15',
        havdalah: kernel.extractClockFromIso(data.times && data.times.havdalah) || '19:10',
        times: data.times || {},
        locationLabel: locationCity
          ? `${locationCity}${locationCc ? `, ${locationCc}` : ''} (Hebcal Zmanim)`
          : `${cityInfo.label} (Hebcal Zmanim)`
      };
    } catch {
      return {
        ok: false,
        city: cityInfo,
        candles: '18:15',
        havdalah: '19:10',
        times: {},
        locationLabel: `${cityInfo.label} (estimado)`
      };
    }
  };

  kernel.icsEscape = function icsEscape(value) {
    return String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  };

  kernel.toIcsDate = function toIcsDate(isoDate) {
    return String(isoDate || '').replace(/-/g, '');
  };

  kernel.toYearlyIcsDate = function toYearlyIcsDate(isoDate, year) {
    const compact = kernel.toIcsDate(isoDate);
    if (compact.length < 8) return '';
    return `${year}${compact.slice(4)}`;
  };

  kernel.isAnnualEventCategory = function isAnnualEventCategory(category) {
    return category === 'Yahrtzeit / Sepelio' || category === 'Festividades' || category === 'Nacimiento';
  };

  kernel.buildIcsEvent = function buildIcsEvent(event) {
    let block = 'BEGIN:VEVENT\r\n';
    block += `UID:${kernel.icsEscape(event.uid)}\r\n`;
    block += `SUMMARY:${kernel.icsEscape(event.summary)}\r\n`;
    if (event.description) {
      block += `DESCRIPTION:${kernel.icsEscape(event.description)}\r\n`;
    }
    block += `DTSTART;VALUE=DATE:${event.dtstart}\r\n`;
    if (event.rrule) {
      block += `RRULE:${event.rrule}\r\n`;
    }
    block += 'END:VEVENT\r\n';
    return block;
  };

  kernel.buildIcsCalendar = function buildIcsCalendar(input) {
    const members = (input && input.members) || [];
    const events = (input && input.events) || [];
    const year = (input && input.year) || new Date().getFullYear();
    let icsContent = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Dor LDor Family Journal//ES\r\nCALSCALE:GREGORIAN\r\n';

    members.forEach((member) => {
      if (!member.birthDate) return;
      const dtstart = kernel.toYearlyIcsDate(member.birthDate, year);
      if (!dtstart) return;
      icsContent += kernel.buildIcsEvent({
        uid: `birthday-${member.id || member.name}@dorldor`,
        summary: `Cumpleaños de ${member.name}${member.hebrewBirthDate ? ` (${member.hebrewBirthDate})` : ''}`,
        description: `Cumpleaños familiar - ${member.relationship || ''}`.trim(),
        dtstart,
        rrule: 'FREQ=YEARLY'
      });
    });

    events.forEach((event) => {
      if (!event.date) return;
      const annual = kernel.isAnnualEventCategory(event.category);
      const dtstart = annual ? kernel.toYearlyIcsDate(event.date, year) : kernel.toIcsDate(event.date);
      if (!dtstart) return;
      const isYahrtzeit = event.category === 'Yahrtzeit / Sepelio';
      icsContent += kernel.buildIcsEvent({
        uid: `event-${event.id || dtstart}@dorldor`,
        summary: event.title || 'Evento familiar',
        description: [
          event.category,
          event.location ? `Lugar: ${event.location}` : '',
          event.hebrewDate ? `Hebreo: ${event.hebrewDate}` : '',
          event.description || ''
        ]
          .filter(Boolean)
          .join(' | '),
        dtstart,
        rrule: annual || isYahrtzeit ? 'FREQ=YEARLY' : ''
      });
    });

    icsContent += 'END:VCALENDAR\r\n';
    return icsContent;
  };

  global.DorLdorKernel = kernel;
})(typeof globalThis !== 'undefined' ? globalThis : window);
