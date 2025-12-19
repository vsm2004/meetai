import HomeView from "@/modules/home/ui/views/home-view";
import { caller } from "@/trpc/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const Page = async () => {
  const data = await caller.hello({ text: "Manu Server" });
  const session =await auth.api.getSession({
    headers:await headers(),
  })
  return (
    <p>{data.greeting}</p>
  )
  return <HomeView />;
};

export default Page;
