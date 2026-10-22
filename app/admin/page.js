import PageFrame from '../components/PageFrame';
import Admin from './Admin';
export const metadata={title:'TEACH Administration',robots:{index:false,follow:false}};
export default function Page(){return <PageFrame eyebrow="PRIVATE ADMINISTRATION" title="TEACH workspace"><Admin/></PageFrame>;}
