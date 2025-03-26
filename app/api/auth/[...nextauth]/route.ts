import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signIn, signOut, getCurrentUser } from '@/models/auth';

export async function generateStaticParams() {
  return [
    {
      nextauth: ['signin', 'signout', 'session', 'csrf', 'providers']
    }
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'signin') {
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
    }

    const { user, error } = await signIn(email, password);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    return NextResponse.json({ user });
  }

  if (action === 'signout') {
    const { error } = await signOut();
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  if (action === 'session') {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  }

  return NextResponse.json({ error: '无效的操作' }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, email, password } = body;

  if (action === 'signin') {
    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码不能为空' }, { status: 400 });
    }

    const { user, error } = await signIn(email, password);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }

    return NextResponse.json({ user });
  }

  if (action === 'signout') {
    const { error } = await signOut();
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: '无效的操作' }, { status: 400 });
} 