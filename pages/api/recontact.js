// /pages/api/recontact.js

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('followups')
    .select(`
      id,
      scheduled_at,
      customers (
        id,
        name,
        phone
      )
    `)
    .lte('scheduled_at', new Date().toISOString())
    .eq('status', 'pending');

  if (error) return res.status(500).json({ error });

  const result = data.map(f => ({
    customer_id: f.customers.id,
    name: f.customers.name,
    phone: f.customers.phone
  }));

  res.status(200).json(result);
}