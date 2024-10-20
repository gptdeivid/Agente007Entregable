import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { question, response } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-70b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an expert business analysis assistant. Your task is to evaluate if the user's response is congruent with the question asked about their business and customers. If the answer is not nonsense and ok, respond only with 'Yes'. If it's not, respond only with 'No'. Do not provide any additional explanations or suggestions. Answer only with 'Yes' or 'No' in english.",
        },
        {
          role: "user",
          content: `Question: "${question}" Response: "${response}" Is this response congruent with the question?`,
        },
      ],
    });
    const aiResponse =
      completion.choices[0].message?.content?.toLowerCase() ?? "";
    const isValid = aiResponse.includes("yes");

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Error validating response:", error);
    return NextResponse.json(
      { error: "Failed to validate response" },
      { status: 500 }
    );
  }
}
