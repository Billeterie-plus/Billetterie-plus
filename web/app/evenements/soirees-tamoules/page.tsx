import EventTypeListing from "../../../components/EventTypeListing";

export default function SoireesTamilPage() {
  return (
    <EventTypeListing
      type="SOIREE"
      titleKey="listing.soirees.title"
      introKey="listing.soirees.intro"
      emptyKey="listing.soirees.empty"
    />
  );
}
