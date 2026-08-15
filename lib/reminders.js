/**
 * lib/reminders.js
 * Cálculo de recordatorios (cumpleaños y yahrtzeit) sin DOM.
 */
(function (global) {
  const kernel = global.DorLdorKernel || {};

  kernel.YAHRTZEIT_CATEGORY = 'Yahrtzeit / Sepelio';

  kernel.parseIsoDate = function parseIsoDate(isoDate) {
    if (!isoDate || typeof isoDate !== 'string') return null;
    const parts = isoDate.split('-').map(Number);
    if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  kernel.getMonthDayKey = function getMonthDayKey(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return 0;
    return date.getMonth() * 100 + date.getDate();
  };

  kernel.sortByCalendarDay = function sortByCalendarDay(items, getIso) {
    return [...items].sort((a, b) => {
      const dateA = kernel.parseIsoDate(getIso(a));
      const dateB = kernel.parseIsoDate(getIso(b));
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return kernel.getMonthDayKey(dateA) - kernel.getMonthDayKey(dateB);
    });
  };

  kernel.getBirthdayReminders = function getBirthdayReminders(members) {
    const list = Array.isArray(members) ? members : [];
    return kernel.sortByCalendarDay(
      list.filter((member) => member && member.birthDate),
      (member) => member.birthDate
    ).map((member) => {
      const date = kernel.parseIsoDate(member.birthDate);
      return {
        type: 'birthday',
        id: member.id,
        title: `Cumpleaños de ${member.name}`,
        date: member.birthDate,
        hebrewDate: member.hebrewBirthDate || '',
        relationship: member.relationship || '',
        day: date ? date.getDate() : '',
        monthLabel: date ? date.toLocaleString('es-ES', { month: 'short' }) : ''
      };
    });
  };

  kernel.getYahrtzeitReminders = function getYahrtzeitReminders(events) {
    const list = Array.isArray(events) ? events : [];
    return kernel.sortByCalendarDay(
      list.filter((event) => event && event.category === kernel.YAHRTZEIT_CATEGORY),
      (event) => event.date
    ).map((event) => {
      const date = kernel.parseIsoDate(event.date);
      return {
        type: 'yahrtzeit',
        id: event.id,
        title: event.title,
        date: event.date,
        hebrewDate: event.hebrewDate || '',
        location: event.location || '',
        day: date ? date.getDate() : '',
        monthLabel: date ? date.toLocaleString('es-ES', { month: 'short' }) : ''
      };
    });
  };

  kernel.getUpcomingReminders = function getUpcomingReminders(members, events) {
    return {
      birthdays: kernel.getBirthdayReminders(members),
      yahrtzeits: kernel.getYahrtzeitReminders(events)
    };
  };

  global.DorLdorKernel = kernel;
})(typeof globalThis !== 'undefined' ? globalThis : window);
