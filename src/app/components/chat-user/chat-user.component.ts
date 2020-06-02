import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.less']
})
export class ChatUserComponent implements OnInit {

  @Input()
  name: string;

  ngOnInit(): void {
  }

}
