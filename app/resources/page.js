import PageFrame from '../components/PageFrame';
import Resources from './Resources';
export const metadata={title:'Your Resources | TEACH',robots:{index:false,follow:false}};
export default function Page(){return <PageFrame eyebrow="YOUR RESOURCES" title="A place for what you choose." introduction="Your courses, curriculum and registered webinars."><Resources/></PageFrame>;}
