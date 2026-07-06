import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import eventsRoutes from "./routes/events.routes";
import ordersRoutes from "./routes/orders.routes";
import ticketsRoutes from "./routes/tickets.routes";
import organizerRoutes from "./routes/organizer.routes";
import webhookRoutes from "./routes/webhook.routes";

// Filet de sécurité : une erreur async non rattrapée ne doit jamais tuer le
// process (ce qui coupait TOUTES les requêtes en cours — login, checkout,
// liste d'événements — pendant le redémarrage sur Railway). On journalise et
// on continue plutôt que de crasher.
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

const app = express();

app.use(cors());

// Stripe webhook needs the raw body, so it's mounted before express.json().
app.use("/webhooks", webhookRoutes);

app.use(express.json({ limit: "8mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/events", eventsRoutes);
app.use("/orders", ordersRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/organizer", organizerRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));
