/**
 * dom-cache.js
 * Cache centralizado de elementos del DOM.
 */

window.DorLdorDom = {
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
  eventModalTitle: document.getElementById('event-modal-title'),

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
  memberModalTitle: document.getElementById('member-modal-title'),

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
