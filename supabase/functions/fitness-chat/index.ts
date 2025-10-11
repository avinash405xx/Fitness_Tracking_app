import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const SYSTEM_PROMPT = `You are a friendly and knowledgeable fitness assistant. Your role is to help users with:
- Fitness advice and workout routines
- Nutrition and diet guidance
- Wellness and mental health tips related to fitness
- Healthy lifestyle habits
- Exercise techniques and form
- Goal setting and motivation

IMPORTANT RESTRICTIONS:
- ONLY respond to questions related to fitness, wellness, nutrition, exercise, and healthy lifestyle
- If asked about topics outside these areas (politics, programming, general knowledge, etc.), politely redirect the conversation back to fitness and wellness
- Do not provide medical diagnoses or treatments - always recommend consulting healthcare professionals for medical concerns
- Keep responses concise, practical, and actionable
- Be encouraging and supportive

If a user asks about something unrelated to fitness/wellness, respond with something like:
"I'm specifically designed to help with fitness, nutrition, and wellness topics. Let's focus on your health and fitness journey! How can I help you with your fitness goals today?"`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, userId } = await req.json();

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: "Message and userId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { data: chatHistory } = await supabase
      .from("chat_history")
      .select("role, content")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(10);

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, weight, height, age, gender")
      .eq("id", userId)
      .maybeSingle();

    const { data: goals } = await supabase
      .from("goals")
      .select("name, category, current_value, target_value, unit, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(5);

    let userContext = "";
    if (profile) {
      userContext += `\n\nUser Profile:\n`;
      if (profile.name) userContext += `- Name: ${profile.name}\n`;
      if (profile.age) userContext += `- Age: ${profile.age}\n`;
      if (profile.gender) userContext += `- Gender: ${profile.gender}\n`;
      if (profile.weight) userContext += `- Weight: ${profile.weight} kg\n`;
      if (profile.height) userContext += `- Height: ${profile.height} cm\n`;
    }

    if (goals && goals.length > 0) {
      userContext += `\nActive Goals:\n`;
      goals.forEach((goal) => {
        userContext += `- ${goal.name}: ${goal.current_value}/${goal.target_value} ${goal.unit} (${goal.category})\n`;
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT + userContext },
    ];

    if (chatHistory && chatHistory.length > 0) {
      chatHistory.forEach((msg) => {
        messages.push({ role: msg.role, content: msg.content });
      });
    }

    messages.push({ role: "user", content: message });

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    );

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
    }

    const openaiData = await openaiResponse.json();
    const assistantResponse = openaiData.choices[0].message.content;

    await supabase.from("chat_history").insert([
      { user_id: userId, role: "user", content: message },
      { user_id: userId, role: "assistant", content: assistantResponse },
    ]);

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});