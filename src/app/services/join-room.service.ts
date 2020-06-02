import {Injectable} from '@angular/core';
import {IJoinRoomResultModel, RoomInfoToken} from '../model/model';
import {MessagesSocketService} from './messages-socket.service';
import 'rxjs/add/operator/do';
import {Observable} from 'rxjs';
import {RoomInfoStore} from './room-info-store';
import {HelperService} from './helper.service';

const TOKEN = 'CHAT_ROOM_TOKEN';


@Injectable({
  providedIn: 'root'
})
export class JoinRoomService {

  constructor(
    private messagesSocketService: MessagesSocketService,
    private roomInfoStore: RoomInfoStore,
    private helperService: HelperService
  ) {

  }


  joinRoom(name: string, room: string) {
    return this._joinRoomInternal(new RoomInfoToken(this.helperService.toTitleCase(room), name));
  }

  tryJoinRoom(): Observable<boolean> {
    let token = this._getRoomToekn();
    return this._joinRoomInternal(token);
  }

  private _joinRoomInternal(token: RoomInfoToken): Observable<boolean> {
    if (token) {
      return this.messagesSocketService.joinRoom(token.name, token.room).do(
        (loginResult: IJoinRoomResultModel) => {
          if (loginResult) {
            let loginToken = new RoomInfoToken(loginResult.room, loginResult.name);
            this._setRoomToken(loginToken);
            this.roomInfoStore.setRoomInfo(loginToken);
          }
        }).map(() => {
        return true;
      });
    } else {
      return Observable.of(false);
    }
  }

  leaveRoom(): Observable<boolean> {
    return this.messagesSocketService.leaveRoom().do(
      null, null,
      () => {
        this._removeRoomToken();
        this.roomInfoStore.removeLogin();
      });

  }

  private _setRoomToken(token: RoomInfoToken): void {
    sessionStorage.setItem(TOKEN, JSON.stringify(token));
  }

  isJoinedRoom() {
    return this.roomInfoStore.hasRoomToken();
  }


  private _getRoomToekn(): RoomInfoToken {
    return <RoomInfoToken>JSON.parse(sessionStorage.getItem(TOKEN));
  }

  private _removeRoomToken() {
    sessionStorage.removeItem(TOKEN);
  }
}
