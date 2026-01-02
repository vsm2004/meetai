import { MeetingsView } from "@/modules/meetings/ui/views/meetings-views";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/meetings-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { loadSearchParams } from "@/modules/agents/params";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadSearchParams(searchParams);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <MeetingsListHeader />
      <MeetingsView />
    </>
  );
};

export default Page;
