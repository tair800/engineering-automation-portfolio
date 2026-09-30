import { Capabilities } from "@/components/home/capabilities";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Featured } from "@/components/home/featured";
import { Hero } from "@/components/home/hero";
import { Principles } from "@/components/home/principles";
import { ProjectList } from "@/components/home/project-list";
import { Results } from "@/components/home/results";

export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <Results />
      <Capabilities />
      <ProjectList />
      <Experience />
      <Principles />
      <Contact />
    </>
  );
}
