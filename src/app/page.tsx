import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { MoreProjects } from "@/components/home/more-projects";
import { SelectedWork } from "@/components/home/selected-work";

/**
 * The home page is written for a recruiter with half a minute, in plain English: who Tahir is, the
 * three projects worth remembering, the rest in a line each, the current role with its core
 * technologies, and how to get in touch. The technical account of every project — architecture,
 * full evidence, limitations — is on its case-study page.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <MoreProjects />
      <Experience />
      <Contact />
    </>
  );
}
