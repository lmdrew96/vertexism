import Masthead from "@/components/Masthead";
import Jumper from "@/components/Jumper";
import EndNote from "@/components/EndNote";
import Colophon from "@/components/Colophon";
import OrbitalEncounter from "@/moments/OrbitalEncounter";
import EdgeStates from "@/moments/EdgeStates";
import SectionI from "@/sections/SectionI";
import SectionIV from "@/sections/SectionIV";
import FourStatesProse from "@/sections/FourStatesProse";

const Page = () => {
  return (
    <>
      <Masthead />
      <main>
        <OrbitalEncounter />
        <SectionI />
        <Jumper note="Sections II & III continue the walk — Whitman as believer, the infidel reframe, the contradiction as permission." />
        <SectionIV />
        <EdgeStates />
        <FourStatesProse />
        <EndNote />
      </main>
      <Colophon />
    </>
  );
};

export default Page;
