import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { customer_id } = req.query;

  const { data, error } = await supabase
    .from('corechat_insurance_logs')
    .select('*')
    .eq('customer_id', customer_id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error });

  res.status(200).json(data);
}