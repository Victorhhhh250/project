import { Lock } from 'lucide-react';
import type { ComponentProps } from 'react';

const icons = {
  Lock,
} as const;

interface LucideIconsProps extends ComponentProps<typeof Lock> {
  name: keyof typeof icons;
}

export function LucideIcons({ name, ...props }: LucideIconsProps) {
  const Icon = icons[name];
  return <Icon {...props} />;
}
