import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelSearchDialogComponent } from './channel-search-dialog.component';

describe('ChannelSearchDialogComponent', () => {
  let component: ChannelSearchDialogComponent;
  let fixture: ComponentFixture<ChannelSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
