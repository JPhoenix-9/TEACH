import PageFrame from '../components/PageFrame';
import Wishes from './Wishes';
export const metadata={title:'The Wishing Well | TEACH',robots:{index:false,follow:false}};
export default function Page(){return <PageFrame eyebrow="THE WISHING WELL" title="What would you like from TEACH?" introduction="Tell us what you want or need from our current resources, and what you’d like us to create next."><Wishes/></PageFrame>;}
