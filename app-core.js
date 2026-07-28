/**
 * app-core.js
 * Configuración y utilidades base compartidas de UI.
 */

window.DorLdorCore = {
  HEBREW_MONTHS_ES: {
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
  },

  openModal(modalEl) {
    modalEl.classList.add('show');
  },

  closeModal(modalEl) {
    modalEl.classList.remove('show');
  },

  showToast(dom, message) {
    dom.toastMessage.innerText = message;
    dom.toast.classList.add('show');
    setTimeout(() => {
      dom.toast.classList.remove('show');
    }, 3000);
  }
};
