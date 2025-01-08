"use client";

import { apiClient } from "@/lib/api-client";
import { ICourse } from "@/models/Product";
import { useEffect, useState } from "react";

const Home = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await apiClient.getCourses(); // Updated to use `getCourses`
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []); // Added an empty dependency array to avoid re-fetching on every render

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="card bg-base-100 shadow-md p-4 rounded-md"
          >
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="text-gray-600">{course.topic}</p>
            <p className="text-lg font-bold">₹{course.price}</p>
            <p className="text-sm text-gray-500">
              Duration: {course.duration} hours
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
