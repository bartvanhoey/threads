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

export async function fetchThread(id: string) {
  try {
    connectToDb();

    const thread = await Thread.findById(id)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err: any) {
    throw new Error(`Error fetching thread: ${err.message}`);
  }
}

export async function addCommentToThread(
  treadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  try {
    connectToDb();
    const origianlThread = await Thread.findById(treadId);
    if (!origianlThread) return; 
    
    const newThread = new Thread({text: commentText, author: userId, parentId: treadId});
    
    const savedComment = await newThread.save();

    origianlThread.children.push(savedComment._id);
    await origianlThread.save();
   
      
    

  } catch (err: any) {
    throw new Error(`Error adding comment to thread: ${err.message}`);
  }
}
