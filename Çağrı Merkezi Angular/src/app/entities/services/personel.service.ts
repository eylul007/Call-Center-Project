import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Router } from '@angular/router'; 
import { throwError, Observable } from 'rxjs'; 
import { environment } from 'src/environments/environment'; 
//import { AuthService } from './auth.service'; 
import { serviceResponse } from '../models/serviceResponseModel';
import { Personel } from '../models/personel.model';
 
@Injectable({ 
  providedIn: 'root' 
}) 
 
export class PersonelService { 
  header = new HttpHeaders({ 
    'Content-Type': 'application/json', 
    //'Authorization': 'Bearer ' + this.authenticationService.currentUserSubject.value.JWT_KEY 
  }); 
 
  constructor(private http: HttpClient, private router: Router/*, private authenticationService: AuthenticationService*/) { } 
  errorHandler(error: Response) { 
    console.log('hatakodu = ' + error); 
    return throwError(error); 
  } 
 
  getPersonelListe(kayitRef: number, arama: string, page: number, pageSize: number) { 
    let parametre: string = ''; 
    if (kayitRef != null) parametre += '&kayitRef=' + kayitRef; 
    if (arama != null && arama != '') parametre += '&arama=' + arama; 
    if (page != null) parametre += '&page=' + page; 
    if (pageSize != null) parametre += '&pageSize=' + pageSize; 
    if (parametre != '') parametre = '?' + parametre.substr(1); 
    //return this.http.get<serviceResponse<Personel>>(environment.api_url + '/api/Personel' + parametre, { headers: this.header }) 
    return this.http.get<Personel[]>(environment.api_url + '/api/Personel/personel-liste' + parametre, { headers: this.header }) 
  } 
 
  postPersonelKayit(AModel: Personel) { 
    return this.http.post<Personel>(environment.api_url + '/api/Personel/personel-kayit', AModel, { headers: this.header }); 
  } 
 
  getPersonelSil(kayitRef: number) { 
    let parametre: string = ''; 
    if (kayitRef != null) parametre += '&kayitRef=' + kayitRef; 
    if (parametre != '') parametre = '?' + parametre.substr(1); 
    return this.http.get<serviceResponse<Personel>>(environment.api_url + '/api/personel-sil' + parametre, { headers: this.header }) 
  } 
 
} 