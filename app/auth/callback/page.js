import PageFrame from "../../components/PageFrame";
import AuthCallback from "./AuthCallback";
export const metadata={title:"Confirm Your Account | TEACH",robots:{index:false,follow:false},referrer:"no-referrer"};
export default function Page(){return <PageFrame eyebrow="YOUR TEACH ACCOUNT" title="Your account." introduction="Finish confirming your email or choosing your password."><AuthCallback/></PageFrame>;}
