import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import React from "react";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchThread } from "@/lib/actions/thread.actions";

const ThreadDetailPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThread(params.id);

  return (
    <section className='relative'>
      <div>
        <ThreadCard
          key={params.id}
          id={params.id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className='mt-7'>
        <Comment
          threadId={thread.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo)}
        />
      </div>
      <div className='mt-10'>
        {thread.children.map((childThread: any) => (
          <ThreadCard
            key={childThread.id}
            id={childThread.id}
            currentUserId={user?.id || ""}
            parentId={childThread.parentId}
            content={childThread.text}
            author={childThread.author}
            community={childThread.community}
            createdAt={childThread.createdAt}
            comments={childThread.children}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default ThreadDetailPage;
