import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import type { User } from '@/lib/models/client/user';
import classes from './bizpage.module.scss';

const channels = [
  { key: 'mail', label: 'Email', icon: EmailIcon },
  { key: 'phone', label: 'Call', icon: LocalPhoneIcon },
  { key: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon },
  { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
  { key: 'facebook', label: 'Facebook', icon: FacebookIcon },
  { key: 'twitter', label: 'X', icon: XIcon },
  { key: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon },
  { key: 'tiktok', label: 'TikTok', icon: MusicNoteIcon },
] as const;

export default function IconGrid({ biz }: { biz: Pick<User, 'contact'> }) {
  return <nav className={classes.contacts} aria-label="Contact this business">{channels.map(({ key, label, icon: Icon }) => {
    const value = biz.contact?.[key]?.trim();
    if (!value) return null;
    let href = value;
    if (key === 'mail') href = `mailto:${value}`;
    else if (key === 'phone') href = `tel:${value}`;
    else if (key === 'whatsapp') href = `https://wa.me/${value.replace(/\D/g, '')}`;
    else {
      href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      try { if (!['https:', 'http:'].includes(new URL(href).protocol)) return null; } catch { return null; }
    }
    return <a key={key} href={href} target={key === 'mail' || key === 'phone' ? undefined : '_blank'} rel="noopener noreferrer"><Icon /><span>{label}</span></a>;
  })}</nav>;
}
