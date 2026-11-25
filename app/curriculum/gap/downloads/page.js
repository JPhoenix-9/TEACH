import PageFrame from '../../../components/PageFrame';
import OwnedContent from '../../../resources/OwnedContent';

export const metadata={title:'Your GAP Downloads | TEACH',robots:{index:false,follow:false}};
export default function Page(){
 return <PageFrame title="Your GAP Downloads"><OwnedContent section="gap"/></PageFrame>;
}
