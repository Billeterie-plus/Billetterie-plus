import EventTypeListing from "../../../components/EventTypeListing";

export default function ConcertsTamoulsPage() {
  return (
    <EventTypeListing
      type="CONCERT"
      title="Concerts d'artistes tamouls"
      intro="Compositeurs et chanteurs tamouls en tournée : Anirudh Ravichander, Sid Sriram, Yuvan Shankar Raja et bien d'autres. Réservez vos places avant qu'elles ne partent."
      emptyMessage="Aucun concert tamoul n'est publié pour le moment. Revenez bientôt !"
    />
  );
}
