const languagePairs = [
  ["Aller au contenu principal", "Skip to main content"],
  ["La santé accessible à tous", "Accessible healthcare for everyone"],
  ["MENU PRINCIPAL", "MAIN MENU"],
  ["Accueil", "Home"],
  ["Parler de ma santé", "Talk about my health"],
  ["Communauté", "Community"],
  ["Mon carnet de santé", "My health record"],
  ["Après configuration et connexion, votre carnet affiche les informations de santé protégées par les règles d’accès Supabase. Aucune donnée fictive n’est affichée.", "After setup and sign-in, your record displays health information protected by Supabase access policies. No fictitious data is shown."],
  ["Programmes de santé", "Health programs"],
  ["Solidarité & association", "Solidarity & association"],
  ["MON ESPACE", "MY SPACE"],
  ["Mon profil", "My profile"],
  ["Mes rendez-vous", "My appointments"],
  ["Besoin d'aide ? 💚", "Need help? 💚"],
  ["Notre mission est de vous accompagner vers une meilleure santé.", "Our mission is to support you on your journey to better health."],
  ["Nous contacter", "Contact us"],
  ["Visiteur AN.O", "AN.O Visitor"],
  ["Compte découverte", "Demo account"],
  ["Ouvrir le menu", "Open menu"],
  ["Plateforme /", "Platform /"],
  ["Navigation principale", "Main navigation"],
  ["Notifications", "Notifications"],
  ["Connexion / Inscription", "Log in / Sign up"],
  ["Bonjour et bienvenue 👋", "Hello and welcome 👋"],
  ["Votre espace de santé, d'écoute, de soutien et de partage.", "Your space for health, listening, support, and sharing."],
  ["✦ Votre santé compte", "✦ Your health matters"],
  ["✦ LA SANTÉ AU CENTRE DE NOS PRIORITÉS", "✦ HEALTH IS OUR PRIORITY"],
  ["Vous n'êtes", "You are"],
  ["pas seul.", "not alone."],
  ["Parlez de votre santé, trouvez du soutien, partagez votre vécu et accédez aux ressources qui peuvent vous aider.", "Talk about your health, find support, share your experience, and access resources that can help you."],
  ["Rejoindre la communauté", "Join the community"],
  ["Parler de ma santé →", "Talk about my health →"],
  ["Une communauté à votre écoute", "A community that listens"],
  ["Solidarité · Prévention · Accompagnement", "Solidarity · Prevention · Support"],
  ["Informations importantes", "Important information"],
  ["Données protégées", "Protected data"],
  ["Supabase n’est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env, puis redémarrez le serveur.", "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, then restart the server."],
  ["Après configuration, les données du compte sont traitées par Supabase et protégées par des autorisations.", "After setup, account data is processed by Supabase and protected by access policies."],
  ["Information, pas diagnostic", "Information, not a diagnosis"],
  ["Les contenus ne remplacent pas une consultation.", "This content is not a substitute for a consultation."],
  ["Soutien respectueux", "Respectful support"],
  ["La bienveillance et la protection des membres priment.", "Kindness and member privacy come first."],
  ["Information importante :", "Important information:"],
  ["AN.O Santé est un prototype associatif. Pour une urgence ou une détérioration de votre état, contactez immédiatement les services de santé locaux.", "AN.O Santé is a nonprofit prototype. In an emergency or if your condition worsens, contact local health services immediately."],
  ["Comment pouvons-nous vous aider ?", "How can we help you?"],
  ["Découvrez les services disponibles sur AN.O Santé.", "Explore the services available on AN.O Santé."],
  ["Exprimez vos préoccupations, symptômes ou besoins de santé.", "Share your health concerns, symptoms, or needs."],
  ["Faire une demande →", "Make a request →"],
  ["Échangez, partagez vos expériences et soutenez d'autres membres.", "Connect, share experiences, and support other members."],
  ["Participer →", "Join in →"],
  ["Carnet de santé", "Health record"],
  ["Retrouvez vos informations de santé et préparez votre suivi médical.", "Keep track of your health information and prepare for medical follow-ups."],
  ["Découvrir →", "Explore →"],
  ["Services médicaux", "Healthcare services"],
  ["Découvrez les possibilités d'orientation et de consultation médicale.", "Explore referral and medical consultation options."],
  ["Voir les programmes →", "View programs →"],
  ["La communauté s'exprime", "Community voices"],
  ["Les derniers échanges et témoignages", "Recent discussions and stories"],
  ["Tout voir →", "View all →"],
  ["À découvrir", "Discover"],
  ["Nos initiatives et programmes", "Our initiatives and programs"],
  ["Informer et accompagner", "Inform and support"],
  ["Rapprocher les soins", "Bringing care closer"],
  ["Santé en milieu rural", "Rural healthcare"],
  ["Santé numérique", "Digital health"],
  ["Solidarité", "Solidarity"],
  ["Des solutions connectées", "Connected solutions"],
  ["Des actions pour tous", "Actions for everyone"],
  ["Explorer nos programmes", "Explore our programs"],
  ["Exprimez votre besoin. Vous méritez d'être écouté.", "Share what you need. You deserve to be heard."],
  ["UN ESPACE D'ÉCOUTE", "A SPACE TO BE HEARD"],
  ["Votre santé mérite toute notre attention.", "Your health deserves our full attention."],
  ["Décrivez votre situation, posez une question ou indiquez le type d'accompagnement dont vous avez besoin. Votre message ne constitue pas une consultation médicale.", "Describe your situation, ask a question, or tell us what support you need. Your message is not a medical consultation."],
  ["Professionnel de santé", "Healthcare professional"],
  ["Exprimez-vous librement", "Express yourself freely"],
  ["Ce formulaire n’est pas opérationnel. N’y saisissez aucune information médicale : aucun message ne sera transmis.", "This form is not available. Do not enter medical information: no message will be sent."],
  ["Votre nom ou pseudo", "Your name or nickname"],
  ["Comment pouvons-nous vous appeler ?", "What should we call you?"],
  ["Quel est votre besoin ?", "What do you need?"],
  ["Sélectionnez un sujet", "Select a topic"],
  ["Symptômes ou problème de santé", "Symptoms or health concern"],
  ["Demande d'orientation médicale", "Medical referral request"],
  ["Drépanocytose", "Sickle cell disease"],
  ["Santé de mon enfant", "My child's health"],
  ["Bien-être et écoute", "Well-being and support"],
  ["Prévention et information", "Prevention and information"],
  ["Accompagnement social", "Social support"],
  ["Autre", "Other"],
  ["Votre message", "Your message"],
  ["Décrivez votre situation ou votre besoin...", "Describe your situation or what you need..."],
  ["Envoyer mon message →", "Send my message →"],
  ["⚠️ En cas d'urgence médicale, ne tardez pas à demander de l'aide en vous rendant dans une structure de soins. Ne partagez pas ici vos informations médicales confidentielles.", "⚠️ In a medical emergency, seek help immediately at a healthcare facility. Do not share confidential medical information here."],
  ["Communauté & échanges", "Community & conversations"],
  ["Partager, écouter et s'entraider dans un espace bienveillant.", "Share, listen, and support one another in a caring space."],
  ["Vous n'êtes pas seul 💚", "You are not alone 💚"],
  ["La communauté AN.O Santé est un espace de soutien, de partage d'expériences et d'écoute. Respectez chacun, protégez votre vie privée et encouragez-vous mutuellement.", "The AN.O Santé community is a place for support, shared experiences, and listening. Respect everyone, protect your privacy, and encourage one another."],
  ["Qu'aimeriez-vous partager avec la communauté ?", "What would you like to share with the community?"],
  ["Communauté générale", "General community"],
  ["Santé des enfants", "Children's health"],
  ["Santé rurale", "Rural health"],
  ["Publier", "Post"],
  ["Groupes de soutien", "Support groups"],
  ["4 groupes", "4 groups"],
  ["Patients & familles", "Patients & families"],
  ["Parents & aidants", "Parents & caregivers"],
  ["Bien-être & écoute", "Well-being & support"],
  ["Se soutenir", "Supporting one another"],
  ["Communautés éloignées", "Remote communities"],
  ["Nos règles de bienveillance", "Our community guidelines"],
  ["• Respecter les autres membres.", "• Respect other members."],
  ["• Ne pas poser de diagnostic.", "• Do not diagnose."],
  ["• Ne pas recommander de traitements dangereux.", "• Do not recommend dangerous treatments."],
  ["• Ne jamais publier de données privées.", "• Never post private information."],
  ["• Signaler tout contenu problématique.", "• Report any concerning content."],
  ["Un espace pour préparer et organiser votre suivi de santé.", "A space to prepare and organize your healthcare."],
  ["Votre santé, vos informations", "Your health, your information"],
  ["Dans la future version sécurisée, votre carnet pourra regrouper les informations utiles à votre suivi médical. Cette maquette ne conserve aucune donnée de santé.", "In a future secure version, your record could bring together information useful for your care. This prototype does not store health data."],
  ["👤 Mon profil de santé", "👤 My health profile"],
  ["Profil patient, informations personnelles et contact d'urgence — fonctionnalité à développer.", "Patient profile, personal information, and emergency contact — feature in development."],
  ["💊 Traitements", "💊 Treatments"],
  ["Suivi des traitements, posologie prescrite et historique — fonctionnalité à développer.", "Treatment tracking, prescribed dosage, and history — feature in development."],
  ["🧬 Allergies & antécédents", "🧬 Allergies & medical history"],
  ["Informations importantes à communiquer au professionnel de santé — fonctionnalité à développer.", "Important information to share with a healthcare professional — feature in development."],
  ["📁 Documents médicaux", "📁 Medical documents"],
  ["Résultats, ordonnances et documents — stockage sécurisé à mettre en place.", "Results, prescriptions, and documents — secure storage to be implemented."],
  ["📅 Rendez-vous", "📅 Appointments"],
  ["Historique et prochaines consultations — fonctionnalité à développer.", "History and upcoming consultations — feature in development."],
  ["🩺 Suivi médical", "🩺 Medical follow-up"],
  ["Suivi et échanges avec les professionnels de santé — fonctionnalité à développer.", "Follow-up and communication with healthcare professionals — feature in development."],
  ["Des initiatives pour informer, accompagner et rapprocher les soins.", "Initiatives to inform, support, and bring care closer."],
  ["SENSIBILISATION", "AWARENESS"],
  ["Informer les patients et familles, encourager le dépistage et soutenir les personnes concernées.", "Inform patients and families, encourage screening, and support those affected."],
  ["En savoir plus →", "Learn more →"],
  ["INCLUSION", "INCLUSION"],
  ["Réfléchir à des solutions de santé connectée et d'orientation pour les communautés éloignées.", "Develop connected healthcare and referral solutions for remote communities."],
  ["INNOVATION", "INNOVATION"],
  ["Télémédecine", "Telemedicine"],
  ["Faciliter l'accès aux professionnels, aux rendez-vous et à l'information de santé.", "Improve access to healthcare professionals, appointments, and health information."],
  ["Une approche humaine au service de la santé et de l'inclusion.", "A human-centered approach to health and inclusion."],
  ["SANTÉ · SOLIDARITÉ · ENGAGEMENT", "HEALTH · SOLIDARITY · COMMITMENT"],
  ["La technologie au service de l'humain.", "Technology in service of people."],
  ["AN.O Santé a vocation à prolonger les initiatives de prévention, d'accompagnement et de solidarité. La plateforme est ouverte à tous les patients et peut accueillir différents programmes associatifs et partenaires de santé.", "AN.O Santé aims to extend prevention, support, and solidarity initiatives. The platform is open to all patients and can host a range of nonprofit programs and healthcare partners."],
  ["Découvrir la vision du projet", "Discover the project's vision"],
  ["Nos axes d'engagement", "Our areas of commitment"],
  ["Des actions qui rapprochent la santé des communautés.", "Actions that bring healthcare closer to communities."],
  ["Sensibilisation", "Awareness"],
  ["Promouvoir l'information sur les maladies, la prévention et le dépistage.", "Promote information about illness, prevention, and screening."],
  ["Accompagnement", "Support"],
  ["Soutenir les patients, les familles et les personnes vulnérables.", "Support patients, families, and vulnerable people."],
  ["Inclusion rurale", "Rural inclusion"],
  ["Faciliter l'accès à l'information et aux soins pour tous.", "Make information and care accessible to everyone."],
  ["Innovation", "Innovation"],
  ["Créer des solutions numériques accessibles et adaptées au contexte local.", "Create accessible digital solutions suited to the local context."],
  ["Information, écoute et solidarité.", "Information, listening, and solidarity."],
  ["Prototype de démonstration — aucun diagnostic ni message réel.", "Demo prototype — no diagnosis or real messages."],
  ["Contenus à faire valider par des professionnels de santé.", "Content must be reviewed by healthcare professionals."],
  ["Compris", "Got it"],
  ["Connexion", "Log in"],
  ["L’espace personnel sera disponible après la mise en place du système sécurisé de comptes utilisateurs.", "Your personal space will be available once a secure user account system is implemented."],
  ["Besoin d’aide ?", "Need help?"],
  ["La plateforme est en phase de prototype. Les coordonnées officielles de contact seront ajoutées après validation par les responsables du projet.", "The platform is currently a prototype. Official contact details will be added after approval by the project leads."],
  ["Aucune notification pour le moment dans cette démonstration.", "There are no notifications in this demo."],
  ["Programme drépanocytose", "Sickle cell program"],
  ["Ce programme vise à informer, sensibiliser et soutenir les patients et leurs familles. Les informations médicales devront être validées par des professionnels de santé.", "This program aims to inform and support patients and their families. Medical information must be reviewed by healthcare professionals."],
  ["Le projet vise à améliorer l’accès à l’information et à l’orientation médicale, notamment pour les communautés éloignées. Les outils devront tenir compte des connexions limitées et de la disponibilité locale des soins.", "The project aims to improve access to information and medical referrals, particularly for remote communities. Tools must account for limited connectivity and local healthcare availability."],
  ["La téléconsultation, la prise de rendez-vous et les échanges médicaux pourront être intégrés après validation des professionnels, des contraintes réglementaires et de la sécurité.", "Telehealth consultations, appointment booking, and medical communication may be added after professional, regulatory, and security review."],
  ["Solidarité & engagement", "Solidarity & commitment"],
  ["La plateforme est conçue pour accueillir des initiatives de santé, des campagnes de prévention, des projets associatifs et des partenaires engagés au service des patients.", "The platform is designed to host health initiatives, prevention campaigns, nonprofit projects, and partners committed to serving patients."],
  ["Fonctionnalité en cours de préparation.", "Feature in preparation."],
  ["Veuillez compléter tous les champs.", "Please complete all fields."],
  ["Écrivez un message avant de publier.", "Write a message before posting."],
  ["Publication ajoutée à la démonstration.", "Post added to the demo."],
  ["Il y a 25 min", "25 min ago"],
  ["Il y a 1 h", "1 hour ago"],
  ["Il y a 3 h", "3 hours ago"],
  ["Comment gérez-vous les moments difficiles ?", "How do you cope with difficult times?"],
  ["Je cherche à échanger avec des personnes qui vivent la même situation que moi. Vos expériences et vos encouragements me feraient beaucoup de bien. 💚", "I would like to connect with people going through the same thing. Your experiences and encouragement would mean a lot to me. 💚"],
  ["Courage à toi, tu n’es pas seule. ❤️", "Stay strong, you are not alone. ❤️"],
  ["N’hésite pas à en parler à ton médecin pour être bien accompagnée.", "Consider talking to your doctor so you can get the support you need."],
  ["L’importance de la prévention", "The importance of prevention"],
  ["Je pense que nous devrions davantage parler de prévention et encourager les familles à consulter tôt. L’information peut vraiment aider. 🙏", "I think we should talk more about prevention and encourage families to seek care early. Information can really help. 🙏"],
  ["Entièrement d’accord avec toi.", "I completely agree with you."],
  ["La sensibilisation dans les quartiers est importante.", "Awareness in our neighborhoods matters."],
  ["Un espace pour se soutenir", "A place to support one another"],
  ["Parfois, pouvoir parler et être écouté fait déjà beaucoup. Prenons le temps de nous soutenir et de respecter le vécu de chacun.", "Sometimes, being able to talk and be heard makes a big difference. Let's take time to support each other and respect everyone's experience."],
  ["Merci pour ce beau message 💚", "Thank you for this lovely message 💚"],
  ["À l’instant", "Just now"],
  ["Partage de la communauté", "Community post"],
  ["Écrire un commentaire...", "Write a comment..."],
  ["Envoyer", "Send"],
  ["Signaler", "Report"],
  ["⚑ Signaler", "⚑ Report"],
  ["soutien(s)", "support(s)"],
  ["réponse(s)", "repl(y/ies)"],

  ["Welcome, Alex", "Bienvenue, Alex"],
  ["Administrator", "Administrateur"],
  ["Log out", "Déconnexion"],
  ["Overview", "Vue d’ensemble"],
  ["Clients", "Bénéficiaires"],
  ["Doula", "Accompagnantes"],
  ["Programs", "Programmes"],
  ["Encounters", "Consultations"],
  ["Messages", "Messages"],
  ["Reports", "Rapports"],
  ["Billing", "Facturation"],
  ["Settings", "Paramètres"],
  ["Better support.", "Un meilleur accompagnement."],
  ["Better outcomes.", "De meilleurs résultats."],
  ["Stronger communities.", "Des communautés plus fortes."],
  ["Here's what's happening with your programs.", "Voici l’actualité de vos programmes."],
  ["Last 30 Days", "30 derniers jours"],
  ["Last 3 Months", "3 derniers mois"],
  ["May 18 – May 24, 2025", "18 mai – 24 mai 2025"],
  ["May 18", "18 mai"],
  ["May 19", "19 mai"],
  ["May 20", "20 mai"],
  ["May 21", "21 mai"],
  ["May 22", "22 mai"],
  ["May 23", "23 mai"],
  ["May 24", "24 mai"],
  ["Families Supported", "Familles accompagnées"],
  ["vs last 7 days", "par rapport aux 7 derniers jours"],
  ["Active Doulas", "Accompagnantes actives"],
  ["Programs Managed", "Programmes gérés"],
  ["Visits Completed", "Visites effectuées"],
  ["No data available", "Données indisponibles"],
  ["No data source connected", "Aucune source de données connectée"],
  ["Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env, then restart the server. Statistics remain blank and no administration action is active.", "Supabase n’est pas configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env, puis redémarrez le serveur. Les chiffres affichés restent vides et aucune action d’administration n’est active."],
  ["Data unavailable", "Données indisponibles"],
  ["Statistics will appear after a real data source is connected.", "Les statistiques seront affichées après connexion d’une source de données réelle."],
  ["Consultation Activity", "Activité des consultations"],
  ["Validated", "Validées"],
  ["Pending", "En attente"],
  ["Care Plan Progress", "Progression des plans de soins"],
  ["Status", "État"],
  ["Not available", "Non disponible"],
  ["Schedule", "Planning"],
  ["No financial data source connected", "Aucune donnée financière connectée"],
  ["Last 7 Days", "7 derniers jours"],
  ["Total Encounters", "Total des consultations"],
  ["● Completed", "● Terminées"],
  ["● Pending Documentation", "● Dossiers à compléter"],
  ["Care Plans Completed", "Plans de soins terminés"],
  ["On Track", "Dans les objectifs"],
  ["Total Care Plans", "Nombre total de plans de soins"],
  ["Program Activity", "Activité des programmes"],
  ["Birth Support Cases", "Accompagnements à la naissance"],
  ["Postpartum Visits", "Visites post-partum"],
  ["Reimbursement Overview", "Remboursements"],
  ["Claims Submitted", "Demandes soumises"],
  ["Claims Approved", "Demandes approuvées"],
  ["Approval Rate", "Taux d’approbation"],
  ["Upcoming Appointments", "Rendez-vous à venir"],
  ["Today, May 24", "Aujourd’hui, 24 mai"],
  ["Tomorrow, May 25", "Demain, 25 mai"],
  ["3 appointments", "3 rendez-vous"],
  ["6 appointments", "6 rendez-vous"],
  ["View all appointments →", "Voir tous les rendez-vous →"],
  ["You're making an impact.", "Vous faites la différence."],
  ["Thank you for supporting families and building healthier communities.", "Merci d’accompagner les familles et de bâtir des communautés en meilleure santé."],
  ["View Impact Report  →", "Voir le rapport d’impact  →"],
  ["View Impact Report →", "Voir le rapport d’impact →"],
  ["← Overview", "← Vue d’ensemble"],
  ["Beneficiaries", "Bénéficiaires"],
  ["Manage beneficiaries and families supported by the association.", "Gérer les bénéficiaires et les familles accompagnées par l’association."],
  ["View registered beneficiaries and their support history.", "Consulter les bénéficiaires inscrits et leur historique d’accompagnement."],
  ["New registrations", "Nouvelles inscriptions"],
  ["Review new registrations and requests.", "Examiner les nouvelles inscriptions et demandes."],
  ["Follow-ups", "Suivis"],
  ["Monitor beneficiaries and their needs.", "Suivre les bénéficiaires et leurs besoins."],
  ["Healthcare professionals", "Professionnels de santé"],
  ["Manage healthcare professionals and community workers.", "Gérer les professionnels de santé et les agents communautaires."],
  ["Manage doctors, nurses and specialists.", "Gérer les médecins, infirmiers et spécialistes."],
  ["Community workers", "Agents communautaires"],
  ["Coordinate community health workers.", "Coordonner les agents de santé communautaires."],
  ["Verification", "Vérification"],
  ["Review and verify professional profiles.", "Examiner et vérifier les profils professionnels."],
  ["Manage health programs, campaigns and field activities.", "Gérer les programmes de santé, les campagnes et les activités de terrain."],
  ["Campaigns", "Campagnes"],
  ["Organize awareness campaigns and screenings.", "Organiser des campagnes de sensibilisation et de dépistage."],
  ["Rural health", "Santé rurale"],
  ["Coordinate rural healthcare activities.", "Coordonner les activités de santé en milieu rural."],
  ["Program monitoring", "Suivi des programmes"],
  ["Track program objectives and progress.", "Suivre les objectifs et l’avancement des programmes."],
  ["Manage consultations, visits and follow-up activities.", "Gérer les consultations, les visites et les activités de suivi."],
  ["Appointments", "Rendez-vous"],
  ["View and manage upcoming appointments.", "Consulter et gérer les prochains rendez-vous."],
  ["Consultations", "Consultations"],
  ["Track consultation requests.", "Suivre les demandes de consultation."],
  ["Pending actions", "Actions en attente"],
  ["Follow activities that need attention.", "Suivre les activités nécessitant une attention particulière."],
  ["Manage community communication and support.", "Gérer la communication et l’accompagnement communautaires."],
  ["Inbox", "Boîte de réception"],
  ["Review messages and requests.", "Examiner les messages et demandes."],
  ["Manage discussions and exchanges.", "Gérer les discussions et les échanges."],
  ["Moderation", "Modération"],
  ["Review reports and flagged content.", "Examiner les signalements et les contenus marqués."],
  ["Measure the association's results and impact.", "Mesurer les résultats et l’impact de l’association."],
  ["Impact report", "Rapport d’impact"],
  ["Review beneficiaries and program outcomes.", "Examiner les bénéficiaires et les résultats des programmes."],
  ["Health indicators", "Indicateurs de santé"],
  ["Monitor key health indicators.", "Suivre les principaux indicateurs de santé."],
  ["Exports", "Exportations"],
  ["Prepare reports for partners.", "Préparer des rapports pour les partenaires."],
  ["Manage contributions and resources.", "Gérer les contributions et les ressources."],
  ["Donations", "Dons"],
  ["Track contributions and donations.", "Suivre les contributions et les dons."],
  ["Expenses", "Dépenses"],
  ["Monitor campaign expenses.", "Suivre les dépenses des campagnes."],
  ["Financial overview", "Vue financière"],
  ["View financial summaries.", "Consulter les synthèses financières."],
  ["Configure the association workspace.", "Configurer l’espace de travail de l’association."],
  ["Organization profile", "Profil de l’organisation"],
  ["Edit association details.", "Modifier les informations de l’association."],
  ["Access management", "Gestion des accès"],
  ["Manage staff and permissions.", "Gérer le personnel et les autorisations."],
  ["Preferences", "Préférences"],
  ["Configure workspace preferences.", "Configurer les préférences de l’espace de travail."],
  ["Section", "Rubrique"],
  ["Notifications", "Notifications"],
  ["Profil", "Profile"],
  ["Changer de langue", "Change language"],
  ["Ouvrir le menu", "Open menu"],
  ["AN.O Santé — Votre santé, notre priorité", "AN.O Santé — Your health, our priority"],
  ["Espace professionnel", "Professional space"],
  ["ESPACE MÉDICAL", "MEDICAL SPACE"],
  ["COMPTE", "ACCOUNT"],
  ["LES P'TITS ANGES", "LITTLE ANGELS"],
  ["ESPACE PROFESSIONNEL · LES P'TITS ANGES D'AN O", "PROFESSIONAL SPACE · LES P'TITS ANGES D'AN O"],
  ["Bonjour, docteur.", "Hello, doctor."],
  ["Retrouvez un dossier patient, consultez les informations autorisées et rédigez vos comptes rendus au même endroit.", "Find patient records, review authorized information, and write reports in one place."],
  ["Ouvrir un dossier patient →", "Open a patient record →"],
  ["Patients suivis", "Patients under care"],
  ["Consultations aujourd'hui", "Today's consultations"],
  ["Dossiers récents", "Recent records"],
  ["Données après connexion sécurisée", "Data available after secure sign-in"],
  ["Aucune activité chargée", "No activity loaded"],
  ["Historique après authentification", "History available after authentication"],
  ["Rechercher", "Search"],
  ["Accès rapides", "Quick actions"],
  ["Les actions essentielles de votre pratique", "Essential actions for your practice"],
  ["Recherche patient", "Patient search"],
  ["Retrouver un dossier par son code", "Find a record by its code"],
  ["Rédiger un compte rendu médical", "Write a medical report"],
  ["Examens, résultats et pièces jointes", "Exams, results, and attachments"],
  ["Informations et paramètres du compte", "Account information and settings"],
  ["Activité récente", "Recent activity"],
  ["Consultations et dossiers ouverts", "Consultations and opened records"],
  ["Aucune activité pour le moment", "No activity yet"],
  ["Les dossiers récemment consultés apparaîtront ici lorsque votre compte sera connecté.", "Recently accessed records will appear here after your account is connected."],
  ["Confidentialité médicale", "Medical privacy"],
  ["Ne consultez un dossier que dans le cadre de votre prise en charge et avec les autorisations nécessaires.", "Only access a record as part of care and with the required authorization."],
  ["Besoin d'assistance ?", "Need assistance?"],
  ["Thématiques de discussion", "Discussion topics"],
  ["Besoin d'aide pour votre espace professionnel ?", "Need help with your professional workspace?"],
  ["Contacter l'assistance", "Contact support"],
  ["Compte médecin", "Doctor account"],
  ["Code patient (ex. ANO-2048-619)", "Patient code (e.g. ANO-2048-619)"],
  ["Code patient · ex. ANO-2048-619", "Patient code · e.g. ANO-2048-619"],
  ["Rechercher →", "Search →"],
  ["Type de consultation", "Consultation type"],
  ["Date de consultation", "Consultation date"],
  ["Motif de consultation", "Reason for consultation"],
  ["Observations cliniques", "Clinical observations"],
  ["Diagnostic / conclusion médicale", "Diagnosis / medical conclusion"],
  ["Prescription / traitement", "Prescription / treatment"],
  ["Examens demandés", "Requested examinations"],
  ["Recommandations & suivi", "Recommendations & follow-up"],
  ["Annuler", "Cancel"],
  ["Nouvelle consultation", "New consultation"],
  ["Espace médecin", "Doctor workspace"],
  ["Profil professionnel", "Professional profile"],
  ["Documents & examens", "Documents & examinations"],
  ["Saisissez un code patient pour rechercher un dossier.", "Enter a patient code to search for a record."],
  ["Aucune donnée affichée avant l’autorisation du patient.", "No information is shown before the patient's authorization."],
  ["Résumé", "Summary"],
  ["Documents", "Documents"],
  ["Rédiger une consultation", "Write a consultation"],
  ["＋ Rédiger une consultation", "＋ Write a consultation"],
  ["Ajout de document indisponible", "Document upload unavailable"],
  ["État du compte", "Account status"],
  ["Vérification professionnelle", "Professional verification"],
  ["Seuls les professionnels vérifiés peuvent ouvrir cet espace.", "Only verified professionals can open this workspace."],
  ["Aucun dossier patient ouvert.", "No patient record is open."],
  ["Ce formulaire de contact n’est pas opérationnel. N’y saisissez aucune information médicale : aucun message ne sera transmis.", "This contact form is not available. Do not enter medical information: no message will be sent."],
  ["Les contenus de cette plateforme ne constituent pas un diagnostic médical.", "The content on this platform is not a medical diagnosis."],
  ["Les fonctions de contact et de rendez-vous ne sont pas encore disponibles.", "Contact and appointment features are not available yet."],
  ["Vue d'ensemble", "Overview"],
  ["Portail médical", "Medical portal"],
  ["Dossiers patients", "Patient records"],
  ["Rechercher un dossier par identifiant patient.", "Search for a record by patient ID."],
  ["Accès patient", "Patient access"],
  ["Retrouver un dossier médical", "Find a medical record"],
  ["Saisissez le code patient pour retrouver le dossier correspondant.", "Enter the patient code to find the corresponding record."],
  ["L'accès au dossier nécessite l'autorisation valide du patient.", "Access to the record requires valid patient authorization."],
  ["Aucun dossier ouvert. L’accès nécessite une autorisation du patient.", "No record is open. Access requires patient authorization."],
  ["Aucune donnée affichée avant l’autorisation du patient.", "No information is shown before the patient's authorization."],
  ["Aucun dossier patient ouvert.", "No patient record is open."],
  ["Aucun dossier ouvert", "No record is open"],
  ["Données de santé consultées avec autorisation active.", "Health data viewed with active authorization."],
  ["Non renseignée", "Not provided"],
  ["Non renseignées", "Not provided"],
  ["Non renseignés", "Not provided"],
  ["Autorisations actives", "Active authorizations"],
  ["Aucune autorisation active.", "No active authorizations."],
  ["Aucune demande en attente.", "No pending requests."],
  ["Une demande d’accès est en attente.", "An access request is pending."],
  ["Valider et verrouiller", "Sign and lock"],
  ["Enregistrer le brouillon", "Save draft"],
  ["Validée", "Signed"],
  ["Brouillon", "Draft"],
  ["Professionnel vérifié", "Verified professional"],
  ["Compte professionnel", "Professional account"],
  ["Compte vérifié", "Verified account"],
  ["État du compte", "Account status"],
  ["Vérification professionnelle", "Professional verification"],
  ["Authentification Supabase", "Supabase authentication"],
  ["Vérification contrôlée côté base de données", "Verification enforced by the database"],
  ["Code patient introuvable ou accès en attente d’autorisation.", "Patient code not found or authorization is pending."],
  ["Aucune consultation enregistrée.", "No consultations recorded."],
  ["Aucun document médical.", "No medical documents."],
  ["Enregistrer mon profil", "Save my profile"],
  ["Date de naissance", "Date of birth"],
  ["Groupe sanguin", "Blood type"],
  ["Allergies", "Allergies"],
  ["Antécédents médicaux", "Medical history"],
  ["Contact d'urgence", "Emergency contact"],
  ["Demandes d'accès des professionnels", "Professional access requests"],
  ["Autoriser l'accès", "Allow access"],
  ["Refuser", "Decline"],
  ["Révoquer l'accès", "Revoke access"],
  ["Consultations et prescriptions", "Consultations and prescriptions"],
  ["Documents médicaux privés", "Private medical documents"],
  ["Téléverser le document", "Upload document"],
  ["Notifications non lues", "Unread notifications"],
  ["Marquer comme lu", "Mark as read"],
  ["Votre santé, vos informations", "Your health, your information"],
  ["Chargement sécurisé du carnet médical…", "Loading secure health record…"],
  ["Ce module n’est pas encore opérationnel ; aucune modification n’est effectuée ici.", "This module is not available yet; no changes are made here."],
  ["Les fonctions de contact et de rendez-vous ne sont pas encore disponibles.", "Contact and appointment features are not available yet."],
  ["AN.O Santé — Tableau de bord de l’association", "AN.O Santé - Association Dashboard"],
  ["AN.O Santé — plateforme associative d'information, d'écoute et de soutien en santé.", "AN.O Santé — nonprofit platform for health information, listening, and support."],
  ["Rapport d’impact : cette fonction sera connectée aux données réelles.", "Impact report: this feature will be connected to real data."]
];

const translations = { fr: new Map(), en: new Map() };
const normalizeText = value => value.trim().replace(/\s+/g, " ");
const dashboardPairsStart = languagePairs.findIndex(([text]) => text === "Welcome, Alex");
const dashboardPairsEnd = languagePairs.findIndex(
  ([text], index) => index > dashboardPairsStart && text === "Notifications"
);
if (dashboardPairsStart < 0 || dashboardPairsEnd < 0) {
  throw new Error("Language translation groups are incomplete.");
}

for (let index = 0; index < languagePairs.length; index += 1) {
  const [first, second] = languagePairs[index];
  const [french, english] = index >= dashboardPairsStart && index < dashboardPairsEnd
    ? [second, first]
    : [first, second];
  translations.fr.set(normalizeText(english), french);
  translations.en.set(normalizeText(french), english);
}

let currentLanguage = localStorage.getItem("ano-language");
if (currentLanguage !== "fr" && currentLanguage !== "en") currentLanguage = "fr";

function translateValue(value) {
  const translation = translations[currentLanguage].get(normalizeText(value));
  if (translation) return translation;

  const likes = value.match(/^♡\s*(\d+)\s+soutien\(s\)$/);
  if (likes) return currentLanguage === "en" ? `♡ ${likes[1]} likes` : value;
  const englishLikes = value.match(/^♡\s*(\d+)\s+likes$/);
  if (englishLikes) return currentLanguage === "fr" ? `♡ ${englishLikes[1]} soutien(s)` : value;

  const replies = value.match(/^💬\s*(\d+)\s+réponse\(s\)$/);
  if (replies) return currentLanguage === "en" ? `💬 ${replies[1]} replies` : value;
  const englishReplies = value.match(/^💬\s*(\d+)\s+replies$/);
  if (englishReplies) return currentLanguage === "fr" ? `💬 ${englishReplies[1]} réponse(s)` : value;
  return value;
}

function translateTextNode(node) {
  const parent = node.parentElement;
  if (!parent || parent.closest("script, style, noscript, [data-no-translate]")) return;
  const original = node.nodeValue;
  const trimmed = original.trim();
  if (!trimmed) return;
  const normalized = normalizeText(trimmed);
  const translated = translateValue(normalized);
  if (translated !== normalized) {
    node.nodeValue = original.replace(trimmed, translated);
  }
}

function translateElement(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) translateTextNode(walker.currentNode);

  const attributes = ["placeholder", "title", "aria-label", "alt", "content"];
  element.querySelectorAll("*").forEach(node => {
    if (node.matches("[data-no-translate]")) return;
    for (const attribute of attributes) {
      const value = node.getAttribute(attribute);
      if (value) node.setAttribute(attribute, translateValue(value));
    }
  });
  if (element.matches && element.matches("[placeholder], [title], [aria-label], [alt], [content]")) {
    for (const attribute of attributes) {
      const value = element.getAttribute(attribute);
      if (value) element.setAttribute(attribute, translateValue(value));
    }
  }
}

function applyLanguage(language) {
  if (language !== "fr" && language !== "en") return;
  currentLanguage = language;
  localStorage.setItem("ano-language", language);
  document.documentElement.lang = language;
  translateElement(document.body);
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", translateValue(description.getAttribute("content")));

  document.querySelectorAll("[data-language-choice]").forEach(button => {
    const active = button.dataset.languageChoice === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const title = document.title;
  const translatedTitle = translateValue(title);
  if (translatedTitle !== title) document.title = translatedTitle;

  document.dispatchEvent(new CustomEvent("languagechange", { detail: { language } }));
}

window.applyLanguage = applyLanguage;
window.getCurrentLanguage = () => currentLanguage;
window.translatePhrase = (fr, en) => currentLanguage === "fr" ? fr : en;

document.querySelectorAll("[data-language-choice]").forEach(button => {
  button.addEventListener("click", () => applyLanguage(button.dataset.languageChoice));
});

const translationObserver = new MutationObserver(records => {
  for (const record of records) {
    if (record.type === "characterData") translateTextNode(record.target);
    for (const node of record.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
      else if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
    }
  }
});
translationObserver.observe(document.body, { childList: true, characterData: true, subtree: true });

applyLanguage(currentLanguage);
