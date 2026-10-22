import PageFrame from "../components/PageFrame";
import AuthForm from "../components/AuthForm";
export const metadata={title:'Reset your password. | TEACH'};
export default function Page(){return <PageFrame eyebrow='YOUR TEACH ACCOUNT' title='Reset your password.' introduction='We’ll email you a link to choose a new password.'><AuthForm mode='reset'/></PageFrame>;}
