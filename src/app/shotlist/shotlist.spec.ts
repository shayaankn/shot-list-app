import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shotlist } from './shotlist';

describe('Shotlist', () => {
  let component: Shotlist;
  let fixture: ComponentFixture<Shotlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shotlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shotlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
