import EventTypeListing from "../../../components/EventTypeListing";

export default function SoireesTamoulesPage() {
  return (
    <EventTypeListing
      type="SOIREE"
      titleKey="listing.soirees.title"
      introKey="listing.soirees.intro"
      emptyKey="listing.soirees.empty"
    />
  );
}
