import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const { profileType } = await request.json();
    
    if (!profileType || !['professional', 'personal', 'both'].includes(profileType)) {
      return NextResponse.json({ error: 'Invalid profile type' }, { status: 400 });
    }

    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate secure token
    const token = nanoid(32);
    
    // Set expiration to 30 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Insert shared link
    const { data, error } = await supabase
      .from('shared_links')
      .insert({
        token,
        profile_type: profileType,
        user_id: user.id,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating shared link:', error);
      return NextResponse.json({ error: 'Failed to create shared link' }, { status: 500 });
    }

    const shareUrl = `${request.nextUrl.origin}/shared/${token}`;
    
    return NextResponse.json({ 
      url: shareUrl,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Error in share link generation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}