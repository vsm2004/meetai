import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CallView } from "@/modules/call/ui/views/call-view";

interface Props{
    params:Promise<{
        meetingId:string;
    }>;
};
 const Page=async({params}:Props)=>{
    const session=await auth.api.getSession({
        headers:await headers()
    })
    if(!session){
        redirect("/sign-in");
    }
    const {meetingId}=await params;
    return(
        <CallView meetingId={meetingId}/>
    )
}
export default Page;