import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { VideoIcon,BanIcon } from "lucide-react"

export const ProcessingState=({
    
})=>{
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col
         gap-y-8 items-center justify-center">
        <EmptyState
        image="/processing.svg"
        title="Meeting was Completed.."
        description=" This Meeing was completed, the summary will appear soon"
        />
        </div>
    )
}