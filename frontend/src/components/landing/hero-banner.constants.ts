export type HeroBannerSize = 'tall' | 'compact';

export const HERO_BANNER_HEIGHT_TALL = 'min-h-[700px]';
export const HERO_BANNER_HEIGHT_COMPACT = 'min-h-[400px]';

export function getHeroBannerHeightClass(size: HeroBannerSize): string {
  return size === 'compact' ? HERO_BANNER_HEIGHT_COMPACT : HERO_BANNER_HEIGHT_TALL;
}
