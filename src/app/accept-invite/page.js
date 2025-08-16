"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/toast-provider';
const apiUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  useEffect(() => {
    if (token) {
      const accept = async () => {
        const res = await fetch(`${apiUrl}/team/accept-invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (res.ok) {
          toast({ title: 'Success', description: data.message });
          router.push('/login');
        } else {
          toast({ title: 'Error', description: data.message, variant: 'destructive' });
          router.push('/');
        }
      };
      accept();
    } else {
      router.push('/');
    }
  }, [token, router, toast]);

  return <div>Accepting invitation...</div>;
} 