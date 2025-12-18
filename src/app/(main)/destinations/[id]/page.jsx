"use client";

import { useState, useEffect } from "react"; import dynamic from "next/dynamic"; import { useRouter, useParams } from "next/navigation"; import Navbar from "@/components/layout/Nav"; import api from "@/lib/api"; import { getImageUrl } from "@/lib/utils"; import toast from "react-hot-toast"; import { MapPin, Eye, Share2, ArrowLeft, Calendar, Clock, Users, ChevronRight, Ticket } from "lucide-react";

const MapView = dynamic(() => import('@/components/Map/MapView'), { ssr: false, loading: () => ( <div className="w-full h-96 bg-gray-100 animate-pulse rounded-xl flex items-center justify-center"> <p className="text-gray-400 font-medium">Memuat peta...</p> </div> ) });

export default function DestinationDetailPage() { const router = useRouter(); const params = useParams(); const { id } = params;

const [destination, setDestination] = useState(null); const [events, setEvents] = useState([]); const [loading, setLoading] = useState(true);

useEffect(() => { if (id) { fetchData(); } }, [id]);

const fetchData = async () => { try { setLoading(true); const [destRes, eventsRes] = await Promise.all([ api.get(/destinations/${id}), api.get(/events?destination_id=${id}) ]);

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

const handleShare = (platform) => { const url = window.location.href; const text = Check out ${destination.name} - ${destination.description};

if (platform === 'whatsapp') {
  window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
} else if (platform === 'facebook') {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}
};

const handleEventClick = (eventId) => { router.push(/events/${eventId}); };

if (loading) { return ( <div className="min-h-screen bg-gray-50"> <Navbar /> <div className="max-w-7xl mx-auto px-4 py-12 space-y-8"> <div className="bg-gray-200 rounded-3xl h-96 animate-pulse"></div> <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div className="lg:col-span-2 h-64 bg-gray-200 rounded-2xl animate-pulse"></div> <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div> </div> </div> </div> ); }

if (!destination) return null;

return ( <div className="min-h-screen bg-gray-50 font-sans"> <Navbar />

  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    <button
      onClick={() => router.back()}
      className="group mb-8 flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-white hover:shadow-sm w-fit"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium">Kembali</span>
    </button>

    <div className="relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-10 shadow-2xl shadow-blue-900/10">
      <img
        src={getImageUrl(destination.image)}
        alt={destination.name}
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      
      <div className="absolute top-6 left-6 flex gap-3 flex-wrap">
        <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {destination.region_name}
        </span>
        {destination.category_name && (
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg border border-blue-400/50">
            {destination.category_name}
          </span>
        )}
      </div>

      <div className="absolute top-6 right-6 flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
        <Eye className="w-4 h-4 text-white" />
        <span className="text-sm font-bold text-white">{destination.view_count || 0} Views</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          {destination.name}
        </h1>
        <div className="flex items-center text-gray-200 text-base md:text-lg max-w-2xl">
          <MapPin className="w-5 h-5 mr-2 text-blue-400 flex-shrink-0" />
          <span className="line-clamp-1">{destination.address}</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            Tentang Destinasi
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg text-justify">
            {destination.description}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
           <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
              Event Mendatang
            </h2>
            {events.length > 0 && (
              <button 
                onClick={() => router.push('/events')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Lihat Semua
              </button>
            )}
          </div>

          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => {
                const eventDate = new Date(event.event_date);
                return (
                  <div 
                    key={event.event_id}
                    onClick={() => handleEventClick(event.event_id)}
                    className="group flex flex-col md:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer"
                  >
                    <div className="md:w-32 bg-blue-50 flex flex-col items-center justify-center p-4 border-r border-blue-100">
                      <span className="text-3xl font-bold text-blue-600">{eventDate.getDate()}</span>
                      <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                        {eventDate.toLocaleString('id-ID', { month: 'short' })}
                      </span>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {event.name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          event.status === 'open' 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {event.status === 'open' ? 'Open' : 'Full'}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {event.event_time} WIB
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Ticket className="w-4 h-4" />
                          {event.price > 0 ? `Rp ${event.price.toLocaleString('id-ID')}` : 'Gratis'}
                        </div>
                      </div>

                      <div className="flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        Lihat Detail Event <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Belum ada event di destinasi ini</p>
              <button 
                onClick={() => router.push(`/events/create?destination=${id}`)}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                + Buat Event Sekarang
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
            Lokasi & Peta
          </h2>
          {destination.latitude && destination.longitude ? (
            <div className="space-y-4">
              <div className="w-full overflow-hidden rounded-2xl shadow-inner border border-gray-200">
                <MapView
                  latitude={destination.latitude}
                  longitude={destination.longitude}
                  name={destination.name}
                  zoom={15}
                  height="h-[400px]"
                />
              </div>
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="text-sm text-blue-800">
                  <span className="font-bold block mb-1">Titik Koordinat</span>
                  {destination.latitude}, {destination.longitude}
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-600/30"
                >
                  Buka Rute Google Maps
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-2xl">
              <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Data lokasi belum tersedia</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Informasi Utama</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-sm font-medium">Wilayah</span>
              <span className="font-bold text-gray-900">{destination.region_name}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-sm font-medium">Tiket Masuk</span>
              <span className="font-bold text-emerald-600">
                {destination.ticket_price > 0 
                  ? `Rp ${Number(destination.ticket_price).toLocaleString('id-ID')}` 
                  : 'Gratis'}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500 text-sm font-medium">Total Views</span>
              <span className="font-bold text-gray-900">{destination.view_count}x</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push(`/events/create?destination=${id}`)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              <Calendar className="w-5 h-5" />
              Buat Event Disini
            </button>
            
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-6 mb-3">Bagikan</h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center gap-2 bg-[#1877F2] text-white py-3 rounded-xl hover:bg-[#1864cc] transition-colors font-semibold text-sm"
              >
                Facebook
              </button>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl hover:bg-[#20bd5a] transition-colors font-semibold text-sm"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
); }