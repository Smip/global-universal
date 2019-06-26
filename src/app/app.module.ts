import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { NotFoundComponent } from './not-found/not-found.component';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MainModule } from './main/main.module';
import { TarifsService } from './shared/services/tarifs.service';
import { TokenInterceptor } from './shared/core/token.interceptor';
import { TranslateBrowserModule } from './shared/translate/translate-browser.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    HttpClientModule,
    TranslateBrowserModule,
    AppRoutingModule,
    MainModule,
    TransferHttpCacheModule,
  ],
  providers: [
    TarifsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
