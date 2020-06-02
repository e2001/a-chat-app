import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ChatMessage, ChatMessageBucket} from '../../model/model';
import * as $ from 'jquery';

import {MessageManagerService} from '../../services/message-manager-service';

@Component({
  selector: 'chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.less']
})
export class ChatMessagesComponent implements OnInit {

  @ViewChild('bucketContainer')
  bucketContainer: ElementRef;

  @Input()
  buckets: ChatMessageBucket[];

  @Input()
  set newMessage(newMessage: ChatMessage) {
    if (newMessage) {
      setTimeout(() => {
        this.scrollToBottom();
      });
    }
  }

  constructor(private messageManagerService: MessageManagerService) {
  }

  ngOnInit() {

  }

  scrollToTop() {
    setTimeout(() => {
      $(this.bucketContainer.nativeElement).scrollTop(0);
    });
  }

  scrollToBottom() {
    $(this.bucketContainer.nativeElement).scrollTop(this.bucketContainer.nativeElement.scrollHeight);
  }

  removeAllMessages() {
    this.messageManagerService.removeAllMessgesAndDeleteLocalStorage();
  }
}
