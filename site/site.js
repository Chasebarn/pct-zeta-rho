const header = document.querySelector('.v2hd');
const menu = header?.querySelector('details');
if (menu) {
  document.addEventListener('click', event => {
    if (!menu.contains(event.target) || event.target.closest('a')) menu.open = false;
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
}

document.querySelectorAll('[data-interest]').forEach(form => {
  const status = form.querySelector('[data-form-status]');
  const button = form.querySelector('button[type="submit"]');
  let submitting = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    submitting = true;
    button.disabled = true;
    const label = button.textContent;
    button.textContent = 'Saving your interest…';
    status.textContent = '';
    status.removeAttribute('data-state');
    form.querySelectorAll('.field-error').forEach(error => error.remove());
    form.querySelectorAll('[aria-invalid]').forEach(field => {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    });
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
          Object.entries(result.errors).forEach(([name, message]) => {
            const field = form.elements.namedItem(name);
            if (!field) return;
            field.setAttribute('aria-invalid', 'true');
            const error = document.createElement('p');
            error.id = field.id + '-error';
            error.className = 'field-error';
            error.textContent = message;
            field.setAttribute('aria-describedby', error.id);
            field.closest('.form-field, .form-consent').append(error);
          });
        }
        return;
      }
      status.dataset.state = 'success';
      status.textContent = result.message;
      form.reset();
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
  button.addEventListener('click', async () => {
    const url = new URL('/rush',window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({title:'Rush Phi Chi Theta at USF',text:'Explore Phi Chi Theta and the Rush process at USF.',url});
      } else {
        await navigator.clipboard.writeText(url);
        status.textContent = 'Rush page link copied.';
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        status.replaceChildren(document.createTextNode('Share this page: '));
        const link = document.createElement('a');
        link.href = url;
        link.textContent = url;
        status.append(link);
      }
    }
  });
});

const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open || reducedMotion.matches) return;
    item.querySelector('p')?.animate(
      [{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:180,easing:'ease-out'}
    );
  });
});
