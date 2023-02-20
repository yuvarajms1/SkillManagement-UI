import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';


  
const routes: Routes = [
  { path: 'skillmanagement', redirectTo: 'skillmanagement/index', pathMatch: 'full'},
  { path: 'skillmanagement/index', component: IndexComponent }
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillManagementRoutingModule { }
