import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const SystemSettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  registration: true,
  login: true,
  trading: true,
  deposits: true,
  withdrawals: true,
  maintenanceMode: false,
};

export function SystemSettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (!error && data) {
      setSettings(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();

    // Real-time: reflect admin toggle changes without requiring a page reload.
    const channel = supabase
      .channel('system_settings_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'system_settings' },
        (payload) => setSettings(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadSettings]);

  return (
    <SystemSettingsContext.Provider value={{ settings, loading, refresh: loadSettings }}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const ctx = useContext(SystemSettingsContext);
  if (!ctx) throw new Error('useSystemSettings must be used inside SystemSettingsProvider');
  return ctx;
}
