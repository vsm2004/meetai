import { ResponsiveDialog } from "@/components/responsive-dialogue"
import { AgentForm } from "./agent-form"

interface NewAgentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NewAgentDialog = ({
  open,
  onOpenChange,
}: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new agent"
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
        />
      </div>
    </ResponsiveDialog>
  )
}
