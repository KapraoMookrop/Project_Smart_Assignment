import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'tasks/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'companies/edit/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'members/:categoryId',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  }
];
