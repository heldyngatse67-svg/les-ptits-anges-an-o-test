import { supabase, supabaseConfigured, SUPABASE_SETUP_MESSAGE } from "./supabase.js";

const form = document.getElementById("authForm");
if (form) {
  const message = document.getElementById("authMessage");
  const submit = document.getElementById("authSubmit");
  const googleButton = document.querySelector("[data-google-auth]");

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.add("show");
    message.setAttribute("role", isError ? "alert" : "status");
  }

  function destinationFor(role) {
    if (role === "patient") return "./index.html";
    if (role === "doctor") return "./medecin.html";
    if (role === "admin") return "./dashboard.html";
    return null;
  }

  async function routeAuthenticatedUser(user) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role, clinician_verified")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    if (profile.role === "doctor" && !profile.clinician_verified) {
      await supabase.auth.signOut();
      showMessage("Votre compte professionnel est en attente de vérification. Aucun accès médical n’a été accordé.");
      return;
    }

    const destination = destinationFor(profile.role);
    if (!destination) {
      await supabase.auth.signOut();
      showMessage("Ce rôle ne dispose pas d’un espace accessible depuis cette plateforme.", true);
      return;
    }
    window.location.assign(destination);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!supabaseConfigured) {
      showMessage(SUPABASE_SETUP_MESSAGE, true);
      return;
    }

    const mode = document.getElementById("signupTab").classList.contains("active")
      ? "signup"
      : "login";
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const fullName = document.getElementById("fullName").value.trim();

    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        if (data.session && data.user) {
          await routeAuthenticatedUser(data.user);
        } else {
          showMessage("Inscription reçue. Consultez votre courriel pour confirmer l’adresse avant de vous connecter.");
        }
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error("Supabase n’a retourné aucun utilisateur après la connexion.");
      await routeAuthenticatedUser(data.user);
    } catch (error) {
      showMessage(error.message || "La demande d’authentification a échoué.", true);
    } finally {
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
    }
  });

  if (supabaseConfigured) {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        showMessage(error.message, true);
        return;
      }
      if (data.session?.user) {
        routeAuthenticatedUser(data.session.user).catch((routeError) => {
          showMessage(routeError.message || "Impossible de charger votre profil.", true);
        });
      }
    });
  }

  googleButton?.addEventListener("click", async () => {
    if (!supabaseConfigured) {
      showMessage(SUPABASE_SETUP_MESSAGE, true);
      return;
    }

    googleButton.disabled = true;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/connexion.html` }
      });
      if (error) throw error;
    } catch (error) {
      showMessage(error.message || "La connexion Google n’a pas pu démarrer.", true);
      googleButton.disabled = false;
    }
  });
}
