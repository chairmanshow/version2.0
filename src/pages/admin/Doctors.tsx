import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Trash2, Plus } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  description: string;
  whatsappNumber: string;
  photoUrl: string;
}

export const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [description, setDescription] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const fetchedDoctors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Doctor[];
      setDoctors(fetchedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'doctors'), {
        name,
        specialization,
        description,
        whatsappNumber,
        photoUrl,
        createdAt: serverTimestamp(),
      });
      fetchDoctors();
      setName('');
      setSpecialization('');
      setDescription('');
      setWhatsappNumber('');
      setPhotoUrl('');
    } catch (error) {
      console.error('Error creating doctor:', error);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'doctors', id));
      fetchDoctors();
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Nearby Doctors</h1>
      
      <form onSubmit={handleCreateDoctor} className="bg-white p-6 rounded-xl shadow mb-8 space-y-4">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full p-2 border rounded" required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="WhatsApp Number" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="w-full p-2 border rounded" required />
        <input type="text" placeholder="Photo URL" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
          <Plus size={20} /> Add Doctor
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4">
        {doctors.map(doctor => (
          <div key={doctor.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h3 className="font-bold">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
            </div>
            <button onClick={() => handleDeleteDoctor(doctor.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
