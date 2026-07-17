import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { wish } = await request.json();

    // Telegram Bot credentials
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram environment variables are missing.");
      return NextResponse.json({ success: false, error: "Telegram credentials missing on server." });
    }

    // Build Telegram message payload
    const telegramPayload = {
      chat_id: chatId,
      text: wish,
    };

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const tgRes = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(telegramPayload),
    });

    const tgData = await tgRes.json();
    if (!tgRes.ok) {
      console.error("Telegram send error:", tgData);
      return NextResponse.json({ success: false, error: tgData.description || "Telegram request failed" });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Telegram API Route Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
