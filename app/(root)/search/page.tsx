import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";

const SearchPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  console.log({ userInfo });

  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch users
  const result = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className='text-heading2-bold text-light-1 mb-10'>Search</h1>
      {/* Search bar */}
      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='text-center !text-base-regular text-light-3'>
            No Users
          </p>
        ) : (
          <>
            {result.users.map((user) => (<UserCard key={user.id} id={user.id} name={user.name} username={user.username} imgUrl={user.image} userType='User' />)) }
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
