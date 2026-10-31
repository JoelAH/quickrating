import { ImageResponse } from 'next/og';
import CONSTANTS from '@/lib/constants';

export const alt = 'QuickRating — Give happy customers a place to speak for you';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ background: '#fbfaf6', width: '100%', height: '100%', padding: '65px 75px', display: 'flex', flexDirection: 'column', color: '#282c24', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', fontSize: 30, alignItems: 'center' }}><span style={{ color: '#b78b15', marginRight: 12 }}>★</span> QuickRating.</div>
      <div style={{ display: 'flex', marginTop: 63, fontSize: 70, lineHeight: 1.1, letterSpacing: -3 }}>Give happy customers<br />a place to speak for you.</div>
      <div style={{ display: 'flex', marginTop: 34, fontSize: 25, color: '#626759' }}>Your own customer review page. No website needed.</div>
      <div style={{ display: 'flex', marginTop: 38, fontSize: 21, background: '#f6c345', padding: '14px 23px', borderRadius: 6, alignSelf: 'flex-start' }}>Start with {CONSTANTS.freeReviewLimit} reviews free →</div>
    </div>, size,
  );
}
