// producer.ts
import redis from "./config/redis";

export const producePost = async (postData: Record<string, any>) => {
  const streamKey = "postStream";

  try {
    const postId = await redis.xadd(
      streamKey,
      "*",
      "data",
      JSON.stringify(postData)
    );
    console.log(`Produced post with ID ${postId}`);
  } catch (error) {
    console.error("Error producing post:", error);
  }
};
