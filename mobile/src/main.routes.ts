import m from 'mithril';
import {SplashComponent} from './app/components/splash/splash.component';

export function initRoutes() {
    const routes = {
        '/splash': SplashComponent,
        '/login': {
            onmatch: async () => (await import('./main.module')).LoginComponent,
        },
        '/username': {
            onmatch: async () => (await import('./main.module')).UsernameComponent,
        },
        '/terms': {
            onmatch: async () => (await import('./main.module')).TermsComponent,
        },
        '/home': createMainRoute(module => module.HomeComponent),
        '/home/how-to': createMainRoute(module => module.HowToComponent),
        '/home/my-wins': createMainRoute(module => module.MyWinsComponent),
        '/play': createMainRoute(module => module.PlayComponent),
        '/rank': createMainRoute(module => module.RankComponent),
        '/popup': {
            onmatch: async () => (await import('./main.module')).PregamePopupComponent,
        },
    };

    m.route(document.querySelector('.app-root'), '/splash', routes);
}

function createMainRoute(fn: (module) => any) {
    let module;
    return {
        async onmatch() {
            module = await import('./main.module');
            return fn(module);
        },
        render(tag) {
            return m(module.MainComponent, tag);
        },
    };
}
