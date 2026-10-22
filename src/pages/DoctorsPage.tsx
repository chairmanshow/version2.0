import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PageLayout } from '../components/PageLayout';
import { MessageCircle } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  description: string;
  whatsappNumber: string;
  photoUrl: string;
}

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const q = query(collection(db, 'doctors'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedDoctors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (number: string) => {
    const message = "hello dr im from chotelal ji health";
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <PageLayout title="Nearby Doctors" description="Find and contact doctors nearby.">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Nearby Doctors</h1>
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doctor => (
              <div key={doctor.id} className="bg-white rounded-xl shadow overflow-hidden p-4">
                {doctor.photoUrl && <img src={doctor.photoUrl} alt={doctor.name} className="w-full h-48 object-cover rounded-lg mb-4" />}
                <h2 className="text-xl font-bold mb-2">{doctor.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{doctor.specialization}</p>
                <p className="text-gray-600 mb-4">{doctor.description}</p>
                <button
                  onClick={() => handleWhatsApp(doctor.whatsappNumber)}
                  className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                >
                  <MessageCircle size={20} /> Contact on WhatsApp
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
