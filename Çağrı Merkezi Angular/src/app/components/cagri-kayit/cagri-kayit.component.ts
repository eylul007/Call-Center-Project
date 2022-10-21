import { Component, OnInit } from '@angular/core'; 
import { environment } from 'src/environments/environment'; 
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { Cagri } from 'src/app/entities/models/cagri.model'; 
import Swal from 'sweetalert2'; 
import { AppComponent } from 'src/app/app.component'; 
import { CagriService } from 'src/app/entities/services/cagri.service';
//import { PersonelService } from 'src/app/entities/services/personel.service'; 
import { serviceResponse } from 'src/app/entities/models/serviceResponseModel'; 
import { Router } from '@angular/router'; 
import { Cihaz } from 'src/app/entities/models/cihaz.model';
import { Personel } from 'src/app/entities/models/personel.model';
 
@Component({ 
  selector: 'app-cagri-kayit', 
  templateUrl: './cagri-kayit.component.html', 
  styleUrls: ['./cagri-kayit.component.css'] 
}) 
export class CagriKayitComponent implements OnInit { 
  loading: boolean = false;
  error: string = '';
  kayitModel = new Cagri(); 
  kayitRef: number = 0;
  cihazListe: Cihaz[] = [];
  personelListe: Personel[] = [];
  currentDate = new Date();
 
  fgKayit = new FormGroup({ 
    //inputcagri_id: new FormControl(), 
    inputmusteri_ad: new FormControl(), 
    inputmusteri_soyad: new FormControl(), 
    inputmusteri_telNo: new FormControl(), 
    inputmusteri_email: new FormControl(), 
    inputsorun_basligi: new FormControl(), 
    inputsorun_aciklamasi: new FormControl(), 
    inputkayit_tarihi: new FormControl(), 
    inputtermin_tarihi: new FormControl(), 
    inputservis_tarihi: new FormControl(), 
    inputservis_ucreti: new FormControl(), 
    inputpersonel_id: new FormControl(),
    inputurun_grubu: new FormControl() 
  }) 
 
  constructor( 
    private webApi: CagriService, 
    private router: Router) 
  { 
      // 
  } 
 
  ngOnInit(): void {
    if (localStorage.getItem('CagriRef')) {
      this.kayitRef = Number(localStorage.getItem('CagriRef'));
      if (this.kayitRef > 0) this.kayitListesiOku();
      localStorage.removeItem('CagriRef');
    }

    this.cihazListeGetir(this.kayitRef);
    this.personelListeGetir(this.kayitRef)

  }

  get controls(): FormGroup['controls'] { 
    return this.fgKayit.controls; 
  } 
 
  modelToForm() { 
    this.fgKayit.controls.inputcagri_id.setValue(this.kayitModel.cagri_id);
    this.fgKayit.controls.inputmusteri_ad.setValue(this.kayitModel.musteri_ad);
    this.fgKayit.controls.inputmusteri_soyad.setValue(this.kayitModel.musteri_soyad);
    this.fgKayit.controls.inputmusteri_telNo.setValue(this.kayitModel.musteri_telNo);
    this.fgKayit.controls.inputmusteri_email.setValue(this.kayitModel.musteri_email);
    this.fgKayit.controls.inputsorun_basligi.setValue(this.kayitModel.sorun_basligi);
    this.fgKayit.controls.inputsorun_aciklamasi.setValue(this.kayitModel.sorun_aciklamasi);
    this.fgKayit.controls.inputkayit_tarihi.setValue(this.kayitModel.kayit_tarihi);
    this.fgKayit.controls.inputtermin_tarihi.setValue(this.kayitModel.termin_tarihi);
    this.fgKayit.controls.inputservis_tarihi.setValue(this.kayitModel.servis_tarihi);
    this.fgKayit.controls.inputservis_ucreti.setValue(this.kayitModel.servis_ucreti);
    this.fgKayit.controls.inputpersonel_id.setValue(this.kayitModel.personel_id);
    this.fgKayit.controls.inputurun_grubu.setValue(this.kayitModel.urun_grubu);
  } 
 
  formToModel() { 
    //this.kayitModel.cagri_id = this.fgKayit.controls.inputcagri_id.value;
    this.kayitModel.musteri_ad = this.fgKayit.controls.inputmusteri_ad.value;
    this.kayitModel.musteri_soyad = this.fgKayit.controls.inputmusteri_soyad.value;
    this.kayitModel.musteri_telNo = this.fgKayit.controls.inputmusteri_telNo.value;
    this.kayitModel.musteri_email = this.fgKayit.controls.inputmusteri_email.value;
    this.kayitModel.sorun_basligi = this.fgKayit.controls.inputsorun_basligi.value;
    this.kayitModel.sorun_aciklamasi = this.fgKayit.controls.inputsorun_aciklamasi.value;
    this.kayitModel.kayit_tarihi = this.fgKayit.controls.inputkayit_tarihi.value ?? this.currentDate;
    this.kayitModel.termin_tarihi = this.fgKayit.controls.inputtermin_tarihi.value;
    this.kayitModel.servis_tarihi = this.fgKayit.controls.inputservis_tarihi.value;
    this.kayitModel.servis_ucreti = this.fgKayit.controls.inputservis_ucreti.value;
    this.kayitModel.personel_id = this.fgKayit.controls.inputpersonel_id.value;
    this.kayitModel.urun_grubu = this.fgKayit.controls.inputurun_grubu.value;
  } 
 
  kayitListesiOku() { 
    this.error = ''; 
    this.loading = true; 
    this.webApi.getCagriListe(this.kayitRef,"", 1, 50).subscribe( 
    { 
      next: (apiResponse: Cagri[]) => { 
          this.error = ''; 
          Object.assign(this.kayitModel, apiResponse[0]); 
          this.modelToForm(); 
      }, 
      error: (error: { message: string; }) => { 
        this.error = 'WebApi bağlantı hatası: ' + error.message; 
        Swal.fire('Hata oluştu!', this.error, 'error'); 
        this.loading = false; 
      }, 
      complete: () => { 
      } 
    }); 
  } 
 
  Kaydet(): void { 
    this.formToModel(); 
    this.loading = true; 
    this.webApi.postCagriKayit(this.kayitModel).subscribe( 
      { 
        next: (apiResponse: Cagri) => {          
            this.kayitModel.cagri_id = this.kayitRef; 
        }, 
        error: (error: { message: string; }) => { 
          this.error = 'WebApi bağlantı hatası: ' + error.message; 
          Swal.fire('Hata oluştu!', this.error, 'error'); 
          this.loading = false; 
        }, 
        complete: () => { 
          //console.info('complete') 
        } 
      }); 

      this.cagriListeyeGit();
  }
  
  onAddClientNeeds(){
    this.fgKayit.reset();
  }

  cihazListeGetir(kayitRef:number){
    this.loading = true; 
    this.webApi.getCihazListe().subscribe( 
    { 
      next: (apiResponse: Cihaz[]) => { 
        this.cihazListe = apiResponse as Cihaz[]; 
        this.loading = false;  
      }
    })
  }
 
  cagriListeyeGit(){
    this.router.navigate(['/cagrilar']);
  }

  personelListeGetir(kayitRef:number){
    this.loading = true; 
    this.webApi.getPersoneller().subscribe( 
    { 
      next: (apiResponse: Personel[]) => { 
        this.personelListe = apiResponse as Personel[]; 
        this.loading = false;  
      }
    })
  }
} 

