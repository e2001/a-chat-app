import {Component, OnInit} from '@angular/core';
import {JoinRoomService} from '../services/join-room.service';
import {Router} from '@angular/router';
import {MessageManagerService} from '../services/message-manager-service';
import {RoomInfoStore} from '../services/room-info-store';
import {IRoomJoinRequestModel, ServerConnectedState} from '../model/model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'join-room-page',
  templateUrl: './join-room-page.component.html',
  styleUrls: ['./join-room-page.component.less']
})
export class JoinRoomPageComponent implements OnInit {

  isConnected: boolean;
  joinRoomForm: FormGroup;
  submitted = false;

  constructor(private joinRoomService: JoinRoomService,
              private router: Router,
              private messageManagerService: MessageManagerService,
              private roomInfoStore: RoomInfoStore,
              private formBuilder: FormBuilder) {
    this.isConnected = false;

    this.joinRoomForm = this.formBuilder.group(<IRoomJoinRequestModel>{
      chatName: ['', Validators.required],
      roomName: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.joinRoomForm.controls;
  }

  ngOnInit(): void {

    this.roomInfoStore.roomConnectStatusObservable$.subscribe(value => {
      this.isConnected = (value === ServerConnectedState.connected);
    });

    this.joinRoomService.tryJoinRoom().subscribe((success) => {
      if (success) {
        this.messageManagerService.loadMessageHistory();
        this.messageManagerService.orchestrateChatEvents();
        this.router.navigateByUrl('/chat-page');
      } else {
        //alert('joinRoom error');
      }
    });
  }


  tryJoinRoom() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.joinRoomForm.invalid) {
      return;
    }

    // Make sure to create a deep copy of the form-model
    const registerData: IRoomJoinRequestModel = _.cloneDeep(this.joinRoomForm.value);

    this.joinRoomService.joinRoom(registerData.chatName, registerData.roomName)
      .subscribe(
        (success) => {
          if (success) {
            this.messageManagerService.loadMessageHistory();
            this.messageManagerService.orchestrateChatEvents();
            this.router.navigateByUrl('/chat-page');
          } else {
            alert('joinRoom error');
          }
        });

  }
}
