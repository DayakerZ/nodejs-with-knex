import redis from "./config/redis";

type Message = [string, Record<string, any>];

type XReadGroupResult = [string, Message[]][];

const streamKey = "postStream";

const consumePosts = async () => {
  console.log("started consumer");
  const consumerGroup = "postConsumerGroup";
  const consumerName = "postConsumer";

    // await redis.xgroup("CREATE", streamKey, consumerGroup, "$", "MKSTREAM");

  while (true) {
    const result = await redis.xreadgroup(
      "GROUP",
      consumerGroup,
      consumerName,
      "BLOCK",
      2000,
      "STREAMS",
      streamKey,
      ">"
    );

    if (result) {
      const [[stream, messages]]: XReadGroupResult = result as XReadGroupResult;
      console.log("result and stream : ", result, stream);
      for (const [id, data] of messages) {
        console.log(`Received new post with ID ${id}:`, data);

        console.log("Post :", JSON.parse(data[1]));
        // Add your processing logic here

        // Acknowledge that the message has been processed
        await redis.xack(streamKey, consumerGroup, id);
        console.log(`Acknowledged post with ID ${id}`);
      }
    }
  }
};

const readStreamRange = async (
  streamKey: string,
  start: string,
  end: string,
  count: number = 10
) => {
  try {
    const result = await redis.xrange(streamKey, start, end, "COUNT", count);

    if (result) {
      result.forEach(([id, data]: [string, Record<string, any>]) => {
        console.log(`Message ID: ${id}, Data:`, data);
      });
    } else {
      console.log("No messages found in the specified range.");
    }
  } catch (error) {
    console.error("Error reading stream range:", error);
  }
};

consumePosts();

readStreamRange(streamKey, "1702538575406-0", "1702538606210-0",2);
