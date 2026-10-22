import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from '../router';
import { PageLayout } from '../components/PageLayout';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isPaid: boolean;
  paymentLink?: string;
  youtubeLiveLink?: string;
  liveStartTime?: string;
  content: string;
}

export const CourseDetail: React.FC = () => {
  const { currentPath } = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  const courseId = currentPath.split('/')[2];

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const docRef = doc(db, 'courses', courseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse({ id: docSnap.id, ...docSnap.data() } as Course);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLayout title="Loading..." description="Loading course details."><p>Loading...</p></PageLayout>;
  if (!course) return <PageLayout title="Course Not Found" description="Course not found."><p>Course not found.</p></PageLayout>;

  return (
    <PageLayout title={course.title} description={course.description}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-64 object-cover rounded-xl mb-6" />
        <p className="text-gray-700 mb-6">{course.description}</p>
        <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: course.content }} />
        
        {course.isPaid ? (
          <a href={course.paymentLink} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Pay & Access</a>
        ) : (
          <div>
            {course.youtubeLiveLink && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Live Session</h2>
                <a href={course.youtubeLiveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Join Live Session</a>
                <p>Start Time: {course.liveStartTime ? new Date(course.liveStartTime).toLocaleString() : 'Not scheduled'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
