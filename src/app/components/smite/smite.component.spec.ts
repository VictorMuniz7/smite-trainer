import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmiteComponent } from './smite.component';

describe('SmiteComponent', () => {
  let component: SmiteComponent;
  let fixture: ComponentFixture<SmiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmiteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
