import Header from '../components/Header';
import SiteFooter from '../components/SiteFooter';
import Desk from './components/Desk';
export const metadata={title:'My Desk | TEACH',description:'A place for your family’s learning, plans and records.',robots:{index:false,follow:false}};
export default function Page(){return <><div className="atmosphere-band" aria-hidden="true"/><Header/><Desk/><SiteFooter/></>;}
