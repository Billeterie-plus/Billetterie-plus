import EventTypeListing from "../../../components/EventTypeListing";

export default function ConcertsTamoulsPage() {
  return (
    <EventTypeListing
      type="CONCERT"
      titleKey="listing.concerts.title"
      introKey="listing.concerts.intro"
      emptyKey="listing.concerts.empty"
    />
  );
}
