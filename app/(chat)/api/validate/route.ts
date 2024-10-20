import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const { question, response } = await request.json();

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that determines if a response is congruent with a given question. Respond with 'yes' if it is, and 'no' if it isn't.",
        },
        {
          role: "user",
          content: `Question: "${question}" Response: "${response}" Is this response congruent with the question?`,
        },
      ],
    });

    const aiResponse =
      completion.data.choices[0].message?.content.toLowerCase();
    const isValid = aiResponse === "yes";

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Error validating response:", error);
    return NextResponse.json(
      { error: "Failed to validate response" },
      { status: 500 }
    );
  }
}
