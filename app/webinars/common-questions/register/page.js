import RegistrationPage from "../../components/RegistrationPage";

export const metadata = {
  title: "Coming Soon: 10 Common Questions About Homeschooling | TEACH",
  robots: { index: false, follow: false },
};

export default function RegisterCommonQuestions() {
  return <RegistrationPage title="10 Common Questions About Homeschooling" description="Jana addresses ten of the questions parents most often ask about homeschooling." upcoming />;
}
