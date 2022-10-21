import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { Subject, Subscription } from 'rxjs'; 
import { debounceTime } from 'rxjs/operators'; 
import Swal from 'sweetalert2'; 
import { serviceResponse } from 'src/app/entities/models/serviceResponseModel'; 
import { Cagri } from 'src/app/entities/models/cagri.model'; 
import { CagriService } from 'src/app/entities/services/cagri.service';
 
@Component({ 
  selector: 'app-cagri-liste', 
  templateUrl: './cagri-liste.component.html', 
  styleUrls: ['./cagri-liste.component.css'] 
}) 
export class CagriListeComponent implements OnInit { 
  loading: boolean = false; 
  error: string = ''; 
  kayitListe: Cagri[] = []; 
  dataPage: number = 1; 
  tumKayitlarYuklendi: boolean = false; 
  inputArama: string = ''; 
  inputIlkTarih: Date; 
  inputSonTarih: Date; 
  kayitRef = 0;
  // Delayed change 
  private aramaChangedSubject: Subject<string> = new Subject<string>(); 
  private aramaChangedSubscription: Subscription; 
 
  constructor(private webApi: CagriService, private router: Router) { 
    this.inputIlkTarih = new Date(); 
    this.inputSonTarih = new Date(); 
    this.inputIlkTarih.setDate(this.inputIlkTarih.getDate() - 14); 
    this.aramaChangedSubscription = this.aramaChangedSubject 
      .pipe(debounceTime(1000)) 
      .subscribe(() => { 
        this.KayitBul(); 
      }); 
  } 
 
  ngOnInit(): void { 
    //this.PPlanCagriSec = Number(localStorage.getItem('PPlanCagriSec')); 
    //if (this.APPlanSatirModel.PAZARLAMA_REF == undefined) this.APPlanSatirModel.PAZARLAMA_REF = 0; 
    
    if (localStorage.getItem('kayitRef')) {
      this.kayitRef = Number(localStorage.getItem('kayitRef'));
      if (this.kayitRef > 0) this.kayitListesiOku();
     
    }
    this.kayitListesiOku(); 

    // EditArama değişimine abone oluyoruz. 
    
  } 
 
  parseDate(event: Event): Date { 
    let dateString: string = (event.target as HTMLInputElement).value; 
    if (dateString) { 
        return new Date(dateString); 
    } 
    return new Date(); 
  } 
 
  kayitListesiOku() { 
    var ilkTarihStr: string = ''; 
    var sonTarihStr: string = ''; 
    this.error = ''; 
    this.loading = true; 
    if (this.inputIlkTarih != undefined) ilkTarihStr = this.inputIlkTarih.toISOString().substring(0, 10); 
    if (this.inputSonTarih != undefined) sonTarihStr = this.inputSonTarih.toISOString().substring(0, 10); 
    this.webApi.getCagriListe(0, this.inputArama, 1, 50).subscribe( 
    { 
      next: (apiResponse: Cagri[] /*serviceResponse<Personel>*/) => { 
        this.kayitListe = apiResponse as Cagri[]; 
        this.loading = false;  
      }, 
      error: error => { 
        this.error = 'WebApi bağlantı hatası: ' + error.message; 
        Swal.fire('Hata oluştu!', this.error, 'error'); 
        this.loading = false; 
      }, 
      complete: () => { 
        //console.info('complete') 
      } 
    }); 
  } 
 
  KayitBul() { 
    this.kayitListesiOku(); 
  } 
 
  Kaydet() { 
    this.KayitDuzenle(0); 
  } 
 
  KayitDuzenle(kayitRef: number) { 
    localStorage.setItem('CagriRef', kayitRef.toString()); 
    this.router.navigate(['/cagri-kayit']); 
  } 
 
  KayitSil(kayitRef: number) { 
    //Swal.fire('Dikkat', 'Kayıt silme hazır değil. (Ref = ' + kayitRef + ')', 'info'); 
    Swal.fire({ 
      title: 'Cagri silme', 
      text: "Bu Cagri silinecektir!", 
      icon: 'warning', 
      showCancelButton: true, 
      cancelButtonColor: '#d33', 
      cancelButtonText: 'Vazgeç', 
      confirmButtonColor: '#3085d6', 
      confirmButtonText: 'Cagriyi sil!' 
    }).then((result) => { 
      if (result.isConfirmed) { 
        this.webApi.getCagriSil(kayitRef).subscribe((apiResponse: serviceResponse<Cagri>) => { 
          if (apiResponse.success){ 
            this.kayitListesiOku(); 
            Swal.fire( 
              'Cagri silindi!',  
              'Cagri silindi', 
              'success' 
            ) 
          } 
        }, 
        error => { 
          this.error = 'WebApi bağlantı hatası: ' + error.message; 
          this.loading = false; 
        }); 
      } 
    }) 
  } 
 
  KayitYazdir(kayitRef: number) { 
    localStorage.setItem('FirmaRef', kayitRef.toString()); 
    this.router.navigate(['/firma-analiz']); 
  } 
 
  inputAramaKeyUp(AramaStr: KeyboardEvent) { 
    this.dataPage = 1; 
    this.aramaChangedSubject.next(this.inputArama); 
  } 
 
  SonrakiSayfayiYukle(){ 
    this.dataPage += 1; 
    this.kayitListesiOku(); 
  }
  
  cagriKaydaGit(){
    this.router.navigate(['/cagri-kayit']);
  }
 
} 
