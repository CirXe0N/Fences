import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ChatComponent} from "./components/chat/chat.component";
import {HttpModule} from "@angular/http";
import {ReactiveFormsModule} from "@angular/forms";
import {APIService} from "./services/api.service";
import {UserService} from "./services/user.service";
import {MomentModule} from "angular2-moment";

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    MomentModule
  ],
  providers: [
    APIService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
