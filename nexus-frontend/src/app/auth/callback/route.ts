import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Sync user to Prisma
      try {
        const { user } = data;
        // Check if user exists in Prisma
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create user in Prisma if they don't exist
          const newUser = await prisma.user.create({
            data: {
              id: user.id, // Use Supabase UUID
              email: user.email,
              name: user.user_metadata?.full_name || user.user_metadata?.name || null,
              image: user.user_metadata?.avatar_url || null,
            }
          });

          // Create default business profile
          await prisma.businessProfile.create({
            data: {
              userId: newUser.id,
            }
          });
        }
      } catch (syncError) {
        console.error("Error syncing user to Prisma:", syncError);
        // Continue anyway so login doesn't completely fail
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Authentication+failed`)
}
