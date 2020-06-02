import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JoinRoomPageComponent} from './join-room-page.component';


@NgModule({
  imports: [
    CommonModule,
    //FormsModule,
    ReactiveFormsModule
  ],
  declarations: [JoinRoomPageComponent],
  exports: [
    JoinRoomPageComponent
  ]
})
export class JoinRoomPageModule {

  constructor() {

  }
}
