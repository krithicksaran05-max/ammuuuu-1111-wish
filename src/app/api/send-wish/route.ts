import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { wish } = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram environment variables TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID are not set.");
      return NextResponse.json({ success: false, error: "Telegram credentials missing on server." });
    }

    const message = `✨ *New Wish Sent to the Cosmos!* ✨\n\n_"${wish}"_`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json();
    if (!data.ok) {
      console.error("Telegram send error:", data);
      return NextResponse.json({ success: false, error: data.description });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Telegram API Route Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
