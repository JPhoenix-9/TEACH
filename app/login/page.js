import PageFrame from "../components/PageFrame";
import AuthForm from "../components/AuthForm";
export const metadata={title:'Welcome back. | TEACH'};
export default function Page(){return <PageFrame eyebrow='YOUR FAMILY AT TEACH' title='Welcome back.' introduction='Sign in to your family account.'><AuthForm mode='login'/></PageFrame>;}
