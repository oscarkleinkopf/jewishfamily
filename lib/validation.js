/**
 * lib/validation.js
 * Validación de eventos y miembros (sin DOM).
 */
(function (global) {
  const kernel = global.DorLdorKernel || {};

  kernel.EVENT_CATEGORIES = [
    'Nacimiento',
    'Brit Milá / Simjat Bat',
    'Bar / Bat Mitzvá',
    'Jupá / Boda',
    'Actividad Comunitaria',
    'Yahrtzeit / Sepelio',
    'Festividades',
    'Otros'
  ];

  kernel.MEMBER_RELATIONSHIPS = ['Hijo', 'Padre', 'Madre', 'Abuelo', 'Tío', 'Primo', 'Otro'];

  kernel.ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

  kernel.isNonEmptyText = function isNonEmptyText(value) {
    return typeof value === 'string' && value.trim().length > 0;
  };

  kernel.isIsoDate = function isIsoDate(value) {
    if (!kernel.ISO_DATE_PATTERN.test(value || '')) return false;
    return Boolean(kernel.parseIsoDate ? kernel.parseIsoDate(value) : Date.parse(value));
  };

  kernel.validateEvent = function validateEvent(event) {
    const errors = {};
    const title = event && event.title;
    const category = event && event.category;
    const date = event && event.date;
    const description = event && event.description;

    if (!kernel.isNonEmptyText(title)) {
      errors.title = 'El título es obligatorio.';
    }
    if (!kernel.isNonEmptyText(category) || !kernel.EVENT_CATEGORIES.includes(category)) {
      errors.category = 'Selecciona una categoría válida.';
    }
    if (!kernel.isIsoDate(date)) {
      errors.date = 'La fecha gregoriana es obligatoria (AAAA-MM-DD).';
    }
    if (!kernel.isNonEmptyText(description)) {
      errors.description = 'El relato del acontecimiento es obligatorio.';
    }

    return {
      ok: Object.keys(errors).length === 0,
      errors
    };
  };

  kernel.validateMember = function validateMember(member) {
    const errors = {};
    const name = member && member.name;
    const relationship = member && member.relationship;
    const birthDate = member && member.birthDate;

    if (!kernel.isNonEmptyText(name)) {
      errors.name = 'El nombre completo es obligatorio.';
    }
    if (!kernel.isNonEmptyText(relationship) || !kernel.MEMBER_RELATIONSHIPS.includes(relationship)) {
      errors.relationship = 'Selecciona un parentesco válido.';
    }
    if (!kernel.isIsoDate(birthDate)) {
      errors.birthDate = 'La fecha de nacimiento es obligatoria (AAAA-MM-DD).';
    }

    return {
      ok: Object.keys(errors).length === 0,
      errors
    };
  };

  global.DorLdorKernel = kernel;
})(typeof globalThis !== 'undefined' ? globalThis : window);
