import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable, Observer} from 'rxjs';

import 'rxjs/add/observable/of';
import {ChatMessage, CreateMessageRequestData, IJoinRoomResultModel} from '../model/model';


@Injectable()
export class MessagesSocketService {

  private isConnected = false;

  constructor(private socket: Socket) {
    this.disconnectEvent$.subscribe(() => {
      this.isConnected = false;
    });
    this.connectEvent$.subscribe(() => {
      this.isConnected = true;
    });
  }

  disconnectEvent$ = this.socket.fromEvent<null>('disconnect');
  connectEvent$ = this.socket.fromEvent<null>('connect');

  newMessageEvent$ = this.socket.fromEvent<ChatMessage>('new-message');

  updateUserList$ = this.socket.fromEvent<string[]>('update-user-list');

  joinRoom(name: string, room: string): Observable<IJoinRoomResultModel> {
    return Observable.create((observer: Observer<IJoinRoomResultModel>) => {
      const successCallback = (loginModel: IJoinRoomResultModel) => {
        observer.next(loginModel);
        observer.complete();
      };
      const errorCallback = (err: string) => {
        observer.error(err);
        observer.complete();
      };
      this.socket.emit('join-room', {name: name, room: room}, (loginResult: IJoinRoomResultModel) => {
        if (loginResult.err) {
          errorCallback(loginResult.err);
        }
        successCallback(loginResult);
      });

    });
  }

  createMessage(createMessageRequestData: CreateMessageRequestData) {

    this.socket.emit('create-message', createMessageRequestData);
  }


  leaveRoom(): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      if (this.isConnected) {
        this.socket.emit('leave-room', null, () => {
          observer.next(true);
          observer.complete();
        });
      } else {
        observer.next(true);
        observer.complete();
      }
    });
  }
}
