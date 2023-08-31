import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";
import { communityTabs } from "@/constants";

const CommunitiesPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  console.log({ userInfo });

  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className='text-heading2-bold text-light-1 mb-10'>Search</h1>
      {/* Search bar */}
      <div className='mt-14 flex flex-col gap-9'>
        {result.communities.length === 0 ? (
          <p className='text-center !text-base-regular text-light-3'>
            No Users
          </p>
        ) : (
          <>
            {result.communities.map((communitiy) => (
              <CommunityCard
                key={communitiy.id}
                id={communitiy.id}
                name={communitiy.name}
                username={communitiy.username}
                imgUrl={communitiy.image}
                bio={communitiy.bio}
                members={communitiy.members}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default CommunitiesPage;
