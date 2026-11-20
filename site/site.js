const header = document.querySelector('.v2hd');
if (header && !document.body.classList.contains('home-page')) {
  const publishHeaderHeight = () => {
    document.documentElement.style.setProperty('--v2hd-h', header.offsetHeight + 'px');
  };
  publishHeaderHeight();
  if ('ResizeObserver' in window) new ResizeObserver(publishHeaderHeight).observe(header);
}

const menu = header?.querySelector('details');
if (menu) {
  const trigger = menu.querySelector('summary');
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) || event.target.closest('a')) menu.open = false;
  });
  document.addEventListener('focusin', event => {
    if (!menu.contains(event.target)) menu.open = false;
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      trigger.focus();
    }
  });
  matchMedia('(min-width:900px)').addEventListener('change', () => { menu.open = false; });
  window.addEventListener('pageshow', () => { menu.open = false; });
}

const leadHero = document.querySelector('.v2hero, .rush-hero, .chapter-cover');
if (header && leadHero?.matches('.rush-hero, .chapter-cover')) {
  const updateHeaderTone = () => header.classList.toggle('is-over-hero', window.scrollY < 12);
  updateHeaderTone();
  window.addEventListener('scroll', updateHeaderTone, { passive: true });
  window.addEventListener('pageshow', updateHeaderTone);
}

if (header && leadHero && 'IntersectionObserver' in window) {
  const updateRushAction = () => {
    const heroHasPassed = leadHero.getBoundingClientRect().bottom <= header.offsetHeight + 1;
    header.classList.toggle('is-hero-nav', !heroHasPassed);
  };
  updateRushAction();
  const observer = new IntersectionObserver(updateRushAction, {
    rootMargin: '-' + header.offsetHeight + 'px 0px 0px',
  });
  observer.observe(leadHero);
  window.addEventListener('pageshow', updateRushAction);
}

const invitations = document.querySelectorAll('[data-arrival-glow]');
if (invitations.length && 'IntersectionObserver' in window) {
  const arrival = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.intersectionRatio < .6) continue;
      entry.target.classList.add('has-arrived');
      arrival.unobserve(entry.target);
    }
  }, {threshold: .6});
  invitations.forEach(invitation => arrival.observe(invitation));
}

if (document.body.classList.contains('rush-page') && window.location.hash === '#interest') {
  const destination = new URL('/rush/interest', window.location.origin);
  destination.search = window.location.search;
  window.location.replace(destination);
}

document.querySelectorAll('[data-interest]').forEach(form => {
  const status = form.querySelector('[data-form-status]');
  const button = form.querySelector('button[type="submit"]');
  const confirmation = document.querySelector('[data-signup-confirmation]');
  let submitting = false;

  function clearFieldError(field) {
    if (!field.matches('[aria-invalid="true"]')) return;
    const id = field.id + '-error';
    document.getElementById(id)?.remove();
    field.removeAttribute('aria-invalid');
    const otherDescriptions = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(value => value && value !== id);
    if (otherDescriptions.length) field.setAttribute('aria-describedby', otherDescriptions.join(' '));
    else field.removeAttribute('aria-describedby');
  }

  form.addEventListener('input', event => {
    clearFieldError(event.target);
    if (status.dataset.state === 'invalid' && !form.querySelector('[aria-invalid="true"]')) {
      status.textContent = '';
      status.removeAttribute('data-state');
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    submitting = true;
    button.disabled = true;
    const label = button.textContent;
    button.textContent = 'Saving your interest…';
    status.textContent = '';
    status.removeAttribute('data-state');
    form.querySelectorAll('[aria-invalid="true"]').forEach(clearFieldError);
    const data = new FormData(form);
    const payload = {
      name:data.get('name'), email:data.get('email'), major:data.get('major') || '',
      graduationYear:data.get('graduationYear') || '', consent:data.get('consent') === 'true',
      website:data.get('website') || '', source:data.get('source') || 'rush'
    };
    try {
      const response = await fetch('/api/interest', {
        method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        status.dataset.state = 'error';
        status.textContent = result.message || 'Your details could not be saved. Please try again.';
        if (result.errors && typeof result.errors === 'object') {
          status.dataset.state = 'invalid';
          Object.entries(result.errors).forEach(([name, message]) => {
            const field = form.elements.namedItem(name);
            if (!field) return;
            field.setAttribute('aria-invalid', 'true');
            const error = document.createElement('p');
            error.id = field.id + '-error';
            error.className = 'field-error';
            error.textContent = message;
            const describedBy = [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' ');
            field.setAttribute('aria-describedby', describedBy);
            field.closest('.form-field, .form-consent').append(error);
          });
          if (form.contains(document.activeElement) || document.activeElement === document.body) {
            form.querySelector('[aria-invalid="true"]')?.focus();
          }
        }
        return;
      }
      form.reset();
      if (confirmation) {
        const moveFocus = form.contains(document.activeElement) || document.activeElement === document.body;
        form.hidden = true;
        confirmation.hidden = false;
        if (moveFocus) confirmation.focus();
      } else {
        status.dataset.state = 'success';
        status.textContent = result.message;
      }
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Your details could not be saved. Check your connection and try again.';
    } finally {
      submitting = false;
      button.disabled = false;
      button.textContent = label;
    }
  });
});

document.querySelectorAll('[data-share]').forEach(button => {
  const status = button.parentElement.querySelector('[data-share-status]');
  let sharing = false;

  button.addEventListener('click', async () => {
    if (sharing) return;
    sharing = true;
    status.replaceChildren();
    const url = document.querySelector('link[rel="canonical"]')?.href || new URL('/rush', window.location.origin).href;
    try {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({title: 'Rush Phi Chi Theta at USF', text: 'Explore Rush for Phi Chi Theta at USF.', url});
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
        }
      }
      await navigator.clipboard.writeText(url);
      status.textContent = 'Rush page link copied.';
    } catch {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = url;
      status.append('Copy this link to share it. ', link);
    } finally {
      sharing = false;
    }
  });
});
