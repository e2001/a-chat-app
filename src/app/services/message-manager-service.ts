import {Injectable} from '@angular/core';
import {MessagesSocketService} from './messages-socket.service';
import {ChatMessage, ChatMessageBucket, CreateMessageRequestData, ServerConnectedState} from '../model/model';
import {MessageStore} from './message.store';
import {Subscription} from 'rxjs';
import {ChatLocalStorageService} from './chat-local-storage.service';
import {RoomInfoStore} from './room-info-store';
import {CryptoService} from './crypto.service';

@Injectable()
export class MessageManagerService {

  constructor(private messagesSocketService: MessagesSocketService,
              private messageStore: MessageStore,
              private chatLocalStorageService: ChatLocalStorageService,
              private roomInfoStore: RoomInfoStore,
              private cryptoService: CryptoService) {
    this.subscriptionsRoomEvents = [];
    this.subscriptionsChatEvents = [];
  }

  private subscriptionsRoomEvents: Subscription[];
  private subscriptionsChatEvents: Subscription[];

  loadMessageHistory() {
    let cryiptedState = this.chatLocalStorageService.loadStateFromStorage(this.roomInfoStore.name, this.roomInfoStore.room);
    let uncriptedState = this._decryptState(cryiptedState);
    this.messageStore.setHistory(uncriptedState);
  }

  private saveMessageHistory() {
    let uncriptedState = this.messageStore.getStoreState();
    let cryiptedState = this._encryptState(uncriptedState);
    this.chatLocalStorageService.saveStateInStorage(this.roomInfoStore.name, this.roomInfoStore.room, cryiptedState);
  }

  private _decryptState(sourceState: ChatMessageBucket[]): ChatMessageBucket[] {
    return sourceState.map((bucket) => {
      return Object.assign(new ChatMessageBucket(bucket), <ChatMessageBucket>{
        messages: bucket.messages.map((message) => {
          return Object.assign(new ChatMessage(message), {
            text: this.cryptoService.doDecrypt(message.text)
          });
        })
      });
    });
  }

  private _encryptState(sourceState: ChatMessageBucket[]): ChatMessageBucket[] {
    return sourceState.map((bucket) => {
      return Object.assign(new ChatMessageBucket(bucket), <ChatMessageBucket>{
        messages: bucket.messages.map((message) => {
          return Object.assign(new ChatMessage(message), {
            text: this.cryptoService.doEncrypt(message.text)
          });
        })
      });
    });
  }

  clearStores() {
    this.messageStore.clearStore();
    this.roomInfoStore.removeAllUsers();
  }

  orchestrateRoomEvents() {
    this.subscriptionsRoomEvents.push(this.messagesSocketService.disconnectEvent$.subscribe(() => {

      this.roomInfoStore.setConnectStatus(ServerConnectedState.disconnected);
    }));
    this.subscriptionsRoomEvents.push(this.messagesSocketService.connectEvent$.subscribe(() => {
      this.roomInfoStore.setConnectStatus(ServerConnectedState.connected);
    }));
  }

  orchestrateChatEvents() {

    this.subscriptionsChatEvents.push(this.messagesSocketService.newMessageEvent$.subscribe((message: ChatMessage) => {
      console.log('new-message received by client', message);
      message.text = this.cryptoService.doDecrypt(message.text);
      this.messageStore.addMessage(message);
      this.saveMessageHistory();
    }));
    this.subscriptionsChatEvents.push(this.messagesSocketService.updateUserList$.subscribe((users: string[]) => {
      this.roomInfoStore.updateUsers(users);
    }));

  }

  unsubscribeFromChatEvents() {
    this.subscriptionsChatEvents.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  unsubscribeFromRoomEvents() {
    this.subscriptionsRoomEvents.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  createMessage(text: string) {
    let cryptedText = this.cryptoService.doEncrypt(text);
    this.messagesSocketService.createMessage(new CreateMessageRequestData({
      text: cryptedText
    }));
  }

  removeAllMessgesAndDeleteLocalStorage() {
    this.messageStore.clearStore();
    this.saveMessageHistory();
  }
}
