import assert from 'node:assert/strict';
import { test } from 'node:test';

import '../lib/calendar.js';
import '../lib/brajot.js';
import '../lib/reminders.js';
import '../lib/validation.js';

const kernel = globalThis.DorLdorKernel;

test('validateEvent rechaza título vacío y acepta un evento válido', () => {
  const invalid = kernel.validateEvent({
    title: '   ',
    category: 'Nacimiento',
    date: '2013-06-18',
    description: 'Relato'
  });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.title);

  const valid = kernel.validateEvent({
    title: 'Brit Milá de David',
    category: 'Brit Milá / Simjat Bat',
    date: '2013-06-26',
    description: 'Octavo día'
  });
  assert.equal(valid.ok, true);
});

test('validateMember exige nombre, parentesco y fecha ISO', () => {
  const invalid = kernel.validateMember({
    name: 'Rajel',
    relationship: 'Madre',
    birthDate: '05-08-1978'
  });
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.birthDate);

  const valid = kernel.validateMember({
    name: 'Rajel Levy',
    relationship: 'Madre',
    birthDate: '1978-08-05'
  });
  assert.equal(valid.ok, true);
});

test('getUpcomingReminders ordena cumpleaños y filtra yahrtzeit', () => {
  const members = [
    { id: 'b', name: 'Miriam', relationship: 'Hija', birthDate: '2016-11-20' },
    { id: 'a', name: 'David', relationship: 'Hijo', birthDate: '2013-06-18' }
  ];
  const events = [
    { id: 'e1', title: 'Jupá', category: 'Jupá / Boda', date: '2008-06-15' },
    { id: 'e2', title: 'Yahrtzeit de Isaac', category: 'Yahrtzeit / Sepelio', date: '2020-01-15' }
  ];

  const reminders = kernel.getUpcomingReminders(members, events);
  assert.equal(reminders.birthdays[0].title, 'Cumpleaños de David');
  assert.equal(reminders.birthdays[1].title, 'Cumpleaños de Miriam');
  assert.equal(reminders.yahrtzeits.length, 1);
  assert.equal(reminders.yahrtzeits[0].title, 'Yahrtzeit de Isaac');
});

test('buildIcsCalendar incluye cumpleaños, yahrtzeit y eventos anuales', () => {
  const ics = kernel.buildIcsCalendar({
    year: 2026,
    members: [{ id: 'm1', name: 'David', relationship: 'Hijo', birthDate: '2013-06-18' }],
    events: [
      { id: 'y1', title: 'Yahrtzeit de Isaac', category: 'Yahrtzeit / Sepelio', date: '2020-01-15' },
      { id: 'w1', title: 'Jupá', category: 'Jupá / Boda', date: '2008-06-15', location: 'Buenos Aires' }
    ]
  });

  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /SUMMARY:Cumpleaños de David/);
  assert.match(ics, /DTSTART;VALUE=DATE:20260618/);
  assert.match(ics, /SUMMARY:Yahrtzeit de Isaac/);
  assert.match(ics, /DTSTART;VALUE=DATE:20260115/);
  assert.match(ics, /SUMMARY:Jupá/);
  assert.match(ics, /DTSTART;VALUE=DATE:20080615/);
  assert.equal((ics.match(/RRULE:FREQ=YEARLY/g) || []).length, 2);
});

test('getLiteBrajot solo incluye categorías de Shabat y familia', () => {
  const lite = kernel.getLiteBrajot();
  assert.ok(lite.length > 0);
  assert.ok(lite.every((braja) => kernel.LITE_BRAJOT_CATEGORIES.includes(braja.category)));
  assert.equal(kernel.filterBrajot('Comida').every((braja) => braja.category === 'Comida'), true);
});

test('formatHebrewDateFromHebcal traduce el mes', () => {
  const formatted = kernel.formatHebrewDateFromHebcal({ hd: 10, hm: 'Tamuz', hy: 5773 });
  assert.equal(formatted, '10 de Tamuz, 5773');
});
