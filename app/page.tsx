import { Act1Countdown } from "@/components/acts/Act1Countdown";
import { readGallery } from "@/lib/gallery.server";
import { Act2Timeline } from "@/components/acts/Act2Timeline";
import { Act3Constellation } from "@/components/acts/Act3Constellation";
import { Act4Letter } from "@/components/acts/Act4Letter";
import { Act5Reasons } from "@/components/acts/Act5Reasons";
import { Act6Songs } from "@/components/acts/Act6Songs";
import { Act7Cake } from "@/components/acts/Act7Cake";
import { Act9Gift } from "@/components/acts/Act9Gift";
import { Act10Gallery } from "@/components/acts/Act10Gallery";
import { Act11Hero } from "@/components/acts/Act11Hero";
import { FinalCard } from "@/components/acts/FinalCard";
import { SceneNav } from "@/components/SceneNav";
import { RevealProvider, RevealGate } from "@/components/RevealProvider";

export default function Home() {
  const gallery = readGallery();
  return (
    <RevealProvider>
      <main className="relative">
        <section id="act-1"><Act1Countdown /></section>
        <RevealGate>
          <SceneNav />
          <section id="act-2"><Act2Timeline items={gallery} /></section>
          <section id="act-3"><Act3Constellation /></section>
          <section id="act-4"><Act4Letter /></section>
          <section id="act-5"><Act5Reasons /></section>
          <section id="act-6"><Act6Songs /></section>
          <section id="act-7"><Act7Cake /></section>
          <section id="act-11"><Act11Hero src="/hero-letter.mp4" /></section>
          <section id="act-10"><Act10Gallery items={gallery} /></section>
          <section id="act-9"><Act9Gift /></section>
          <FinalCard />
        </RevealGate>
      </main>
    </RevealProvider>
  );
}
