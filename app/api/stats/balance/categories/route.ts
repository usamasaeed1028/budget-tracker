import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
};
