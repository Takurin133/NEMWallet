import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPage } from './account/account.page';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [AccountPage],
  entryComponents: [AccountPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ]
})
export class SettingModule { }
