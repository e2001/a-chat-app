import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {JoinRoomPageModule} from './join-room-page/join-room-page.module';
import {JoinRoomPageComponent} from './join-room-page/join-room-page.component';
import {ChatPageModule} from './chat-page/chat-page.module';
import {ChatPageComponent} from './chat-page/chat-page.component';
import {NeedJoinRoomGuard} from './route-guards/join-room.guard';
import {MessageStore} from './services/message.store';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {MessagesSocketService} from './services/messages-socket.service';
import {IsJoinedRoomGuard} from './route-guards/is-joined-room.guard';
import {MessageManagerService} from './services/message-manager-service';
import {RoomInfoStore} from './services/room-info-store';
import {ChatLocalStorageService} from './services/chat-local-storage.service';
import {CryptoService} from './services/crypto.service';
import {HelperService} from './services/helper.service';


const config: SocketIoConfig = {url: 'http://localhost:5555', options: {}};

const appRoutes: Routes = [
  {
    path: 'chat-page',
    component: ChatPageComponent,
    canActivate: [NeedJoinRoomGuard]
  },
  {
    path: 'join-room',
    component: JoinRoomPageComponent,
    resolve: [IsJoinedRoomGuard]
  },
  {
    path: '**',
    redirectTo: '/join-room',
    pathMatch: 'full'
  },
];

@NgModule({
  declarations: [
    AppComponent,


  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    JoinRoomPageModule,
    ChatPageModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),

  ],
  providers: [
    NeedJoinRoomGuard,
    IsJoinedRoomGuard,
    MessageStore,
    MessagesSocketService,
    MessageManagerService,
    RoomInfoStore,
    ChatLocalStorageService,
    CryptoService,
    HelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
