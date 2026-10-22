import ComingSoon from "../components/ComingSoon";
export const metadata = {"title":"Create a Free Account | TEACH","description":"A place for every family at TEACH."};
export default function Page() { return <ComingSoon title="Create a Free Account" image="/Icons/my-desk.png" introduction="A place for every family at TEACH." description="We’re preparing free TEACH accounts and a personal desk for your family. We’ll ask a little about your household so your desk can suggest resources that fit. Your purchases will unlock the resources you choose when account features open." points={["Parent’s name and email address.", "An optional phone number.", "Number of children and each child’s age, to help suggest suitable resources."]} account={true} />; }

