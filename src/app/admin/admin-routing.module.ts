import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthComponent } from './auth/auth.component';
import { IndexComponent } from './index/index.component';
import { NewsListComponent } from './news-list/news-list.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { NewsCreateComponent } from './news-create/news-create.component';
import { CanDeactivateGuard } from '../shared/services/can-deactivate.guard';
import { TarifsComponent } from './tarifs/tarifs.component';

const routes: Routes = [
  {
    path: 'auth', component: AuthComponent
  },
  {
    path: '', component: AdminComponent, canActivate: [AuthGuard], children: [
      {path: '', component: NewsListComponent},
      {path: 'pages', component: IndexComponent},
      {path: 'pages/:slug/:lang', component: ArticleEditComponent, canDeactivate: [CanDeactivateGuard]},
      {path: 'news/add', component: NewsCreateComponent},
      {path: 'tarifs', component: TarifsComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class AdminRoutingModule {
}
