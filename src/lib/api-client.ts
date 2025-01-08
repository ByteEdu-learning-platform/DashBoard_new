import { Types } from "mongoose";

export type CourseFormData = {
  title: string;
  topic: string;
  description: string;
  price: number;
  duration: number; // in hours
  modules: { title: string; content: string; duration: number }[]; // in minutes
};

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getCourses() {
    return this.fetch<CourseFormData[]>("/courses");
  }

  async getCourse(id: string) {
    return this.fetch<CourseFormData>(`/courses/${id}`);
  }

  async createCourse(courseData: CourseFormData) {
    return this.fetch<CourseFormData>("/courses", {
      method: "POST",
      body: courseData,
    });
  }

  async updateCourse(id: string, courseData: Partial<CourseFormData>) {
    return this.fetch<CourseFormData>(`/courses/${id}`, {
      method: "PUT",
      body: courseData,
    });
  }

  async deleteCourse(id: string) {
    return this.fetch<void>(`/courses/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
