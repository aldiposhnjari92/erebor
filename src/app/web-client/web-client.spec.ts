import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebClient } from './web-client';

describe('WebClient', () => {
  let component: WebClient;
  let fixture: ComponentFixture<WebClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
