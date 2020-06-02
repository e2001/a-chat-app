import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {JoinRoomService} from '../services/join-room.service';

@Injectable()
export class IsJoinedRoomGuard {
  constructor(private joinRoomService: JoinRoomService, private router: Router) {
  }

  resolve(): void {
    if (this.joinRoomService.isJoinedRoom()) {
      this.router.navigate(['/chat-page']);
    }
  }
}
