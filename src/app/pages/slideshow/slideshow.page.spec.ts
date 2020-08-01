import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlideshowPage } from './slideshow.page';

describe('SlideshowPage', () => {
  let component: SlideshowPage;
  let fixture: ComponentFixture<SlideshowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideshowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlideshowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
