import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export async function GET(request:Request){
 const auth=await requireAdmin(request);if("error" in auth)return NextResponse.json({error:auth.error},{status:auth.status});
 const {data,error}=await auth.supabase.from("student_leads").select("*").order("created_at",{ascending:false}).limit(2000);
 if(error)return NextResponse.json({error:"Could not retrieve leads."},{status:500});
 return NextResponse.json({leads:data||[]});
}
export async function PATCH(request:Request){
 const auth=await requireAdmin(request);if("error" in auth)return NextResponse.json({error:auth.error},{status:auth.status});
 const body=await request.json();const id=String(body.id||"");
 const allowed=["New","Contacted","Interested","Converted","Not Interested"];
 const patch:any={};
 if(body.lead_status!==undefined){if(!allowed.includes(body.lead_status))return NextResponse.json({error:"Invalid status."},{status:400});patch.lead_status=body.lead_status;}
 if(body.admin_notes!==undefined)patch.admin_notes=String(body.admin_notes).slice(0,2000);
 if(!id||Object.keys(patch).length===0)return NextResponse.json({error:"Missing update data."},{status:400});
 const {data,error}=await auth.supabase.from("student_leads").update(patch).eq("id",id).select("*").single();
 if(error)return NextResponse.json({error:"Update failed."},{status:500});
 return NextResponse.json({lead:data});
}
export async function DELETE(request:Request){
 const auth=await requireAdmin(request);if("error" in auth)return NextResponse.json({error:auth.error},{status:auth.status});
 const id=new URL(request.url).searchParams.get("id");if(!id)return NextResponse.json({error:"Missing id."},{status:400});
 const {error}=await auth.supabase.from("student_leads").delete().eq("id",id);
 if(error)return NextResponse.json({error:"Delete failed."},{status:500});
 return NextResponse.json({ok:true});
}