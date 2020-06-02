import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChatPageComponent} from './chat-page.component';
import {ChatFooterComponent} from '../components/chat-footer/chat-footer.component';
import {ChatMessagesComponent} from '../components/chat-messages/chat-messages.component';
import {ChatSidebarComponent} from '../components/chat-sidebar/chat-sidebar.component';
import {DisconnectedMessageComponent} from '../components/disconnected-message/disconnected-message.component';
import {ChatUserComponent} from '../components/chat-user/chat-user.component';
import {ChatRoomNameComponent} from '../components/chat-room-name/chat-room-name.component';


@NgModule({
  imports: [
    CommonModule

  ],
  declarations: [
    ChatPageComponent,
    ChatFooterComponent,
    ChatMessagesComponent,
    ChatSidebarComponent,
    DisconnectedMessageComponent,
    ChatUserComponent,
    ChatRoomNameComponent
  ],
  exports: [
    ChatPageComponent
  ]
})
export class ChatPageModule {



}
