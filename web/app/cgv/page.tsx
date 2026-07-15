"use client";

import { useT } from "../../lib/i18n/LanguageContext";

export default function CgvPage() {
  const t = useT();
  const notice = t("legal.frenchOnlyNotice");
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Conditions générales de vente</h1>
      <p className="mb-2 text-sm text-slate-400">Dernière mise à jour : juillet 2026</p>
      {notice && <p className="mb-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{notice}</p>}

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">1. Objet</h2>
          <p>
            Ticket Area est une plateforme de billetterie qui met en relation des organisateurs d'événements (concerts,
            soirées) et des acheteurs de billets. Ticket Area agit en tant qu'intermédiaire technique ; chaque billet est
            vendu par l'organisateur de l'événement concerné, dont le nom est indiqué sur la fiche de l'événement.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">2. Commande et paiement</h2>
          <p>
            La commande est définitive après validation du paiement, traité par notre prestataire Stripe. Le prix payé
            inclut le prix du billet fixé par l'organisateur ; les frais de service éventuels sont affichés avant
            validation de la commande.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">3. Livraison des billets</h2>
          <p>
            Les billets sont électroniques (e-billets) et accessibles immédiatement après paiement dans l'espace « Mes
            billets » de votre compte. Chaque billet comporte un QR code unique scanné à l'entrée de l'événement.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">4. Droit de rétractation</h2>
          <p>
            Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux
            prestations de services de loisirs devant être fournies à une date déterminée (spectacles, concerts,
            événements). Les billets ne sont donc en principe ni échangeables ni remboursables, sauf annulation ou
            report de l'événement par l'organisateur.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">5. Annulation ou report d'un événement</h2>
          <p>
            En cas d'annulation d'un événement par l'organisateur, les acheteurs sont informés par email et remboursés
            selon les modalités communiquées par l'organisateur. En cas de report, les billets restent valables pour la
            nouvelle date sauf indication contraire.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">6. Responsabilité</h2>
          <p>
            Ticket Area agit comme intermédiaire technique de billetterie et n'est pas responsable de la tenue, du
            contenu ou de l'annulation d'un événement, qui relève de la seule responsabilité de l'organisateur.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">7. Données personnelles</h2>
          <p>
            Le traitement de vos données personnelles est décrit dans notre{" "}
            <a href="/confidentialite" className="text-brand hover:underline">
              politique de confidentialité
            </a>
            .
          </p>
        </section>
      </div>

      <p className="mt-10 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
        Ce document est un modèle informatif fourni pour couvrir les points essentiels d'une billetterie en ligne. Il
        est recommandé de le faire relire par un professionnel du droit avant mise en production, afin de l'adapter à
        votre structure juridique réelle (mentions légales, SIRET, etc.).
      </p>
    </div>
  );
}
