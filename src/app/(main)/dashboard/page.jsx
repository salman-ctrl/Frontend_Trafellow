"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import Navbar from "@/components/layout/Nav";
import toast from 'react-hot-toast';
import { 
  MapPin, Calendar, ArrowRight, Star, 
  Shield, Zap, Users, Clock, Instagram, 
  Facebook, Twitter, Mail, Phone, Map, ChevronRight
} from "lucide-react";

const RegionList = () => {
  const router = useRouter();
  const [regions, setRegions] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [regionsRes, destinationsRes, eventsRes] = await Promise.all([
        api.get('/regions'),
        api.get('/destinations?limit=3'),
        api.get('/events?limit=3')
      ]);
      
      setRegions(regionsRes.data.data);
      setDestinations(destinationsRes.data.data?.slice(0, 3) || []);
      setEvents(eventsRes.data.data?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegionClick = (regionId) => {
    router.push(`/regions/${regionId}`);
  };

  const handleDestinationClick = (destinationId) => {
    router.push(`/destinations/${destinationId}`);
  };

  const handleEventClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="relative h-[60vh] mb-16 bg-slate-100 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-100 rounded-2xl h-48 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <section className="relative h-[70vh] mb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/background/dashboard/hero.png" 
            alt="West Sumatra" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 max-w-4xl mx-auto">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 uppercase tracking-wider">
            Explore West Sumatra
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Jelajahi Keindahan <br/> Ranah Minang
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl leading-relaxed">
            Temukan destinasi wisata menakjubkan dan bergabung dengan komunitas pecinta wisata terbesar di Sumatera Barat.
          </p>
          <button 
            onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:-translate-y-1 shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            Mulai Jelajah <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Jelajahi Wilayah</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dari pegunungan yang sejuk hingga pantai yang memukau, pilih destinasi favoritmu berdasarkan wilayah.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {regions.map((region) => (
            <button
              key={region.region_id}
              onClick={() => handleRegionClick(region.region_id)}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {region.image ? (
                <img
                  src={getImageUrl(region.image)}
                  alt={region.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 w-full h-full" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-[10px] font-bold text-white mb-2 uppercase tracking-wide border border-white/10">
                  {region.type === 'kota' ? 'Kota' : 'Kabupaten'}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                  {region.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-blue-600 font-bold tracking-wider uppercase text-xs mb-2 block">Popular Destinations</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
                Sedang <span className="text-blue-600">Trending</span> <br /> Minggu Ini
              </h2>
            </div>
            <button 
              onClick={() => router.push('/destinations')}
              className="group flex items-center gap-2 text-slate-600 font-medium hover:text-blue-600 transition-colors"
            >
              Lihat Semua Destinasi
              <span className="bg-slate-200 group-hover:bg-blue-100 p-1.5 rounded-full transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div 
                key={destination.destination_id} 
                onClick={() => handleDestinationClick(destination.destination_id)}
                className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 cursor-pointer h-[500px]"
              >
                <div className="absolute inset-0">
                  <img
                    src={getImageUrl(destination.image)}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                </div>

                <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    {destination.region?.name}
                  </span>
                  <div className="flex items-center gap-1 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg">
                    <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-slate-900">{destination.rating || '4.8'}</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-3 leading-snug">
                    {destination.name}
                  </h3>
                  <p className="text-slate-300 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {destination.description || 'Nikmati pengalaman wisata alam terbaik di Sumatera Barat dengan pemandangan yang tak terlupakan.'}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Tiket Masuk</p>
                      <p className="text-white font-bold text-lg">
                        {destination.ticket_price ? `Rp ${destination.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center transform group-hover:rotate-45 transition-all duration-500 hover:bg-blue-500 hover:text-white">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Shield, title: "Terverifikasi", desc: "Data destinasi valid dan aman." },
              { icon: Users, title: "Komunitas", desc: "Ribuan teman perjalanan baru." },
              { icon: Zap, title: "Update Kilat", desc: "Info event real-time." }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Event Seru Bulan Ini</h2>
              <p className="text-slate-400 max-w-lg text-lg">
                Jangan sampai ketinggalan momen seru. Bergabunglah dengan event dan festival lokal.
              </p>
            </div>
            <button 
              onClick={() => router.push('/events')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl backdrop-blur-sm transition-all flex items-center gap-2"
            >
              Kalender Event <Calendar className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {events.map((event, index) => {
              const eventDate = new Date(event.event_date);
              return (
                <div 
                  key={event.event_id}
                  onClick={() => handleEventClick(event.event_id)}
                  className="group relative bg-slate-800/50 hover:bg-slate-800 border border-white/5 hover:border-blue-500/50 rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                >
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-center shadow-lg shadow-blue-900/50">
                        <span className="block text-xl font-bold">{eventDate.getDate()}</span>
                        <span className="block text-xs font-medium uppercase tracking-wider">{eventDate.toLocaleString('id-ID', { month: 'short' })}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${event.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {event.status === 'open' ? 'Open Slot' : 'Full Booked'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="flex flex-col gap-2 text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        {event.event_time} WIB
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="truncate">{event.meeting_point}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Lihat Detail</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Mulai Petualanganmu Disini
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Daftar sekarang untuk akses fitur komunitas, simpan wishlist destinasi impian, dan dapatkan notifikasi event eksklusif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => router.push('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Buat Akun Gratis
            </button>
            <button 
              onClick={() => router.push('/about')}
              className="w-full sm:w-auto px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all border border-blue-500 shadow-lg"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-blue-600">SumbarTravel</h3>
              <p className="text-slate-500 leading-relaxed">
                Platform pariwisata digital nomor satu untuk mengeksplorasi keindahan alam dan budaya Sumatera Barat.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:shadow-md transition-all border border-slate-100">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Navigasi</h4>
              <ul className="space-y-4 text-slate-500">
                {['Beranda', 'Destinasi', 'Event', 'Tentang Kami', 'Kontak'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Wilayah Populer</h4>
              <ul className="space-y-4 text-slate-500">
                {['Padang', 'Bukittinggi', 'Payakumbuh', 'Pesisir Selatan'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                      Wisata {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-6">Hubungi Kami</h4>
              <ul className="space-y-4 text-slate-500">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>hello@sumbartravel.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>+62 812 3456 7890</span>
                </li>
                <li className="flex items-start gap-3">
                  <Map className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Jl. Jend. Sudirman No. 123, Padang, Sumatera Barat</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>&copy; 2024 SumbarTravel. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegionList;