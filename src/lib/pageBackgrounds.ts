import type { CSSProperties } from 'react';

/** Shared by the picker, live preview, and public page; no remote images required. */
export const PAGE_BACKGROUNDS = [
  {
    id: 'classic', label: 'Classic', description: 'Simple and understated',
    style: { backgroundColor: '#f6f7f0', backgroundImage: 'none', backgroundSize: 'auto' },
  },
  {
    id: 'linen', label: 'Warm linen', description: 'A soft, woven paper texture',
    style: {
      backgroundColor: '#f1e5d2',
      backgroundImage: 'repeating-linear-gradient(0deg, rgba(124, 98, 57, .055) 0px, rgba(124, 98, 57, .055) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(124, 98, 57, .055) 0px, rgba(124, 98, 57, .055) 1px, transparent 1px, transparent 4px)',
      backgroundSize: 'auto',
    },
  },
  {
    id: 'botanical', label: 'Botanical', description: 'Gentle green, organic shapes',
    style: {
      backgroundColor: '#dce7d0',
      backgroundImage: 'radial-gradient(ellipse at 0% 20%, #c1d1b1 0%, #c1d1b1 18%, transparent 18.2%), radial-gradient(ellipse at 100% 55%, #d0ddbd 0%, #d0ddbd 23%, transparent 23.2%), radial-gradient(ellipse at 5% 95%, #c3d1b5 0%, #c3d1b5 20%, transparent 20.2%), linear-gradient(135deg, #edf2e3, #d4e0c8)',
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'sunrise', label: 'Soft sunrise', description: 'Peach, golden light, and lilac',
    style: {
      backgroundColor: '#f5e1dc',
      backgroundImage: 'radial-gradient(ellipse at 10% 10%, #f9d99c 0%, transparent 50%), radial-gradient(ellipse at 95% 85%, #d4c5e1 0%, transparent 55%), linear-gradient(140deg, #fff3d7, #f3d5d2, #d4dfed)',
      backgroundSize: '100% 100%',
    },
  },
  {
    id: 'starlight', label: 'Starlight', description: 'Deep blue with scattered stars',
    style: {
      backgroundColor: '#1d3042',
      backgroundImage: 'radial-gradient(circle, rgba(255, 237, 188, .7) 1px, transparent 1.7px), radial-gradient(circle, rgba(220, 232, 245, .4) .8px, transparent 1.5px), linear-gradient(145deg, #172736, #31485c)',
      backgroundSize: '83px 97px, 137px 163px, 100% 100%',
      backgroundPosition: '12px 18px, 49px 71px, center',
    },
  },
] as const satisfies readonly { id: string; label: string; description: string; style: CSSProperties }[];

export type PageBackground = typeof PAGE_BACKGROUNDS[number]['id'];
export const PAGE_BACKGROUND_IDS = PAGE_BACKGROUNDS.map(background => background.id);

export function isPageBackground(value: unknown): value is PageBackground {
  return PAGE_BACKGROUNDS.some(background => background.id === value);
}

export function normalizePageBackground(value: unknown): PageBackground {
  return isPageBackground(value) ? value : 'classic';
}

export function getPageBackgroundStyle(value: unknown): CSSProperties {
  return PAGE_BACKGROUNDS.find(background => background.id === normalizePageBackground(value))!.style;
}
