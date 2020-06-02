import {Injectable} from '@angular/core';
import {ChatMessage, ChatMessageBucket} from '../model/model';


@Injectable()
export class ChatLocalStorageService {

  readonly CHAT_STATE_KEY: string = 'CHAT_STATE';

  loadStateFromStorage(name: string, room: string): ChatMessageBucket[] {

    let historyStr = localStorage.getItem(this.getKey(name, room));
    if (historyStr) {
      let history = <ChatMessageBucket[]>JSON.parse(historyStr);
      if (history) {
        let history2 = history.map((bucket) => {
          return Object.assign(new ChatMessageBucket(bucket), <ChatMessageBucket>{
            messages: bucket.messages.map((message) => {
              return new ChatMessage(message);
            })
          });
        });
        return history2;
      }
    }

    return [];
  }

  saveStateInStorage(name: string, room: string, buckets: ChatMessageBucket[]) {
    localStorage.setItem(this.getKey(name, room), JSON.stringify(buckets));
  }

  private getKey(name: string, room: string) {
    return this.CHAT_STATE_KEY + '_' + name + '_' + room;
  }

}
