import { useState } from 'react';
import { Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { countries } from '@/lib/countries';

export default function CountryPromptModal({ onSaved }) {
  const [country, setCountry] = useState('US');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({ country });
    setSaving(false);
    onSaved(country);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4">
      <div className="bg-card rounded-2xl border border-border shadow-lg p-6 w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Where do you live?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Please select your country/region to continue.
          </p>
        </div>

        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="h-12 mb-5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.flag} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="w-full h-12 font-medium" disabled={saving} onClick={handleSave}>
          {saving ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
