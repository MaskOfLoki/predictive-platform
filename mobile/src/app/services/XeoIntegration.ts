class XeoIntegration {
  constructor() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ event: 'ready' }, '*');
    }
  }
}

export const xeo = new XeoIntegration();
