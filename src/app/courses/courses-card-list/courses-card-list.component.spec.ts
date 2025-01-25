import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CoursesCardListComponent } from "./courses-card-list.component";
import { CoursesModule } from "../courses.module";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { setupCourses } from "../common/setup-test-data";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let debugEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesModule],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesCardListComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
  });

  it("should create the component", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const cardEls = debugEl.queryAll(By.css(".course-card"));

    expect(cardEls).toHaveSize(12);
  });

  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const firstCourse = component.courses[0];
    const firstCardEl = debugEl.query(By.css(".course-card"));
    const firstCardTitleEl = debugEl.query(By.css("mat-card-title"));
    const firstCardImgEl = debugEl.query(By.css("img"));

    expect(firstCardEl).toBeTruthy();
    expect(firstCardTitleEl.nativeElement.textContent).toEqual(firstCourse.titles.description);
    expect(firstCardImgEl.nativeElement.src).toEqual(firstCourse.iconUrl);
  });
});
