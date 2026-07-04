"use client";

import { useState } from "react";
import { IconKeys, IconMic, IconDrum, IconHeadphones, IconNote } from "./icons";
import type { IconKey } from "../lib/artists";

const ICONS: Record<IconKey, () => JSX.Element> = {
  keys: IconKeys,
  mic: IconMic,
  drum: IconDrum,
  headphones: IconHeadphones,
  note: IconNote,
};

export default function ArtistAvatar({
  image,
  icon,
  color,
  name,
  size = "sm",
}: {
  image: string;
  icon: IconKey;
  color: string;
  name: string;
  size?: "sm" | "lg";
}) {
  const [errored, setErrored] = useState(false);
  const dim = size === "lg" ? "h-40 w-40" : "h-14 w-14";
  const iconWrap = size === "lg" ? "[&_svg]:h-16 [&_svg]:w-16" : "";
  const Icon = ICONS[icon];

  if (!errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        onError={() => setErrored(true)}
        className={`${dim} rounded-full border object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${dim} items-center justify-center rounded-full bg-gradient-to-br ${color} text-white ${iconWrap}`}
    >
      <Icon />
    </div>
  );
}
