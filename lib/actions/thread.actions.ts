"use server";

import { connectToDb } from "../mongoose";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDb();

    const createThread = await Thread.create({ text, author, community: null });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createThread._id },
    });

    revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Error creating thread: ${err.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 20) {
  try {
    connectToDb();

    const skipAmount = (pageNumber - 1) * pageSize;

    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const threads = await threadsQuery.exec();
    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext };
  } catch (err: any) {
    throw new Error(`Error fetching threads: ${err.message}`);
  }
}
