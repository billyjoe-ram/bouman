import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdictsComponent } from './Edicts.component';

describe('EdictsComponent', () => {
  let component: EdictsComponent;
  let fixture: ComponentFixture<EdictsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdictsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
