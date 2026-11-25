import PageFrame from '../../components/PageFrame';
import OwnedContent from '../../resources/OwnedContent';

export const metadata={title:'Your Blueprint Lessons | TEACH',robots:{index:false,follow:false}};
export default function Page(){
 return <PageFrame title="Your Blueprint Lessons"><OwnedContent section="blueprint"/></PageFrame>;
}
