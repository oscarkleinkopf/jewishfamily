/**
 * app.js
 * Lógica principal del Diario Familiar y Proyecto Shorashim "Dor L'Dor".
 * Diseñado para ejecución sin necesidad de servidor local (CORS-free standalone script).
 */

// --- Diccionario de traducción de meses hebreos ---
const HEBREW_MONTHS_ES = {
  'Nisan': 'Nisán',
  'Iyyar': 'Iyar',
  'Sivan': 'Siván',
  'Tamuz': 'Tamuz',
  'Av': 'Av',
  'Elul': 'Elul',
  'Tishrei': 'Tishrei',
  'Cheshvan': 'Jeshván',
  'Kislev': 'Kislev',
  'Tevet': 'Tevet',
  'Shvat': 'Shvat',
  'Adar': 'Adar',
  'Adar I': 'Adar I',
  'Adar II': 'Adar II'
};

// --- Variables de Estado Global ---
let currentTheme = 'light';
let activeView = 'timeline';
let currentShorashimStep = 1;
let currentSlideshowIndex = 0;
let slideshowMediaList = []; // { title, desc, url, type }

// --- Cache de Elementos del DOM ---
const dom = {
  // Navegación
  sidebar: document.getElementById('sidebar-nav'),
  menuToggleBtn: document.getElementById('menu-toggle-btn'),
  navLinks: document.querySelectorAll('.sidebar-link'),
  viewSections: document.querySelectorAll('.view-section'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  
  // Respaldo
  exportBtn: document.getElementById('export-db-btn'),
  importBtn: document.getElementById('import-db-trigger'),
  importFile: document.getElementById('import-db-file'),
  clearBtn: document.getElementById('clear-db-btn'),
  
  // Línea de Tiempo
  addEventBtn: document.getElementById('add-event-btn'),
  timelineContainer: document.getElementById('timeline-events-container'),
  searchEventsInput: document.getElementById('search-events-input'),
  filterMemberSelect: document.getElementById('filter-member-select'),
  categoryPills: document.querySelectorAll('#category-pills-container .category-pill'),
  
  // Álbum
  galleryContainer: document.getElementById('gallery-container'),
  
  // Familia
  addMemberBtn: document.getElementById('add-member-btn'),
  familyMembersContainer: document.getElementById('family-members-container'),
  treeLevelGrandparents: document.getElementById('tree-level-grandparents'),
  treeLevelParents: document.getElementById('tree-level-parents'),
  treeLevelChildren: document.getElementById('tree-level-children'),
  
  // Shorashim
  shorashimEditor: document.getElementById('shorashim-editor-wizard'),
  shorashimBooklet: document.getElementById('shorashim-booklet-preview'),
  shorashimToggleViewBtn: document.getElementById('shorashim-toggle-view-btn'),
  printShorashimBtn: document.getElementById('print-shorashim-btn'),
  wizardSteps: document.querySelectorAll('.wizard-step-indicator'),
  wizardStepContents: document.querySelectorAll('.wizard-step-content'),
  wizardPrevBtn: document.getElementById('wizard-prev-btn'),
  wizardNextBtn: document.getElementById('wizard-next-btn'),
  
  // Inputs Shorashim
  shChildName: document.getElementById('sh-child-name'),
  shChildHebName: document.getElementById('sh-child-heb-name'),
  shChildNamedAfter: document.getElementById('sh-child-named-after'),
  shChildBio: document.getElementById('sh-child-bio'),
  shParentsStory: document.getElementById('sh-parents-story'),
  shSiblingsInfo: document.getElementById('sh-siblings-info'),
  shGrandparentsStory: document.getElementById('sh-grandparents-story'),
  shTraditionsShabat: document.getElementById('sh-traditions-shabat'),
  shRecipes: document.getElementById('sh-recipes'),
  shObjects: document.getElementById('sh-objects'),
  
  // Buscador Genealógico
  genSearchName: document.getElementById('gen-search-name'),
  genSearchYear: document.getElementById('gen-search-year'),
  genSearchCountry: document.getElementById('gen-search-country'),
  searchMyHeritageBtn: document.getElementById('search-myheritage-btn'),
  searchGeniBtn: document.getElementById('search-geni-btn'),
  searchFamilySearchBtn: document.getElementById('search-familysearch-btn'),
  
  // Brajot
  brajotContainer: document.getElementById('brajot-container'),
  brajotCategoryPills: document.querySelectorAll('#brajot-category-pills .category-pill'),
  
  // Recordatorios
  birthdayContainer: document.getElementById('birthday-reminders-container'),
  yahrtzeitContainer: document.getElementById('yahrtzeit-reminders-container'),
  
  // Modales
  modalAddEvent: document.getElementById('modal-add-event'),
  modalAddMember: document.getElementById('modal-add-member'),
  modalSlideshow: document.getElementById('modal-slideshow'),
  modalLinkBraja: document.getElementById('modal-link-braja'),
  
  // Formularios e inputs
  addEventForm: document.getElementById('add-event-form'),
  eventModalTitle: document.getElementById('event-modal-title'),
  eventIdInput: document.getElementById('event-id-input'),
  eventTitleInput: document.getElementById('event-title-input'),
  eventCategoryInput: document.getElementById('event-category-input'),
  eventDateInput: document.getElementById('event-date-input'),
  eventHebDateInput: document.getElementById('event-heb-date-input'),
  eventLocationInput: document.getElementById('event-location-input'),
  eventDescInput: document.getElementById('event-desc-input'),
  eventTaggedCheckboxes: document.getElementById('event-tagged-members-checkboxes'),
  eventPhotoInput: document.getElementById('event-photo-input'),
  eventVideoInput: document.getElementById('event-video-input'),
  closeEventModalBtn: document.getElementById('close-event-modal-btn'),
  cancelEventModalBtn: document.getElementById('cancel-event-modal-btn'),
  
  addMemberForm: document.getElementById('add-member-form'),
  memberModalTitle: document.getElementById('member-modal-title'),
  memberIdInput: document.getElementById('member-id-input'),
  memberNameInput: document.getElementById('member-name-input'),
  memberHebNameInput: document.getElementById('member-heb-name-input'),
  memberRelationInput: document.getElementById('member-relation-input'),
  memberBirthInput: document.getElementById('member-birth-input'),
  memberHebBirthInput: document.getElementById('member-heb-birth-input'),
  memberPhotoInput: document.getElementById('member-photo-input'),
  closeMemberModalBtn: document.getElementById('close-member-modal-btn'),
  cancelMemberModalBtn: document.getElementById('cancel-member-modal-btn'),
  
  // Slideshow
  slideshowMediaContainer: document.getElementById('slideshow-media-container'),
  slideshowCaptionTitle: document.getElementById('slideshow-caption-title'),
  slideshowCaptionDesc: document.getElementById('slideshow-caption-desc'),
  slideshowPrevBtn: document.getElementById('slideshow-prev-btn'),
  slideshowNextBtn: document.getElementById('slideshow-next-btn'),
  closeSlideshowBtn: document.getElementById('close-slideshow-btn'),
  
  // Vincular Brajá
  linkBrajaForm: document.getElementById('link-braja-form'),
  linkBrajaIdInput: document.getElementById('link-braja-id-input'),
  linkBrajaTitleDisplay: document.getElementById('link-braja-title-display'),
  linkBrajaEventSelect: document.getElementById('link-braja-event-select'),
  closeLinkBrajaBtn: document.getElementById('close-link-braja-btn'),
  cancelLinkBrajaBtn: document.getElementById('cancel-link-braja-btn'),
  
  // Toast
  toast: document.getElementById('toast-notify'),
  toastMessage: document.getElementById('toast-message')
};

const { escapeHtml, sanitizeUrl } = globalThis.DorLDorSecurity;
const PLACEHOLDER_EVENT_IMAGE = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800';
const PLACEHOLDER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

function memberAvatarSrc(member) {
  if (member.avatar instanceof Blob) {
    return URL.createObjectURL(member.avatar);
  }
  if (typeof member.avatar === 'string' && member.avatar) {
    return sanitizeUrl(member.avatar, PLACEHOLDER_AVATAR);
  }
  return PLACEHOLDER_AVATAR;
}

// --- Inicialización de la App ---
document.addEventListener('DOMContentLoaded', async () => {
  await initDB();
  await checkAndPreloadSeedData();
  await initTheme();
  setupEventListeners();
  registerServiceWorker();
  setupAudioRecorder();
  
  // Carga inicial de datos en las vistas
  await updateAllViews();
});

// --- Registro de Service Worker para PWA ---
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('PWA Service Worker listo en:', reg.scope))
        .catch(err => console.warn('PWA Service Worker no registrado:', err));
    });
  }
}

function isExactDemoSeed(members, events, shorashim) {
  const fingerprint = typeof DEMO_SEED_FINGERPRINT !== 'undefined' ? DEMO_SEED_FINGERPRINT : null;
  if (!fingerprint) return false;
  if (!Array.isArray(members) || !Array.isArray(events)) return false;
  if (members.length !== fingerprint.members.length) return false;
  if (events.length !== fingerprint.events.length) return false;
  const membersMatch = fingerprint.members.every((seedMember) => {
    const stored = members.find((member) => member.id === seedMember.id);
    return stored && stored.name === seedMember.name;
  });
  if (!membersMatch) return false;
  const eventsMatch = fingerprint.events.every((seedEvent) => {
    const stored = events.find((event) => event.id === seedEvent.id);
    return stored && stored.title === seedEvent.title;
  });
  if (!eventsMatch) return false;
  if (!shorashim) return false;
  return shorashim.childName === fingerprint.shorashim.childName
    && shorashim.childNamedAfter === fingerprint.shorashim.childNamedAfter;
}

function offerDemoSeedRemoval() {
  const banner = document.getElementById('seed-data-banner');
  if (!banner) return;
  banner.hidden = false;

  const removeBtn = document.getElementById('remove-seed-data-btn');
  const keepBtn = document.getElementById('keep-seed-data-btn');

  removeBtn?.addEventListener('click', async () => {
    const confirmed = confirm(
      'Se quitará únicamente la familia de ejemplo Levy y el relato de Shorashim de muestra (David Levy / Varsovia). Esta acción no se puede deshacer. ¿Quitar los datos de ejemplo?'
    );
    if (!confirmed) return;
    await clearAllData();
    await saveSetting('seed_removal_declined', 'true');
    banner.hidden = true;
    showToast('Datos de ejemplo eliminados');
    await updateAllViews();
  }, { once: true });

  keepBtn?.addEventListener('click', async () => {
    await saveSetting('seed_removal_declined', 'true');
    banner.hidden = true;
  }, { once: true });
}

async function checkAndPreloadSeedData() {
  const members = await getMembers();
  const events = await getEvents();
  const shorashim = await getShorashimProject();
  const firstRun = await getSetting('first_run_completed');

  if (!firstRun) {
    await saveSetting('first_run_completed', 'true');
  }

  const alreadyOffered = await getSetting('seed_removal_declined');
  if (!alreadyOffered && isExactDemoSeed(members, events, shorashim)) {
    offerDemoSeedRemoval();
  }
}

// --- Inicializar Tema Claro/Oscuro ---
async function initTheme() {
  const dbTheme = await getSetting('app_theme');
  currentTheme = dbTheme || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  if (currentTheme === 'dark') {
    dom.themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    dom.themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
}

// --- Actualización de Vistas Globales ---
async function updateAllViews() {
  const members = await getMembers();
  const events = await getEvents();
  
  renderTimeline(events, members);
  renderGallery(events);
  renderFamily(members);
  renderD3Tree(members);
  renderShorashim();
  renderMigrationMap();
  renderBrajot(events);
  renderReminders(members, events);
  fetchHebcalZmanim();
  
  populateFilterMemberSelect(members);
  populateTaggedMembersCheckboxes(members);
  setupPhotoTagging(members);
}

// --- API de Conversión Calendario Hebreo (Hebcal) ---
async function fetchHebrewDate(gregorianDateString) {
  if (!gregorianDateString) return '';
  try {
    const response = await fetch(`https://www.hebcal.com/converter?cfg=json&date=${gregorianDateString}&g2h=1`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    
    const monthEs = HEBREW_MONTHS_ES[data.hm] || data.hm;
    return `${data.hd} de ${monthEs}, ${data.hy}`;
  } catch (e) {
    console.error('Error al consultar Hebcal API:', e);
    return '';
  }
}

// --- Manejo del Enrutamiento SPA ---
function switchView(viewName) {
  activeView = viewName;
  
  dom.viewSections.forEach(section => {
    if (section.id === `view-${viewName}`) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });

  dom.navLinks.forEach(link => {
    if (link.getAttribute('data-view') === viewName) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  if (window.innerWidth <= 1024) {
    dom.sidebar.classList.remove('show');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Configuración de Event Listeners ---
function setupEventListeners() {
  dom.menuToggleBtn.addEventListener('click', () => {
    dom.sidebar.classList.toggle('show');
  });

  dom.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const view = link.getAttribute('data-view');
      switchView(view);
    });
  });

  dom.themeToggleBtn.addEventListener('click', async () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    await saveSetting('app_theme', currentTheme);
    showToast(`Modo ${currentTheme === 'light' ? 'Claro' : 'Oscuro'} activado`);
  });

  // Respaldo
  dom.exportBtn.addEventListener('click', async () => {
    try {
      const dbJson = await exportDatabase();
      const blob = new Blob([dbJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dor_l_dor_respaldo_${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Copia de seguridad descargada con éxito');
    } catch (e) {
      console.error(e);
      showToast('Error al exportar datos');
    }
  });

  dom.importBtn.addEventListener('click', () => {
    dom.importFile.click();
  });

  dom.importFile.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const result = await importDatabase(e.target.result);
        if (result) {
          showToast('Copia de seguridad restaurada');
          setTimeout(() => window.location.reload(), 1500);
        }
      } catch (err) {
        console.error(err);
        alert('Archivo de copia de seguridad inválido.');
      }
    };
    reader.readAsText(file);
  });

  dom.clearBtn.addEventListener('click', async () => {
    if (confirm('¿Está seguro de que desea eliminar todos los datos del diario familiar? Esta acción no se puede deshacer.')) {
      await clearAllData();
      showToast('Datos locales borrados');
      setTimeout(() => window.location.reload(), 1000);
    }
  });

  // MODAL ACONTECIMIENTO (EVENTO)
  dom.addEventBtn.addEventListener('click', () => {
    dom.addEventForm.reset();
    dom.eventIdInput.value = '';
    dom.eventHebDateInput.value = '';
    if (dom.eventModalTitle) dom.eventModalTitle.innerText = 'Añadir Recuerdo';
    resetAudioRecorderUI();
    openModal(dom.modalAddEvent);
  });

  dom.closeEventModalBtn.addEventListener('click', () => closeModal(dom.modalAddEvent));
  dom.cancelEventModalBtn.addEventListener('click', () => closeModal(dom.modalAddEvent));

  dom.eventDateInput.addEventListener('change', async (e) => {
    dom.eventHebDateInput.placeholder = 'Consultando calendario hebreo...';
    const hebDate = await fetchHebrewDate(e.target.value);
    dom.eventHebDateInput.value = hebDate;
  });

  dom.addEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = dom.eventIdInput.value || 'event-' + Date.now();
    const title = dom.eventTitleInput.value;
    const category = dom.eventCategoryInput.value;
    const date = dom.eventDateInput.value;
    const hebrewDate = dom.eventHebDateInput.value;
    const location = dom.eventLocationInput.value;
    const description = dom.eventDescInput.value;
    
    const taggedMembers = [];
    dom.eventTaggedCheckboxes.querySelectorAll('input:checked').forEach(cb => {
      taggedMembers.push(cb.value);
    });

    const media = [];
    
    const photoFile = dom.eventPhotoInput.files[0];
    if (photoFile) {
      media.push({
        id: 'media-' + Date.now() + '-photo',
        type: 'image',
        blob: photoFile,
        name: photoFile.name
      });
    }

    const videoFile = dom.eventVideoInput.files[0];
    if (videoFile) {
      media.push({
        id: 'media-' + Date.now() + '-video',
        type: 'video',
        blob: videoFile,
        name: videoFile.name
      });
    }

    let existingMedia = [];
    let linkedBlessings = [];
    if (dom.eventIdInput.value) {
      const allEvents = await getEvents();
      const oldEvent = allEvents.find(ev => ev.id === dom.eventIdInput.value);
      if (oldEvent) {
        existingMedia = oldEvent.media || [];
        linkedBlessings = oldEvent.linkedBlessings || [];
      }
    }

    if (recordedAudioBlob) {
      existingMedia = existingMedia.filter((item) => item.type !== 'audio');
      media.push({
        id: 'media-' + Date.now() + '-audio',
        type: 'audio',
        blob: recordedAudioBlob,
        name: 'historia-oral.webm'
      });
    }

    const eventData = {
      id,
      title,
      category,
      date,
      hebrewDate,
      location,
      description,
      taggedMembers,
      linkedBlessings,
      media: [...existingMedia, ...media]
    };

    await saveEvent(eventData);
    resetAudioRecorderUI();
    closeModal(dom.modalAddEvent);
    showToast('Acontecimiento guardado');
    await updateAllViews();
  });

  // MODAL FAMILIAR (MIEMBRO)
  dom.addMemberBtn.addEventListener('click', () => {
    dom.addMemberForm.reset();
    dom.memberIdInput.value = '';
    dom.memberHebBirthInput.value = '';
    if (dom.memberModalTitle) dom.memberModalTitle.innerText = 'Añadir Miembro de la Familia';
    openModal(dom.modalAddMember);
  });

  dom.closeMemberModalBtn.addEventListener('click', () => closeModal(dom.modalAddMember));
  dom.cancelMemberModalBtn.addEventListener('click', () => closeModal(dom.modalAddMember));

  dom.memberBirthInput.addEventListener('change', async (e) => {
    dom.memberHebBirthInput.placeholder = 'Consultando...';
    const hebDate = await fetchHebrewDate(e.target.value);
    dom.memberHebBirthInput.value = hebDate;
  });

  dom.addMemberForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = dom.memberIdInput.value || 'member-' + Date.now();
    const name = dom.memberNameInput.value;
    const hebrewName = dom.memberHebNameInput.value;
    const relationship = dom.memberRelationInput.value;
    const birthDate = dom.memberBirthInput.value;
    const hebrewBirthDate = dom.memberHebBirthInput.value;
    
    let avatar = null;
    const photoFile = dom.memberPhotoInput.files[0];
    if (photoFile) {
      avatar = photoFile;
    } else if (dom.memberIdInput.value) {
      const allMembers = await getMembers();
      const oldM = allMembers.find(m => m.id === dom.memberIdInput.value);
      if (oldM) avatar = oldM.avatar;
    }

    const memberData = {
      id,
      name,
      hebrewName,
      relationship,
      birthDate,
      hebrewBirthDate,
      avatar
    };

    await saveMember(memberData);
    closeModal(dom.modalAddMember);
    showToast('Familiar registrado');
    await updateAllViews();
  });

  // Filtros de Línea de Tiempo
  dom.searchEventsInput.addEventListener('input', async () => {
    const events = await getEvents();
    const members = await getMembers();
    filterAndRenderTimeline(events, members);
  });

  dom.filterMemberSelect.addEventListener('change', async () => {
    const events = await getEvents();
    const members = await getMembers();
    filterAndRenderTimeline(events, members);
  });

  dom.categoryPills.forEach(pill => {
    pill.addEventListener('click', async () => {
      dom.categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const events = await getEvents();
      const members = await getMembers();
      filterAndRenderTimeline(events, members);
    });
  });

  // Shorashim
  dom.shorashimToggleViewBtn.addEventListener('click', () => {
    if (dom.shorashimEditor.style.display !== 'none') {
      saveShorashimFromInputs();
      renderShorashimBooklet();
      dom.shorashimEditor.style.display = 'none';
      dom.shorashimBooklet.style.display = 'block';
      dom.shorashimToggleViewBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Editar Proyecto';
    } else {
      dom.shorashimEditor.style.display = 'block';
      dom.shorashimBooklet.style.display = 'none';
      dom.shorashimToggleViewBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Vista Previa Libro';
    }
  });

  dom.printShorashimBtn.addEventListener('click', () => {
    saveShorashimFromInputs();
    renderShorashimBooklet();
    window.print();
  });

  document.getElementById('export-pdf-shorashim-btn')?.addEventListener('click', () => {
    saveShorashimFromInputs();
    renderShorashimBooklet();
    exportShorashimToPDF();
  });

  document.getElementById('export-ics-btn')?.addEventListener('click', async () => {
    const members = await getMembers();
    const events = await getEvents();
    exportRemindersToICS(members, events);
  });

  document.getElementById('tree-view-d3-btn')?.addEventListener('click', () => {
    document.getElementById('d3-tree-wrapper').style.display = 'block';
    document.getElementById('classic-tree-wrapper').style.display = 'none';
    document.getElementById('tree-view-d3-btn').classList.add('active');
    document.getElementById('tree-view-classic-btn').classList.remove('active');
  });

  document.getElementById('tree-view-classic-btn')?.addEventListener('click', () => {
    document.getElementById('d3-tree-wrapper').style.display = 'none';
    document.getElementById('classic-tree-wrapper').style.display = 'block';
    document.getElementById('tree-view-classic-btn').classList.add('active');
    document.getElementById('tree-view-d3-btn').classList.remove('active');
  });

  dom.wizardSteps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      goToWizardStep(stepNum);
    });
  });

  dom.wizardPrevBtn.addEventListener('click', () => {
    if (currentShorashimStep > 1) {
      goToWizardStep(currentShorashimStep - 1);
    }
  });

  dom.wizardNextBtn.addEventListener('click', () => {
    if (currentShorashimStep < 4) {
      goToWizardStep(currentShorashimStep + 1);
    } else {
      dom.shorashimToggleViewBtn.click();
    }
  });

  const shInputs = [
    dom.shChildName, dom.shChildHebName, dom.shChildNamedAfter, dom.shChildBio,
    dom.shParentsStory, dom.shSiblingsInfo, dom.shGrandparentsStory,
    dom.shTraditionsShabat, dom.shRecipes, dom.shObjects
  ];
  shInputs.forEach(input => {
    input.addEventListener('change', () => {
      saveShorashimFromInputs();
    });
  });

  // Buscador Genealógico
  dom.searchMyHeritageBtn.addEventListener('click', () => launchGenealogySearch('myheritage'));
  dom.searchGeniBtn.addEventListener('click', () => launchGenealogySearch('geni'));
  dom.searchFamilySearchBtn.addEventListener('click', () => launchGenealogySearch('familysearch'));

  // Brajot
  dom.brajotCategoryPills.forEach(pill => {
    pill.addEventListener('click', async () => {
      dom.brajotCategoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const events = await getEvents();
      renderBrajot(events, pill.getAttribute('data-category'));
    });
  });

  // MODAL VINCULAR BRAJÁ
  dom.closeLinkBrajaBtn.addEventListener('click', () => closeModal(dom.modalLinkBraja));
  dom.cancelLinkBrajaBtn.addEventListener('click', () => closeModal(dom.modalLinkBraja));

  dom.linkBrajaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const eventId = dom.linkBrajaEventSelect.value;
    const brajaId = dom.linkBrajaIdInput.value;

    if (!eventId || !brajaId) return;

    const events = await getEvents();
    const event = events.find(ev => ev.id === eventId);
    
    if (event) {
      if (!event.linkedBlessings) event.linkedBlessings = [];
      if (!event.linkedBlessings.includes(brajaId)) {
        event.linkedBlessings.push(brajaId);
        await saveEvent(event);
        showToast('Bendición vinculada con éxito');
      } else {
        showToast('Ya está vinculada a este acontecimiento');
      }
    }
    
    closeModal(dom.modalLinkBraja);
    await updateAllViews();
  });

  // MODAL SLIDESHOW
  dom.closeSlideshowBtn.addEventListener('click', () => closeModal(dom.modalSlideshow));
  dom.slideshowPrevBtn.addEventListener('click', () => navigateSlideshow(-1));
  dom.slideshowNextBtn.addEventListener('click', () => navigateSlideshow(1));

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeModal(e.target);
    }
  });
}

// --- Operaciones de Modales ---
function openModal(modalEl) {
  modalEl.classList.add('show');
}

function closeModal(modalEl) {
  modalEl.classList.remove('show');
}

function showToast(message) {
  dom.toastMessage.innerText = message;
  dom.toast.classList.add('show');
  setTimeout(() => {
    dom.toast.classList.remove('show');
  }, 3000);
}

// --- RENDERIZADORES ---

function renderTimeline(events, members) {
  dom.timelineContainer.innerHTML = '';
  
  if (events.length === 0) {
    dom.timelineContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 60px 20px;">
        <i class="fa-solid fa-hourglass-empty" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 20px;"></i>
        <h3>No hay acontecimientos registrados</h3>
        <p style="color: var(--text-secondary); margin-top: 10px; max-width: 450px; margin-left: auto; margin-right: auto;">
          Comienza a armar el diario familiar agregando nacimientos, Bar Mitzvás, bodas u otros momentos comunitarios importantes.
        </p>
      </div>
    `;
    return;
  }

  const membersMap = {};
  members.forEach(m => { membersMap[m.id] = m; });

  events.forEach(event => {
    const card = document.createElement('article');
    card.className = 'card timeline-card';

    const visualMedia = (event.media || []).find((item) => item.type === 'image' || item.type === 'video');
    const audioMedia = (event.media || []).find((item) => item.type === 'audio' && item.blob instanceof Blob);
    let mediaSrc = '';
    let isVideo = false;
    let isAudio = false;

    if (visualMedia && visualMedia.blob instanceof Blob) {
      mediaSrc = URL.createObjectURL(visualMedia.blob);
      isVideo = visualMedia.type === 'video';
    } else if (event.imageUrl) {
      mediaSrc = sanitizeUrl(event.imageUrl, '');
    } else if (audioMedia) {
      mediaSrc = URL.createObjectURL(audioMedia.blob);
      isAudio = true;
    }

    const safeMediaSrc = escapeHtml(mediaSrc);
    const mediaHtml = isAudio
      ? `<div class="timeline-card-media timeline-card-media-audio">
          <i class="fa-solid fa-microphone"></i>
          <audio src="${safeMediaSrc}" controls></audio>
         </div>`
      : isVideo
      ? `<div class="timeline-card-media">
          <video src="${safeMediaSrc}"></video>
          <div class="media-play-overlay"><i class="fa-solid fa-circle-play"></i></div>
         </div>`
      : mediaSrc
      ? `<div class="timeline-card-media">
          <img src="${safeMediaSrc}" alt="${escapeHtml(event.title)}" loading="lazy">
         </div>`
      : '';

    let taggedHtml = '';
    if (event.taggedMembers && event.taggedMembers.length > 0) {
      taggedHtml = '<div class="tagged-members-avatars">';
      event.taggedMembers.forEach(mId => {
        const m = membersMap[mId];
        if (m) {
          const avatarUrl = escapeHtml(memberAvatarSrc(m));
          taggedHtml += `<img src="${avatarUrl}" class="tagged-avatar" alt="${escapeHtml(m.name)}" title="${escapeHtml(m.name)} (${escapeHtml(m.relationship)})">`;
        }
      });
      taggedHtml += '</div>';
    }

    let blessingsHtml = '';
    if (event.linkedBlessings && event.linkedBlessings.length > 0) {
      event.linkedBlessings.forEach(bId => {
        const braja = BRAJOT_DATABASE.find(b => b.id === bId);
        if (braja) {
          blessingsHtml += `
            <div class="card-linked-blessing">
              <div class="blessing-title"><i class="fa-solid fa-scroll"></i> ${escapeHtml(braja.title)}</div>
              <div class="blessing-hebrew">${escapeHtml(braja.hebrew)}</div>
              <div class="blessing-trans">${escapeHtml(braja.transliteration)}</div>
            </div>
          `;
        }
      });
    }

    card.innerHTML = `
      ${mediaHtml}
      <div class="timeline-card-content">
        <div>
          <span class="timeline-card-category">${escapeHtml(event.category)}</span>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h3 class="timeline-card-title">${escapeHtml(event.title)}</h3>
            <div class="no-print" style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-icon-only edit-event-btn" data-id="${escapeHtml(event.id)}" title="Editar" style="padding: 6px 10px;"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-secondary btn-icon-only delete-event-btn" data-id="${escapeHtml(event.id)}" title="Eliminar" style="padding: 6px 10px; color: #DC2626;"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
          <div class="timeline-card-date">
            <span><i class="fa-solid fa-calendar-day"></i> ${escapeHtml(event.date)}</span>
            ${event.hebrewDate ? `<span class="heb-date"><i class="fa-solid fa-star-of-david"></i> ${escapeHtml(event.hebrewDate)}</span>` : ''}
            ${event.location ? `<span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(event.location)}</span>` : ''}
          </div>
          <p class="timeline-card-body">${escapeHtml(event.description)}</p>
          ${blessingsHtml}
        </div>
        <div class="timeline-card-footer">
          <span style="font-size: 0.8rem; color: var(--text-secondary);">Familiares:</span>
          ${taggedHtml}
        </div>
      </div>
    `;

    const mediaContainer = card.querySelector('.timeline-card-media');
    if (mediaContainer && !isAudio) {
      mediaContainer.addEventListener('click', () => {
        openSlideshowFromEvent(event);
      });
    }

    card.querySelector('.edit-event-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      openEditEventModal(event);
    });

    card.querySelector('.delete-event-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      handleDeleteEvent(event.id);
    });

    dom.timelineContainer.appendChild(card);
  });
}

function filterAndRenderTimeline(events, members) {
  const query = dom.searchEventsInput.value.toLowerCase();
  const selectedMember = dom.filterMemberSelect.value;
  const activePill = document.querySelector('#category-pills-container .category-pill.active');
  const selectedCategory = activePill ? activePill.getAttribute('data-category') : 'all';

  const filteredEvents = events.filter(e => {
    const matchesQuery = e.title.toLowerCase().includes(query) || 
                         e.description.toLowerCase().includes(query) || 
                         (e.location && e.location.toLowerCase().includes(query));
    
    const matchesMember = !selectedMember || (e.taggedMembers && e.taggedMembers.includes(selectedMember));
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;

    return matchesQuery && matchesMember && matchesCategory;
  });

  renderTimeline(filteredEvents, members);
}

function populateFilterMemberSelect(members) {
  const currentVal = dom.filterMemberSelect.value;
  dom.filterMemberSelect.replaceChildren();
  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = 'Todos los familiares';
  dom.filterMemberSelect.appendChild(allOption);
  members.forEach(m => {
    const option = document.createElement('option');
    option.value = m.id;
    option.textContent = `${m.name} (${m.relationship})`;
    dom.filterMemberSelect.appendChild(option);
  });
  dom.filterMemberSelect.value = currentVal;
}

function populateTaggedMembersCheckboxes(members) {
  dom.eventTaggedCheckboxes.replaceChildren();
  members.forEach(m => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '8px';
    label.style.fontSize = '0.85rem';
    label.style.cursor = 'pointer';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = m.id;

    const span = document.createElement('span');
    span.textContent = `${m.name} (${m.relationship})`;

    label.append(input, span);
    dom.eventTaggedCheckboxes.appendChild(label);
  });
}

function openEditEventModal(event) {
  dom.eventIdInput.value = event.id;
  dom.eventTitleInput.value = event.title;
  dom.eventCategoryInput.value = event.category;
  dom.eventDateInput.value = event.date;
  dom.eventHebDateInput.value = event.hebrewDate || '';
  dom.eventLocationInput.value = event.location || '';
  dom.eventDescInput.value = event.description;
  
  dom.eventPhotoInput.value = '';
  dom.eventVideoInput.value = '';

  dom.eventTaggedCheckboxes.querySelectorAll('input').forEach(cb => {
    cb.checked = event.taggedMembers && event.taggedMembers.includes(cb.value);
  });

  if (dom.eventModalTitle) dom.eventModalTitle.innerText = 'Editar Recuerdo';
  resetAudioRecorderUI();
  const existingAudio = (event.media || []).find((item) => item.type === 'audio' && item.blob instanceof Blob);
  if (existingAudio) {
    showExistingAudioPreview(existingAudio.blob);
  }
  openModal(dom.modalAddEvent);
}

async function handleDeleteEvent(id) {
  if (confirm('¿Desea eliminar este recuerdo de la línea de tiempo?')) {
    await deleteEvent(id);
    showToast('Acontecimiento eliminado');
    await updateAllViews();
  }
}

function renderGallery(events) {
  dom.galleryContainer.innerHTML = '';
  slideshowMediaList = [];

  let count = 0;
  events.forEach(event => {
    if (event.media && event.media.length > 0) {
      event.media.forEach(item => {
        let mediaSrc = '';
        if (item.blob && item.blob instanceof Blob) {
          mediaSrc = URL.createObjectURL(item.blob);
        } else {
          return;
        }

        slideshowMediaList.push({
          title: event.title,
          desc: event.description,
          url: mediaSrc,
          type: item.type
        });

        const gridItem = document.createElement('div');
        gridItem.className = 'gallery-item';
        gridItem.setAttribute('data-index', count);

        const innerHtml = item.type === 'video'
          ? `<video src="${escapeHtml(mediaSrc)}"></video>
             <div class="gallery-overlay">
               <h4>${escapeHtml(event.title)}</h4>
               <span><i class="fa-solid fa-circle-play"></i> Video</span>
             </div>`
          : item.type === 'audio'
          ? `<div class="gallery-audio-tile"><i class="fa-solid fa-microphone"></i></div>
             <div class="gallery-overlay">
               <h4>${escapeHtml(event.title)}</h4>
               <span><i class="fa-solid fa-microphone"></i> Historia oral</span>
             </div>`
          : `<img src="${escapeHtml(mediaSrc)}" alt="${escapeHtml(event.title)}" loading="lazy">
             <div class="gallery-overlay">
               <h4>${escapeHtml(event.title)}</h4>
               <span><i class="fa-solid fa-camera"></i> Foto</span>
             </div>`;

        gridItem.innerHTML = innerHtml;
        
        const indexCaptured = count;
        gridItem.addEventListener('click', () => {
          openSlideshow(indexCaptured);
        });

        dom.galleryContainer.appendChild(gridItem);
        count++;
      });
    } else if (event.imageUrl) {
      const safeImageUrl = sanitizeUrl(event.imageUrl, PLACEHOLDER_EVENT_IMAGE);
      slideshowMediaList.push({
        title: event.title,
        desc: event.description,
        url: safeImageUrl,
        type: 'image'
      });

      const gridItem = document.createElement('div');
      gridItem.className = 'gallery-item';
      gridItem.setAttribute('data-index', count);
      gridItem.innerHTML = `
        <img src="${escapeHtml(safeImageUrl)}" alt="${escapeHtml(event.title)}" loading="lazy">
        <div class="gallery-overlay">
          <h4>${escapeHtml(event.title)}</h4>
          <span><i class="fa-solid fa-camera"></i> Foto</span>
        </div>
      `;

      const indexCaptured = count;
      gridItem.addEventListener('click', () => {
        openSlideshow(indexCaptured);
      });

      dom.galleryContainer.appendChild(gridItem);
      count++;
    }
  });

  if (slideshowMediaList.length === 0) {
    dom.galleryContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
        <i class="fa-solid fa-images" style="font-size: 2.5rem; margin-bottom: 12px; color: var(--accent-color);"></i>
        <p>No se han cargado fotos ni videos en el diario familiar.</p>
      </div>
    `;
  }
}

function renderFamily(members) {
  dom.familyMembersContainer.innerHTML = '';
  
  if (members.length === 0) {
    dom.familyMembersContainer.innerHTML = '<p style="color: var(--text-secondary);">No hay familiares registrados.</p>';
    dom.treeLevelGrandparents.innerHTML = '';
    dom.treeLevelParents.innerHTML = '';
    dom.treeLevelChildren.innerHTML = '';
    return;
  }

  dom.treeLevelGrandparents.innerHTML = '';
  dom.treeLevelParents.innerHTML = '';
  dom.treeLevelChildren.innerHTML = '';

  members.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card member-card';
    
    const avatarUrl = memberAvatarSrc(m);

    card.innerHTML = `
      <img src="${escapeHtml(avatarUrl)}" class="member-card-avatar" alt="${escapeHtml(m.name)}">
      <div class="member-card-details">
        <h4 class="member-card-name">${escapeHtml(m.name)}</h4>
        ${m.hebrewName ? `<p class="member-card-hebrew">${escapeHtml(m.hebrewName)}</p>` : ''}
        <span class="member-card-relation">${escapeHtml(m.relationship)}</span>
        <p class="member-card-birthday"><i class="fa-solid fa-cake-candles"></i> Nac: ${escapeHtml(m.birthDate)}</p>
        ${m.hebrewBirthDate ? `<p class="member-card-birthday" style="color: var(--accent-color);"><i class="fa-solid fa-star-of-david"></i> ${escapeHtml(m.hebrewBirthDate)}</p>` : ''}
      </div>
      <div class="no-print" style="display: flex; flex-direction: column; gap: 8px;">
        <button class="btn btn-secondary edit-member-btn" data-id="${escapeHtml(m.id)}" style="padding: 6px 10px;"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-secondary delete-member-btn" data-id="${escapeHtml(m.id)}" style="padding: 6px 10px; color: #DC2626;"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;

    card.querySelector('.edit-member-btn').addEventListener('click', () => {
      openEditMemberModal(m);
    });

    card.querySelector('.delete-member-btn').addEventListener('click', () => {
      handleDeleteMember(m.id);
    });

    dom.familyMembersContainer.appendChild(card);

    const treeNode = document.createElement('div');
    treeNode.className = 'tree-node';
    treeNode.innerHTML = `
      <img src="${escapeHtml(avatarUrl)}" class="tree-node-avatar" alt="${escapeHtml(m.name)}">
      <span class="tree-node-relation">${escapeHtml(m.relationship)}</span>
      <h4 class="tree-node-name">${escapeHtml((m.name || '').split(' ')[0])}</h4>
      ${m.hebrewName ? `<span class="tree-node-hebrew">${escapeHtml(m.hebrewName.split(' ben ')[0].split(' bat ')[0])}</span>` : ''}
    `;

    treeNode.addEventListener('click', () => {
      openEditMemberModal(m);
    });

    if (m.relationship.includes('Abuel')) {
      dom.treeLevelGrandparents.appendChild(treeNode);
    } else if (m.relationship.includes('Padre') || m.relationship.includes('Madre') || m.relationship.includes('Tío')) {
      dom.treeLevelParents.appendChild(treeNode);
    } else {
      dom.treeLevelChildren.appendChild(treeNode);
    }
  });

  const checkEmptyLevel = (el, label) => {
    if (el.children.length === 0) {
      el.innerHTML = `<div style="color: var(--text-secondary); font-size: 0.85rem; padding: 20px; border: 1px dashed var(--border-color); border-radius: 8px;">No hay registrados (${label})</div>`;
    }
  };
  checkEmptyLevel(dom.treeLevelGrandparents, 'Abuelos');
  checkEmptyLevel(dom.treeLevelParents, 'Padres / Tíos');
  checkEmptyLevel(dom.treeLevelChildren, 'Hijos / Primos');
}

function openEditMemberModal(m) {
  dom.memberIdInput.value = m.id;
  dom.memberNameInput.value = m.name;
  dom.memberHebNameInput.value = m.hebrewName || '';
  dom.memberRelationInput.value = m.relationship;
  dom.memberBirthInput.value = m.birthDate;
  dom.memberHebBirthInput.value = m.hebrewBirthDate || '';
  dom.memberPhotoInput.value = '';

  if (dom.memberModalTitle) dom.memberModalTitle.innerText = 'Editar Familiar';
  openModal(dom.modalAddMember);
}

async function handleDeleteMember(id) {
  if (confirm('¿Desea eliminar a este familiar? Se quitará también del árbol genealógico.')) {
    await deleteMember(id);
    showToast('Familiar eliminado');
    await updateAllViews();
  }
}

async function renderShorashim() {
  const project = await getShorashimProject();
  if (project) {
    dom.shChildName.value = project.childName || '';
    dom.shChildHebName.value = project.childHebName || '';
    dom.shChildNamedAfter.value = project.childNamedAfter || '';
    dom.shChildBio.value = project.childBio || '';
    dom.shParentsStory.value = project.parentsStory || '';
    dom.shSiblingsInfo.value = project.siblingsInfo || '';
    dom.shGrandparentsStory.value = project.grandparentsStory || '';
    dom.shTraditionsShabat.value = project.traditionsShabat || '';
    dom.shRecipes.value = project.recipes || '';
    dom.shObjects.value = project.objects || '';
  }
}

async function saveShorashimFromInputs() {
  const projectData = {
    childName: dom.shChildName.value,
    childHebName: dom.shChildHebName.value,
    childNamedAfter: dom.shChildNamedAfter.value,
    childBio: dom.shChildBio.value,
    parentsStory: dom.shParentsStory.value,
    siblingsInfo: dom.shSiblingsInfo.value,
    grandparentsStory: dom.shGrandparentsStory.value,
    traditionsShabat: dom.shTraditionsShabat.value,
    recipes: dom.shRecipes.value,
    objects: dom.shObjects.value
  };

  await saveShorashimProject(projectData);
}

function goToWizardStep(stepNum) {
  currentShorashimStep = stepNum;

  dom.wizardSteps.forEach(step => {
    const sNum = parseInt(step.getAttribute('data-step'));
    if (sNum === stepNum) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });

  dom.wizardStepContents.forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(`step-content-${stepNum}`).classList.add('active');

  dom.wizardPrevBtn.disabled = stepNum === 1;
  dom.wizardNextBtn.innerText = stepNum === 4 ? 'Vista Previa Libro' : 'Siguiente';
}

function renderShorashimBooklet() {
  document.getElementById('print-child-name-cover').innerText = `Presentado por: ${dom.shChildName.value || '______'}`;
  document.getElementById('print-child-name').innerText = dom.shChildName.value || '______';
  document.getElementById('print-child-heb-name').innerText = dom.shChildHebName.value || '______';
  
  document.getElementById('print-child-named-after').innerText = dom.shChildNamedAfter.value || 'Sin información cargada.';
  document.getElementById('print-child-bio').innerText = dom.shChildBio.value || 'Sin información cargada.';
  document.getElementById('print-parents-story').innerText = dom.shParentsStory.value || 'Sin información cargada.';
  document.getElementById('print-siblings-info').innerText = dom.shSiblingsInfo.value || '';
  document.getElementById('print-grandparents-story').innerText = dom.shGrandparentsStory.value || 'Sin información cargada.';
  document.getElementById('print-traditions-shabat').innerText = dom.shTraditionsShabat.value || 'Sin información cargada.';
  document.getElementById('print-recipes').innerText = dom.shRecipes.value || 'Sin información cargada.';
  document.getElementById('print-objects').innerText = dom.shObjects.value || 'Sin información cargada.';
}

function launchGenealogySearch(site) {
  const name = dom.genSearchName.value.trim();
  const year = dom.genSearchYear.value.trim();
  const country = dom.genSearchCountry.value.trim();

  if (!name) {
    alert('Ingrese al menos el nombre de su antepasado para buscar.');
    return;
  }

  let siteQuery = '';
  if (site === 'myheritage') siteQuery = 'site:myheritage.es';
  else if (site === 'geni') siteQuery = 'site:geni.com';
  else if (site === 'familysearch') siteQuery = 'site:familysearch.org';

  let query = `${siteQuery} "${name}"`;
  if (year) query += ` ${year}`;
  if (country) query += ` "${country}"`;

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(searchUrl, '_blank');
}

function renderBrajot(events, filterCategory = 'all') {
  dom.brajotContainer.innerHTML = '';

  const filteredBrajot = filterCategory === 'all'
    ? BRAJOT_DATABASE
    : BRAJOT_DATABASE.filter(b => b.category === filterCategory);

  filteredBrajot.forEach(braja => {
    const card = document.createElement('article');
    card.className = 'card braja-card';
    card.innerHTML = `
      <div>
        <div class="braja-card-header">
          <span class="braja-category-tag">${escapeHtml(braja.category)}</span>
          <button class="btn btn-secondary btn-icon-only copy-braja-btn" title="Copiar texto" style="padding: 6px 10px;"><i class="fa-solid fa-copy"></i></button>
        </div>
        <h3>${escapeHtml(braja.title)}</h3>
        <div class="braja-hebrew font-hebrew-title">${escapeHtml(braja.hebrew)}</div>
        <p class="braja-transliteration"><strong>Fonetica:</strong> ${escapeHtml(braja.transliteration)}</p>
        <p class="braja-translation"><strong>Traduccion:</strong> ${escapeHtml(braja.translation)}</p>
      </div>
      <div>
        <p class="braja-desc">${escapeHtml(braja.description)}</p>
        <div class="braja-actions no-print">
          <button class="btn btn-primary btn-sm link-braja-btn" style="width: 100%; margin-top: 12px;">
            <i class="fa-solid fa-link"></i> Vincular a un Recuerdo
          </button>
        </div>
      </div>
    `;

    card.querySelector('.copy-braja-btn').addEventListener('click', () => {
      const textToCopy = `${braja.title}\n\nHebreo:\n${braja.hebrew}\n\nFonetica:\n${braja.transliteration}\n\nTraduccion:\n${braja.translation}`;
      navigator.clipboard.writeText(textToCopy);
      showToast('Bendición copiada al portapapeles');
    });

    card.querySelector('.link-braja-btn').addEventListener('click', () => {
      openLinkBrajaModal(braja, events);
    });

    dom.brajotContainer.appendChild(card);
  });
}

function openLinkBrajaModal(braja, events) {
  dom.linkBrajaIdInput.value = braja.id;
  dom.linkBrajaTitleDisplay.innerText = braja.title;
  
  dom.linkBrajaEventSelect.replaceChildren();
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Selecciona un evento...';
  dom.linkBrajaEventSelect.appendChild(placeholder);
  events.forEach(e => {
    const option = document.createElement('option');
    option.value = e.id;
    option.textContent = `${e.title} (${e.date})`;
    dom.linkBrajaEventSelect.appendChild(option);
  });

  openModal(dom.modalLinkBraja);
}

function renderReminders(members, events) {
  dom.birthdayContainer.innerHTML = '';
  dom.yahrtzeitContainer.innerHTML = '';

  if (members.length === 0) {
    dom.birthdayContainer.innerHTML = '<p style="color: var(--text-secondary);">No hay familiares registrados.</p>';
    dom.yahrtzeitContainer.innerHTML = '<p style="color: var(--text-secondary);">No hay familiares registrados.</p>';
    return;
  }

  const sortedBirthdays = [...members].sort((a, b) => {
    const dateA = new Date(a.birthDate);
    const dateB = new Date(b.birthDate);
    return (dateA.getMonth() - dateB.getMonth()) || (dateA.getDate() - dateB.getDate());
  });

  sortedBirthdays.forEach(m => {
    const birth = new Date(m.birthDate);
    const month = birth.toLocaleString('es-ES', { month: 'short' });
    const day = birth.getDate();

    const item = document.createElement('div');
    item.className = 'reminder-item';
    item.innerHTML = `
      <div class="reminder-date-badge">
        ${escapeHtml(day)}
        <span>${escapeHtml(month)}</span>
      </div>
      <div class="reminder-info">
        <h4 class="reminder-title">Cumpleaños de ${escapeHtml(m.name)}</h4>
        <p class="reminder-desc">
          Parentesco: <strong>${escapeHtml(m.relationship)}</strong> | Nac: ${escapeHtml(m.birthDate)}
          ${m.hebrewBirthDate ? `<br>Hebreo: <span class="heb">${escapeHtml(m.hebrewBirthDate)}</span>` : ''}
        </p>
      </div>
    `;
    dom.birthdayContainer.appendChild(item);
  });

  const yahrtzeitEvents = events.filter(e => e.category === 'Yahrtzeit / Sepelio');

  if (yahrtzeitEvents.length === 0) {
    dom.yahrtzeitContainer.innerHTML = `
      <div style="text-align: center; padding: 20px; color: var(--text-secondary);">
        <i class="fa-regular fa-lightbulb" style="font-size: 1.5rem; margin-bottom: 8px;"></i>
        <p>No se han registrado aniversarios de Yahrtzeit (Sepelios/Memoriales).</p>
      </div>
    `;
    return;
  }

  yahrtzeitEvents.forEach(e => {
    const date = new Date(e.date);
    const month = date.toLocaleString('es-ES', { month: 'short' });
    const day = date.getDate();

    const item = document.createElement('div');
    item.className = 'reminder-item';
    item.style.borderLeftColor = 'var(--text-secondary)';
    item.innerHTML = `
      <div class="reminder-date-badge" style="color: var(--text-secondary);">
        ${escapeHtml(day)}
        <span>${escapeHtml(month)}</span>
      </div>
      <div class="reminder-info">
        <h4 class="reminder-title">${escapeHtml(e.title)}</h4>
        <p class="reminder-desc">
          Gregoriano: <strong>${escapeHtml(e.date)}</strong> | Lugar: ${escapeHtml(e.location || 'No indicado')}
          ${e.hebrewDate ? `<br>Hebreo (Yahrtzeit anual): <span class="heb">${escapeHtml(e.hebrewDate)}</span>` : ''}
        </p>
      </div>
    `;
    dom.yahrtzeitContainer.appendChild(item);
  });
}

function openSlideshowFromEvent(event) {
  const firstMedia = (event.media || []).find((item) => item.type === 'image' || item.type === 'video' || item.type === 'audio');
  let searchUrl = '';

  if (firstMedia && firstMedia.blob) {
    searchUrl = URL.createObjectURL(firstMedia.blob);
  } else if (event.imageUrl) {
    searchUrl = event.imageUrl;
  } else {
    return;
  }

  const idx = slideshowMediaList.findIndex(item => item.url === searchUrl || item.url === event.imageUrl);
  if (idx !== -1) {
    openSlideshow(idx);
  }
}

function openSlideshow(index) {
  currentSlideshowIndex = index;
  renderSlideshowContent();
  openModal(dom.modalSlideshow);
}

function renderSlideshowContent() {
  const item = slideshowMediaList[currentSlideshowIndex];
  if (!item) return;

  dom.slideshowMediaContainer.innerHTML = '';
  
  const safeSrc = item.url && String(item.url).startsWith('blob:')
    ? item.url
    : sanitizeUrl(item.url, PLACEHOLDER_EVENT_IMAGE);

  if (item.type === 'video') {
    const video = document.createElement('video');
    video.src = safeSrc;
    video.controls = true;
    video.autoplay = true;
    video.className = 'slideshow-media';
    dom.slideshowMediaContainer.appendChild(video);
  } else if (item.type === 'audio') {
    const audio = document.createElement('audio');
    audio.src = safeSrc;
    audio.controls = true;
    audio.autoplay = true;
    audio.className = 'slideshow-media';
    dom.slideshowMediaContainer.appendChild(audio);
  } else {
    const img = document.createElement('img');
    img.src = safeSrc;
    img.className = 'slideshow-media';
    img.alt = item.title;
    dom.slideshowMediaContainer.appendChild(img);
  }

  dom.slideshowCaptionTitle.innerText = item.title;
  dom.slideshowCaptionDesc.innerText = item.desc;
}

function navigateSlideshow(direction) {
  currentSlideshowIndex += direction;
  if (currentSlideshowIndex >= slideshowMediaList.length) {
    currentSlideshowIndex = 0;
  } else if (currentSlideshowIndex < 0) {
    currentSlideshowIndex = slideshowMediaList.length - 1;
  }
  renderSlideshowContent();
}

// ==========================================================================
// NUEVAS FUNCIONALIDADES AVANZADAS
// ==========================================================================

// 1. Compresión de Imágenes en Cliente
async function compressImage(file, maxWidth = 1600, maxHeight = 1600, quality = 0.82) {
  if (!file || !file.type || !file.type.startsWith('image/')) return file;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          resolve(blob || file);
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

// 2. Grabadora de Historias Orales (Audio Recorder)
let mediaRecorder = null;
let audioChunks = [];
let audioTimerInterval = null;
let recordedAudioBlob = null;

function getAudioRecorderEls() {
  return {
    recordBtn: document.getElementById('event-record-audio-btn'),
    stopBtn: document.getElementById('event-stop-audio-btn'),
    timerSpan: document.getElementById('event-audio-timer'),
    statusSpan: document.getElementById('event-audio-status'),
    playerContainer: document.getElementById('event-audio-preview-container'),
    audioPlayer: document.getElementById('event-audio-player')
  };
}

function resetAudioRecorderUI() {
  recordedAudioBlob = null;
  audioChunks = [];
  clearInterval(audioTimerInterval);
  const { recordBtn, stopBtn, timerSpan, statusSpan, playerContainer, audioPlayer } = getAudioRecorderEls();
  if (recordBtn) {
    recordBtn.disabled = false;
    recordBtn.classList.remove('recording-active');
  }
  if (stopBtn) stopBtn.disabled = true;
  if (timerSpan) timerSpan.innerText = '00:00';
  if (statusSpan) statusSpan.innerText = '';
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
    audioPlayer.load();
  }
  if (playerContainer) playerContainer.style.display = 'none';
}

function showExistingAudioPreview(blob) {
  const { playerContainer, audioPlayer, statusSpan } = getAudioRecorderEls();
  if (!blob || !audioPlayer) return;
  audioPlayer.src = URL.createObjectURL(blob);
  if (playerContainer) playerContainer.style.display = 'block';
  if (statusSpan) statusSpan.innerText = 'Historia oral ya guardada. Grabe de nuevo para reemplazarla.';
}

function setupAudioRecorder() {
  const { recordBtn, stopBtn, timerSpan, statusSpan, playerContainer, audioPlayer } = getAudioRecorderEls();

  if (!recordBtn || !stopBtn) return;

  recordBtn.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        recordedAudioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType || 'audio/webm' });
        const audioUrl = URL.createObjectURL(recordedAudioBlob);
        audioPlayer.src = audioUrl;
        playerContainer.style.display = 'block';
        statusSpan.innerText = '✓ Audio grabado listo para guardar';
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000);
      recordBtn.disabled = true;
      recordBtn.classList.add('recording-active');
      stopBtn.disabled = false;
      statusSpan.innerText = '🔴 Grabando historia oral...';

      let seconds = 0;
      clearInterval(audioTimerInterval);
      audioTimerInterval = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timerSpan.innerText = `${mins}:${secs}`;
      }, 1000);
    } catch (err) {
      alert('Permiso de micrófono requerido para grabar audio: ' + err.message);
    }
  });

  stopBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      clearInterval(audioTimerInterval);
      recordBtn.disabled = false;
      recordBtn.classList.remove('recording-active');
      stopBtn.disabled = true;
    }
  });
}

// 3. Exportación del Libro de Shorashim en PDF
function exportShorashimToPDF() {
  const booklet = document.getElementById('shorashim-booklet-preview');
  if (!booklet || typeof html2pdf === 'undefined') {
    showToast('Generador de PDF no disponible');
    return;
  }
  showToast('Generando libro de Shorashim en PDF...');

  const opt = {
    margin: [10, 10, 10, 10],
    filename: `libro_shorashim_dorldor_${new Date().toISOString().slice(0,10)}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(booklet).save().then(() => {
    showToast('PDF generado e iniciado la descarga');
  }).catch(err => {
    console.error(err);
    showToast('Error al exportar PDF');
  });
}

// 4. Mapa Interactivo de Migración Familiar (Leaflet)
let leafletMap = null;

function renderMigrationMap() {
  const mapContainer = document.getElementById('migration-map');
  if (!mapContainer) return;

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  mapContainer.replaceChildren();
  const empty = document.createElement('div');
  empty.className = 'empty-migration-map';
  empty.innerHTML = '<p>No hay rutas de migración registradas. El mapa permanece vacío hasta que se documenten lugares reales de la familia.</p>';
  mapContainer.appendChild(empty);
}

// 5. Árbol Genealógico Interactivo D3.js SVG
function buildFamilyTreeData(members) {
  const unused = [...members];
  const take = (predicate) => {
    const matched = [];
    for (let i = unused.length - 1; i >= 0; i--) {
      if (predicate(unused[i])) matched.unshift(unused.splice(i, 1)[0]);
    }
    return matched;
  };
  const toNode = (member) => ({
    name: member.name,
    hebrewName: member.hebrewName || '',
    relationship: member.relationship || '',
    children: []
  });
  const generation = (label, people) => {
    if (!people.length) return [];
    return [{
      name: label,
      relationship: '',
      hebrewName: '',
      children: people.map(toNode)
    }];
  };

  const grandparents = take((m) => /abuel/i.test(m.relationship || ''));
  const parents = take((m) => /padre|madre|t[ií]o/i.test(m.relationship || ''));
  const children = take((m) => /hijo|hija|prim/i.test(m.relationship || ''));

  return {
    name: 'Familia',
    relationship: '',
    hebrewName: '',
    children: [
      ...generation('Abuelos', grandparents),
      ...generation('Padres', parents),
      ...generation('Hijos', children),
      ...generation('Otros', unused)
    ]
  };
}

function renderD3Tree(members) {
  const svgNode = document.getElementById('d3-tree-svg');
  const emptyEl = document.getElementById('d3-tree-empty');
  if (!svgNode || typeof d3 === 'undefined') return;

  const svgEl = d3.select('#d3-tree-svg');
  svgEl.selectAll('*').remove();

  if (!members || members.length === 0) {
    svgNode.style.display = 'none';
    if (emptyEl) emptyEl.hidden = false;
    return;
  }

  svgNode.style.display = 'block';
  if (emptyEl) emptyEl.hidden = true;

  const width = svgEl.node().clientWidth || 800;
  const height = 520;
  const rootData = buildFamilyTreeData(members);
  const hierarchyRoot = d3.hierarchy(rootData);
  const treeLayout = d3.tree().size([width - 120, height - 140]);
  treeLayout(hierarchyRoot);

  const g = svgEl.append('g').attr('transform', 'translate(60, 60)');

  const zoom = d3.zoom().on('zoom', (event) => {
    g.attr('transform', event.transform);
  });
  svgEl.call(zoom);

  g.selectAll('.d3-link')
    .data(hierarchyRoot.links())
    .enter()
    .append('path')
    .attr('class', 'd3-link')
    .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));

  const node = g.selectAll('.d3-node')
    .data(hierarchyRoot.descendants())
    .enter()
    .append('g')
    .attr('class', 'd3-node')
    .attr('transform', d => `translate(${d.x},${d.y})`);

  node.append('circle').attr('r', 20);

  node.append('text')
    .attr('class', 'd3-node-title')
    .attr('dy', 34)
    .attr('text-anchor', 'middle')
    .text(d => d.data.name);

  node.append('text')
    .attr('class', 'd3-node-sub')
    .attr('dy', 48)
    .attr('text-anchor', 'middle')
    .text(d => `${d.data.relationship}${d.data.hebrewName ? ' (' + d.data.hebrewName + ')' : ''}`);

  document.getElementById('d3-zoom-in')?.addEventListener('click', () => svgEl.transition().call(zoom.scaleBy, 1.3));
  document.getElementById('d3-zoom-out')?.addEventListener('click', () => svgEl.transition().call(zoom.scaleBy, 0.7));
  document.getElementById('d3-zoom-reset')?.addEventListener('click', () => svgEl.transition().call(zoom.transform, d3.zoomIdentity.translate(60, 60)));
}

// 6. Etiquetado de Personas en Fotos (Slideshow Photo Tagging)
let isPhotoTagMode = false;
let photoTagsMap = {};

function setupPhotoTagging(members) {
  const toggleBtn = document.getElementById('toggle-photo-tag-mode-btn');
  const selectorBox = document.getElementById('photo-tag-selector-box');
  const memberSelect = document.getElementById('photo-tag-member-select');
  const saveBtn = document.getElementById('save-photo-tag-btn');

  if (!toggleBtn || !selectorBox) return;

  memberSelect.replaceChildren();
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = 'Selecciona familiar...';
  memberSelect.appendChild(placeholder);
  members.forEach(m => {
    const option = document.createElement('option');
    option.value = m.name;
    option.textContent = `${m.name} (${m.relationship})`;
    memberSelect.appendChild(option);
  });

  toggleBtn.addEventListener('click', () => {
    isPhotoTagMode = !isPhotoTagMode;
    if (isPhotoTagMode) {
      toggleBtn.innerHTML = '<i class="fa-solid fa-check"></i> Modo Etiquetado Activo';
      toggleBtn.style.backgroundColor = 'var(--accent-color)';
      toggleBtn.style.color = '#070B13';
      selectorBox.style.display = 'block';
      showToast('Haz clic en la foto sobre la persona a etiquetar');
    } else {
      toggleBtn.innerHTML = '<i class="fa-solid fa-user-tag"></i> Etiquetar Personas';
      toggleBtn.style.backgroundColor = '';
      toggleBtn.style.color = '';
      selectorBox.style.display = 'none';
    }
  });

  saveBtn.addEventListener('click', () => {
    const selectedMember = memberSelect.value;
    if (selectedMember) {
      showToast(`Etiqueta de ${selectedMember} asignada a la foto`);
      toggleBtn.click();
    }
  });
}

function formatHebcalClock(isoLike) {
  if (typeof isoLike !== 'string' || isoLike.length < 16) return 'no disponible';
  const clock = isoLike.slice(11, 16);
  return /^\d{2}:\d{2}$/.test(clock) ? clock : 'no disponible';
}

function renderZmanimUnavailable(zmanimDisplay, locationText, message) {
  if (locationText) locationText.innerText = message;
  zmanimDisplay.innerHTML = `
    <div class="zmanim-chip">🕯️ <strong>Encendido:</strong> no disponible</div>
    <div class="zmanim-chip">✨ <strong>Havdalá:</strong> no disponible</div>
    <button type="button" class="btn btn-secondary btn-sm" id="retry-zmanim-btn">Reintentar</button>
  `;
  document.getElementById('retry-zmanim-btn')?.addEventListener('click', () => {
    fetchHebcalZmanim();
  });
}

async function fetchHebcalZmanim() {
  const zmanimDisplay = document.getElementById('zmanim-times-display');
  const locationText = document.getElementById('zmanim-location-text');
  if (!zmanimDisplay) return;

  try {
    const response = await fetch('https://www.hebcal.com/zmanim?cfg=json&city=BU&g2h=1');
    if (!response.ok) throw new Error();
    const data = await response.json();
    const candles = formatHebcalClock(data && data.times ? data.times.candles : null);
    const havdalah = formatHebcalClock(data && data.times ? data.times.havdalah : null);
    const unavailable = candles === 'no disponible' || havdalah === 'no disponible';

    if (candles === 'no disponible' && havdalah === 'no disponible') {
      renderZmanimUnavailable(zmanimDisplay, locationText, 'Horarios de Shabat no disponible');
      return;
    }

    if (locationText) locationText.innerText = 'Buenos Aires, Argentina (Hebcal Zmanim)';
    zmanimDisplay.innerHTML = `
      <div class="zmanim-chip">🕯️ <strong>Encendido:</strong> ${escapeHtml(candles)}</div>
      <div class="zmanim-chip">✨ <strong>Havdalá:</strong> ${escapeHtml(havdalah)}</div>
      ${unavailable ? '<button type="button" class="btn btn-secondary btn-sm" id="retry-zmanim-btn">Reintentar</button>' : ''}
    `;
    document.getElementById('retry-zmanim-btn')?.addEventListener('click', () => {
      fetchHebcalZmanim();
    });
  } catch (e) {
    renderZmanimUnavailable(zmanimDisplay, locationText, 'Horarios de Shabat no disponible');
  }
}

function exportRemindersToICS(members, events) {
  let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Dor LDor Family Journal//ES\r\n";

  members.forEach(m => {
    if (m.birthDate) {
      const year = new Date().getFullYear();
      const dt = m.birthDate.replace(/-/g, '');
      icsContent += "BEGIN:VEVENT\r\n";
      icsContent += `SUMMARY:Cumpleaños de ${m.name} (${m.hebrewBirthDate || ''})\r\n`;
      icsContent += `DESCRIPTION:Cumpleaños familiar - ${m.relationship}\r\n`;
      icsContent += `DTSTART;VALUE=DATE:${year}${dt.slice(4)}\r\n`;
      icsContent += "RRULE:FREQ=YEARLY\r\n";
      icsContent += "END:VEVENT\r\n";
    }
  });

  icsContent += "END:VCALENDAR\r\n";

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aniversarios_familia_dorldor.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Archivo de calendario .ics descargado');
}

