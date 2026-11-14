import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const { cartItems, deliveryMethod, address } = await request.json();
    
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const { data: order, error } = await supabase
      .from('orders')
      .insert([{ 
        total_amount: totalAmount, 
        status: 'pending',
        delivery_method: deliveryMethod,
        delivery_address: deliveryMethod === 'pickup' ? 'Store Pickup' : address
      }])
      .select()
      .single();

    if (error) throw error;

    const lemonSqueezyUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_URL;
    
    if (lemonSqueezyUrl) {
      return NextResponse.json({ url: `${lemonSqueezyUrl}?checkout[custom][order_id]=${order.id}` });
    } else {
      return NextResponse.json({ url: `/checkout/success?order_id=${order.id}` });
    }

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}