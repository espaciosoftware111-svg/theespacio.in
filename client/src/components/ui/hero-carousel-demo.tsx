"use client";

import { HeroCarousel, type HeroCarouselItem } from "./hero-carousel";

const ART = (name: string) =>
  `https://pub-45c4a3d9611041d08fe82d52599b72b0.r2.dev/primary-showcase-assets/${name}.jpg`;

const LOOKS: HeroCarouselItem[] = [
  {
    title: "Prismatic\nRift",
    image: ART("prismatic-rift-anime"),
    credit: "BY ESPACIO STUDIO.",
    meta: ["HYDERABAD", "5-10 PM", "TURNKEY"],
    accent: "#7b61ff",
  },
  {
    title: "Ember\nClouds",
    image: ART("black-hole-ember-clouds"),
    credit: "BY MAISON DELACROIX.",
    meta: ["JUBILEE HILLS", "RESIDENCE", "4BHK"],
    accent: "#ff4114",
  },
  {
    title: "Neon\nPortal",
    image: ART("neon-cave-portal-silhouette"),
    credit: "BY STUDIO VANTA.",
    meta: ["BANJARA HILLS", "PENTHOUSE", "VILLA"],
    accent: "#00c8ff",
  },
  {
    title: "Red\nRibbon",
    image: ART("red-ribbon-typography"),
    credit: "BY CASA SOLARA.",
    meta: ["GACHIBOWLI", "DUPLEX", "BESPOKE"],
    accent: "#e5231b",
  },
  {
    title: "Celestial\nLight",
    image: ART("celestial-light-figure"),
    credit: "BY AURELIA STUDIO.",
    meta: ["KOKAPET", "TURNKEY", "LUXURY"],
    accent: "#2f7bff",
  },
];

export default function DemoOne() {
  return (
    <div className="h-screen w-full">
      <HeroCarousel
        items={LOOKS}
        defaultIndex={2}
        brand="ESPACIO"
        onBack={() => {}}
        onMenu={() => {}}
        autoplay
      />
    </div>
  );
}
