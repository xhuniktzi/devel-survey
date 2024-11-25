import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'public', loadChildren: () => import('./public/public.module').then(m => m.PublicModule)},
    {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
    {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
    {path: 'response', loadChildren: () => import('./response/response.module').then(m => m.ResponseModule)},
    { path: '**', redirectTo: 'auth' },
];
