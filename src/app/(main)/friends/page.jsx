"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Nav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import api from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { 
  Users, UserPlus, UserCheck, UserX, Search, Bell, 
  MessageCircle, MapPin, Trash2, Shield, Sparkles 
} from "lucide-react";
import toast from "react-hot-toast";

function FriendsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'friends') {
        const { data } = await api.get('/friendships/friends');
        setFriends(data.data || []);
      } else if (activeTab === 'requests') {
        const { data } = await api.get('/friendships/pending');
        setPendingRequests(data.data || []);
      } else if (activeTab === 'find') {
        const { data } = await api.get('/users');
        setAllUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await api.post('/friendships/request', { friend_id: userId });
      toast.success('Permintaan pertemanan terkirim');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengirim permintaan';
      toast.error(message);
    }
  };

  const handleAcceptRequest = async (friendshipId) => {
    try {
      await api.put(`/friendships/${friendshipId}/respond`, { status: 'accepted' });
      toast.success('Permintaan pertemanan diterima');
      fetchData();
    } catch (error) {
      console.error('Accept error:', error);
      toast.error('Gagal menerima permintaan');
    }
  };

  const handleRejectRequest = async (friendshipId) => {
    try {
      await api.put(`/friendships/${friendshipId}/respond`, { status: 'rejected' });
      toast.success('Permintaan pertemanan ditolak');
      fetchData();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Gagal menolak permintaan');
    }
  };

  const handleDeleteFriend = async (friendshipId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pertemanan ini?')) {
      return;
    }

    try {
      await api.delete(`/friendships/${friendshipId}`);
      toast.success('Pertemanan dihapus');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus pertemanan');
    }
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Komunitas Traveler</h1>
          <p className="text-lg text-gray-600">
            Terhubung dengan sesama petualang, bagikan pengalaman, dan rencanakan perjalanan bersama.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 inline-flex">
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'friends'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Teman Saya</span>
              <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${activeTab === 'friends' ? 'bg-white/20' : 'bg-gray-100'}`}>
                {friends.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                {pendingRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <span>Permintaan</span>
              {pendingRequests.length > 0 && (
                <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${activeTab === 'requests' ? 'bg-white/20' : 'bg-red-100 text-red-600'}`}>
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('find')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'find'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span>Cari Teman</span>
            </button>
          </div>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'friends' && (
            <div className="animate-fade-in-up">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl h-64 border border-gray-100 shadow-sm animate-pulse"></div>
                  ))}
                </div>
              ) : friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Users className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Belum Ada Teman</h3>
                  <p className="text-gray-500 mt-2 mb-6">Mulai tambahkan teman untuk berbagi cerita perjalanan.</p>
                  <button
                    onClick={() => setActiveTab('find')}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Cari Teman Baru
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {friends.map((friend) => (
                    <div
                      key={friend.user_id}
                      className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="relative">
                          <img
                            src={getImageUrl(friend.profile_picture)}
                            alt={friend.name}
                            className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute -bottom-2 -right-2 bg-green-500 p-1 rounded-full border-4 border-white">
                            <Shield className="w-3 h-3 text-white fill-white" />
                          </div>
                        </div>
                        <div className="relative">
                          <button className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl" onClick={() => handleDeleteFriend(friend.friendship_id)}>
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{friend.name}</h3>
                        <p className="text-sm text-gray-500 font-medium mb-3">@{friend.username}</p>
                        {friend.location && (
                          <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                            {friend.location}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => router.push(`/messages/${friend.user_id}`)}
                        className="w-full py-3 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-600/20"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Kirim Pesan
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="animate-fade-in-up">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-2xl h-24 animate-pulse"></div>
                  ))}
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Sparkles className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Semua Bersih</h3>
                  <p className="text-gray-500 mt-2">Tidak ada permintaan pertemanan tertunda saat ini.</p>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.friendship_id}
                      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-6"
                    >
                      <img
                        src={getImageUrl(request.profile_picture)}
                        alt={request.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                      />
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold text-gray-900">{request.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">@{request.username}</p>
                        <p className="text-xs text-gray-400">
                          Dikirim {new Date(request.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => handleAcceptRequest(request.friendship_id)}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 flex items-center justify-center gap-2"
                        >
                          <UserCheck className="w-4 h-4" />
                          Terima
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.friendship_id)}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-100 hover:text-red-600 text-gray-600 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <UserX className="w-4 h-4" />
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'find' && (
            <div className="animate-fade-in-up">
              <div className="max-w-2xl mx-auto mb-10">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari traveler berdasarkan nama atau username..."
                    className="block w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm outline-none font-medium"
                  />
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl h-24 animate-pulse"></div>
                  ))}
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Tidak ada user ditemukan dengan kata kunci tersebut.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.user_id}
                      className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all flex items-center gap-5"
                    >
                      <img
                        src={getImageUrl(user.profile_picture)}
                        alt={user.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{user.name}</h3>
                        <p className="text-sm text-gray-500 mb-2 truncate">@{user.username}</p>
                        {user.location && (
                          <div className="flex items-center text-xs text-gray-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleSendRequest(user.user_id)}
                        disabled={loading}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function FriendsPage() {
  return (
    <ProtectedRoute>
      <FriendsContent />
    </ProtectedRoute>
  );
}