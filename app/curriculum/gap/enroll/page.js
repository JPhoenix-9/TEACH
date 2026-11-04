import {notFound} from 'next/navigation';
import PageFrame from '../../../components/PageFrame';
import {gapProduct} from '../../../lib/gap-catalog.mjs';
import Enrollment from './Enrollment';

export const metadata={title:'Your GAP selection | TEACH',robots:{index:false,follow:true}};
export default async function Page({searchParams}){
  const {product}=await searchParams;
  const selected=typeof product==='string'?gapProduct(product):null;
  if(!selected)notFound();
  return <PageFrame eyebrow="THE GAP CURRICULUM" title="Your next step." introduction="A complete starting curriculum for your child’s grade band.">
    <Enrollment productKey={selected.key} title={selected.title} pages={selected.pages}/>
  </PageFrame>;
}
