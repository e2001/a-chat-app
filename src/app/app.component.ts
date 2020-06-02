import {Component, OnDestroy, OnInit} from '@angular/core';
import {MessageManagerService} from './services/message-manager-service';
import {ChatMessageBucket} from './model/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private messageManagerService: MessageManagerService) {
    ChatMessageBucket.setMessgeCapacity(4);
  }

  ngOnInit(): void {
    this.messageManagerService.orchestrateRoomEvents();

  }

  ngOnDestroy(): void {
    this.messageManagerService.unsubscribeFromRoomEvents();
  }

}
