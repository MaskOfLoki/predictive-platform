import m from 'mithril';

export function initRoutes() {
    const routes = {
        '/admin': {
            onmatch: async () => {
                try {
                    const module = await import('./app/admin/admin.module');
                    return module.AdminComponent;
                } catch (e) {
                    console.error('admin.onmatch', e);
                    throw e;
                }
            },
        },
        // '/mainboard': createMainboardRoute(module => module.IntroComponent),
        // '/mainboard/leaderboard': createMainboardRoute(module => module.LeaderboardComponent),
        // '/mainboard/poll': createMainboardRoute(module => module.PollComponent),
    };

    m.route(document.querySelector('.app-root'), '/admin', routes);
}

// function createMainboardRoute(fn: (module) => any) {
//     let module;
//     return {
//         async onmatch() {
//             try {
//                 module = await import('./app/mainboard/mainboard.module');
//                 return fn(module);
//             } catch (e) {
//                 console.error('createMainboardRoute.onmatch', e);
//                 throw e;
//             }
//         },
//         render(tag) {
//             return m(module.MainboardComponent, tag);
//         },
//     };
// }
