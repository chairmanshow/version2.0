import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from '../router';
import { PageLayout } from '../components/PageLayout';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isPaid: boolean;
}

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedCourses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout title="Courses" description="Browse our Ayurvedic and health courses.">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-xl shadow overflow-hidden">
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <Link
                    href={`/courses/${course.id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
