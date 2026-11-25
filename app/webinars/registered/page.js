import PageFrame from '../../components/PageFrame';
import OwnedContent from '../../resources/OwnedContent';

export const metadata={title:'Your Registered Webinars | TEACH',robots:{index:false,follow:false}};
export default function Page(){
 return <PageFrame title="Your Registered Webinars"><OwnedContent section="webinars"/></PageFrame>;
}
