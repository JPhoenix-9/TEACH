import PageFrame from "../components/PageFrame";
import AuthForm from "../components/AuthForm";
export const metadata={title:'Welcome back. | TEACH'};
export default async function Page({searchParams}){const {next}=await searchParams;return <PageFrame eyebrow='YOUR FAMILY AT TEACH' title='Welcome back.' introduction='Sign in to your family account.'><AuthForm mode='login' returnTo={next}/></PageFrame>;}
