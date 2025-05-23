import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingFormComponent } from './drawing-form.component';

describe('DrawingFormComponent', () => {
  let component: DrawingFormComponent;
  let fixture: ComponentFixture<DrawingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
