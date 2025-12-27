import { ResponsiveDialog } from "@/components/responsive-dialogue"
import { AgentForm } from "./agent-form"
import { AgentGetOne } from "../../types"

interface UpdateAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void;
  initialValues:AgentGetOne;
}

export const UpdateAgentDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit the agent details"
      open={open}
      onOpenChange={onOpenChange}
      className="w-full
    max-w-[700px]
    min-w-[600px]"
    >
      <div className="px-6 pb-4">
        <AgentForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
          initialValues={initialValues}
        />
      </div>
    </ResponsiveDialog>
  )
}
