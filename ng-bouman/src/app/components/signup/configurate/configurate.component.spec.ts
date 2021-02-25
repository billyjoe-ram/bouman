import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurateComponent } from './configurate.component';

describe('ConfigurateComponent', () => {
  let component: ConfigurateComponent;
  let fixture: ComponentFixture<ConfigurateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
