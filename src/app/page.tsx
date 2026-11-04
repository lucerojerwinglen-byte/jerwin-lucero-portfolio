import { Overview } from "@/components/Overview";
import { FitCheck } from "@/components/FitCheck";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsSection } from "@/components/SkillsSection";
import { CredentialsSection } from "@/components/CredentialsSection";
import { TypingGame } from "@/components/TypingGame";
import { ContactForm } from "@/components/ContactForm";
import { ScrollcraftMount } from "@/components/ScrollcraftMount";

export default function Home() {
  return (
    <>
      <ScrollcraftMount />
      <Overview />
      <FitCheck />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <CredentialsSection />
      <TypingGame />
      <ContactForm />
    </>
  );
}
