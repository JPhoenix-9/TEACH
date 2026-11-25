import PageFrame from '../components/PageFrame';
import Admin from './Admin';
export const metadata={title:'Owner Dashboard | TEACH',robots:{index:false,follow:false}};
export default function Page(){return <PageFrame eyebrow="TEACH" title="Owner Dashboard"><Admin/></PageFrame>;}
