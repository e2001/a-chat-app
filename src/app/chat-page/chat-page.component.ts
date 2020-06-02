import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {MessageStore} from '../services/message.store';
import {RoomInfoStore} from '../services/room-info-store';
import {JoinRoomService} from '../services/join-room.service';
import {MessageManagerService} from '../services/message-manager-service';
import {ChatMessage, ChatMessageBucket, RoomInfoToken, ServerConnectedState} from '../model/model';
import {Observable, Subscription} from 'rxjs';



@Component({
  selector: 'app-dashboard-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.less']
})
export class ChatPageComponent implements OnInit, OnDestroy {

  isConnected: boolean = false;
  private subscriptions: Subscription[] = [];
  needToReconnect: boolean = false;

  roomName: string;
  roomUserName: string;
  users$: Observable<string[]>;
  buckets$: Observable<ChatMessageBucket[]>;
  newMessage$: Observable<ChatMessage>;

  constructor(
    private joinRoomService: JoinRoomService,
    private router: Router,
    private messageManagerService: MessageManagerService,
    private roomInfoStore: RoomInfoStore,
    private messageStore: MessageStore,
  ) {

  }


  ngOnInit(): void {

    this.users$ = this.roomInfoStore.usersObservable$;
    this.buckets$ = this.messageStore.bucketsObservable$;
    this.newMessage$ = this.messageStore.newMessageObservable$;

    this.subscriptions.push(this.roomInfoStore.roomInfoObservable$.subscribe((roomInfoToken: RoomInfoToken) => {
      if (roomInfoToken) {
        this.roomName = roomInfoToken.room;
        this.roomUserName = roomInfoToken.name;
      }
    }));

    this.setupJoinRoomOnReconnectBehaviour();
  }


  private setupJoinRoomOnReconnectBehaviour() {
    this.subscriptions.push(this.roomInfoStore.roomConnectStatusObservable$.subscribe(value => {
      let isConnectedNewVal = (value === ServerConnectedState.connected);
      if (this.needToReconnect && this.isConnected !== isConnectedNewVal && isConnectedNewVal === true) {
        this.joinRoomService.tryJoinRoom().subscribe(() => {

        });
        this.needToReconnect = false;
      }
      if (isConnectedNewVal === false) {
        this.needToReconnect = true;
      }
      this.isConnected = isConnectedNewVal;
    }));

  }

  createMessage(text) {
    this.messageManagerService.createMessage(text);
  }

  leaveRoom() {
    this.joinRoomService.leaveRoom().subscribe(
      null, null,
      () => {
        this.router.navigateByUrl('/join-room');
        this.messageManagerService.unsubscribeFromChatEvents();
        this.messageManagerService.clearStores();
      });
  }

  ngOnDestroy(): void {
    this.messageManagerService.unsubscribeFromChatEvents();
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

}
