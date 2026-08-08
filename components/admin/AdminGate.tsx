"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { isAdminEmail } from "@/lib/admin";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Memuat...</div>;
  }

  if (!user || !isAdminEmail(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center space-y-4 border border-gray-100">
          <i className="fa-solid fa-lock text-3xl text-brand" />
          <h1 className="font-bold text-lg text-gray-900">Panel Admin</h1>
          {user && !isAdminEmail(user.email) && (
            <p className="text-xs text-red-500">
              Akun {user.email} belum terdaftar sebagai admin. Hubungi pengelola untuk ditambahkan.
            </p>
          )}
          <button
            onClick={() => signInWithPopup(auth, googleProvider)}
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <i className="fa-brands fa-google" /> Masuk dengan Google
          </button>
          {user && (
            <button onClick={() => signOut(auth)} className="text-xs text-gray-400 underline">
              keluar dari {user.email}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-900 text-gray-300 text-xs px-4 py-2 flex items-center justify-between">
        <span>Masuk sebagai <b className="text-white">{user.email}</b></span>
        <button onClick={() => signOut(auth)} className="hover:text-white underline">Keluar</button>
      </div>
      {children}
    </div>
  );
}
