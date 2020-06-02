export interface IRoomJoinRequestModel {
  chatName:any;
  roomName:any;
}

export interface IJoinRoomResultModel {
  room: undefined;
  name: undefined;
  err: undefined;
}

export class RoomInfoToken {
  name: string;
  room: string;

  constructor(room: string, name: string) {
    this.room = room;
    this.name = name;
  }
}


export class CreateMessageRequestData {
  text: string;

  constructor(init?: Partial<CreateMessageRequestData>) {
    Object.assign(this, init);
  }
}


export enum ServerConnectedState {
  connected,
  disconnected
}

export class ChatMessage {
  from: string;
  text: string;
  createdAt: string;
  id: string;

  constructor(init?: Partial<ChatMessage>) {
    Object.assign(this, init);
  }
}



export class ChatMessageBucket {
  private static _maxsize: number = 2;

  static get messgeCapacity(): number {
    return ChatMessageBucket._maxsize;
  }

  static setMessgeCapacity(value: number) {
    ChatMessageBucket._maxsize = value;
  }

  id: string;
  messages: ChatMessage[];

  isFull() {
    return this.messages.length === ChatMessageBucket.messgeCapacity;
  }

  constructor(init?: Partial<ChatMessage>) {
    Object.assign(this, init, {
      messages: []
    });
  }
}
