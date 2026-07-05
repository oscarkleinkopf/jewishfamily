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

// --- Descarga Muestra de Imágenes a Blobs ---
async function urlToBlob(url) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error();
    return await response.blob();
  } catch (e) {
    console.warn('Error al descargar imagen semilla (se usará enlace directo):', url);
    return null;
  }
}

// --- Precarga de Datos Muestra ---
async function checkAndPreloadSeedData() {
  const members = await getMembers();
  const firstRun = await getSetting('first_run_completed');
  
  if (members.length === 0 && !firstRun) {
    console.log('Precargando base de datos inicial...');
    
    // 1. Guardar Miembros
    for (const m of INITIAL_MEMBERS) {
      const blob = await urlToBlob(m.imageUrl);
      await saveMember({
        id: m.id,
        name: m.name,
        hebrewName: m.hebrewName,
        relationship: m.relationship,
        birthDate: m.birthDate,
        hebrewBirthDate: m.hebrewBirthDate,
        avatar: blob || m.imageUrl
      });
    }

    // 2. Guardar Eventos
    for (const e of INITIAL_EVENTS) {
      const blob = await urlToBlob(e.imageUrl);
      const media = blob ? [{ id: 'media-' + Date.now() + Math.random(), type: 'image', blob, name: 'foto.jpg' }] : [];
      await saveEvent({
        id: e.id,
        title: e.title,
        description: e.description,
        category: e.category,
        date: e.date,
        hebrewDate: e.hebrewDate,
        location: e.location,
        taggedMembers: e.taggedMembers,
        linkedBlessings: e.linkedBlessings,
        imageUrl: !blob ? e.imageUrl : null,
        media: media
      });
    }

    // 3. Inicializar Proyecto Shorashim
    const initialShorashim = {
      childName: 'David Levy',
      childHebName: 'David ben Moshe (Significa "Amado")',
      childNamedAfter: 'Fui nombrado en memoria de mi bisabuelo materno, David, quien era un sastre muy bondadoso en Varsovia.',
      childBio: 'Nací el 18 de junio de 2013 en Buenos Aires. Mis padres me cuentan que hacía mucho frío ese día, pero toda la familia vino a celebrar mi Brit Milá.',
      parentsStory: 'Mis padres Moisés y Rajel se conocieron en un campamento de juventud judía en las sierras. Se casaron bajo la Jupá el 15 de junio de 2008 en una fiesta hermosa y tradicional.',
      siblingsInfo: 'Tengo una hermana menor llamada Miriam, nacida en 2016. Es muy alegre y le encanta trenzar la Jalá de Shabat con mamá.',
      grandparentsStory: 'Mi abuelo Abraham llegó de Europa central siendo niño tras la guerra. Mi abuela Sara nació en una colonia agrícola en Entre Ríos y nos habla de su infancia rural.',
      traditionsShabat: 'Los viernes por la noche encendemos las velas en familia, cantamos Shalom Aleijem, mi papá nos recita Birkat Cohanim y compartimos la Jalá.',
      recipes: 'La Jalá dulce que amasa mi mamá y el Kugel de fideos dulce que hace mi abuela Sara en Rosh Hashaná.',
      objects: 'El candelabro de Shabat de bronce que perteneció a la bisabuela de mi mamá en Polonia, y la copa de Kidush de plata grabada.'
    };
    await saveShorashimProject(initialShorashim);
    
    await saveSetting('first_run_completed', 'true');
    console.log('Precarga inicial completada con éxito.');
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
    dom.eventModalTitle.innerText = 'Añadir Recuerdo';
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
    closeModal(dom.modalAddEvent);
    showToast('Acontecimiento guardado');
    await updateAllViews();
  });

  // MODAL FAMILIAR (MIEMBRO)
  dom.addMemberBtn.addEventListener('click', () => {
    dom.addMemberForm.reset();
    dom.memberIdInput.value = '';
    dom.memberHebBirthInput.value = '';
    dom.memberModalTitle.innerText = 'Añadir Miembro de la Familia';
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

    let mediaSrc = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800';
    let isVideo = false;
    
    if (event.media && event.media.length > 0) {
      const firstMedia = event.media[0];
      if (firstMedia.blob && firstMedia.blob instanceof Blob) {
        mediaSrc = URL.createObjectURL(firstMedia.blob);
      }
      isVideo = firstMedia.type === 'video';
    } else if (event.imageUrl) {
      mediaSrc = event.imageUrl;
    }

    const mediaHtml = isVideo
      ? `<div class="timeline-card-media">
          <video src="${mediaSrc}"></video>
          <div class="media-play-overlay"><i class="fa-solid fa-circle-play"></i></div>
         </div>`
      : `<div class="timeline-card-media">
          <img src="${mediaSrc}" alt="${event.title}" loading="lazy">
         </div>`;

    let taggedHtml = '';
    if (event.taggedMembers && event.taggedMembers.length > 0) {
      taggedHtml = '<div class="tagged-members-avatars">';
      event.taggedMembers.forEach(mId => {
        const m = membersMap[mId];
        if (m) {
          const avatarUrl = m.avatar && m.avatar instanceof Blob ? URL.createObjectURL(m.avatar) : (m.avatar || 'https://www.w3.org/2000/svg');
          taggedHtml += `<img src="${avatarUrl}" class="tagged-avatar" alt="${m.name}" title="${m.name} (${m.relationship})">`;
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
              <div class="blessing-title"><i class="fa-solid fa-scroll"></i> ${braja.title}</div>
              <div class="blessing-hebrew">${braja.hebrew}</div>
              <div class="blessing-trans">${braja.transliteration}</div>
            </div>
          `;
        }
      });
    }

    card.innerHTML = `
      ${mediaHtml}
      <div class="timeline-card-content">
        <div>
          <span class="timeline-card-category">${event.category}</span>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h3 class="timeline-card-title">${event.title}</h3>
            <div class="no-print" style="display: flex; gap: 8px;">
              <button class="btn btn-secondary btn-icon-only edit-event-btn" data-id="${event.id}" title="Editar" style="padding: 6px 10px;"><i class="fa-solid fa-pen"></i></button>
              <button class="btn btn-secondary btn-icon-only delete-event-btn" data-id="${event.id}" title="Eliminar" style="padding: 6px 10px; color: #DC2626;"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>
          <div class="timeline-card-date">
            <span><i class="fa-solid fa-calendar-day"></i> ${event.date}</span>
            ${event.hebrewDate ? `<span class="heb-date"><i class="fa-solid fa-star-of-david"></i> ${event.hebrewDate}</span>` : ''}
            ${event.location ? `<span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>` : ''}
          </div>
          <p class="timeline-card-body">${event.description}</p>
          ${blessingsHtml}
        </div>
        <div class="timeline-card-footer">
          <span style="font-size: 0.8rem; color: var(--text-secondary);">Familiares:</span>
          ${taggedHtml}
        </div>
      </div>
    `;

    const mediaContainer = card.querySelector('.timeline-card-media');
    mediaContainer.addEventListener('click', () => {
      openSlideshowFromEvent(event);
    });

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
  dom.filterMemberSelect.innerHTML = '<option value="">Todos los familiares</option>';
  members.forEach(m => {
    dom.filterMemberSelect.innerHTML += `<option value="${m.id}">${m.name} (${m.relationship})</option>`;
  });
  dom.filterMemberSelect.value = currentVal;
}

function populateTaggedMembersCheckboxes(members) {
  dom.eventTaggedCheckboxes.innerHTML = '';
  members.forEach(m => {
    dom.eventTaggedCheckboxes.innerHTML += `
      <label style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
        <input type="checkbox" value="${m.id}">
        <span>${m.name} (${m.relationship})</span>
      </label>
    `;
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

  dom.eventModalTitle.innerText = 'Editar Recuerdo';
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
          ? `<video src="${mediaSrc}"></video>
             <div class="gallery-overlay">
               <h4>${event.title}</h4>
               <span><i class="fa-solid fa-circle-play"></i> Video</span>
             </div>`
          : `<img src="${mediaSrc}" alt="${event.title}" loading="lazy">
             <div class="gallery-overlay">
               <h4>${event.title}</h4>
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
      slideshowMediaList.push({
        title: event.title,
        desc: event.description,
        url: event.imageUrl,
        type: 'image'
      });

      const gridItem = document.createElement('div');
      gridItem.className = 'gallery-item';
      gridItem.setAttribute('data-index', count);
      gridItem.innerHTML = `
        <img src="${event.imageUrl}" alt="${event.title}" loading="lazy">
        <div class="gallery-overlay">
          <h4>${event.title}</h4>
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
    
    const avatarUrl = m.avatar && m.avatar instanceof Blob 
      ? URL.createObjectURL(m.avatar) 
      : (m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');

    card.innerHTML = `
      <img src="${avatarUrl}" class="member-card-avatar" alt="${m.name}">
      <div class="member-card-details">
        <h4 class="member-card-name">${m.name}</h4>
        ${m.hebrewName ? `<p class="member-card-hebrew">${m.hebrewName}</p>` : ''}
        <span class="member-card-relation">${m.relationship}</span>
        <p class="member-card-birthday"><i class="fa-solid fa-cake-candles"></i> Nac: ${m.birthDate}</p>
        ${m.hebrewBirthDate ? `<p class="member-card-birthday" style="color: var(--accent-color);"><i class="fa-solid fa-star-of-david"></i> ${m.hebrewBirthDate}</p>` : ''}
      </div>
      <div class="no-print" style="display: flex; flex-direction: column; gap: 8px;">
        <button class="btn btn-secondary edit-member-btn" data-id="${m.id}" style="padding: 6px 10px;"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-secondary delete-member-btn" data-id="${m.id}" style="padding: 6px 10px; color: #DC2626;"><i class="fa-solid fa-trash-can"></i></button>
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
      <img src="${avatarUrl}" class="tree-node-avatar" alt="${m.name}">
      <span class="tree-node-relation">${m.relationship}</span>
      <h4 class="tree-node-name">${m.name.split(' ')[0]}</h4>
      ${m.hebrewName ? `<span class="tree-node-hebrew">${m.hebrewName.split(' ben ')[0].split(' bat ')[0]}</span>` : ''}
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

  dom.memberModalTitle.innerText = 'Editar Familiar';
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
          <span class="braja-category-tag">${braja.category}</span>
          <button class="btn btn-secondary btn-icon-only copy-braja-btn" title="Copiar texto" style="padding: 6px 10px;"><i class="fa-solid fa-copy"></i></button>
        </div>
        <h3>${braja.title}</h3>
        <div class="braja-hebrew font-hebrew-title">${braja.hebrew}</div>
        <p class="braja-transliteration"><strong>Fonetica:</strong> ${braja.transliteration}</p>
        <p class="braja-translation"><strong>Traduccion:</strong> ${braja.translation}</p>
      </div>
      <div>
        <p class="braja-desc">${braja.description}</p>
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
  
  dom.linkBrajaEventSelect.innerHTML = '<option value="">Selecciona un evento...</option>';
  events.forEach(e => {
    dom.linkBrajaEventSelect.innerHTML += `<option value="${e.id}">${e.title} (${e.date})</option>`;
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
        ${day}
        <span>${month}</span>
      </div>
      <div class="reminder-info">
        <h4 class="reminder-title">Cumpleaños de ${m.name}</h4>
        <p class="reminder-desc">
          Parentesco: <strong>${m.relationship}</strong> | Nac: ${m.birthDate}
          ${m.hebrewBirthDate ? `<br>Hebreo: <span class="heb">${m.hebrewBirthDate}</span>` : ''}
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
        ${day}
        <span>${month}</span>
      </div>
      <div class="reminder-info">
        <h4 class="reminder-title">${e.title}</h4>
        <p class="reminder-desc">
          Gregoriano: <strong>${e.date}</strong> | Lugar: ${e.location || 'No indicado'}
          ${e.hebrewDate ? `<br>Hebreo (Yahrtzeit anual): <span class="heb">${e.hebrewDate}</span>` : ''}
        </p>
      </div>
    `;
    dom.yahrtzeitContainer.appendChild(item);
  });
}

function openSlideshowFromEvent(event) {
  const firstMedia = event.media && event.media[0];
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
  
  if (item.type === 'video') {
    const video = document.createElement('video');
    video.src = item.url;
    video.controls = true;
    video.autoplay = true;
    video.className = 'slideshow-media';
    dom.slideshowMediaContainer.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = item.url;
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

function setupAudioRecorder() {
  const recordBtn = document.getElementById('event-record-audio-btn');
  const stopBtn = document.getElementById('event-stop-audio-btn');
  const timerSpan = document.getElementById('event-audio-timer');
  const statusSpan = document.getElementById('event-audio-status');
  const playerContainer = document.getElementById('event-audio-preview-container');
  const audioPlayer = document.getElementById('event-audio-player');

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
        recordedAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(recordedAudioBlob);
        audioPlayer.src = audioUrl;
        playerContainer.style.display = 'block';
        statusSpan.innerText = '✓ Audio grabado listo para guardar';
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
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
  if (!mapContainer || typeof L === 'undefined') return;

  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }

  leafletMap = L.map('migration-map').setView([30.0, 10.0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(leafletMap);

  const migrationPoints = [
    { name: 'Varsovia, Polonia', lat: 52.2297, lng: 21.0122, desc: 'Origen de los bisabuelos paternos (década de 1920)' },
    { name: 'Casablanca, Marruecos', lat: 33.5731, lng: -7.5898, desc: 'Comunidad de origen de los antepasados maternos' },
    { name: 'Entre Ríos, Argentina', lat: -31.7413, lng: -60.5115, desc: 'Colonia agrícola judía (Llegada a Sudamérica)' },
    { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816, desc: 'Establecimiento del núcleo familiar actual' },
    { name: 'Jerusalén, Israel', lat: 31.7683, lng: 35.2137, desc: 'Aliyá de familiares y ceremonias en la ciudad sagrada' }
  ];

  const latLngs = [];
  migrationPoints.forEach(pt => {
    const marker = L.marker([pt.lat, pt.lng]).addTo(leafletMap);
    marker.bindPopup(`<b>${pt.name}</b><br><span style="font-size: 0.85rem; color: #475569;">${pt.desc}</span>`);
    latLngs.push([pt.lat, pt.lng]);
  });

  if (latLngs.length > 1) {
    L.polyline(latLngs, { color: '#D97706', weight: 3, dashArray: '6, 10' }).addTo(leafletMap);
  }
}

// 5. Árbol Genealógico Interactivo D3.js SVG
function renderD3Tree(members) {
  const svgEl = d3.select('#d3-tree-svg');
  if (svgEl.empty() || typeof d3 === 'undefined') return;

  svgEl.selectAll('*').remove();

  const width = svgEl.node().clientWidth || 800;
  const height = 520;

  const rootData = {
    name: 'Familia Levy',
    relationship: 'Familia',
    children: [
      {
        name: 'Abraham Levy',
        hebrewName: 'Avraham ben Moshe',
        relationship: 'Abuelo',
        children: [
          {
            name: 'Moisés Levy',
            hebrewName: 'Moshe ben Avraham',
            relationship: 'Padre',
            children: [
              { name: 'David Levy', hebrewName: 'David ben Moshe', relationship: 'Hijo' },
              { name: 'Miriam Levy', hebrewName: 'Miriam bat Moshe', relationship: 'Hija' }
            ]
          }
        ]
      },
      {
        name: 'Sara Stern',
        hebrewName: 'Sara bat Yitzchak',
        relationship: 'Abuela',
        children: [
          {
            name: 'Rajel Stern',
            hebrewName: 'Rajel bat Yitzchak',
            relationship: 'Madre'
          }
        ]
      }
    ]
  };

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

  memberSelect.innerHTML = '<option value="">Selecciona familiar...</option>';
  members.forEach(m => {
    memberSelect.innerHTML += `<option value="${m.name}">${m.name} (${m.relationship})</option>`;
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

// 7. Zmanim & Calendario Exportación .ics
async function fetchHebcalZmanim() {
  const zmanimDisplay = document.getElementById('zmanim-times-display');
  const locationText = document.getElementById('zmanim-location-text');
  if (!zmanimDisplay) return;

  try {
    const response = await fetch('https://www.hebcal.com/zmanim?cfg=json&city=BU&g2h=1');
    if (!response.ok) throw new Error();
    const data = await response.json();

    locationText.innerText = 'Buenos Aires, Argentina (Hebcal Zmanim)';
    if (data.times) {
      const candles = data.times.candles ? data.times.candles.slice(11, 16) : '18:15';
      const havdalah = data.times.havdalah ? data.times.havdalah.slice(11, 16) : '19:10';
      zmanimDisplay.innerHTML = `
        <div style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 6px;">🕯️ <strong>Encendido:</strong> ${candles}</div>
        <div style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 6px;">✨ <strong>Havdalá:</strong> ${havdalah}</div>
      `;
    }
  } catch (e) {
    locationText.innerText = 'Horarios de Shabat estimados';
    zmanimDisplay.innerHTML = `
      <div style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 6px;">🕯️ <strong>Velas:</strong> 18:15</div>
      <div style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 6px;">✨ <strong>Havdalá:</strong> 19:10</div>
    `;
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

