import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";

const CreateThreadPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  console.log({userInfo});

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className='text-heading2-bold text-light-1'>Create Thread</h1>
      <PostThread userId={userInfo._id} />
    </>
  );
};

export default CreateThreadPage;
