import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'disconnected-message',
  templateUrl: './disconnected-message.component.html',
  styleUrls: ['./disconnected-message.component.less']
})
export class DisconnectedMessageComponent implements OnInit {

  @Output() leaveRoomClicked = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

}
