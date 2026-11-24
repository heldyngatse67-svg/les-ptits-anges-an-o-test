// ============================================
// M'A SANTÉ — INTERACTIONS JAVASCRIPT
// ============================================

// MENU MOBILE
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");

    const icon = menuToggle.querySelector("i");

    if (navLinks.classList.contains("show")) {
        icon.classList.replace("fa-bars", "fa-xmark");
    } else {
        icon.classList.replace("fa-xmark", "fa-bars");
    }
});

// Fermer le menu après avoir cliqué sur un lien
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");

        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    });
});

// NAVIGATION ACTIVE
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".nav-link").forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");
    });
});

// TOAST NOTIFICATION
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// CHAT
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

// Ajout d'un message dans la conversation
function addMessage(text, type = "assistant") {
    const message = document.createElement("div");
    message.classList.add("message", type);

    const avatar = document.createElement("div");
    avatar.classList.add("message-avatar");

    const content = document.createElement("div");
    content.classList.add("message-content");

    if (type === "assistant") {
        avatar.innerHTML = '<i class="fa-solid fa-heart-pulse"></i>';
    } else {
        avatar.innerHTML = '<i class="fa-solid fa-user"></i>';
    }

    // Ne pas injecter les saisies utilisateurs en HTML
    content.textContent = text;

    message.appendChild(avatar);
    message.appendChild(content);

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Réponses de démonstration (pas un vrai assistant médical)
function getDemoResponse(message) {
    const text = message.toLowerCase();

    // Situations urgentes possibles
    const emergencyKeywords = [
        "difficulté à respirer",
        "difficulte a respirer",
        "respire pas",
        "ne respire plus",
        "douleur poitrine",
        "douleur thoracique",
        "perte de connaissance",
        "inconscient",
        "convulsion",
        "saigne beaucoup",
        "hémorragie",
        "hemorragie",
        "suicider",
        "me tuer"
    ];

    const emergencyDetected = emergencyKeywords.some(word =>
        text.includes(word)
    );

    if (emergencyDetected) {
        return "Ce que vous décrivez pourrait nécessiter une aide urgente. N'attendez pas une réponse en ligne : contactez immédiatement les services d'urgence locaux ou rendez-vous dans un centre de santé. Si possible, demandez à une personne de confiance de rester avec vous.";
    }

    // Douleurs
    if (
        text.includes("douleur") ||
        text.includes("mal") ||
        text.includes("souffre")
    ) {
        return "Je comprends que ces douleurs puissent être préoccupantes. Pour votre sécurité, je ne peux pas déterminer leur cause à partir d'un message. Si la douleur est intense, soudaine, persistante ou s'aggrave, consultez rapidement un professionnel de santé. Vous pouvez aussi préciser depuis quand elle a commencé et si d'autres symptômes l'accompagnent.";
    }

    // Symptômes
    if (
        text.includes("symptôme") ||
        text.includes("symptome") ||
        text.includes("fièvre") ||
        text.includes("fievre") ||
        text.includes("fatigue") ||
        text.includes("toux")
    ) {
        return "Merci de partager ce que vous ressentez. Les symptômes peuvent avoir différentes causes et nécessitent parfois un examen médical. Notez leur début, leur fréquence et leur évolution. Si vous vous sentez très mal ou si votre état s'aggrave, consultez rapidement un professionnel de santé.";
    }

    // Prévention
    if (
        text.includes("prévention") ||
        text.includes("prevention") ||
        text.includes("conseil") ||
        text.includes("éviter") ||
        text.includes("eviter")
    ) {
        return "Pour préserver votre santé au quotidien, privilégiez une alimentation variée, une bonne hydratation, un sommeil suffisant, une activité physique adaptée et un suivi médical régulier. Les conseils doivent être adaptés à votre situation personnelle.";
    }

    // Santé mentale / inquiétudes
    if (
        text.includes("stress") ||
        text.includes("angoisse") ||
        text.includes("triste") ||
        text.includes("mental") ||
        text.includes("déprime") ||
        text.includes("deprime")
    ) {
        return "Merci de parler de ce que vous traversez. Votre bien-être émotionnel est important. Vous pouvez en discuter avec une personne de confiance ou un professionnel de santé. Si vous êtes en danger immédiat ou pensez vous faire du mal, recherchez tout de suite une aide humaine et urgente.";
    }

    // Réponse générale
    return "Merci de nous avoir partagé votre préoccupation. Votre santé mérite de l'attention. Cette plateforme est un prototype de démonstration et ne peut pas fournir de diagnostic. Si votre problème vous inquiète, persiste ou s'aggrave, rapprochez-vous d'un professionnel de santé. Vous pouvez continuer à préciser ce que vous ressentez, mais évitez de partager des informations personnelles identifiantes.";
}

// Envoi du message
chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = userInput.value.trim();

    if (!message) return;

    addMessage(message, "user");

    userInput.value = "";
    userInput.style.height = "auto";

    // Réponse de démonstration
    setTimeout(() => {
        const response = getDemoResponse(message);
        addMessage(response, "assistant");
    }, 600);
});

// Boutons de questions rapides
document.querySelectorAll(".quick-btn").forEach(button => {
    button.addEventListener("click", () => {
        const question = button.dataset.question;

        userInput.value = question;
        userInput.focus();

        // Envoyer automatiquement la question
        chatForm.requestSubmit();
    });
});

// Ajuster automatiquement la hauteur du champ
userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, 100) + "px";
});

// ENTRÉE POUR ENVOYER / SHIFT+ENTRÉE POUR RETOUR
userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        chatForm.requestSubmit();
    }
});

// FORMULAIRE CONTACT — DÉMO SANS BACKEND
const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();

    if (!name || !email) {
        contactFeedback.textContent = "Veuillez remplir les champs obligatoires.";
        return;
    }

    contactFeedback.textContent =
        "Merci " + name + " ! Le formulaire fonctionne en démonstration, mais aucun message n'est réellement envoyé.";

    contactForm.reset();
});

// ANIMATION À L'APPARITION DES SECTIONS
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

document.querySelectorAll(
    ".service-card, .prevention-card, .about-content, .about-image"
).forEach(element => {
    element.classList.add("reveal");
    observer.observe(element);
});

console.log("M'a Santé — Prototype chargé avec succès.");