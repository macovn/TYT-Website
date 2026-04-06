import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({ error: 'Supabase configuration is missing' }, { status: 500 });
    }

    // Initialize Supabase admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Create user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role }
    });

    if (authError) {
      console.error('Auth Create Error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (authData.user) {
      console.log('User created in Auth:', authData.user.id);
      
      // 2. Insert profile explicitly
      const { data: insertData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: email,
            role: role || 'editor',
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (profileError) {
        console.error('Profile Insert Error:', profileError);
        // Fallback to upsert
        await supabaseAdmin.from('profiles').upsert({ id: authData.user.id, email, role: role || 'editor' });
      } else {
        console.log('SUCCESS: Profile inserted into DB:', insertData);
      }
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
