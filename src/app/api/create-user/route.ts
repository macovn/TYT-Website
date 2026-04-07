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
    let { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role }
    });

    if (authError) {
      console.log('Initial Auth Create Attempt Error:', authError.message);
      
      // If user already exists, try to update/confirm them
      const isAlreadyRegistered = 
        authError.message.toLowerCase().includes('already registered') || 
        authError.message.toLowerCase().includes('already exists');

      if (isAlreadyRegistered) {
        console.log('User already exists, attempting to confirm and update...');
        
        // Find user by email (case-insensitive)
        const { data, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
          console.error('List Users Error:', listError);
          return NextResponse.json({ error: 'Could not list users to find existing account: ' + listError.message }, { status: 400 });
        }

        const users = data.users;
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = users.find((u: any) => u.email?.toLowerCase().trim() === normalizedEmail);
        
        if (existingUser) {
          console.log('Found existing user ID:', existingUser.id);
          const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            existingUser.id,
            { 
              email_confirm: true,
              password: password, // Update password too
              user_metadata: { role }
            }
          );
          
          if (updateError) {
            console.error('Update User Error:', updateError);
            return NextResponse.json({ error: 'User exists but could not be updated/confirmed: ' + updateError.message }, { status: 400 });
          }
          
          console.log('Successfully updated/confirmed existing user.');
          authData = { user: updateData.user };
        } else {
          console.error('User reported as registered but not found in list (first 50 users).');
          return NextResponse.json({ error: 'Tài khoản đã tồn tại nhưng không tìm thấy trong danh sách để tự động xác nhận. Vui lòng liên hệ quản trị viên.' }, { status: 400 });
        }
      } else {
        return NextResponse.json({ error: authError.message }, { status: 400 });
      }
    }

    if (authData.user) {
      console.log('User ID to process in profiles:', authData.user.id);
      
      // 2. Upsert profile directly to be cleaner
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: email.toLowerCase().trim(),
          role: role || 'editor',
          updated_at: new Date().toISOString()
        })
        .select();

      if (profileError) {
        console.error('Profile Upsert Error:', profileError);
        // We don't return 400 here because the Auth part succeeded, 
        // but we log it for debugging.
      } else {
        console.log('SUCCESS: Profile upserted into DB:', profileData?.[0]?.id);
      }
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
