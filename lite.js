/**
 * lite.js
 * Superficie simplificada montable (zmanim, brajot, recordatorios, ICS).
 *
 * Uso:
 *   DorLdorLite.mount(containerEl, {
 *     city: 'BU',
 *     theme: 'inherit',
 *     features: ['zmanim', 'brajot', 'reminders', 'ics'],
 *     members: [],
 *     events: []
 *   });
 */
(function (global) {
  const DEFAULT_FEATURES = ['zmanim', 'brajot', 'reminders', 'ics'];

  function kernel() {
    return global.DorLdorKernel || {};
  }

  function hasFeature(features, name) {
    return features.indexOf(name) !== -1;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function resolveContainer(target) {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    return target;
  }

  function applyTheme(root, theme) {
    if (!theme || theme === 'inherit') return;
    root.setAttribute('data-theme', theme);
  }

  function cityOptionsHtml(selectedCity) {
    const cities = kernel().ZMANIM_CITIES || [];
    return cities
      .map((city) => {
        const selected = city.code === selectedCity ? ' selected' : '';
        return `<option value="${escapeHtml(city.code)}"${selected}>${escapeHtml(city.label)}</option>`;
      })
      .join('');
  }

  function renderShell(state) {
    const features = state.features;
    return `
      <div class="dorldor-lite">
        <header class="dorldor-lite-header">
          <h2>Dor L'Dor Lite</h2>
          <p>Zmanim, brajot de Shabat y recordatorios familiares.</p>
        </header>
        ${hasFeature(features, 'zmanim') ? `
          <section class="dorldor-lite-card" data-lite-section="zmanim">
            <div class="dorldor-lite-card-head">
              <h3>Horarios de Shabat</h3>
              <select class="dorldor-lite-select" data-lite-city>${cityOptionsHtml(state.city)}</select>
            </div>
            <p class="dorldor-lite-location" data-lite-location>Consultando Hebcal...</p>
            <div class="dorldor-lite-times" data-lite-times></div>
          </section>
        ` : ''}
        ${hasFeature(features, 'brajot') ? `
          <section class="dorldor-lite-card" data-lite-section="brajot">
            <h3>Brajot de Shabat y familia</h3>
            <div class="dorldor-lite-brajot" data-lite-brajot></div>
          </section>
        ` : ''}
        ${hasFeature(features, 'reminders') ? `
          <section class="dorldor-lite-card" data-lite-section="reminders">
            <div class="dorldor-lite-card-head">
              <h3>Próximos recordatorios</h3>
              ${hasFeature(features, 'ics') ? '<button type="button" class="dorldor-lite-btn" data-lite-ics>Exportar .ics</button>' : ''}
            </div>
            <div data-lite-reminders></div>
          </section>
        ` : hasFeature(features, 'ics') ? `
          <section class="dorldor-lite-card">
            <button type="button" class="dorldor-lite-btn" data-lite-ics>Exportar .ics</button>
          </section>
        ` : ''}
      </div>
    `;
  }

  async function renderZmanim(root, city) {
    const locationEl = root.querySelector('[data-lite-location]');
    const timesEl = root.querySelector('[data-lite-times]');
    if (!timesEl) return;
    const result = kernel().fetchZmanim
      ? await kernel().fetchZmanim({ city })
      : { candles: '18:15', havdalah: '19:10', locationLabel: 'Horarios estimados' };
    if (locationEl) locationEl.textContent = result.locationLabel;
    timesEl.innerHTML = `
      <span>🕯️ Encendido: <strong>${escapeHtml(result.candles)}</strong></span>
      <span>✨ Havdalá: <strong>${escapeHtml(result.havdalah)}</strong></span>
    `;
  }

  function renderBrajot(root) {
    const listEl = root.querySelector('[data-lite-brajot]');
    if (!listEl) return;
    const brajot = kernel().getLiteBrajot ? kernel().getLiteBrajot() : [];
    if (!brajot.length) {
      listEl.innerHTML = '<p class="dorldor-lite-empty">No hay brajot disponibles.</p>';
      return;
    }
    listEl.innerHTML = brajot.map((braja) => `
      <article class="dorldor-lite-braja" data-braja-id="${escapeHtml(braja.id)}">
        <div class="dorldor-lite-braja-head">
          <strong>${escapeHtml(braja.title)}</strong>
          <button type="button" class="dorldor-lite-btn dorldor-lite-btn-ghost" data-copy-braja>Copiar</button>
        </div>
        <p class="dorldor-lite-hebrew">${escapeHtml(braja.hebrew)}</p>
        <p>${escapeHtml(braja.transliteration)}</p>
      </article>
    `).join('');
  }

  function renderReminders(root, members, events) {
    const listEl = root.querySelector('[data-lite-reminders]');
    if (!listEl) return;
    const data = kernel().getUpcomingReminders
      ? kernel().getUpcomingReminders(members, events)
      : { birthdays: [], yahrtzeits: [] };
    const items = [...data.birthdays, ...data.yahrtzeits];
    if (!items.length) {
      listEl.innerHTML = '<p class="dorldor-lite-empty">Sin recordatorios locales. Shabatin puede pasar members y events al montar.</p>';
      return;
    }
    listEl.innerHTML = items.map((item) => `
      <div class="dorldor-lite-reminder">
        <div class="dorldor-lite-badge">${escapeHtml(item.day)}<span>${escapeHtml(item.monthLabel)}</span></div>
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.hebrewDate || item.date)}</p>
        </div>
      </div>
    `).join('');
  }

  function downloadIcs(members, events) {
    const ics = kernel().buildIcsCalendar
      ? kernel().buildIcsCalendar({ members, events })
      : 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nEND:VCALENDAR\r\n';
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dorldor-lite-recordatorios.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function bindEvents(root, state) {
    const citySelect = root.querySelector('[data-lite-city]');
    if (citySelect) {
      citySelect.addEventListener('change', async () => {
        state.city = citySelect.value;
        await renderZmanim(root, state.city);
      });
    }

    root.querySelectorAll('[data-copy-braja]').forEach((button) => {
      button.addEventListener('click', async () => {
        const card = button.closest('[data-braja-id]');
        const braja = (kernel().getLiteBrajot ? kernel().getLiteBrajot() : [])
          .find((item) => item.id === (card && card.getAttribute('data-braja-id')));
        const text = kernel().formatBrajaCopyText ? kernel().formatBrajaCopyText(braja) : '';
        if (text && navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          button.textContent = 'Copiado';
          setTimeout(() => {
            button.textContent = 'Copiar';
          }, 1500);
        }
      });
    });

    const icsBtn = root.querySelector('[data-lite-ics]');
    if (icsBtn) {
      icsBtn.addEventListener('click', () => downloadIcs(state.members, state.events));
    }
  }

  async function mount(target, options) {
    const container = resolveContainer(target);
    if (!container) {
      console.warn('DorLdorLite.mount: contenedor no encontrado');
      return null;
    }

    const state = {
      city: (options && options.city) || kernel().DEFAULT_ZMANIM_CITY || 'BU',
      theme: (options && options.theme) || 'inherit',
      features: (options && options.features) || DEFAULT_FEATURES,
      members: (options && options.members) || [],
      events: (options && options.events) || []
    };

    applyTheme(container, state.theme);
    container.innerHTML = renderShell(state);
    renderBrajot(container);
    renderReminders(container, state.members, state.events);
    bindEvents(container, state);
    await renderZmanim(container, state.city);
    return state;
  }

  global.DorLdorLite = {
    mount,
    DEFAULT_FEATURES
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
