import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'chat-room-name',
  templateUrl: './chat-room-name.component.html',
  styleUrls: ['./chat-room-name.component.less']
})
export class ChatRoomNameComponent implements OnInit {

  @Input()
  roomName: string;

  ngOnInit(): void {
  }

}
