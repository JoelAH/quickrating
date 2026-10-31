import type { User } from '@/lib/models/client/user';
import type { TrialPageWithReviews } from '@/lib/models/client/trial-page';
import { Avatar } from '@mui/material';
import RoomIcon from '@mui/icons-material/Room';
import IconGrid from './iconGrid';
import classes from './bizpage.module.scss';

export default function BizPage({ biz }: { biz: User | TrialPageWithReviews }) {
  return <header className={classes.businessHeader}>
    <div className={classes.identity}>
      <Avatar src={biz.imageUrl} alt={biz.businessName} sx={{ width: 76, height: 76, bgcolor: '#eef0e5', color: '#65714f', fontSize: 30, border: `2px solid ${biz.themeColor || '#f6c345'}` }}>{biz.businessName.charAt(0)}</Avatar>
      <div><p className={classes.eyebrow}>CUSTOMER STORIES</p><h1>{biz.businessName}</h1></div>
    </div>
    {biz.greeting && <p className={classes.greeting}>{biz.greeting}</p>}
    {biz.contact?.address && <p className={classes.address}><RoomIcon sx={{ fontSize: 16 }} />{biz.contact.address}</p>}
    <IconGrid biz={biz} />
  </header>;
}
