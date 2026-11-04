import {notFound} from 'next/navigation';
import PageFrame from '../../components/PageFrame';
import {blueprintProduct,blueprintPrice} from '../../lib/blueprint-catalog.mjs';
import Enrollment from './Enrollment';

export const metadata={title:'Your Blueprint selection | TEACH',robots:{index:false,follow:true}};
export default async function Page({searchParams}){
  const {product='blueprint'}=await searchParams;
  const selected=typeof product==='string'?blueprintProduct(product):null;
  if(!selected)notFound();
  return <PageFrame eyebrow="HOMESCHOOL SUCCESS BLUEPRINT" title="Your next step." introduction="Choose the guidance that fits what you need right now.">
    <Enrollment productKey={selected.key} title={selected.title} price={blueprintPrice(selected.priceCents)} videos={selected.videos}/>
  </PageFrame>;
}
