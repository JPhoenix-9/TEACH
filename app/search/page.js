import PageFrame from '../components/PageFrame';
import Search from './Search';
export const metadata={title:'Search TEACH',robots:{index:false,follow:true}};
export default function Page(){return <PageFrame eyebrow="FIND YOUR WAY" title="What can we help you find?"><Search/></PageFrame>;}
