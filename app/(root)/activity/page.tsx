import React from "react";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";

const ActivityPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  console.log({ userInfo });

  if (!userInfo?.onboarded) redirect("/onboarding");

  // get user activity
  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className='text-heading2-bold text-light-1 mb-10'>Activity</h1>
      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className='flex items-center gap-2 rounded-md bg-dark-2 px-7 py-4'>
                  <Image
                    src={activity.author.image}
                    alt='Profile Picture'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className="!text-small-regular text-light-1" >
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default ActivityPage;
