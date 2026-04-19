import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Clean up expired links
    const { error } = await supabase
      .from('shared_links')
      .update({ is_active: false })
      .lt('expires_at', new Date().toISOString())
      .eq('is_active', true);

    if (error) {
      console.error('Error cleaning up expired links:', error);
      return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Expired links cleaned up successfully' });

  } catch (error) {
    console.error('Error in cleanup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Optional: Add GET method for manual cleanup trigger
export async function GET() {
  return POST(new Request(''));
}