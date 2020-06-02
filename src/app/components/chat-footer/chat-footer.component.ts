import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'chat-footer',
  templateUrl: './chat-footer.component.html',
  styleUrls: ['./chat-footer.component.less']
})
export class ChatFooterComponent implements OnInit {

  constructor() {
  }

  @ViewChild('textarea')
  textarea: ElementRef;

  @Output()
  createMessage = new EventEmitter<string>();

  ngOnInit() {
  }

  sendMessage() {
    this.createMessage.emit(this.textarea.nativeElement.value);
  }
}
