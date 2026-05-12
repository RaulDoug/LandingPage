const components = [
  {id: 'header', file: './components/header.html'},
  {id: 'hero', file: './components/sections/hero.html'},
  {id: 'services', file: './components/sections/services.html'},
  {id: 'about', file: './components/sections/about.html'},
  {id: 'gallery', file: './components/sections/gallery.html'},
  {id: 'testimonials', file: './components/sections/testimonials.html'},
  {id: 'cta', file: './components/sections/cta.html'},
  {id: 'footer', file: './components/footer.html'},
]

export async function loadComponent(id, file) {
  try {
    const res = await fetch(file);

    if (!res.ok) {
      throw new Error(`Erro ao carregar ${file}`);
    }

    const target = document.getElementById(id);

    if (!target) {
      throw new Error(`Elemento #${id} não encontrado`);
    }

    const html = await res.text();
    target.innerHTML = html;

  } catch (err) {
    console.error(err);
  }
}

async function loadAllComponents() {
  for (const c of components) {
    await loadComponent(c.id, c.file);
  }

  window.initMenu?.();
  window.initGallery?.();
  window.initTestimonials?.();
}

loadAllComponents();
