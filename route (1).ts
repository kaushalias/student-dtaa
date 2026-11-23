import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase";

const cleanPhone=(v:string)=>v.replace(/[^\d+]/g,"");
export async function POST(request:Request){
 try{
  const body=await request.json();
  // Honeypot field: real visitors should leave this empty.
  if(body.website) return NextResponse.json({ok:true});
  const full_name=String(body.full_name||"").trim();
  const email=String(body.email||"").trim().toLowerCase();
  const mobile_number=cleanPhone(String(body.mobile_number||""));
  const whatsapp_number=cleanPhone(String(body.whatsapp_number||""));
  const promo_code=String(body.promo_code||"").trim().toUpperCase();
  if(full_name.length<2||full_name.length>100) return NextResponse.json({error:"Please enter a valid name."},{status:400});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254) return NextResponse.json({error:"Please enter a valid email address."},{status:400});
  if(!/^\+?\d{8,15}$/.test(mobile_number)||!/^\+?\d{8,15}$/.test(whatsapp_number)) return NextResponse.json({error:"Please enter valid phone numbers with country code."},{status:400});
  if(!promo_code||promo_code.length>40) return NextResponse.json({error:"Please enter a valid promo code."},{status:400});
  if(body.consent!=="yes") return NextResponse.json({error:"Consent is required."},{status:400});
  const supabase=serverSupabase();
  const {data:promo}=await supabase.from("promo_codes").select("code").eq("code",promo_code).eq("active",true).maybeSingle();
  if(!promo) return NextResponse.json({error:"This promo code is invalid or inactive."},{status:400});
  const {error}=await supabase.from("student_leads").insert({full_name,email,mobile_number,whatsapp_number,promo_code,consent:true,lead_status:"New"});
  if(error){console.error("Lead insert failed:",error.message);return NextResponse.json({error:"Registration could not be saved. Please try again."},{status:500});}
  return NextResponse.json({ok:true},{status:201});
 }catch(e){console.error(e);return NextResponse.json({error:"Invalid request."},{status:400});}
}