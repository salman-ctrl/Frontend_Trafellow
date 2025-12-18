"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Nav";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import { 
  MapPin, Eye, Share2, ArrowLeft, Calendar, 
  Clock, Users, ChevronRight, Ticket, Star,
  Facebook, Twitter, Link as LinkIcon 
} from "lucide-react";

const MapView = dynamic(() => import('@/components/Map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
      <p className="text-slate-400 font-medium">Memuat peta...</p>
    </div>
  )
});

export default function DestinationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [destination, setDestination] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [destRes, eventsRes] = await Promise.all([
        api.get(`/destinations/${id}`),
        api.get(`/events?destination_id=${id}`) 
      ]);

      setDestination(destRes.data.data);
      setEvents(eventsRes.data.data || []); 
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data');
      router.push('/destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Lihat destinasi keren ini: ${destination.name}`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link disalin ke clipboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="bg-slate-100 rounded-[2.5rem] h-[500px] animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-40 bg-slate-100 rounded-3xl animate-pulse"></div>
              <div className="h-60 bg-slate-100 rounded-3xl animate-pulse"></div>
            </div>
            <div className="h-96 bg-slate-100 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) return null;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main className="pb-24">
        <div className="relative h-[60vh] min-h-[500px] w-full">
          <div className="absolute inset-0">
            <img
              src={getImageUrl(destination.image)}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
          </div>

          <div className="absolute top-0 left-0 right-0 p-6">
            <div className="max-w-7xl mx-auto">
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/10"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Kembali</span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 pb-12 pt-24 bg-gradient-to-t from-black via-black/60 to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {destination.category_name}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {destination.region_name}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      4.8 (120 Ulasan)
                    </span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                    {destination.name}
                  </h1>
                  
                  <div className="flex items-center text-slate-300 text-lg max-w-2xl">
                    <MapPin className="w-5 h-5 mr-2 text-blue-400 shrink-0" />
                    <span className="truncate">{destination.address}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleShare('facebook')}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleShare('whatsapp')}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-green-600 hover:border-green-600 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleShare('copy')}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-600 hover:border-slate-600 transition-all"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Tentang Destinasi</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                    {destination.description}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Event Mendatang</h2>
                    <p className="text-slate-500 mt-1">Bergabung dengan kegiatan seru di lokasi ini</p>
                  </div>
                  {events.length > 0 && (
                    <button 
                      onClick={() => router.push('/events')}
                      className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
                    >
                      Lihat Semua <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {events.length > 0 ? (
                  <div className="grid gap-4">
                    {events.map((event) => {
                      const eventDate = new Date(event.event_date);
                      return (
                        <div 
                          key={event.event_id}
                          onClick={() => router.push(`/events/${event.event_id}`)}
                          className="group bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer flex flex-col sm:flex-row gap-6 items-center"
                        >
                          <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <span className="text-3xl font-bold">{eventDate.getDate()}</span>
                            <span className="text-xs font-bold uppercase tracking-wider">{eventDate.toLocaleString('id-ID', { month: 'short' })}</span>
                          </div>

                          <div className="flex-grow text-center sm:text-left w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 justify-center sm:justify-start">
                              <span className={`w-fit mx-auto sm:mx-0 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                                event.status === 'open' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                  : 'bg-red-50 text-red-600 border-red-200'
                              }`}>
                                {event.status === 'open' ? 'Registrasi Dibuka' : 'Penuh'}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="w-3.5 h-3.5" /> {event.event_time} WIB
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {event.name}
                            </h3>

                            <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                {event.max_participants || 0} Slot
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Ticket className="w-4 h-4" />
                                <span className="font-semibold text-slate-700">
                                  {event.price > 0 ? `Rp ${event.price.toLocaleString('id-ID')}` : 'Gratis'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <ChevronRight className="w-5 h-5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 p-10 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Calendar className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Belum Ada Event</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">
                      Jadilah yang pertama membuat kegiatan seru di destinasi ini dan ajak teman-temanmu.
                    </p>
                    <button 
                      onClick={() => router.push(`/events/create?destination=${id}`)}
                      className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      Buat Event Sekarang
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Lokasi</h2>
                {destination.latitude && destination.longitude ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                      <MapView
                        latitude={destination.latitude}
                        longitude={destination.longitude}
                        name={destination.name}
                        zoom={14}
                        height="h-[400px]"
                      />
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-slate-900/20"
                    >
                      <MapPin className="w-5 h-5" />
                      Petunjuk Arah Google Maps
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl">
                    <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500">Peta lokasi belum tersedia.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Informasi Kunjungan</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                      <span className="text-slate-500 text-sm">Tiket Masuk</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {destination.ticket_price > 0 
                          ? `Rp ${Number(destination.ticket_price).toLocaleString('id-ID')}` 
                          : 'Gratis'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <span className="block text-slate-400 text-xs font-bold uppercase mb-1">Dilihat</span>
                        <span className="block text-xl font-bold text-slate-900">{destination.view_count}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl text-center">
                        <span className="block text-slate-400 text-xs font-bold uppercase mb-1">Rating</span>
                        <div className="flex items-center justify-center gap-1">
                          <span className="block text-xl font-bold text-slate-900">4.8</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button
                      onClick={() => router.push(`/events/create?destination=${id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Buat Event Disini
                    </button>
                    <p className="text-xs text-center text-slate-400 px-4">
                      Anda bisa membuat event komunitas atau open trip di destinasi ini.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                   <h3 className="text-xl font-bold mb-2 relative z-10">Ingin Liburan?</h3>
                   <p className="text-slate-300 text-sm mb-6 relative z-10">
                     Temukan pemandu lokal atau teman perjalanan untuk pengalaman terbaik.
                   </p>
                   <button className="w-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white font-semibold py-3 rounded-xl transition-all">
                     Cari Teman Jalan
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}