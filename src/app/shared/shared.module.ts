import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownDirective } from './directives/dropdown.directive';
import { SidenavDirective } from './directives/sidenav.directive';
import { TabsDirective } from './directives/tabs.directive';
import { ModalDirective } from './directives/modal.directive';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentPipe } from './pipes/moment.pipe';
import { LocalizePipe } from './pipes/localize.pipe';
import { FindLangPipe } from './pipes/findLang.pipe';
import { CutArticlePipe } from './pipes/cut-article.pipe';
import { PaginatorButtonsComponent } from './components/paginator-buttons/pagnator-buttons.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    DropdownDirective,
    SidenavDirective,
    TabsDirective,
    ModalDirective,
    MomentPipe,
    LocalizePipe,
    FindLangPipe,
    CutArticlePipe,
    PaginatorButtonsComponent
  ],
  exports: [
    DropdownDirective,
    SidenavDirective,
    TabsDirective,
    ModalDirective,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MomentPipe,
    LocalizePipe,
    FindLangPipe,
    CutArticlePipe,
    PaginatorButtonsComponent
  ]
})
export class SharedModule {
  static forRoot (): ModuleWithProviders {
    return {ngModule: SharedModule};
  }
}
