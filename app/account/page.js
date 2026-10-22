import PageFrame from "../components/PageFrame";
import FamilyAccount from "./FamilyAccount";
export const metadata={title:"Your Family Account | TEACH",robots:{index:false,follow:false}};
export default function Page(){return <PageFrame eyebrow="YOUR FAMILY AT TEACH" title="Your family account." introduction="Keep your family details together and choose how you hear from us."><FamilyAccount/></PageFrame>;}
