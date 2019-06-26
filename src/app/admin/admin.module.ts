import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthComponent } from './auth/auth.component';
import { AdminRoutingModule } from './admin-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { UsersService } from '../shared/services/users.service';
import { AuthService } from '../shared/services/auth.service';
import { IndexComponent } from './index/index.component';
import { ArticleService } from '../shared/services/article.service';
import { NewsListComponent } from './news-list/news-list.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { AuthGuard } from '../shared/services/auth.guard';
import { NewsCreateComponent } from './news-create/news-create.component';
import { CanDeactivateGuard } from '../shared/services/can-deactivate.guard';
import { FilesService } from '../shared/services/files.service';
import { QuillModule } from 'ngx-quill';
import { TarifsComponent } from './tarifs/tarifs.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    TranslateModule,
    SharedModule,
    QuillModule
  ],
  declarations: [
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    AuthComponent,
    IndexComponent,
    NewsListComponent,
    ArticleEditComponent,
    NewsCreateComponent,
    TarifsComponent
  ],
  providers: [
    UsersService,
    AuthService,
    ArticleService,
    AuthGuard,
    CanDeactivateGuard,
    FilesService
  ]
})
export class AdminModule {}
