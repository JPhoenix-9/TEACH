import RegistrationPage from "../../components/RegistrationPage";

export const metadata = {
  title: "Can I Really Homeschool? Your Top 10 Questions Answered | TEACH",
  description: "A free webinar with Jana Sheridan to help you take your next step with confidence. Your top 10 homeschooling questions answered. Coming soon, with registration required.",
  robots: { index: false, follow: false },
};

export default function RegisterCommonQuestions() {
  return <RegistrationPage slug="common-questions"
    title="Can I Really Homeschool?"
    subtitle="Your Top 10 Questions Answered"
    image="/webinars/can-i-really-homeschool.png"
    imageAlt="A mother looking warmly at her daughter as she reads a book at their sunlit kitchen table"
    description="A free webinar with Jana Sheridan to help you take your next step with confidence."
    introduction="Thinking about homeschooling brings plenty of questions. Join Jana as she addresses ten of the questions parents most often ask, so you can consider your next step with a clearer understanding."
    upcoming
  />;
}
