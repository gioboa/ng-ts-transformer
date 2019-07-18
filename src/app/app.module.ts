import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CustomComponent } from './custom/custom.component';
import { StandardComponent } from './standard/standard.component';
@NgModule({
  declarations: [AppComponent, CustomComponent, StandardComponent],
  imports: [BrowserModule],
  entryComponents: [CustomComponent, StandardComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
