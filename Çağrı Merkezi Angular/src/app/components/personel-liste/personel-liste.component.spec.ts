import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonelListeComponent } from './personel-liste.component';

describe('PersonelListeComponent', () => {
  let component: PersonelListeComponent;
  let fixture: ComponentFixture<PersonelListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonelListeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonelListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
