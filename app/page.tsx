import Displayer from "@/components/Displayer";
import ProfileForm from "@/components/ProfileForm";

export default function Home() {
  return (
    <div className="container mx-auto">
      <ProfileForm />
      <Displayer />
    </div>
  );
}
