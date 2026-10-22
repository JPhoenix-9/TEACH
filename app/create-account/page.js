import PageFrame from "../components/PageFrame";
import AuthForm from "../components/AuthForm";
export const metadata={title:'Create your free account. | TEACH'};
export default function Page(){return <PageFrame eyebrow='A PLACE FOR YOUR FAMILY' title='Create your free account.' introduction='Start with your email. After confirmation, tell us a little about your family.'><AuthForm mode='signup'/></PageFrame>;}
