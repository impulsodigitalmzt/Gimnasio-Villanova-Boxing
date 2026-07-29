import { Facebook, Instagram } from 'lucide-react';

/** Redes oficiales Villanova Boxing */
export const SOCIAL = {
  facebook: 'https://www.facebook.com/profile.php?id=100063454001537',
  instagram: 'https://www.instagram.com/villanovaboxing/?hl=es',
} as const;

export const socialLinks = [
  {
    href: SOCIAL.facebook,
    label: 'Facebook de Villanova Boxing',
    icon: Facebook,
    external: true,
  },
  {
    href: SOCIAL.instagram,
    label: 'Instagram de Villanova Boxing (@villanovaboxing)',
    icon: Instagram,
    external: true,
  },
] as const;

export function SocialLinks({
  className = '',
  iconClassName = 'size-4',
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="inline-flex size-9 items-center justify-center rounded-full border border-brand/25 text-zinc-300 transition-colors hover:border-brand/60 hover:bg-brand/15 hover:text-brand-light"
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
