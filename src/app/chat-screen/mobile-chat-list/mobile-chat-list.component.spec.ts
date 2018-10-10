import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileChatListComponent } from './mobile-chat-list.component';

describe('MobileChatListComponent', () => {
  let component: MobileChatListComponent;
  let fixture: ComponentFixture<MobileChatListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileChatListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
