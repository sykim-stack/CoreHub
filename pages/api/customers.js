import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('customers')
      .select('*');

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json({ error });
    }

    return res.status(200).json(data);

  } catch (e) {
    console.error("SERVER ERROR:", e);
    return res.status(500).json({ error: e.message });
  }
}