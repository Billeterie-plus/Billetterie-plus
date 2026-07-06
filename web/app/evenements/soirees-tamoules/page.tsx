import EventTypeListing from "../../../components/EventTypeListing";

export default function SoireesTamoulesPage() {
  return (
    <EventTypeListing
      type="SOIREE"
      title="Soirées tamoules"
      intro="Trouvez la prochaine grande soirée tamoule près de chez vous et réservez votre entrée."
      emptyMessage="Aucune soirée tamoule n'est publiée pour le moment. Revenez bientôt !"
    />
  );
}
