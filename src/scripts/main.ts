/*
 * Global Scripts: Manages modal dialogues, theme toggle syncing,
 * and image-security.
 */

// Handles showing and hiding modals, as well as pausing running media on close
const setupModals = () => {
  const modalTriggers = document.querySelectorAll('[data-modal-id]');
  const dialogs = document.querySelectorAll('dialog') as NodeListOf<HTMLDialogElement>;

  // Halts video playbacks to avoid background audio when closing a modal
  const stopVideo = (modal: HTMLDialogElement) => {
    const iframe = modal.querySelector('iframe');
    if (iframe) iframe.src = '';

    const video = modal.querySelector('video');
    if (video) { video.pause(); video.currentTime = 0; }
  };

  // Registers click events to open specific dialog elements
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.getAttribute('data-modal-id');
      if (!modalId) return;
      const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
       if (dialog) {
         dialog.showModal();
         document.body.style.overflow = 'hidden';
       }
    });
  });

  // Registers handlers for closing active dialogs via close buttons
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dialog = btn.closest('dialog');
      if (dialog) {
        stopVideo(dialog);
        (dialog as HTMLDialogElement).close();
      }
    });
  });

  // Closes the modal dialogue when clicking outside its bounds or pressing Escape
  dialogs.forEach(dialog => {
    dialog.addEventListener('close', () => {
      document.body.style.overflow = 'auto';
    });

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        stopVideo(dialog);
        dialog.close();
      }
    });
  });
};

// Handles showing and hiding project case study modals
const setupProjectModals = () => {
  const projectCards = document.querySelectorAll('[data-project-card]');

  // Halts video playbacks to avoid background audio when closing a modal
  const stopVideo = (modal: HTMLDialogElement) => {
    const video = modal.querySelector('video');
    if (video) { video.pause(); video.currentTime = 0; }
  };

  // Registers click events to open project modals
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project-card');
      if (!projectId) return;
      const modal = document.getElementById(`modal-${projectId}`) as HTMLDialogElement | null;
      if (modal) {
        modal.showModal();
        document.body.style.overflow = 'hidden';
      }
    });

    // Keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.dispatchEvent(new Event('click'));
      }
    });
  });

  // Registers handlers for closing project modals
  document.querySelectorAll('[data-project-modal]').forEach(modal => {
    const dialog = modal as HTMLDialogElement;
    
    dialog.addEventListener('close', () => {
      document.body.style.overflow = 'auto';
    });

    dialog.addEventListener('click', (e) => {
      const rect = dialog.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
        stopVideo(dialog);
        dialog.close();
      }
    });
  });

  // Close buttons inside project modals
  document.querySelectorAll('[data-project-modal] .close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dialog = (btn as HTMLElement).closest('dialog') as HTMLDialogElement | null;
      if (dialog) {
        stopVideo(dialog);
        dialog.close();
      }
    });
  });
};

// Handles clicking theme buttons and setting persistent storage changes across views
const setupTheme = () => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const newToggle = toggle.cloneNode(true) as HTMLButtonElement;
  toggle.parentNode?.replaceChild(newToggle, toggle);

  newToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isLight = html.classList.toggle('light');
    
    const theme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  });
};

// Initialization runner
const initMain = () => {
  setupModals();
  setupProjectModals();
  setupTheme();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
} else {
    initMain();
}

document.addEventListener('astro:after-swap', initMain);

export {};