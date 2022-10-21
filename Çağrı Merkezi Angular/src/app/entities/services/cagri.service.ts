import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Router } from '@angular/router'; 
import { throwError, Observable } from 'rxjs'; 
import { environment } from 'src/environments/environment'; 
//import { AuthService } from './auth.service'; 
import { serviceResponse } from '../models/serviceResponseModel'; 
import { Cagri } from '../models/cagri.model';
import { Cihaz } from '../models/cihaz.model';
import { Personel } from '../models/personel.model';

@Injectable({ 
  providedIn: 'root' 
}) 
 
export class CagriService {
 
  header = new HttpHeaders({ 
    'Content-Type': 'application/json', 
    //'Authorization': 'Bearer ' + this.authenticationService.currentUserSubject.value.JWT_KEY 
  }); 
 
  constructor(private http: HttpClient, private router: Router/*, private authenticationService: AuthenticationService*/) { } 
  errorHandler(error: Response) { 
    console.log('hatakodu = ' + error); 
    return throwError(error); 
  } 
 
  getCagriListe(kayitRef: number, arama: string, page: number, pageSize: number) { 
    let parametre: string = ''; 
    if (kayitRef != null) parametre += '&kayitRef=' + kayitRef; 
    if (arama != null && arama != '') parametre += '&arama=' + arama; 
    if (page != null) parametre += '&page=' + page; 
    if (pageSize != null) parametre += '&pageSize=' + pageSize; 
    if (parametre != '') parametre = '?' + parametre.substr(1); 
    return this.http.get<Cagri[]>(environment.api_url + '/api/Cagri/cagri-liste') 
  } 
 
  postCagriKayit(AModel: Cagri) { 
    return this.http.post<Cagri>(environment.api_url + '/api/Cagri/cagri-kayit', AModel, { headers: this.header }); 
  } 
 
  getCagriSil(kayitRef: number) { 
    let parametre: string = ''; 
    if (kayitRef != null) parametre += '&kayitRef=' + kayitRef; 
    if (parametre != '') parametre = '?' + parametre.substr(1); 
    return this.http.get<serviceResponse<Cagri>>(environment.api_url + '/api/cagri-sil' + parametre, { headers: this.header }) 
  }
  
  getCihazListe(){
    return this.http.get<Cihaz[]>(environment.api_url + '/api/Cihaz/cihaz-liste')
  }
 
  getPersoneller(){
    return this.http.get<Personel[]>(environment.api_url + '/api/Personel/personel-liste')
  }
} 
