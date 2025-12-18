"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="/background/login/login.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-900/20 to-blue-800/40 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative w-full max-w-sm">
        
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-10 bg-gradient-to-b from-blue-600 to-blue-700 rounded-t-[50%] shadow-xl z-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-t-[50%]"></div>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-blue-200/50 p-8 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-blue-500/30 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-blue-500/30 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-blue-500/30 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-blue-500/30 rounded-br-2xl"></div>

             <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="blue-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                      <circle cx="40" cy="40" r="2" fill="#3B82F6"/>
                      <circle cx="0" cy="0" r="2" fill="#3B82F6"/>
                      <circle cx="80" cy="80" r="2" fill="#3B82F6"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#blue-pattern)"/>
                </svg>
              </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 py-4">
                
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700">
                        Trafellow
                    </h1>
                    <div className="h-1 w-16 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full mt-2"></div>
                </div>

                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                </div>

                <p className="text-gray-500 text-sm font-medium animate-pulse">
                    Memuat Petualangan Anda...
                </p>
            </div>
        </div>

        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2.5 h-2.5 bg-blue-700 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}