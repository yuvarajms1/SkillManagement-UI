import { Component, OnInit } from '@angular/core';
import { SkillManagementService } from '../skillmanagement.service';
import { SkillManagement } from '../skillmanagement';
import { ToastrService } from 'ngx-toastr';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Validation from '../../Validation';
import { forkJoin, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
      
  searchTechStack: any = [];
  employeeName: any = '';
  form: FormGroup = new FormGroup({
   
    searchText: new FormControl(''),
    
  });
  submitted = false;
  isSearchVisible = false;

  technology: any = [];
  proficiencyLevel: any = [];
  private unsubscribe$ = new Subject();
  categoryDisabled = true;
  practices: any = [];
  categories: any = [];

  showdefault: boolean = true;

  defaultpracticeId = 0;
  defaultCategoryId = 0;
  innerSearch='';
  innerGridClass='toast-top-center';
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(public skillManagementService: SkillManagementService, private formBuilder: FormBuilder, private toastrService: ToastrService) { }
    
  /**
   * Write code on Method
   *
   * @return response()
   */
  ngOnInit(): void {
 

    this.form = this.formBuilder.group(
      {
        
        searchText: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ],
        ]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
    this.loadPractices();
    this.skillManagementService.getProficiencyLevel().subscribe((data: any) => {
      this.proficiencyLevel = data;


    })
    

  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit():void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    
    this.showdefault = false;
    forkJoin([
      this.skillManagementService.getAllSkills(this.form.value.searchText)

    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([skills]) => {
        this.searchTechStack = skills;
        this.isSearchVisible = true;
        if (skills != null) {
          this.employeeName = skills[0].employeeName;
        }
      });
  }
  onReset(): void {
    this.submitted = false;
    this.showdefault = true;
    this.searchTechStack = [];
    this.practices = [];
    this.categories = [];
    this.technology = [];
    this.defaultpracticeId = 0;
    this.defaultCategoryId = 0;
    this.categoryDisabled = true;
    this.loadPractices();
    this.form.reset();
  }

  saveSkillsOnSearch() {
    if (this.validateSkill()) {
      for (let i = 0; i < this.searchTechStack.length; i++) {
        var filterlist = this.searchTechStack[i].technologyStack.filter((x: any) => x.selected);
        this.searchTechStack[i].employeeName=this.employeeName;
         this.searchTechStack[i].technologyStack = filterlist;
      }
      this.addTechSkill(this.searchTechStack);
    }
  }

  validateSkill() {
    var result = '';
    var filterTechlist = this.searchTechStack.filter((item: any) => item.technologyStack.some((ts: any) => ts.selected));

    if (filterTechlist.length == 0) {
      this.toastrService.error('Please select atleast one technology and choose corresponding skill level ', 'Validation',{positionClass:this.innerGridClass});
      result = 'Error';
      return false;
    }

    for (let i = 0; i < this.searchTechStack.length; i++) {

      
      for (let j = 0; j < this.searchTechStack[i].technologyStack.length; j++) {
        var technology = this.searchTechStack[i].technologyStack[j].technologyName;

        if ((this.searchTechStack[i].technologyStack[j].selectedProficiencyLevel == 0 || this.searchTechStack[i].technologyStack[j].selectedProficiencyLevel == undefined) && this.searchTechStack[i].technologyStack[j].selected) {
          this.toastrService.error('Please choose the skill level for the selected technology ' + technology, 'Validation',{positionClass:this.innerGridClass});
          result = 'Error';
        }

      }
    }

    if (result == 'Error') {
      return false;
    }
    else { return true; }
  }
  addTechSkill(skill:any) {

    this.skillManagementService.createSkillMatrixOnSearch(skill)
      .subscribe((searchTechStack) => {
        this.toastrService.success('Skills Saved Successfully', 'Add Skills',{positionClass:this.innerGridClass});
        this.onSubmit();
      })
  }
  handlePracticeChange(event: any) {

    const practiceID = event.target.value;
    this.defaultpracticeId = event.target.value;
    this.technology = [];
    this.categories = [];
    this.defaultCategoryId=0;
    if (practiceID == 0) {
      this.categoryDisabled = true;
    } else {
      this.skillManagementService.getAllCategories(practiceID).subscribe((category) => {
        this.categories = category;
        this.categoryDisabled = false;
      });
    }
  }

  handleCategoryChange(event: any): void {
    const categoryID = event.target.value;
    this.defaultCategoryId = event.target.value;
    this.technology = [];

    if (categoryID == 0) {
    } else {
      this.skillManagementService.getTechnology(categoryID).subscribe((techStacks) => {
        this.technology = techStacks;
      });
    }
  }
  loadPractices() {
    this.skillManagementService.getAllPractices().subscribe((practices) => {
      this.practices = practices;
    });
  }

  updateTechSkill() {


    if (this.defaultpracticeId == 0) {
      this.toastrService.error('Please select Practice', 'Validation',{positionClass:this.innerGridClass});
      return false;
    }

    if (this.defaultCategoryId == 0) {
      this.toastrService.error('Please select Category', 'Validation',{positionClass:this.innerGridClass});
      return false;
    }

    if (this.validateOnUpdate()) {
      var filterlist = this.technology.filter((x: any) => x.selected);
      this.technology = filterlist;
      this.skillManagementService.updateSkillMatrix(this.technology)
        .subscribe((data) => {
          this.toastrService.success('Skills Saved Successfully', 'Add Skills',{positionClass:this.innerGridClass});
          this.onReset();
        })
    }
    return;
  }
  validateOnUpdate() {
    var result = '';
    var filterlist = this.technology.filter((x: any) => x.selected);
    
    if (filterlist.length == 0) {
      this.toastrService.error('Please select atleast one technology and choose corresponding skill level ', 'Validation',{positionClass:this.innerGridClass});
      result = 'Error';
    }

    for (let i = 0; i < this.technology.length; i++) {
      var technology = this.technology[i].technologyName;
      if ((this.technology[i].selectedProficiencyLevel == 0 || this.technology[i].selectedProficiencyLevel == undefined) && this.technology[i].selected) {
        this.toastrService.error('Please choose the skill level for the selected technology ' + technology, 'Validation',{positionClass:this.innerGridClass});
        result = 'Error';
      }

    }

    if (result == 'Error') {
      return false;
    }
    else { return true; }

  }

  setTrColor(index:any)
  {
    if(index % 2){
      return this.innerSearch ='background-color: none'
    }
    else
    {
      return this.innerSearch ='background-color: #DDF1FB;'
      
    }
  }
}
