import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ECO_PRODUCTS, DELIVERY_FEE } from '../../../lib/ecoProducts';

// Server-only client. The service role key bypasses row security, so it stays on the server.
function getAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Server is missing SUPABASE_SERVICE_ROLE_KEY');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false },
  });
}

export async function POST(request) {
  try {
    const supabase = getAdminClient();
    const { cartItems, deliveryMethod, address, contact } = await request.json();

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    // Rebuild the order from our own product list so browser-sent prices can't be tampered with
    const items = [];
    for (const line of cartItems) {
      const product = ECO_PRODUCTS.find((p) => p.id === line.id);
      const quantity = Math.floor(Number(line.quantity));
      if (!product || !(quantity >= 1) || quantity > 99) {
        return NextResponse.json({ error: 'Invalid cart item.' }, { status: 400 });
      }
      items.push({ id: product.id, name: product.name, price: product.price, quantity });
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const isPickup = deliveryMethod === 'pickup';
    const totalAmount = subtotal + (isPickup ? 0 : DELIVERY_FEE);

    // Who is ordering? Guests send no token.
    let userId = null;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      userId = data?.user?.id ?? null;
    }

    const { data: order, error } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        total_amount: totalAmount,
        status: 'pending',
        delivery_method: isPickup ? 'pickup' : 'delivery',
        delivery_address: isPickup ? 'Store Pickup' : address,
        contact_name: contact?.name ?? null,
        contact_email: contact?.email ?? null,
        contact_phone: contact?.phone ?? null,
        items,
      }])
      .select()
      .single();

    if (error) throw error;

    const lemonSqueezyUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_URL;

    if (lemonSqueezyUrl) {
      return NextResponse.json({ url: `${lemonSqueezyUrl}?checkout[custom][order_id]=${order.id}` });
    }
    return NextResponse.json({ url: `/checkout/success?order_id=${order.id}` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
