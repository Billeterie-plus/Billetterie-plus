import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} My Ticket. Tous droits réservés.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/cgv" className="hover:text-brand">Conditions générales de vente</Link>
          <Link href="/confidentialite" className="hover:text-brand">Politique de confidentialité</Link>
          <span className="flex items-center gap-1">Paiement sécurisé par Stripe</span>
        </div>
      </div>
    </footer>
  );
}
