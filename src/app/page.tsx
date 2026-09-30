import { Capabilities } from "@/components/home/capabilities";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Featured } from "@/components/home/featured";
import { Hero } from "@/components/home/hero";
import { MoreProjects } from "@/components/home/more-projects";

/**
 * The home page is for a reader with a minute: who, what they build, the three strongest
 * projects with one figure each, the rest in a line each, skills, the current role, and contact.
 * Everything deeper — architecture, full evidence, limitations — is on the case-study pages.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <MoreProjects />
      <Capabilities />
      <Experience />
      <Contact />
    </>
  );
}
