import PageFrame from '../components/PageFrame';
import Wishes from './Wishes';
export const metadata={title:'The Wishing Well | TEACH',robots:{index:false,follow:false}};
export default function Page(){return <PageFrame eyebrow="THE WISHING WELL" title="What do you wish already existed?" introduction="Tell us what would make your homeschool days a little easier."><Wishes/></PageFrame>;}
