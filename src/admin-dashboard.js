import { supabase, supabaseConfigured, SUPABASE_SETUP_MESSAGE } from "./supabase.js";

const status = document.getElementById("adminStatus");
if (status) {
  const showStatus = (message, isError = false) => {
    status.textContent = message;
    status.hidden = false;
    status.setAttribute("role", isError ? "alert" : "status");
  };

  async function initialize() {
    if (!supabaseConfigured) {
      showStatus(`${SUPABASE_SETUP_MESSAGE} Les chiffres affichés restent vides et aucune action d’administration n’est active.`, true);
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session?.user) {
      window.location.assign("./connexion.html");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.session.user.id)
      .single();
    if (profileError) throw profileError;
    if (profile.role !== "admin") {
      await supabase.auth.signOut();
      showStatus("Accès réservé à un administrateur autorisé. Redirection vers la connexion…", true);
      window.setTimeout(() => window.location.assign("./connexion.html"), 2000);
      return;
    }

    const signOutButton = document.createElement("button");
    signOutButton.type = "button";
    signOutButton.className = "date-select";
    signOutButton.textContent = "Log out";
    signOutButton.addEventListener("click", async () => {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        showStatus(`Unable to end the session: ${signOutError.message}`, true);
        return;
      }
      window.location.assign("./connexion.html");
    });
    document.querySelector(".top-right").append(signOutButton);

    showStatus("Compte administrateur vérifié. Les statistiques et outils de gestion ne sont pas encore reliés à des données réelles.");
  }

  initialize().catch((error) => {
    showStatus(`Impossible de vérifier l’accès administrateur : ${error.message}`, true);
  });
}
