"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Nav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { 
  Calendar, Clock, MapPin, Users, FileText, Image as ImageIcon, 
  X, ChevronRight, Info, CheckCircle 
} from "lucide-react";

function CreateEventContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [regions, setRegions] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    region_id: '',
    destination_id: searchParams.get('destination') || '',
    meeting_point: '',
    latitude: '',
    longitude: '',
    max_participants: '',
    event_image: null
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (formData.region_id) {
      fetchDestinations(formData.region_id);
    }
  }, [formData.region_id]);

  const fetchRegions = async () => {
    try {
      const { data } = await api.get('/regions');
      setRegions(data.data);
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const fetchDestinations = async (regionId) => {
    try {
      const { data } = await api.get(`/destinations?region_id=${regionId}&limit=100`);
      setDestinations(data.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent typing if length exceeds limit (client-side UX)
    if (name === 'title' && value.length > 100) return;
    if (name === 'meeting_point' && value.length > 100) return;
    if (name === 'max_participants' && value.length > 4) return;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        event_image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      event_image: null
    }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.event_date || 
        !formData.event_time || !formData.region_id || !formData.meeting_point || 
        !formData.max_participants) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (parseInt(formData.max_participants) < 1) {
      toast.error('Jumlah peserta minimal 1');
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('event_date', formData.event_date);
      submitData.append('event_time', formData.event_time);
      submitData.append('region_id', formData.region_id);
      if (formData.destination_id) submitData.append('destination_id', formData.destination_id);
      submitData.append('meeting_point', formData.meeting_point);
      if (formData.latitude) submitData.append('latitude', formData.latitude);
      if (formData.longitude) submitData.append('longitude', formData.longitude);
      submitData.append('max_participants', formData.max_participants);
      if (formData.event_image) submitData.append('event_image', formData.event_image);

      const { data } = await api.post('/events', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Event berhasil dibuat!');
      router.push(`/events/${data.data.event_id}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal membuat event';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Buat Event Petualangan
          </h1>
          <p className="text-gray-500 text-lg">
            Ajak teman-teman dan komunitas untuk menjelajahi keindahan Sumatera Barat bersama.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">STEP 1</span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Informasi Dasar</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Detail Event</h2>
              </div>
              
              <div className="p-8 space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Event</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Contoh: Pendakian Gunung Marapi Bersama"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium"
                    required
                  />
                  <p className="text-right text-xs text-gray-400 mt-1">{formData.title.length}/100</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Lengkap</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    maxLength={2000}
                    placeholder="Ceritakan tentang rencana perjalanan, itinerary, dan hal menarik lainnya..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    required
                  />
                  <p className="text-right text-xs text-gray-400 mt-1">{formData.description.length}/2000</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Pelaksanaan</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleChange}
                        min={minDate}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                      <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Waktu Kumpul</label>
                    <div className="relative">
                      <input
                        type="time"
                        name="event_time"
                        value={formData.event_time}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        required
                      />
                      <Clock className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">STEP 2</span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lokasi & Peserta</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Tujuan & Kuota</h2>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Wilayah</label>
                    <div className="relative">
                      <select
                        name="region_id"
                        value={formData.region_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Pilih Wilayah</option>
                        {regions.map((region) => (
                          <option key={region.region_id} value={region.region_id}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none rotate-90" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Destinasi (Opsional)</label>
                    <div className="relative">
                      <select
                        name="destination_id"
                        value={formData.destination_id}
                        onChange={handleChange}
                        disabled={!formData.region_id}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">Pilih Destinasi</option>
                        {destinations.map((dest) => (
                          <option key={dest.destination_id} value={dest.destination_id}>
                            {dest.name}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none rotate-90" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Titik Kumpul (Meeting Point)</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="meeting_point"
                      value={formData.meeting_point}
                      onChange={handleChange}
                      maxLength={100}
                      placeholder="Lokasi spesifik untuk berkumpul..."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                    <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kuota Peserta</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="max_participants"
                      value={formData.max_participants}
                      onChange={handleChange}
                      min="1"
                      max="9999"
                      placeholder="Maksimal orang"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                    <Users className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" /> Termasuk Anda sebagai host
                  </p>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">STEP 3</span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Visual</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Upload Foto</h2>
              </div>

              <div className="p-8">
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-white/90 hover:bg-white text-red-600 px-4 py-2 rounded-xl font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2"
                      >
                        <X className="w-4 h-4" /> Hapus Foto
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className="mb-2 text-sm text-gray-500 font-medium">Klik untuk upload foto banner</p>
                      <p className="text-xs text-gray-400">SVG, PNG, JPG (MAX. 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-white hover:text-gray-900 hover:border-gray-300 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Publikasikan Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/20">
              <h3 className="text-lg font-bold mb-4">Tips Event Menarik</h3>
              <ul className="space-y-4 text-blue-50 text-sm">
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">1</div>
                  <p>Gunakan judul yang singkat namun deskriptif dan menarik perhatian.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">2</div>
                  <p>Jelaskan itinerary atau kegiatan secara rinci agar peserta paham.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-xs font-bold">3</div>
                  <p>Upload foto lokasi atau ilustrasi kegiatan yang berkualitas tinggi.</p>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Preview Ringkas</h3>
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-2">
                    {formData.title || 'Judul Event Anda'}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.event_date || 'Tanggal'} • {formData.max_participants || '0'} Peserta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <ProtectedRoute>
      <CreateEventContent />
    </ProtectedRoute>
  );
}