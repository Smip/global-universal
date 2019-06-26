import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { IndexComponent } from './index/index.component';
import { OfferComponent } from './offer/offer.component';
import { ContactsComponent } from './contacts/contacts.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TarifsComponent } from './tarifs/tarifs.component';
import { NewsComponent } from './news/news.component';
import { ReadNewsComponent } from './read-news/read-news.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/null', pathMatch: 'full'
  },
  {
    path: ':lang', component: MainComponent, children: [
      {path: '', component: IndexComponent, pathMatch: 'full'},
      {path: 'public-offer', component: OfferComponent},
      {path: 'contacts', component: ContactsComponent},
      {path: 'privacy-policy', component: PrivacyPolicyComponent},
      {path: 'tarifs', component: TarifsComponent},
      {path: 'news/:slug', component: ReadNewsComponent},
      {path: 'news/page/:page', component: NewsComponent},
      {path: 'news', component: NewsComponent},
    ]
  },
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})

export class MainRoutingModule {
}
