import { Configuration, OpenAIApi } from "openai";
import readline from "readline";

const configuration = new Configuration({
  organization: "org-DeAgs8Rm8BfmRrqSbG0ZGmlq",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const requestQueue = []; // Queue to hold API requests
let isProcessing = false; // Flag to track if API requests are ongoing

userInterface.on("line", (input) => {
  requestQueue.push(input); // Add user input to the request queue

  // Process the request queue only if no other requests are ongoing
  if (!isProcessing) {
    processRequestQueue();
  }
});

async function processRequestQueue() {
  isProcessing = true;

  while (requestQueue.length > 0) {
    const input = requestQueue.shift();
    try {
      const response = await makeApiRequest(input);
      console.log(response.data.choices[0].message.content);
    } catch (error) {
      console.log("Error:", error.message);
    }

    // Introduce a delay before processing the next request to comply with rate limits
    await wait(1000); // Adjust the delay time as needed

    // Check if there are more requests in the queue to process
    if (requestQueue.length === 0) {
      isProcessing = false;
      userInterface.prompt();
    }
  }
}

function makeApiRequest(input) {
  return openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
