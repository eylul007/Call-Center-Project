import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CagriKayitComponent } from './components/cagri-kayit/cagri-kayit.component';
import { CagriListeComponent } from './components/cagri-liste/cagri-liste.component'; 
import { HomeComponent } from './components/home/home.component';
import { PersonelListeComponent } from './components/personel-liste/personel-liste.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'cagrilar',
        component: CagriListeComponent
      },
      {
        path: 'cagri-kayit',
        component: CagriKayitComponent
      },
      {
        path: 'personeller',
        component: PersonelListeComponent
      }
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
