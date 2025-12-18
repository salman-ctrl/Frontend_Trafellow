"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Nav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/utils";
import { 
  User, Mail, MapPin, Calendar, Edit2, 
  Camera, Ticket, Users, Save, X, 
  CheckCircle, Globe 
} from "lucide-react";
import toast from "react-hot-toast";

function ProfileContent() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    profile_picture: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        profile_picture: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        profile_picture: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const sendData = new FormData();
      sendData.append("name", formData.name);
      sendData.append("bio", formData.bio);
      sendData.append("location", formData.location);

      if (formData.profile_picture) {
        sendData.append("profile_picture", formData.profile_picture);
      }

      const result = await updateProfile(sendData);

      if (result.success) {
        setIsEditing(false);
        setImagePreview(null);
        toast.success("Profil berhasil diperbarui");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
    setFormData({
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
      profile_picture: null,
    });
  };

  if (!user) return null;

  const joinDate = new Date(user.created_at);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          <div className="relative h-64 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          <div className="relative px-8 md:px-12 pb-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              <div className="relative -mt-24 shrink-0 mx-auto md:mx-0">
                <div className="w-48 h-48 rounded-[2rem] border-4 border-white shadow-2xl overflow-hidden bg-slate-100 relative group">
                  <img
                    src={imagePreview || getImageUrl(user.profile_picture)}
                    alt={user.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <label className="cursor-pointer flex flex-col items-center text-white gap-2">
                        <Camera className="w-8 h-8" />
                        <span className="text-xs font-bold uppercase tracking-wider">Ubah Foto</span>
                        <input
                          type="file"
                          name="profile_picture"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 w-full pt-4 md:pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                      {user.name}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <span>@{user.username}</span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                      <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-100">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="group flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all font-semibold shadow-lg hover:shadow-blue-500/30 active:scale-95"
                    >
                      <Edit2 className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                      <span>Edit Profil</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Nama Lengkap</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Lokasi</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Contoh: Padang, Sumatera Barat"
                          className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Bio Singkat</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Ceritakan sedikit tentang dirimu..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none font-medium text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 justify-end">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="px-8 py-3.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <X className="w-5 h-5" /> Batal
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      {user.bio && (
                        <div className="prose prose-slate max-w-none">
                          <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            {user.bio}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem 
                          icon={Mail} 
                          label="Email Address" 
                          value={user.email} 
                          color="blue"
                        />
                        <InfoItem 
                          icon={MapPin} 
                          label="Lokasi Saat Ini" 
                          value={user.location || "Belum diatur"} 
                          color="emerald"
                        />
                        <InfoItem 
                          icon={Calendar} 
                          label="Member Sejak" 
                          value={joinDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })} 
                          color="purple"
                        />
                        <InfoItem 
                          icon={Globe} 
                          label="Status Akun" 
                          value="Terverifikasi" 
                          color="orange"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <button
                        onClick={() => router.push("/events/my-events")}
                        className="group relative overflow-hidden bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Ticket className="w-24 h-24 text-blue-600 rotate-12" />
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Ticket className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Event Saya</h3>
                        <p className="text-slate-500 text-sm">Kelola tiket dan jadwal eventmu</p>
                      </button>

                      <button
                        onClick={() => router.push("/friends")}
                        className="group relative overflow-hidden bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Users className="w-24 h-24 text-emerald-600 -rotate-12" />
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Teman Perjalanan</h3>
                        <p className="text-slate-500 text-sm">Lihat koneksi dan komunitasmu</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-colors">
      <div className={`p-3 rounded-xl border ${colors[color]} shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="font-semibold text-slate-900 line-clamp-1">{value}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}