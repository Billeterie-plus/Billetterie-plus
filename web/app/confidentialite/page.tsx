"use client";

import { useT } from "../../lib/i18n/LanguageContext";

export default function PrivacyPage() {
  const t = useT();
  const notice = t("legal.frenchOnlyNotice");
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Politique de confidentialité</h1>
      <p className="mb-2 text-sm text-slate-400">Dernière mise à jour : juillet 2026</p>
      {notice && <p className="mb-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">{notice}</p>}

      <div className="space-y-8 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">1. Données collectées</h2>
          <p>
            Lors de la création d'un compte ou d'un achat de billet, Ticket Area collecte : votre nom, votre adresse email,
            un mot de passe (stocké de façon chiffrée, jamais en clair), et, si vous êtes organisateur, le nom de votre
            organisation. Les informations de paiement (numéro de carte, etc.) ne transitent jamais par nos serveurs :
            elles sont saisies directement sur la page sécurisée de notre prestataire de paiement, Stripe.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">2. Utilisation des données</h2>
          <p>
            Vos données servent uniquement à : gérer votre compte et vos billets, vous envoyer vos e-billets et
            confirmations de commande, permettre aux organisateurs de vérifier vos billets à l'entrée d'un évènement, et
            améliorer le fonctionnement du site. Nous ne vendons ni ne partageons vos données avec des tiers à des fins
            commerciales.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">3. Paiement sécurisé</h2>
          <p>
            Les paiements sont traités par Stripe, prestataire certifié PCI-DSS (norme de sécurité des données de
            l'industrie des cartes de paiement). Ticket Area ne stocke jamais vos coordonnées bancaires complètes sur ses
            propres serveurs.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">4. Conservation des données</h2>
          <p>
            Vos données sont conservées pendant la durée de votre compte, puis supprimées ou anonymisées dans un délai
            raisonnable après sa suppression, sauf obligation légale de conservation plus longue (facturation,
            comptabilité).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">5. Vos droits</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de
            rectification, d'effacement, de limitation et de portabilité de vos données, ainsi que du droit de vous
            opposer à leur traitement. Vous pouvez exercer ces droits en nous contactant à l'adresse indiquée ci-dessous.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">6. Cookies</h2>
          <p>
            Ticket Area utilise uniquement les cookies strictement nécessaires au fonctionnement du site (maintien de
            votre session de connexion). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-base font-semibold text-slate-900">7. Contact</h2>
          <p>
            Pour toute question relative à vos données personnelles, contactez-nous via l'adresse email associée à
            votre compte organisateur, ou depuis la page de contact du site.
          </p>
        </section>
      </div>

      <p className="mt-10 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
        Ce document est un modèle informatif fourni pour couvrir les points essentiels de conformité. Il est recommandé
        de le faire relire par un professionnel du droit avant mise en production, afin de l'adapter précisément à votre
        activité et à votre structure juridique.
      </p>
    </div>
  );
}
