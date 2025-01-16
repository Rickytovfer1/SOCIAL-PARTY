import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeedNoticiasComponent } from './feed-noticias.component';

describe('FeedNoticiasComponent', () => {
  let component: FeedNoticiasComponent;
  let fixture: ComponentFixture<FeedNoticiasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FeedNoticiasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
