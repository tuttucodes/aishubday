import { Act0Gate } from "@/components/acts/Act0Gate";
import { Act1Countdown } from "@/components/acts/Act1Countdown";
import { readMedia, readBonus } from "@/lib/media.server";
import { Act2Timeline } from "@/components/acts/Act2Timeline";
import { Act3Constellation } from "@/components/acts/Act3Constellation";
import { Act4Letter } from "@/components/acts/Act4Letter";
import { Act5Reasons } from "@/components/acts/Act5Reasons";
import { Act6Songs } from "@/components/acts/Act6Songs";
import { Act7Cake } from "@/components/acts/Act7Cake";
import { Act8Song } from "@/components/acts/Act8Song";
import { Act9Gift } from "@/components/acts/Act9Gift";
import { FinalCard } from "@/components/acts/FinalCard";
import { SceneNav } from "@/components/SceneNav";
import { RevealProvider, RevealGate } from "@/components/RevealProvider";

export default function Home() {
  const media = readMedia();
  const bonus = readBonus();
  return (
    <RevealProvider>
      <main className="relative">
        <Act0Gate />
        <section id="act-1"><Act1Countdown /></section>
        <RevealGate>
          <SceneNav />
          <section id="act-2"><Act2Timeline media={media} bonus={bonus} /></section>
          <section id="act-3"><Act3Constellation /></section>
          <section id="act-4"><Act4Letter /></section>
          <section id="act-5"><Act5Reasons /></section>
          <section id="act-6"><Act6Songs /></section>
          <section id="act-7"><Act7Cake /></section>
          <section id="act-8"><Act8Song /></section>
          <section id="act-9"><Act9Gift /></section>
          <FinalCard />
        </RevealGate>
      </main>
    </RevealProvider>
  );
}
