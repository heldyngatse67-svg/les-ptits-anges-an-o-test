import { supabase, supabaseConfigured, SUPABASE_SETUP_MESSAGE } from "./supabase.js";

const card = document.getElementById("patientCard");
if (card) {
  let currentUser = null;
  let currentPatient = null;
  let activeTab = "summary";

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  const formatDate = (value) => value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("fr-FR")
    : "Non renseignée";

  function showError(text) {
    const error = document.getElementById("patientError");
    error.textContent = text;
    error.style.display = "block";
    error.setAttribute("role", "alert");
  }

  function clearCard(message = "Aucun dossier ouvert. L’accès nécessite une autorisation du patient.") {
    card.innerHTML = `<div class="patient-header"><div class="patient-initial">—</div><div><div class="patient-name">Aucun dossier ouvert</div><div class="patient-caption">${escapeHtml(message)}</div></div></div>
      <div class="patient-info-grid"></div>
      <div class="tabs"><button class="tab active" onclick="patientTab('summary',this)">Résumé</button><button class="tab" onclick="patientTab('consultations',this)">Consultations</button><button class="tab" onclick="patientTab('documents',this)">Documents</button></div>
      <div class="tab-content" id="patientTabContent"><div class="tab-empty">Aucune donnée affichée avant l’autorisation du patient.</div></div>
      <div class="patient-actions"><button class="btn btn-primary" onclick="openConsultation()">＋ Rédiger une consultation</button><button class="btn btn-secondary" disabled>Ajout de document indisponible</button></div>`;
  }

  function renderPatientSummary(record, profile) {
    const details = [
      ["Date de naissance", formatDate(record.date_of_birth)],
      ["Groupe sanguin", record.blood_type || "Non renseigné"],
      ["Allergies", record.allergies || "Non renseignées"],
      ["Antécédents", record.medical_history || "Non renseignés"],
      ["Contact d'urgence", record.emergency_contact || "Non renseigné"]
    ];
    return `<div class="patient-header"><div class="patient-initial">${escapeHtml((profile.full_name || "P").slice(0, 2).toUpperCase())}</div><div><div class="patient-name">${escapeHtml(profile.full_name || "Patient")}</div><div class="patient-caption">Données de santé consultées avec autorisation active.</div></div><div class="patient-code">${escapeHtml(record.patient_code)}</div></div>
      <div class="patient-info-grid">${details.map(([label, value]) => `<div class="patient-info"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>`;
  }

  async function loadPatientTab(type = activeTab) {
    if (!currentPatient) return;
    activeTab = type;
    const tabContent = document.getElementById("patientTabContent");
    if (type === "summary") {
      const { data: record, error: recordError } = await supabase
        .from("patient_records")
        .select("*")
        .eq("patient_id", currentPatient.id)
        .single();
      if (recordError) return showError(`Impossible de charger le dossier : ${recordError.message}`);
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", currentPatient.id)
        .single();
      if (profileError) return showError(`Impossible de charger le profil : ${profileError.message}`);
      card.querySelector(".patient-header")?.remove();
      card.querySelector(".patient-info-grid")?.remove();
      card.insertAdjacentHTML("afterbegin", renderPatientSummary(record, profile));
      tabContent.innerHTML = '<div class="tab-empty">Dossier patient chargé depuis la base protégée. Seules les informations autorisées sont affichées.</div>';
      return;
    }

    if (type === "consultations") {
      const [consultationResult, prescriptionResult] = await Promise.all([
        supabase.from("consultations").select("*").eq("patient_id", currentPatient.id).order("consultation_date", { ascending: false }),
        supabase.from("prescriptions").select("*").eq("patient_id", currentPatient.id).order("created_at", { ascending: false })
      ]);
      if (consultationResult.error) return showError(`Impossible de charger les consultations : ${consultationResult.error.message}`);
      if (prescriptionResult.error) return showError(`Impossible de charger les prescriptions : ${prescriptionResult.error.message}`);
      const prescriptions = prescriptionResult.data;
      tabContent.innerHTML = consultationResult.data.length ? consultationResult.data.map((consultation) => `<article class="record-card">
        <strong>${escapeHtml(formatDate(consultation.consultation_date))} · ${escapeHtml(consultation.consultation_type)}</strong>
        <p>État : ${escapeHtml(consultation.status === "signed" ? "Validée" : "Brouillon")}</p>
        <p>Motif : ${escapeHtml(consultation.reason)}</p><p>Observations : ${escapeHtml(consultation.observations)}</p>
        <p>Conclusion : ${escapeHtml(consultation.diagnosis)}</p><p>Suivi : ${escapeHtml(consultation.follow_up)}</p>
        ${prescriptions.filter((prescription) => prescription.consultation_id === consultation.id).map((prescription) => `<p>Prescription (${escapeHtml(prescription.status === "signed" ? "validée" : "brouillon")}) : ${escapeHtml(prescription.items.map((item) => item.instructions).join("; "))}${prescription.doctor_id === currentUser.id && prescription.status === "draft" ? ` <button class="btn btn-secondary" data-sign-prescription="${escapeHtml(prescription.id)}">Valider la prescription</button>` : ""}</p>`).join("")}
        ${consultation.doctor_id === currentUser.id && consultation.status === "draft" ? `<button class="btn btn-primary" data-sign-consultation="${escapeHtml(consultation.id)}">Valider et verrouiller</button>` : ""}
      </article>`).join("") : '<div class="tab-empty">Aucune consultation enregistrée.</div>';
      tabContent.querySelectorAll("[data-sign-prescription]").forEach((button) => {
        button.addEventListener("click", async () => {
          button.disabled = true;
          const { error: signError } = await supabase.rpc("sign_prescription", { prescription_id: button.dataset.signPrescription });
          if (signError) {
            button.disabled = false;
            showError(`La validation de la prescription a échoué : ${signError.message}`);
            return;
          }
          await loadPatientTab("consultations");
        });
      });
      tabContent.querySelectorAll("[data-sign-consultation]").forEach((button) => {
        button.addEventListener("click", async () => {
          button.disabled = true;
          const { error: signError } = await supabase.rpc("sign_consultation", { consultation_id: button.dataset.signConsultation });
          if (signError) {
            button.disabled = false;
            showError(`La validation a échoué : ${signError.message}`);
            return;
          }
          await loadPatientTab("consultations");
        });
      });
      return;
    }

    const { data, error } = await supabase
      .from("medical_documents")
      .select("id, object_path, file_name, category, created_at")
      .eq("patient_id", currentPatient.id)
      .order("created_at", { ascending: false });
    if (error) return showError(`Impossible de charger les documents : ${error.message}`);
    tabContent.innerHTML = data.length
      ? data.map((document) => `<article class="record-card"><button class="text-link" data-medical-document="${escapeHtml(document.id)}">${escapeHtml(document.file_name)}</button><p>${escapeHtml(document.category)} · ${escapeHtml(new Date(document.created_at).toLocaleDateString("fr-FR"))}</p></article>`).join("")
      : '<div class="tab-empty">Aucun document médical.</div>';
    tabContent.querySelectorAll("[data-medical-document]").forEach((button) => {
      button.addEventListener("click", async () => {
        const document = data.find((item) => item.id === button.dataset.medicalDocument);
        const { data: signedUrl, error: urlError } = await supabase.storage
          .from("medical-documents")
          .createSignedUrl(document.object_path, 60);
        if (urlError) {
          showError(`Impossible d’ouvrir le document : ${urlError.message}`);
          return;
        }
        window.open(signedUrl.signedUrl, "_blank", "noopener,noreferrer");
      });
    });
  }

  async function searchPatient(inputId) {
    const code = document.getElementById(inputId).value.trim().toUpperCase();
    const error = document.getElementById("patientError");
    error.style.display = "none";
    currentPatient = null;
    card.classList.remove("show");
    clearCard();
    if (!code) return;
    if (!supabaseConfigured || !currentUser) {
      showError(SUPABASE_SETUP_MESSAGE);
      return;
    }

    const { data: record, error: lookupError } = await supabase
      .from("patient_records")
      .select("patient_id, patient_code")
      .eq("patient_code", code)
      .maybeSingle();
    if (lookupError) {
      showError(`La recherche a échoué : ${lookupError.message}`);
      return;
    }
    if (!record) {
      const { error: requestError } = await supabase.rpc("request_patient_access", { patient_code_input: code });
      if (requestError) {
        showError(requestError.message.includes("No patient found")
          ? "Aucun patient ne correspond à ce code."
          : `Impossible d’envoyer la demande d’accès : ${requestError.message}`);
        return;
      }
      showError("Demande envoyée. Aucune donnée médicale ne sera visible avant l’autorisation du patient.");
      error.setAttribute("role", "status");
      return;
    }

    currentPatient = { id: record.patient_id, code: record.patient_code };
    card.classList.add("show");
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelector(".tab")?.classList.add("active");
    await loadPatientTab("summary");
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function openConsultation() {
    if (!currentPatient) {
      showError("Recherchez un patient et obtenez son autorisation avant de rédiger une consultation.");
      return;
    }
    document.getElementById("consultDate").value = new Date().toISOString().slice(0, 10);
    document.getElementById("consultModal").classList.add("open");
  }

  function closeConsultation() {
    document.getElementById("consultModal").classList.remove("open");
  }

  window.searchPatient = searchPatient;
  window.patientTab = (type, button) => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button?.classList.add("active");
    loadPatientTab(type).catch((error) => showError(`Impossible de charger le dossier : ${error.message}`));
  };
  window.openConsultation = openConsultation;
  window.closeConsultation = closeConsultation;

  document.getElementById("consultModal").addEventListener("click", (event) => {
    if (event.target.id === "consultModal") closeConsultation();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeConsultation();
  });

  document.getElementById("consultForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentPatient) return showError("Aucun dossier autorisé n’est sélectionné.");
    const fields = event.currentTarget.querySelectorAll("input, select, textarea");
    const prescriptionText = fields[5].value.trim();
    const prescriptionItems = prescriptionText
      ? prescriptionText.split(/\r?\n/).map((instructions) => ({ instructions: instructions.trim() })).filter((item) => item.instructions)
      : null;
    const submit = event.currentTarget.querySelector('[type="submit"]');
    submit.disabled = true;
    const { error } = await supabase.rpc("save_consultation", {
      p_patient_id: currentPatient.id,
      p_consultation_date: fields[0].value,
      p_consultation_type: fields[1].value,
      p_reason: fields[2].value.trim(),
      p_observations: fields[3].value.trim(),
      p_diagnosis: fields[4].value.trim(),
      p_follow_up: fields[7].value.trim(),
      p_prescription_items: prescriptionItems
    });
    submit.disabled = false;
    if (error) {
      showError(`La consultation n’a pas été enregistrée : ${error.message}`);
      return;
    }
    closeConsultation();
    event.currentTarget.reset();
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    document.querySelectorAll(".tab")[1]?.classList.add("active");
    await loadPatientTab("consultations");
    window.alert("Consultation enregistrée comme brouillon. Elle ne sera définitive qu’après validation.");
  });

  async function initialize() {
    clearCard(SUPABASE_SETUP_MESSAGE);
    document.querySelector(".demo-chip")?.remove();
    document.querySelector(".profile-sub").textContent = "Connexion non établie";
    if (!supabaseConfigured) {
      showError(SUPABASE_SETUP_MESSAGE);
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session?.user) {
      window.location.assign("./connexion.html");
      return;
    }
    currentUser = data.session.user;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name, clinician_verified")
      .eq("id", currentUser.id)
      .single();
    if (profileError) throw profileError;
    if (profile.role !== "doctor" || !profile.clinician_verified) {
      await supabase.auth.signOut();
      showError("Accès refusé : seuls les professionnels vérifiés peuvent ouvrir cet espace.");
      window.setTimeout(() => window.location.assign("./connexion.html"), 2500);
      return;
    }
    const profileName = profile.full_name || "Médecin";
    document.querySelector(".profile-name").textContent = profileName;
    document.querySelector(".profile-sub").textContent = "Compte vérifié";
    document.querySelector(".top-avatar").textContent = profileName.slice(0, 2).toUpperCase();
    const signOutButton = document.createElement("button");
    signOutButton.type = "button";
    signOutButton.className = "btn btn-secondary btn-sm";
    signOutButton.textContent = "Déconnexion";
    signOutButton.addEventListener("click", async () => {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        showError(`Impossible de fermer la session : ${signOutError.message}`);
        return;
      }
      window.location.assign("./connexion.html");
    });
    document.querySelector(".top-right").append(signOutButton);
    document.querySelectorAll(".patient-error").forEach((element) => {
      element.textContent = "Code patient introuvable ou accès en attente d’autorisation.";
    });
    document.querySelector(".modal-header p").textContent = "Cette consultation sera enregistrée en brouillon dans le dossier autorisé.";
    document.querySelector(".demo-alert").textContent = "Le brouillon n’est visible que par le patient et les professionnels autorisés. Validez-le uniquement après vérification.";
    document.querySelector('#consultForm [type="submit"]').textContent = "Enregistrer le brouillon";
    document.querySelector("#settings .patient-info strong").textContent = "Authentification Supabase";
    document.querySelectorAll("#settings .patient-info strong")[1].textContent = "Vérification contrôlée côté base de données";
  }

  initialize().catch((error) => {
    showError(`Espace médecin indisponible : ${error.message}`);
  });
}
