import { ResponsiveDialog } from "@/components/responsive-dialogue"
import { MeetingForm } from "./meeting-form"
import { useRouter } from "next/navigation"
import { MeetingGetOne } from "../../types"

interface UpdateMeetingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValues:MeetingGetOne
}

export const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateMeetingDialogProps) => {
  return (
    <ResponsiveDialog
      title="Edit the Meeting"
      description="Create an update in the Meeting details"
      open={open}
      onOpenChange={onOpenChange}
      className="w-full
    max-w-[700px]
    min-w-[600px]"
    >
      <div className="px-6 pb-4">
        <MeetingForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
          initialValues={initialValues}
        />
      </div>
    </ResponsiveDialog>
  )
}
