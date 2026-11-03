/* Japanese Notes - Main JS */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    // close on link click
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Tabs
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const panels = tabGroup.parentElement.querySelectorAll('.tab-panel');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  });

  // Checklist progress (localStorage)
  const CHECK_KEY = 'jp-notes-checks';
  let checks = {};
  try {
    checks = JSON.parse(localStorage.getItem(CHECK_KEY) || '{}');
  } catch (e) {}

  document.querySelectorAll('.check-list input[type="checkbox"]').forEach(cb => {
    const id = cb.id || cb.dataset.id;
    if (!id) return;
    if (checks[id]) cb.checked = true;
    cb.addEventListener('change', () => {
      checks[id] = cb.checked;
      localStorage.setItem(CHECK_KEY, JSON.stringify(checks));
      updateProgress();
    });
  });

  function updateProgress() {
    const total = document.querySelectorAll('.check-list input[type="checkbox"]').length;
    const done = document.querySelectorAll('.check-list input[type="checkbox"]:checked').length;
    const el = document.getElementById('progress-text');
    if (el && total > 0) {
      el.textContent = `${done} / ${total} selesai`;
    }
    const bar = document.getElementById('progress-bar');
    if (bar && total > 0) {
      bar.style.width = `${(done / total) * 100}%`;
    }
  }
  updateProgress();

  // Personal notes (localStorage)
  const NOTES_KEY = 'jp-notes-personal';
  const notesArea = document.getElementById('personal-notes');
  const saveBtn = document.getElementById('save-notes');
  const clearBtn = document.getElementById('clear-notes');
  const status = document.getElementById('notes-status');

  if (notesArea) {
    try {
      notesArea.value = localStorage.getItem(NOTES_KEY) || '';
    } catch (e) {}

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        localStorage.setItem(NOTES_KEY, notesArea.value);
        if (status) {
          status.textContent = 'Tersimpan ✓';
          status.style.color = 'var(--success)';
          setTimeout(() => { status.textContent = ''; }, 2000);
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Hapus semua catatan pribadi di perangkat ini?')) {
          notesArea.value = '';
          localStorage.removeItem(NOTES_KEY);
          if (status) {
            status.textContent = 'Dikosongkan';
            status.style.color = 'var(--text-muted)';
          }
        }
      });
    }

    // auto-save on blur
    notesArea.addEventListener('blur', () => {
      localStorage.setItem(NOTES_KEY, notesArea.value);
    });
  }
});
