"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [busy,setBusy]=useState(false), [message,setMessage]=useState(""), [ok,setOk]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setBusy(true); setMessage(""); setOk(false);
    const form=new FormData(e.currentTarget);
    const payload=Object.fromEntries(form.entries());
    try{
      const res=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Could not submit. Please try again.");
      setOk(true); setMessage("Thank you! Your registration has been received. Our team will contact you soon.");
      e.currentTarget.reset();
    }catch(err){setMessage(err instanceof Error?err.message:"Something went wrong.");}
    finally{setBusy(false);}
  }
  return <main>
    <nav className="container flex items-center justify-between"><div className="font-extrabold text-xl text-indigo-700">StudentConnect</div><a className="text-sm font-semibold text-indigo-700" href="/admin">Admin Login ↗</a></nav>
    <section className="container grid md:grid-cols-2 gap-10 items-center py-12 md:py-20">
      <div><div className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700 mb-5">STUDENT REGISTRATION PORTAL</div>
        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">Your next opportunity starts <span className="text-indigo-600">here.</span></h1>
        <p className="text-lg muted mt-5 leading-8">Register your details and promo code. Our team will get in touch with you to share the next steps.</p>
        <div className="mt-8 flex gap-3 text-sm muted"><span>✓ Quick registration</span><span>✓ Personal assistance</span></div>
      </div>
      <div className="card p-6 md:p-8">
        <h2 className="text-2xl font-extrabold">Register now</h2><p className="muted mt-2 mb-6">Enter your correct contact details below.</p>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="block text-sm font-semibold mb-2">Full name *</label><input className="field" name="full_name" required minLength={2} maxLength={100} placeholder="Your full name"/></div>
          <div><label className="block text-sm font-semibold mb-2">Email address *</label><input className="field" type="email" name="email" required maxLength={254} placeholder="you@example.com"/></div>
          <div><label className="block text-sm font-semibold mb-2">Mobile number *</label><input className="field" type="tel" name="mobile_number" required pattern="[+]?[0-9\s-]{8,16}" placeholder="+91 98765 43210"/></div>
          <div><label className="block text-sm font-semibold mb-2">WhatsApp number *</label><input className="field" type="tel" name="whatsapp_number" required pattern="[+]?[0-9\s-]{8,16}" placeholder="+91 98765 43210"/></div>
          <div><label className="block text-sm font-semibold mb-2">Promo code *</label><input className="field uppercase" name="promo_code" required maxLength={40} placeholder="Enter your promo code"/></div>
          <label className="flex gap-3 text-sm leading-5"><input type="checkbox" name="consent" value="yes" required className="mt-1"/> I agree that the team may contact me by phone or WhatsApp about this registration.</label>
          <button disabled={busy} className="btn btn-primary w-full disabled:opacity-60">{busy?"Submitting...":"SUBMIT REGISTRATION →"}</button>
          {message&&<p role="status" className={`text-sm rounded-lg p-3 ${ok?"bg-green-50 text-green-800":"bg-red-50 text-red-700"}`}>{message}</p>}
        </form>
        <p className="text-xs muted mt-5">Your details are used only to respond to your registration. Please read our privacy policy before submitting.</p>
      </div>
    </section>
    <footer className="container text-center text-sm muted py-8">© {new Date().getFullYear()} StudentConnect · <a href="/privacy" className="underline">Privacy notice</a></footer>
  </main>;
}