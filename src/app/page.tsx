import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsSection } from "@/components/SkillsSection";
import { CredentialsSection } from "@/components/CredentialsSection";
import { TypingGame } from "@/components/TypingGame";
import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <>
      <Hero />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <CredentialsSection />
      <TypingGame />
      <ContactForm />
    </>
  );
}
