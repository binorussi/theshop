import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, items, totalAmount, customerInfo } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!botToken || !adminChatId) {
      return NextResponse.json(
        { error: 'Telegram configuration missing' },
        { status: 500 }
      );
    }

    const itemsList = items
      .map(
        (item: { name: string; quantity: number; price: number }) =>
          `• *${item.name}* (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n');

    const orderMessage =
      `🛍️ *NEW ORDER RECEIVED*\n` +
      `🌐 *Source:* ${source || 'Website'}\n\n` +
      `👤 *Customer:* ${customerInfo?.name || 'N/A'}\n` +
      `📞 *Phone:* ${customerInfo?.phone || 'N/A'}\n` +
      `📍 *Address:* ${customerInfo?.address || 'N/A'}\n` +
      `💬 *Telegram:* ${customerInfo?.telegramUser || 'N/A'}\n\n` +
      `🛒 *Items Ordered:*\n${itemsList}\n\n` +
      `💰 *Total Amount:* $${Number(totalAmount).toFixed(2)} \n` +
      `⏰ *Time:* ${new Date().toLocaleString()}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: adminChatId,
        text: orderMessage,
        parse_mode: 'Markdown',
      }),
    });

    return NextResponse.json({ success: true, message: 'Order submitted successfully' });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}