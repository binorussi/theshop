import { NextResponse } from 'next/server';

type CheckoutItem = {
  name: string;
  quantity: number;
  price: number;
  currency?: string;
  lineTotal?: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      source,
      items,
      totalAmount,
      currency,
      paymentMethod,
      customerInfo,
    } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

    if (!botToken || !adminChatId) {
      console.error(
        'Telegram configuration missing.'
      );

      return NextResponse.json(
        {
          error:
            'Telegram configuration missing',
        },
        {
          status: 500,
        }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          error: 'No items were provided.',
        },
        {
          status: 400,
        }
      );
    }

    const safeItems = items as CheckoutItem[];

    /*
     * Calculate each line total on the server.
     *
     * We do NOT blindly trust the browser's lineTotal.
     */
    const calculatedItems = safeItems.map((item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const lineTotal = price * quantity;

      return {
        ...item,
        price,
        quantity,
        lineTotal,
      };
    });

    /*
     * Calculate the total again on the server.
     */
    const calculatedTotal = calculatedItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    const itemsList = calculatedItems
      .map(
        (item) =>
          `• *${item.name}* (x${item.quantity}) - ${item.lineTotal.toLocaleString(
            'en-ET',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )} ETB`
      )
      .join('\n');

    const paymentLabels: Record<string, string> = {
      cod: 'Pay On Delivery (Cash)',
      telebirr: 'Telebirr',
      cbe: 'Commercial Bank of Ethiopia (CBE)',
    };

    const paymentName =
      paymentLabels[paymentMethod] ||
      paymentMethod ||
      'N/A';

    const orderMessage =
      `🛍️ *NEW ORDER RECEIVED*\n` +
      `🌐 *Source:* ${source || 'Website'}\n` +
      `💳 *Payment:* ${paymentName}\n\n` +

      `👤 *Customer:* ${
        customerInfo?.name || 'N/A'
      }\n` +

      `📞 *Phone:* ${
        customerInfo?.phone || 'N/A'
      }\n` +

      `📍 *Address:* ${
        customerInfo?.address || 'N/A'
      }\n` +

      `💬 *Telegram:* ${
        customerInfo?.telegramUser || 'N/A'
      }\n\n` +

      `🛒 *Items Ordered:*\n` +
      `${itemsList}\n\n` +

      `💰 *Total Amount:* ${calculatedTotal.toLocaleString(
        'en-ET',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )} ETB\n` +

      `⏰ *Time:* ${new Date().toLocaleString(
        'en-ET',
        {
          timeZone: 'Africa/Addis_Ababa',
        }
      )}`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: orderMessage,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!telegramResponse.ok) {
      const telegramError =
        await telegramResponse.text();

      console.error(
        'Telegram API error:',
        telegramError
      );

      return NextResponse.json(
        {
          error:
            'Order could not be sent to Telegram.',
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        'Order submitted successfully',
      totalAmount: calculatedTotal,
      currency: currency || 'ETB',
    });
  } catch (error) {
    console.error(
      'Checkout error:',
      error
    );

    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      {
        status: 500,
      }
    );
  }
}