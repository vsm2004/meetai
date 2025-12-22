import HomeView from "@/modules/home/ui/views/home-view";
import { caller } from "@/trpc/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // optional server test call
  // const data = await caller.hello({ text: "Manu Server" });

  return <HomeView />;
};

export default Page;
