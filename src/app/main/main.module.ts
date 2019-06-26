import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainRoutingModule } from './main-routing.module';
import { IndexComponent } from './index/index.component';
import { FirstBlockComponent } from './index/first-block/first-block.component';
import { SharedModule } from '../shared/shared.module';
import { OfferComponent } from './offer/offer.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ContactsComponent } from './contacts/contacts.component';
import { NewsComponent } from './news/news.component';
import { TarifsComponent } from './tarifs/tarifs.component';
import { TranslateModule } from '@ngx-translate/core';
import { ArticleService } from '../shared/services/article.service';
import { ReadNewsComponent } from './read-news/read-news.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    TranslateModule,
    SharedModule
  ],
  declarations: [
    MainComponent,
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    FirstBlockComponent,
    OfferComponent,
    PrivacyPolicyComponent,
    ContactsComponent,
    NewsComponent,
    TarifsComponent,
    ReadNewsComponent
  ],
  providers: [
    ArticleService
  ]
})
export class MainModule {}
