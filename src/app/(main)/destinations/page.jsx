"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Nav";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";
import { 
  MapPin, Search, Filter, Compass, 
  ArrowRight, Star, SlidersHorizontal, 
  X, ChevronLeft, ChevronRight 
} from "lucide-react";

export default function DestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    region_id: '',
    category_id: '',
    search: '',
    page: 1,
    limit: 9
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDestinations();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const fetchInitialData = async () => {
    try {
      const [regionsRes, categoriesRes] = await Promise.all([
        api.get('/regions'),
        api.get('/destination-categories')
      ]);

      setRegions(regionsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data filter');
    }
  };

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.region_id) params.append('region_id', filters.region_id);
      if (filters.category_id) params.append('category_id', filters.category_id);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const { data } = await api.get(`/destinations?${params.toString()}`);
      setDestinations(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 
    }));
  };

  const clearFilters = () => {
    setFilters({ region_id: '', category_id: '', search: '', page: 1, limit: 9 });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="bg-white border-b border-slate-200 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4">
                <Compass className="w-3 h-3" />
                Explore West Sumatra
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                Temukan <span className="text-blue-600">Surga</span> Tersembunyi
              </h1>
              <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
                Jelajahi koleksi destinasi wisata terbaik, mulai dari pegunungan sejuk hingga pantai tropis yang memukau.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Cari destinasi impianmu..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              <div className="relative min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-500" />
                </div>
                <select
                  value={filters.region_id}
                  onChange={(e) => handleFilterChange('region_id', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer hover:border-blue-300 transition-colors"
                >
                  <option value="">Semua Wilayah</option>
                  {regions.map((region) => (
                    <option key={region.region_id} value={region.region_id}>{region.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="relative min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                </div>
                <select
                  value={filters.category_id}
                  onChange={(e) => handleFilterChange('category_id', e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer hover:border-blue-300 transition-colors"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>{category.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-slate-400" />
                </div>
              </div>

              {(filters.region_id || filters.category_id || filters.search) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center px-4 py-3 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors min-w-fit"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
                <div className="h-64 bg-slate-200 rounded-2xl animate-pulse mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-6 animate-pulse"></div>
                <div className="h-10 bg-slate-200 rounded-xl animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Destinasi Tidak Ditemukan</h3>
            <p className="text-slate-500 max-w-md">
              Coba ubah kata kunci pencarian atau atur ulang filter untuk menemukan destinasi yang Anda cari.
            </p>
            <button 
              onClick={clearFilters}
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div
                key={destination.destination_id}
                onClick={() => router.push(`/destinations/${destination.destination_id}`)}
                className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 cursor-pointer h-full"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={getImageUrl(destination.image)}
                    alt={destination.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      {destination.region_name}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                     <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {destination.category_name}
                    </span>
                    <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-white">4.8</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                      {destination.name}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed mb-6">
                      {destination.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Tiket Masuk</span>
                      <span className="text-slate-900 font-bold">
                        {destination.ticket_price ? `Rp ${Number(destination.ticket_price).toLocaleString('id-ID')}` : 'Gratis'}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-[-45deg]">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {destinations.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
              disabled={filters.page === 1}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            
            <div className="bg-blue-50 text-blue-600 font-bold px-4 py-3 rounded-xl min-w-[3rem] text-center border border-blue-100">
              {filters.page}
            </div>

            <button
              onClick={() => handleFilterChange('page', filters.page + 1)}
              disabled={destinations.length < filters.limit}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-slate-600"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}