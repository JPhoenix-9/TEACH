import PageFrame from '../components/PageFrame';
import PurchaseComplete from './PurchaseComplete';
export const metadata={title:'Your TEACH order',robots:{index:false,follow:false}};
export default function Page(){return <PageFrame eyebrow="YOUR TEACH ORDER" title="Your next step." introduction="We’ll check your payment confirmation and open your resources."><PurchaseComplete/></PageFrame>;}
