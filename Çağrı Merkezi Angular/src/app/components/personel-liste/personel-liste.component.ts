import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { Subject, Subscription } from 'rxjs'; 
import { debounceTime } from 'rxjs/operators'; 
import Swal from 'sweetalert2'; 
import { serviceResponse } from 'src/app/entities/models/serviceResponseModel'; 
import { Personel } from 'src/app/entities/models/personel.model'; 
import { PersonelService } from 'src/app/entities/services/personel.service';
import { FormControl, FormGroup } from '@angular/forms';
 
@Component({ 
  selector: 'app-personel-liste', 
  templateUrl: './personel-liste.component.html', 
  styleUrls: ['./personel-liste.component.css'] 
}) 
export class PersonelListeComponent implements OnInit { 
  loading: boolean = false; 
  error: string = ''; 
  kayitListe: Personel[] = []; 
  dataPage: number = 1; 
  tumKayitlarYuklendi: boolean = false; 
  inputArama: string = ''; 


  kayitModel = new Personel(); 
  kayitRef: number = 0;

  fgKayit = new FormGroup({ 
    //inputpersonel_id: new FormControl(), 
    inputad: new FormControl(), 
    inputsoyad: new FormControl(), 
    inputemail: new FormControl(), 
    inputtelNo: new FormControl(), 
  })
 
  // Delayed change 
  private aramaChangedSubject: Subject<string> = new Subject<string>(); 
  private aramaChangedSubscription: Subscription; 
 
  constructor(private webApi: PersonelService, private router: Router) {  
    this.aramaChangedSubscription = this.aramaChangedSubject 
      .pipe(debounceTime(1000)) 
      .subscribe(() => { 
        this.KayitBul(); 
      });
  } 
 
  ngOnInit(): void { 
    this.kayitListesiOku(); 
  } 
 
  kayitListesiOku() { 
    var ilkTarihStr: string = ''; 
    var sonTarihStr: string = ''; 
    this.error = ''; 
    this.loading = true; 
    this.webApi.getPersonelListe(0, this.inputArama, 1, 50).subscribe( 
    { 
      next: (apiResponse: Personel[] /*serviceResponse<Personel>*/) => { 
        this.kayitListe = apiResponse as Personel[]; 
        this.loading = false; 
      }, 
      error: error => { 
        this.error = 'WebApi bağlantı hatası: ' + error.message; 
        Swal.fire('Hata oluştu!', this.error, 'error'); 
        this.loading = false; 
      }, 
      complete: () => {  
      } 
    }); 
  } 
 
  KayitBul() { 
    this.kayitListesiOku(); 
  } 
 
  formToModel() { 
    //this.kayitModel.personel_id = this.fgKayit.controls.inputpersonel_id.value;
    this.kayitModel.ad = this.fgKayit.controls.inputad.value;
    this.kayitModel.soyad = this.fgKayit.controls.inputsoyad.value;
    this.kayitModel.email = this.fgKayit.controls.inputemail.value;
    this.kayitModel.telNo = this.fgKayit.controls.inputtelNo.value;
  } 
 

  Kaydet() { 
    this.formToModel(); 
    this.loading = true; 
    this.webApi.postPersonelKayit(this.kayitModel).subscribe( 
      { 
        next: (apiResponse: Personel) => { 
            this.kayitModel.personel_id = this.kayitRef; 
            this.kayitListesiOku(); 
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

  onAddClientNeeds() {
    this.fgKayit.reset();
  }
 
  KayitDuzenle(kayitRef: number) { 
    localStorage.setItem('PersonelRef', kayitRef.toString()); 
    this.router.navigate(['/personel-kayit']); 
  } 
 
  KayitSil(kayitRef: number) { 
    Swal.fire({ 
      title: 'Personel silme', 
      text: "Bu Personel silinecektir!", 
      icon: 'warning', 
      showCancelButton: true, 
      cancelButtonColor: '#d33', 
      cancelButtonText: 'Vazgeç', 
      confirmButtonColor: '#3085d6', 
      confirmButtonText: 'Personelyi sil!' 
    }).then((result) => { 
      if (result.isConfirmed) { 
        this.webApi.getPersonelSil(kayitRef).subscribe((apiResponse: serviceResponse<Personel>) => { 
          if (apiResponse.success){ 
            this.kayitListesiOku(); 
            Swal.fire( 
              'Personel silindi!',  
              'Personel silindi', 
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
} 
 
