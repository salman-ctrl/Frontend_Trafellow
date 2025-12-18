"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Nav";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { 
  Calendar, Clock, MapPin, Users,
  User, MessageCircle, CheckCircle, Twitter, 
  Facebook, Share2, ArrowLeft, Heart, MoreHorizontal
} from "lucide-react";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { user, isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data.data);
      setParticipants(data.data.participants || []);
      
      if (user && data.data.participants) {
        const participant = data.data.participants.find(
          p => p.user_id === user.user_id
        );
        setIsParticipant(!!participant);
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat detail event');
      router.push('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!isAuthenticated) {
      toast.error('Silakan login terlebih dahulu');
      router.push('/login');
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/events/${id}/join`);
      toast.success('Berhasil bergabung ke event!');
      fetchEventDetail();
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal bergabung ke event';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar dari event ini?')) {
      return;
    }

    try {
      setActionLoading(true);
      await api.post(`/events/${id}/leave`);
      toast.success('Berhasil keluar dari event');
      fetchEventDetail();
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal keluar dari event';
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoToChat = () => {
    router.push(`/events/${id}/chat`);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      open: { bg: 'bg-emerald-500', text: 'Open Trip' },
      full: { bg: 'bg-zinc-500', text: 'Fully Booked' },
      ongoing: { bg: 'bg-blue-500', text: 'Live Now' },
      completed: { bg: 'bg-gray-500', text: 'Completed' },
      cancelled: { bg: 'bg-red-500', text: 'Cancelled' }
    };
    
    const info = statusMap[status] || statusMap.open;
    
    return (
      <span className={`${info.bg} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
        {info.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          <div className="bg-white rounded-3xl h-[400px] animate-pulse border border-gray-100 shadow-sm"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl h-40 animate-pulse"></div>
              <div className="bg-white rounded-2xl h-60 animate-pulse"></div>
            </div>
            <div className="bg-white rounded-2xl h-80 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.event_date);
  const isCreator = user?.user_id === event.created_by;
  const dateStr = eventDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button 
          onClick={() => router.back()}
          className="group flex items-center text-gray-500 hover:text-gray-900 font-medium mb-6 transition-colors"
        >
          <div className="p-2 rounded-full bg-white border border-gray-200 group-hover:border-gray-300 mr-3 shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Kembali ke Daftar Event
        </button>

        <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-xl mb-8 group">
          <img
            src={getImageUrl(event.image)}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              {getStatusBadge(event.status)}
              <div className="flex items-center text-white/90 text-sm font-medium bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                {event.region_name}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {event.title}
            </h1>
            
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span className="font-medium">Hosted by {event.creator_name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detail Kegiatan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 mr-4">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Tanggal Pelaksanaan</p>
                    <p className="text-gray-900 font-semibold">{dateStr}</p>
                  </div>
                </div>

                <div className="flex items-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 mr-4">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Waktu Kumpul</p>
                    <p className="text-gray-900 font-semibold">{event.event_time} WIB</p>
                  </div>
                </div>

                <div className="flex items-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 mr-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Meeting Point</p>
                    <p className="text-gray-900 font-semibold">{event.meeting_point}</p>
                  </div>
                </div>

                <div className="flex items-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Kuota Peserta</p>
                    <p className="text-gray-900 font-semibold">{event.max_participants} Orang</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Deskripsi</h3>
                <p>{event.description}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Peserta ({participants.length})</h2>
                <div className="text-sm text-gray-500">
                  Sisa kuota: <span className="text-blue-600 font-bold">{event.max_participants - event.current_participants}</span>
                </div>
              </div>
              
              {participants.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-gray-500">Belum ada peserta yang bergabung.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {participants.map((participant) => (
                    <div 
                      key={participant.user_id}
                      className="flex items-center space-x-3 p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all bg-white"
                    >
                      <img
                        src={getImageUrl(participant.profile_picture)}
                        alt={participant.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{participant.name}</h3>
                        <p className="text-xs text-gray-500 truncate">@{participant.username}</p>
                      </div>
                      {participant.user_id === event.created_by && (
                        <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full">
                          HOST
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Status Pendaftaran</p>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {event.status === 'open' ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
                  </h3>
                  {event.status === 'open' && (
                     <span className="flex h-3 w-3 relative">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                     </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {isCreator ? (
                  <>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                      <div className="bg-blue-600 p-1.5 rounded-full">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-blue-800 font-medium">Anda adalah Host event ini</p>
                    </div>
                    
                    <button
                      onClick={handleGoToChat}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Group Chat</span>
                    </button>

                    <button
                      onClick={() => router.push(`/events/${id}/edit`)}
                      className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-xl transition-all"
                    >
                      Edit Event
                    </button>
                  </>
                ) : isParticipant ? (
                  <>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                      <div className="bg-emerald-500 p-1 rounded-full">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-emerald-800 font-medium">Kamu sudah terdaftar!</p>
                    </div>

                    <button
                      onClick={handleGoToChat}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Buka Group Chat</span>
                    </button>

                    <button
                      onClick={handleLeaveEvent}
                      disabled={actionLoading}
                      className="w-full bg-white border border-gray-200 hover:bg-red-50 hover:border-red-100 hover:text-red-600 text-gray-600 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50"
                    >
                      {actionLoading ? 'Memproses...' : 'Batalkan Keikutsertaan'}
                    </button>
                  </>
                ) : (
                  <>
                    {event.status === 'open' ? (
                      <button
                        onClick={handleJoinEvent}
                        disabled={actionLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {actionLoading ? 'Memproses...' : 'Gabung Event Sekarang'}
                      </button>
                    ) : (
                      <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed border border-gray-200">
                        Pendaftaran Ditutup
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bagikan</span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-sky-50 hover:text-sky-500 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}