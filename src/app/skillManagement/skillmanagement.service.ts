import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
     
import {  Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
  
import { SkillManagement } from './skillmanagement';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillManagementService {
  
  private skillManagementAPIUrl = environment.apiUrl;
    
  /*------------------------------------------
  --------------------------------------------
  Http Header Options
  --------------------------------------------
  --------------------------------------------*/
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
   
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(private httpClient: HttpClient) { }
    
  
  /**
   * Write code on Method
   *
   * @return response()
   */
  getAllSkills(searchtext:any): Observable<any> {
    return this.httpClient.get(this.skillManagementAPIUrl + '/SkillsMatrix/GetSkillMatrix?skillName=' + searchtext)

      .pipe(
        catchError(this.errorHandler)
      )
  }

  getAllPractices(): Observable<any> {
    return this.httpClient.get(this.skillManagementAPIUrl + '/Practices/GetAllPractices')

      .pipe(
        catchError(this.errorHandler)
      )
  }
  getAllCategories(practiceId:any): Observable<any> {
    return this.httpClient.get(this.skillManagementAPIUrl + '/Categories/GetAllCategories?practicesId=' + practiceId)

      .pipe(
        catchError(this.errorHandler)
      )
  }
  getTechnology(categoryId:any): Observable<any> {
    return this.httpClient.get(this.skillManagementAPIUrl + '/TechnologyStack/GetTechnologyStack?categoryId=' + categoryId)

      .pipe(
        catchError(this.errorHandler)
      )
  }
  getAllTechnology(): Observable<any> {
    return this.httpClient.get(this.skillManagementAPIUrl + '/TechnologyStack/GetAllTechnologyStack')

      .pipe(
        catchError(this.errorHandler)
      )
  }
  getProficiencyLevel(): Observable<any> {
    return this.httpClient.get(this.skillManagementAPIUrl + '/ProficiencyLevel/GetAllLevels')

      .pipe(
        catchError(this.errorHandler)
      )
  }
  /**
   * Write code on Method
   *
   * @return response()
   */
  createSkillMatrixOnSearch(skillMatrix: any): Observable<any> {
  
    return this.httpClient.post(this.skillManagementAPIUrl + '/SkillsMatrix/CreateSkillsMatrix/', skillMatrix, this.httpOptions)
  
    .pipe(
      catchError(this.errorHandler)
    )
  }  

  updateSkillMatrix(skillData: any): Observable<any> {

    return this.httpClient.post(this.skillManagementAPIUrl + '/SkillsMatrix/UpdateSkillsMatrix/', skillData, this.httpOptions)

      .pipe(
        catchError(this.errorHandler)
      )
  }
      
  /** 
   * Write code on Method
   *
   * @return response()
   */
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
 }
}
