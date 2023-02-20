import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
  
import { SkillManagementRoutingModule } from './skillmanagement-routing.module';
import { IndexComponent } from './index/index.component';

  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
  
@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    SkillManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SkillManagementModule { }
