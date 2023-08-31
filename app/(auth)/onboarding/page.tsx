import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

async function OnBoardingPage() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user?.username,
    name: userInfo?  userInfo?.name : user?.firstName || "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ?  userInfo?.image : user?.imageUrl,
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col'>
      <h1 className='text-heading2-bold text-light-1'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Complete your profile now to use Threads{" "}
      </p>
      <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </main>
  );
}

export default OnBoardingPage;
