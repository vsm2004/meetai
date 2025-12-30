import { ResponsiveDialog } from "@/components/responsive-dialogue"
import { MeetingForm } from "./meeting-form"
import { useRouter } from "next/navigation"

interface NewMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NewMeetingDialog = ({
  open,
  onOpenChange,
}: NewMeetingDialogProps) => {
  const router=useRouter();
  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new Meeting"
      open={open}
      onOpenChange={onOpenChange}
      className="w-full
    max-w-[700px]
    min-w-[600px]"
    >
      <div className="px-6 pb-4">
        <MeetingForm
          onSuccess={(id) => {
            onOpenChange(false);
            router.push(`/meetings/${id}`);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </div>
    </ResponsiveDialog>
  )
}
