import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Trash2, Plus, Edit } from 'lucide-react';

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

export const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [paymentLink, setPaymentLink] = useState('');
  const [youtubeLiveLink, setYoutubeLiveLink] = useState('');
  const [liveStartTime, setLiveStartTime] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const fetchedCourses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'courses'), {
        title,
        description,
        thumbnailUrl,
        isPaid,
        paymentLink: isPaid ? paymentLink : '',
        youtubeLiveLink,
        liveStartTime,
        content,
        createdAt: serverTimestamp(),
      });
      fetchCourses();
      // Reset form
      setTitle('');
      setDescription('');
      setThumbnailUrl('');
      setIsPaid(false);
      setPaymentLink('');
      setYoutubeLiveLink('');
      setLiveStartTime('');
      setContent('');
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'courses', id));
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Courses</h1>
      
      <form onSubmit={handleCreateCourse} className="bg-white p-6 rounded-xl shadow mb-8 space-y-4">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Thumbnail URL" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full p-2 border rounded" />
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
          <label>Paid Course</label>
        </div>
        {isPaid && <input type="text" placeholder="Payment Link" value={paymentLink} onChange={(e) => setPaymentLink(e.target.value)} className="w-full p-2 border rounded" />}
        <input type="text" placeholder="YouTube Live Link" value={youtubeLiveLink} onChange={(e) => setYoutubeLiveLink(e.target.value)} className="w-full p-2 border rounded" />
        <input type="datetime-local" value={liveStartTime} onChange={(e) => setLiveStartTime(e.target.value)} className="w-full p-2 border rounded" />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded" required />
        <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
          <Plus size={20} /> Create Course
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h3 className="font-bold">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
            </div>
            <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
