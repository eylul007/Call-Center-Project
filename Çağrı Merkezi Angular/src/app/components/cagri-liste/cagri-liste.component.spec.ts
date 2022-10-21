import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CagriListeComponent } from './cagri-liste.component';

describe('CagriListeComponent', () => {
  let component: CagriListeComponent;
  let fixture: ComponentFixture<CagriListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CagriListeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CagriListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
