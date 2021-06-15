import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdictCardComponent } from './edict-card.component';

describe('EdictCardComponent', () => {
  let component: EdictCardComponent;
  let fixture: ComponentFixture<EdictCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdictCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdictCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
