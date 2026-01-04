import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { VideoIcon,BanIcon } from "lucide-react"
interface Props{
    meetingId:string
}

export const ActiveState=({
    meetingId
}:Props)=>{
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col
         gap-y-8 items-center justify-center">
        <EmptyState
        image="/upcoming.svg"
        title="Meeting is still active and haven't ended yet"
        description="Meeing will end, once all the participants had left"
        />
            <Button asChild className="w-full lg:w-auto">
                <Link href={'/call/${meetingId}'}>
                <VideoIcon/>
                Join Meeting
                </Link>
            </Button>
        </div>
    )
}