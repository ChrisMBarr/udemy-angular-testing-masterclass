import { TestBed } from "@angular/core/testing";
import { HttpErrorResponse, provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { CoursesService } from "./courses.service";
import {
  COURSES,
  findLessonsForCourse,
  LESSONS,
} from "../../../../server/db-data";
import { Course } from "../model/course";

describe("CoursesService", () => {
  let service: CoursesService;
  let injectedHttp: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CoursesService,
      ],
    });

    service = TestBed.inject(CoursesService);
    injectedHttp = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    injectedHttp.verify();
  });

  it("should retrieve all courses", () => {
    service.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No Courses returned");
      expect(courses).toHaveSize(12);

      const oneCourse = courses.find((c) => c.id === 12);
      expect(oneCourse.titles.description).toEqual("Angular Testing Course");
    });

    const req = injectedHttp.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");

    req.flush({ payload: Object.values(COURSES) });
  });

  it("should retrieve one course by ID", () => {
    service.findCourseById(12).subscribe((course) => {
      expect(course.id).toEqual(12);
      expect(course.titles.description).toEqual("Angular Testing Course");
    });

    const req = injectedHttp.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("GET");

    req.flush(COURSES[12]);
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    service.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toEqual(12);
      expect(course.titles.description).toEqual("Testing Course");
    });

    const req = injectedHttp.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles).toEqual(changes.titles);

    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should give an error saving the course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    service.saveCourse(12, changes).subscribe({
      next: () => fail("The save course operation should have failed!"),
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(500);
      },
    });

    const req = injectedHttp.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");

    req.flush("Save Course Failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it("should find a list of lessons", () => {
    service.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons).toHaveSize(3);
    });

    const req = injectedHttp.expectOne((r) => r.url === "/api/lessons");
    expect(req.request.method).toEqual("GET");
    expect(req.request.params.get("courseId")).toEqual("12");
    expect(req.request.params.get("filter")).toEqual("");
    expect(req.request.params.get("sortOrder")).toEqual("asc");
    expect(req.request.params.get("pageNumber")).toEqual("0");
    expect(req.request.params.get("pageSize")).toEqual("3");

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });
});
