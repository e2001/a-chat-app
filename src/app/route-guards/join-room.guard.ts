import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {JoinRoomService} from '../services/join-room.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';

@Injectable()
export class NeedJoinRoomGuard implements CanActivate {

  constructor(private joinRoomService: JoinRoomService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const redirectUrl = route['_routerState']['url'];

    if (this.joinRoomService.isJoinedRoom()) {
      return true;
    }

    this.router.navigateByUrl(
      this.router.createUrlTree(
        ['/join-room'], {
          queryParams: {
            redirectUrl
          }
        }
      )
    );

    return false;
  }
}
