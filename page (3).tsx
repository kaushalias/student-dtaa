"use client";
import { FormEvent,useState } from "react";
import { browserSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
export default function AdminLogin(){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false); const router=useRouter();
 async function login(e:FormEvent){e.preventDefault();setBusy(true);setError("");const {error}=await browserSupabase().auth.signInWithPassword({email,password});setBusy(false);if(error){setError(error.message);return;}router.push("/admin/dashboard");}
 return <main className="container max-w-md pt-20"><a href="/" className="text-indigo-700">← Back to website</a><div className="card p-8 mt-5"><h1 className="text-2xl font-extrabold">Admin login</h1><p className="muted mt-2 mb-6">Sign in with your authorized administrator account.</p><form onSubmit={login} className="space-y-4"><div><label className="block text-sm font-semibold mb-2">Email</label><input className="field" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></div><div><label className="block text-sm font-semibold mb-2">Password</label><input className="field" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></div><button className="btn btn-primary w-full" disabled={busy}>{busy?"Signing in...":"Sign in"}</button>{error&&<p className="text-sm text-red-600">{error}</p>}</form></div></main>
}