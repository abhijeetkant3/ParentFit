/* FitMom Single Page Application Hash Router */

class Router {
  constructor() {
    this.routes = {};
    this.currentView = null;
    this.container = null;

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init(containerElement) {
    this.container = containerElement;
    this.handleRoute();
  }

  register(path, viewModule) {
    this.routes[path] = viewModule;
  }

  navigate(pathWithParams) {
    window.location.hash = pathWithParams;
  }

  parseHash() {
    const hash = window.location.hash.slice(1) || 'home';
    const [path, queryString] = hash.split('?');
    
    const params = {};
    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
    }

    return { path, params };
  }

  async handleRoute() {
    if (!this.container) return;

    const { path, params } = this.parseHash();
    const routeHandler = this.routes[path] || this.routes['home'];

    if (routeHandler) {
      if (this.currentView && typeof this.currentView.destroy === 'function') {
        this.currentView.destroy();
      }

      this.container.innerHTML = '';
      this.currentView = routeHandler;
      
      const content = await routeHandler.render(params);
      if (typeof content === 'string') {
        this.container.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        this.container.appendChild(content);
      }

      if (typeof routeHandler.postRender === 'function') {
        routeHandler.postRender(params);
      }

      // Scroll main window to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update active state in bottom nav
      this.updateNavbarActive(path);
    }
  }

  updateNavbarActive(currentPath) {
    const navItems = document.querySelectorAll('.bottom-navbar .nav-item');
    navItems.forEach(item => {
      const route = item.getAttribute('data-route');
      if (route === currentPath || (currentPath === '' && route === 'home')) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });
  }
}

export const router = new Router();
