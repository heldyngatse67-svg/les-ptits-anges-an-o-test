import { supabase, supabaseConfigured, SUPABASE_SETUP_MESSAGE } from "./supabase.js";

const recordGrid = document.querySelector(".record-grid");
if (recordGrid) {
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  function showUnavailable(message, isError = false) {
    recordGrid.innerHTML = `<div class="record-card" role="${isError ? "alert" : "status"}"><h3>Mon carnet de santé</h3><p class="record-empty">${escapeHtml(message)}</p><a href="./connexion.html">Connexion / Inscription</a></div>`;
  }

  function formatDate(value) {
    if (!value) return "Non renseignée";
    return new Date(`${value}T00:00:00`).toLocaleDateString("fr-FR");
  }

  async function loadPatientWorkspace(user) {
    const [recordResult, consultationResult, prescriptionResult, documentResult, accessResult, grantedAccessResult, notificationResult] =
      await Promise.all([
        supabase.from("patient_records").select("*").eq("patient_id", user.id).single(),
        supabase.from("consultations").select("*").eq("patient_id", user.id).order("consultation_date", { ascending: false }),
        supabase.from("prescriptions").select("*").eq("patient_id", user.id).order("created_at", { ascending: false }),
        supabase.from("medical_documents").select("*").eq("patient_id", user.id).order("created_at", { ascending: false }),
        supabase.from("patient_access").select("id, doctor_id, requested_at").eq("patient_id", user.id).eq("status", "requested"),
        supabase.from("patient_access").select("id, doctor_id, approved_at").eq("patient_id", user.id).eq("status", "granted"),
        supabase.from("notifications").select("id, message, created_at, read_at").eq("user_id", user.id).is("read_at", null).order("created_at", { ascending: false })
      ]);

    const requiredResults = [recordResult, consultationResult, prescriptionResult, documentResult, accessResult, grantedAccessResult, notificationResult];
    const firstError = requiredResults.find((result) => result.error)?.error;
    if (firstError) throw firstError;

    const record = recordResult.data;
    const consultations = consultationResult.data;
    const prescriptions = prescriptionResult.data;
    const documents = documentResult.data;
    const accessRequests = accessResult.data;
    const grantedAccess = grantedAccessResult.data;
    const notifications = notificationResult.data;

    recordGrid.innerHTML = `
      <section class="record-card" style="grid-column:1/-1">
        <h3>Mon profil de santé</h3>
        <p class="record-empty">Code patient : <strong>${escapeHtml(record.patient_code)}</strong></p>
        <form id="patientRecordForm">
          <div class="form-group"><label for="recordBirthDate">Date de naissance</label><input id="recordBirthDate" type="date" value="${escapeHtml(record.date_of_birth)}"></div>
          <div class="form-group"><label for="recordBloodType">Groupe sanguin</label><select id="recordBloodType"><option value="">Non renseigné</option>${["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => `<option ${record.blood_type === type ? "selected" : ""}>${type}</option>`).join("")}</select></div>
          <div class="form-group"><label for="recordAllergies">Allergies</label><textarea id="recordAllergies" maxlength="4000">${escapeHtml(record.allergies)}</textarea></div>
          <div class="form-group"><label for="recordHistory">Antécédents médicaux</label><textarea id="recordHistory" maxlength="8000">${escapeHtml(record.medical_history)}</textarea></div>
          <div class="form-group"><label for="recordEmergency">Contact d'urgence</label><input id="recordEmergency" maxlength="500" value="${escapeHtml(record.emergency_contact)}"></div>
          <button class="btn btn-primary" type="submit">Enregistrer mon profil</button>
          <p id="recordSaveMessage" role="status"></p>
        </form>
      </section>
      <section class="record-card" style="grid-column:1/-1">
        <h3>Demandes d'accès des professionnels</h3>
        <div>${accessRequests.length ? accessRequests.map((request) => `<article class="record-card"><p>Un professionnel (identifiant ${escapeHtml(request.doctor_id.slice(0, 8))}…) demande l'accès à votre dossier depuis le ${escapeHtml(new Date(request.requested_at).toLocaleDateString("fr-FR"))}.</p><button class="btn btn-primary" data-access-response="${escapeHtml(request.id)}" data-approve="true">Autoriser l'accès</button> <button class="btn btn-secondary" data-access-response="${escapeHtml(request.id)}" data-approve="false">Refuser</button></article>`).join("") : '<p class="record-empty">Aucune demande en attente.</p>'}</div>
        <h4>Autorisations actives</h4>
        ${grantedAccess.length ? grantedAccess.map((grant) => `<article class="record-card"><p>Professionnel autorisé (identifiant ${escapeHtml(grant.doctor_id.slice(0, 8))}…) depuis le ${escapeHtml(grant.approved_at ? new Date(grant.approved_at).toLocaleDateString("fr-FR") : "date non renseignée")}.</p><button class="btn btn-secondary" data-revoke-access="${escapeHtml(grant.id)}">Révoquer l'accès</button></article>`).join("") : '<p class="record-empty">Aucune autorisation active.</p>'}
      </section>
      <section class="record-card" style="grid-column:1/-1">
        <h3>Consultations et prescriptions</h3>
        ${consultations.length ? consultations.map((consultation) => {
          const related = prescriptions.filter((prescription) => prescription.consultation_id === consultation.id);
          return `<article class="record-card"><p><strong>${escapeHtml(formatDate(consultation.consultation_date))} · ${escapeHtml(consultation.consultation_type)}</strong> — ${escapeHtml(consultation.status === "signed" ? "Validée" : "Brouillon")}</p><p>Motif : ${escapeHtml(consultation.reason)}</p><p>Observations : ${escapeHtml(consultation.observations)}</p><p>Conclusion : ${escapeHtml(consultation.diagnosis)}</p><p>Suivi : ${escapeHtml(consultation.follow_up)}</p>${related.map((prescription) => `<p>Prescription : ${escapeHtml(prescription.items.map((item) => item.instructions).join("; "))}</p>`).join("")}</article>`;
        }).join("") : '<p class="record-empty">Aucune consultation enregistrée.</p>'}
      </section>
      <section class="record-card" style="grid-column:1/-1">
        <h3>Documents médicaux privés</h3>
        <form id="medicalDocumentForm"><div class="form-group"><label for="medicalDocument">Ajouter un PDF ou une image (10 Mo maximum)</label><input id="medicalDocument" type="file" accept="application/pdf,image/jpeg,image/png" required></div><div class="form-group"><label for="medicalDocumentCategory">Type de document</label><select id="medicalDocumentCategory"><option value="exam">Examen</option><option value="prescription">Ordonnance</option><option value="report">Compte rendu</option><option value="other">Autre</option></select></div><button class="btn btn-primary" type="submit">Téléverser le document</button><p id="documentMessage" role="status"></p></form>
        ${documents.length ? documents.map((document) => `<p><button class="text-link" data-document-id="${escapeHtml(document.id)}">${escapeHtml(document.file_name)}</button> · ${escapeHtml(formatDate(document.created_at.slice(0, 10)))}</p>`).join("") : '<p class="record-empty">Aucun document enregistré.</p>'}
      </section>
      <section class="record-card" style="grid-column:1/-1">
        <h3>Notifications non lues</h3>
        ${notifications.length ? notifications.map((notification) => `<article class="record-card"><p>${escapeHtml(notification.message)}</p><button class="btn btn-secondary" data-notification-read="${escapeHtml(notification.id)}">Marquer comme lu</button></article>`).join("") : '<p class="record-empty">Aucune notification non lue.</p>'}
      </section>`;

    document.getElementById("patientRecordForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const saveMessage = document.getElementById("recordSaveMessage");
      const { error } = await supabase.from("patient_records").update({
        date_of_birth: document.getElementById("recordBirthDate").value || null,
        blood_type: document.getElementById("recordBloodType").value || null,
        allergies: document.getElementById("recordAllergies").value.trim() || null,
        medical_history: document.getElementById("recordHistory").value.trim() || null,
        emergency_contact: document.getElementById("recordEmergency").value.trim() || null
      }).eq("patient_id", user.id);
      saveMessage.textContent = error ? `Échec de l’enregistrement : ${error.message}` : "Profil de santé enregistré.";
      saveMessage.setAttribute("role", error ? "alert" : "status");
    });

    recordGrid.querySelectorAll("[data-access-response]").forEach((button) => {
      button.addEventListener("click", async () => {
        button.disabled = true;
        const { error } = await supabase.rpc("respond_to_access_request", {
          access_id: button.dataset.accessResponse,
          approve: button.dataset.approve === "true"
        });
        if (error) {
          button.disabled = false;
          window.alert(`Impossible de traiter la demande : ${error.message}`);
        } else {
          await loadPatientWorkspace(user);
        }
      });
    });
    recordGrid.querySelectorAll("[data-revoke-access]").forEach((button) => {
      button.addEventListener("click", async () => {
        if (!window.confirm("Révoquer l’accès de ce professionnel à votre dossier ?")) return;
        button.disabled = true;
        const { error } = await supabase.rpc("revoke_patient_access", { access_id: button.dataset.revokeAccess });
        if (error) {
          button.disabled = false;
          window.alert(`Impossible de révoquer l’accès : ${error.message}`);
          return;
        }
        await loadPatientWorkspace(user);
      });
    });

    document.getElementById("medicalDocumentForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.getElementById("medicalDocument");
      const file = input.files[0];
      const message = document.getElementById("documentMessage");
      if (!file || !["application/pdf", "image/jpeg", "image/png"].includes(file.type) || file.size > 10485760) {
        message.textContent = "Format non pris en charge ou fichier supérieur à 10 Mo.";
        message.setAttribute("role", "alert");
        return;
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-180);
      const objectPath = `${user.id}/${user.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("medical-documents").upload(objectPath, file, {
        contentType: file.type,
        upsert: false
      });
      if (uploadError) {
        message.textContent = `Téléversement refusé : ${uploadError.message}`;
        message.setAttribute("role", "alert");
        return;
      }

      const { error: metadataError } = await supabase.from("medical_documents").insert({
        patient_id: user.id,
        uploaded_by: user.id,
        object_path: objectPath,
        category: document.getElementById("medicalDocumentCategory").value,
        file_name: file.name.slice(0, 255),
        mime_type: file.type,
        size_bytes: file.size
      });
      if (metadataError) {
        const { error: cleanupError } = await supabase.storage.from("medical-documents").remove([objectPath]);
        message.textContent = `Le fichier n’a pas été enregistré dans le dossier : ${metadataError.message}${cleanupError ? ` Le nettoyage a aussi échoué : ${cleanupError.message}` : ""}`;
        message.setAttribute("role", "alert");
        return;
      }
      await loadPatientWorkspace(user);
    });

    recordGrid.querySelectorAll("[data-document-id]").forEach((button) => {
      button.addEventListener("click", async () => {
        const item = documents.find((document) => document.id === button.dataset.documentId);
        const { data, error } = await supabase.storage.from("medical-documents").createSignedUrl(item.object_path, 60);
        if (error) {
          window.alert(`Impossible d’ouvrir le document : ${error.message}`);
          return;
        }
        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      });
    });

    recordGrid.querySelectorAll("[data-notification-read]").forEach((button) => {
      button.addEventListener("click", async () => {
        const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", button.dataset.notificationRead);
        if (error) {
          window.alert(`Impossible de mettre à jour la notification : ${error.message}`);
          return;
        }
        await loadPatientWorkspace(user);
      });
    });
  }

  async function initialize() {
    if (!supabaseConfigured) {
      showUnavailable(SUPABASE_SETUP_MESSAGE, true);
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session?.user) {
      showUnavailable("Connectez-vous pour consulter ou modifier votre carnet médical. Aucune donnée fictive n’est affichée.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", data.session.user.id)
      .single();
    if (profileError) throw profileError;
    if (profile.role === "doctor") {
      window.location.assign("./medecin.html");
      return;
    }
    if (profile.role !== "patient") {
      showUnavailable("Cet espace est réservé aux comptes patients.", true);
      return;
    }

    const nameElement = document.querySelector(".profile-name");
    const roleElement = document.querySelector(".profile-role");
    const avatar = document.querySelector(".profile .avatar");
    if (nameElement) nameElement.textContent = profile.full_name || "Patient";
    if (roleElement) roleElement.textContent = "Espace patient";
    if (avatar) avatar.textContent = (profile.full_name || "P").slice(0, 1).toUpperCase();
    const authButton = document.querySelector(".top-cta");
    if (authButton) {
      authButton.textContent = "Déconnexion";
      authButton.removeAttribute("onclick");
      authButton.addEventListener("click", async () => {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          window.alert(`Impossible de fermer la session : ${signOutError.message}`);
          return;
        }
        window.location.assign("./connexion.html");
      });
    }
    await loadPatientWorkspace(data.session.user);
  }

  initialize().catch((error) => {
    showUnavailable(`Le carnet n’a pas pu être chargé : ${error.message}`, true);
  });
}
