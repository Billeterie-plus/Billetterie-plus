import EventTypeListing from "../../../components/EventTypeListing";

export default function FilmsPage() {
  return (
    <EventTypeListing
      type="FILM"
      titleKey="listing.films.title"
      introKey="listing.films.intro"
      emptyKey="listing.films.empty"
    />
  );
}
