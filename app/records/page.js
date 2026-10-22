import PageFrame from '../components/PageFrame';
import FamilyRecords from './FamilyRecords';
export const metadata={title:'Children’s Records | TEACH',robots:{index:false,follow:false}};
export default function Page(){return <PageFrame eyebrow="YOUR FAMILY’S FILES" title="Children’s Records" introduction="The days, the learning, the story you’re keeping."><FamilyRecords/></PageFrame>;}
