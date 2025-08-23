import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagment } from './inventory-managment';

describe('InventoryManagment', () => {
  let component: InventoryManagment;
  let fixture: ComponentFixture<InventoryManagment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryManagment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryManagment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
