import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '../lib/LanguageContext';

export function FundPasswordModal({ open }) {
  if (!open) return null;

  return (
    <div>
      <h2>Fund Password</h2>
    </div>
  );
}

export function LoginPasswordModal({ open }) {
  if (!open) return null;

  return (
    <div>
      <h2>Login Password</h2>
    </div>
  );
}

export function LanguageModal({ open }) {
  const { language } = useLanguage();

  if (!open) return null;

  return (
    <div>
      <h2>Language</h2>
      <p>{language}</p>
    </div>
  );
}

export function NotificationsModal({ open }) {
  if (!open) return null;

  return (
    <div>
      <h2>Notifications</h2>
    </div>
  );
}

export function SecurityModal({ open }) {
  if (!open) return null;

  return (
    <div>
      <h2>Security Center</h2>
    </div>
  );
}

export function AccountBindingModal({ open }) {
  if (!open) return null;

  return (
    <div>
      <h2>Account Binding</h2>
    </div>
  );
}
