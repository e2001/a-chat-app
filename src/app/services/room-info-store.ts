import {BehaviorSubject, Observable} from 'rxjs';
import {RoomInfoToken, ServerConnectedState} from '../model/model';
import {Injectable} from '@angular/core';

@Injectable()
export class RoomInfoStore {

  private roomInfoSubject = new BehaviorSubject<RoomInfoToken>(null);
  public roomInfoObservable$: Observable<RoomInfoToken> = this.roomInfoSubject.asObservable();

  private roomConnectStatus = new BehaviorSubject<ServerConnectedState>(ServerConnectedState.disconnected);
  public roomConnectStatusObservable$: Observable<ServerConnectedState> = this.roomConnectStatus.asObservable();

  private usersSubject = new BehaviorSubject<string[]>([]);
  public usersObservable$: Observable<string[]> = this.usersSubject.asObservable();

  updateUsers(names: string[]) {
    this.usersSubject.next(names);
  }

  removeAllUsers() {
    this.usersSubject.next([]);
  }

  setConnectStatus(state: ServerConnectedState) {
    this.roomConnectStatus.next(state);
  }

  setRoomInfo(roomInfoToken: RoomInfoToken) {
    this.roomInfoSubject.next(<RoomInfoToken>{
      ...roomInfoToken
    });
  }

  removeLogin() {
    this.roomInfoSubject.next(null);
  }

  hasRoomToken(): boolean {
    return this.roomInfoSubject.getValue() != null;
  }

  get name() {
    if (this.roomInfoSubject.getValue()) {
      return this.roomInfoSubject.getValue().name;
    }
  }

  get room() {
    if (this.roomInfoSubject.getValue()) {
      return this.roomInfoSubject.getValue().room;
    }
  }



}
