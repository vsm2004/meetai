"use client";

import { AgentsViewError } from '@/modules/agents/ui/views/agents-view';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AgentsViewError />;
}
