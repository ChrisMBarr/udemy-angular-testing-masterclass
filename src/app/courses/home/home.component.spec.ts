import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";

import { HomeComponent } from "./home.component";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let debugEl: DebugElement;
  let injectedCoursesService: jasmine.SpyObj<CoursesService>;

  const beginnerCourses = setupCourses().filter((c) => c.category === "BEGINNER");
  const advancedCourses = setupCourses().filter((c) => c.category === "ADVANCED");

  beforeEach(async () => {
    const coursesServiceSpy = jasmine.createSpyObj<CoursesService>("CoursesService", ["findAllCourses"]);

    await TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    injectedCoursesService = TestBed.inject<any>(CoursesService);
  });

  it("should create the component", () => {
    injectedCoursesService.findAllCourses.and.returnValue(of());
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    injectedCoursesService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabEls = debugEl.queryAll(By.css(".mdc-tab"));

    expect(tabEls).toHaveSize(1);
    expect(tabEls[0].nativeElement.textContent).toEqual("Beginners");
  });

  it("should display only advanced courses", () => {
    injectedCoursesService.findAllCourses.and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabEls = debugEl.queryAll(By.css(".mdc-tab"));

    expect(tabEls).toHaveSize(1);
    expect(tabEls[0].nativeElement.textContent).toEqual("Advanced");
  });

  it("should display both tabs", () => {
    injectedCoursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabEls = debugEl.queryAll(By.css(".mdc-tab"));

    expect(tabEls).toHaveSize(2);
    expect(tabEls[0].nativeElement.textContent).toEqual("Beginners");
    expect(tabEls[1].nativeElement.textContent).toEqual("Advanced");
  });

  it("should display advanced courses when tab clicked", fakeAsync(() => {
    injectedCoursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabEls = debugEl.queryAll(By.css(".mdc-tab"));
    click(tabEls[1]);
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    const cardTitleEls = debugEl.queryAll(By.css(".mat-mdc-card-title"));

    expect(cardTitleEls.length).toBeGreaterThan(0);
    expect(cardTitleEls[0].nativeElement.textContent).toContain("Angular Security Course");
  }));
});
