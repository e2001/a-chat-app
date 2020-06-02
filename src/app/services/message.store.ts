import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {ChatMessage, ChatMessageBucket} from '../model/model';
import * as shortUuid from 'short-uuid';


@Injectable()
export class MessageStore {

  private MAX_MESSAGE_PER_BUCKET = 2;
  private MAX_MESSAGE = 5;
  private last_message_num: number;
  private loadedIndex = 0;
  private loadedBuckets: ChatMessageBucket[];

  private translator = shortUuid();
  private bucketIds: string[] = [];

  private get currentBucket() {
    let bucketsArr = this.bucketsSubject.getValue();
    return bucketsArr[bucketsArr.length - 1];
  }

  private bucketsSubject = new BehaviorSubject<ChatMessageBucket[]>([]);
  public bucketsObservable$: Observable<ChatMessageBucket[]> = this.bucketsSubject.asObservable();

  private newMessageSubject = new BehaviorSubject<ChatMessage>(null);
  public newMessageObservable$: Observable<ChatMessage> = this.newMessageSubject.asObservable();

  constructor() {
    // const last_message_numStr = localStorage.getItem('last_message_num');
    // if (last_message_numStr) {
    //   console.log('constructor last_message_numStr', last_message_numStr);
    //   this.last_message_num = JSON.parse(last_message_numStr);
    // } else {
    //   this.last_message_num = -1;
    //   localStorage.setItem('last_message_numStr', JSON.stringify(this.last_message_num));
    // }
    // this.loadedIndex = this.bucketIds.length;
    // this.tryloadNextBucket();

  }


  _addBucket() {
    this.bucketsSubject.next([...this.bucketsSubject.getValue(),
      new ChatMessageBucket({id: this.translator.new()})]);
  }

  // addHistory(buckets: ChatMessageBucket[]) {
  //
  //   let bucketsDeepCopy = JSON.parse(JSON.stringify(buckets));
  //
  //   this.bucketsSubject.next([...bucketsDeepCopy, ...this.bucketsSubject.getValue()]);
  //   //let historicalBucket = new ChatMessageBucket(this.translator.new());
  //   // historicalBucket.messages.push(new ChatMessage({
  //   //   id: this.translator.new(),
  //   //   from: 'from',
  //   //   createdAt: 'createdAt',
  //   //   text: 'history 1'
  //   // }));
  //   // historicalBucket.messages.push(new ChatMessage({
  //   //   id: this.translator.new(),
  //   //   from: 'from',
  //   //   createdAt: 'createdAt',
  //   //   text: 'history 2'
  //   // }));
  //
  // }

  addMessage(newChatMessage2: ChatMessage) {

    if (!this.currentBucket || this.currentBucket.isFull()) {
      this._addBucket();
    }

    this.currentBucket.messages.push(newChatMessage2);

    this.newMessageSubject.next(newChatMessage2);
  }

  setHistory(buckets: ChatMessageBucket[]) {
    //let bucketsDeepCopy = JSON.parse(JSON.stringify(buckets));

    this.bucketsSubject.next([...buckets, ...this.bucketsSubject.getValue()]);
  }

  getStoreState(): ChatMessageBucket[] {
    return this.bucketsSubject.getValue();
  }

  // tryloadNextBucket() {
  //   if (this.loadedIndex > 1) {
  //     let id = this.bucketIds[this.loadedIndex - 1];
  //     let bucketStr = localStorage.getItem('bucket_' + id);
  //     if (bucketStr) {
  //       this.loadedBuckets.unshift(JSON.parse(bucketStr));
  //       this.loadedIndex = this.loadedIndex - 1;
  //     } else {
  //       this.bucketIds.splice(this.loadedIndex - 1, 1);
  //       this.loadedIndex = this.loadedIndex - 1;
  //     }
  //   }
  //   console.log('tryloadNextBucket loadedIndex', this.loadedIndex);
  // }

  // addBucket() {
  //   let bucket = new ChatMessageBucket(this.translator.new());
  //   try {
  //     localStorage.setItem('bucket_' + bucket.id, JSON.stringify(bucket));
  //     this.loadedBuckets.push(bucket);
  //     this.bucketIds.push(bucket.id);
  //     localStorage.setItem('bucketIds', JSON.stringify(this.bucketIds));
  //   } catch (e) {
  //
  //   }
  //   console.log('addBucket loadedIndex', this.loadedIndex);
  // }

  // private lastId = 0;
  //
  // findLastMessage() {
  //   if ('bucket_10' in localStorage) {
  //     alert('yes');
  //   } else {
  //     alert('no');
  //   }
  // }

  clearStore() {
    this.bucketsSubject.next([]);
  }
}
