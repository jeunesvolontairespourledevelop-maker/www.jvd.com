/* Assistant virtuel JVD — 100% gratuit, aucune connexion à une IA payante.
   Fonctionne par reconnaissance de mots-clés dans les questions posées. */
(function () {
  const KB = [
    { kw: ["bonjour", "salut", "bonsoir", "coucou"], a: "Bonjour ! Je suis l'assistant virtuel de JVD 🌱 Pose-moi une question sur l'association : notre mission, comment nous rejoindre, ou comment nous contacter." },
    { kw: ["jvd", "association", "qui êtes", "qui etes", "c'est quoi", "signifie"], a: "JVD signifie « Jeunes Volontaires pour le Développement ». C'est une association guinéenne basée à Conakry, portée par des jeunes engagés dans trois domaines : l'éducation, l'environnement et la santé." },
    { kw: ["mission", "objectif", "but"], a: "Notre mission est de montrer qu'une jeunesse guinéenne organisée peut transformer durablement son pays, à travers des actions concrètes en éducation, en environnement et en santé." },
    { kw: ["domaine", "action", "activité", "activités", "que faites"], a: "Nous intervenons sur trois domaines : 📚 Éducation (soutien scolaire, alphabétisation), 🌱 Environnement (reboisement, nettoyage), 🩺 Santé & action sociale (sensibilisation, soutien aux familles). Tu peux voir le détail sur la page « Nos actions »." },
    { kw: ["rejoindre", "devenir volontaire", "m'engager", "adhérer", "inscription", "participer"], a: "Pour rejoindre JVD : écris-nous via le formulaire de contact en précisant le domaine qui t'intéresse (éducation, environnement ou santé). Un membre de l'équipe reviendra vers toi pour la suite. Tout le détail est sur la page « Rejoindre »." },
    { kw: ["cotisation", "payer", "prix", "coût", "cout", "gratuit", "argent"], a: "Rejoindre JVD repose avant tout sur l'engagement et le temps donné sur le terrain, pas sur une cotisation. Les modalités précises te seront expliquées lors de ta prise de contact." },
    { kw: ["contact", "email", "e-mail", "mail", "téléphone", "telephone", "whatsapp", "numéro", "numero", "joindre"], a: "Tu peux nous écrire à jeunesvolontairespourledevelop@gmail.com ou nous joindre sur WhatsApp au +224 625 32 84 50." },
    { kw: ["adresse", "où", "ou", "localisation", "situé", "situe", "conakry", "ville"], a: "JVD est basée à Conakry, en Guinée. Nos actions démarrent là-bas, avec l'ambition de s'étendre à d'autres régions du pays." },
    { kw: ["financ", "budget", "don", "sponsor", "partenaire"], a: "JVD s'appuie sur l'engagement volontaire de ses membres et sur les soutiens ponctuels de partenaires. Si tu souhaites proposer un partenariat, contacte-nous directement par email ou WhatsApp." },
    { kw: ["photo", "vidéo", "video", "galerie", "image"], a: "Tu trouveras nos photos et vidéos d'actions de terrain sur la page « Galerie »." },
    { kw: ["actualité", "actualites", "news", "événement", "evenement", "dernière action"], a: "Retrouve le récit de nos derniers événements sur la page « Actualités »." },
    { kw: ["merci", "ok", "d'accord", "super", "cool"], a: "Avec plaisir ! N'hésite pas si tu as une autre question 🙂" },
  ];

  const FALLBACK = "Je n'ai pas la réponse à cette question précise. Écris-nous directement à jeunesvolontairespourledevelop@gmail.com ou sur WhatsApp au +224 625 32 84 50 — on te répondra avec plaisir.";

  function findAnswer(text) {
    const t = text.toLowerCase();
    for (const entry of KB) {
      if (entry.kw.some(k => t.includes(k))) return entry.a;
    }
    return FALLBACK;
  }

  const css = `
    #jvd-assist-btn{
      position:fixed;bottom:22px;right:22px;width:58px;height:58px;border-radius:50%;
      background:var(--green-deep,#134429);color:#fff;border:none;cursor:pointer;
      box-shadow:0 8px 20px rgba(19,68,41,.35);font-size:1.5rem;z-index:998;
      display:flex;align-items:center;justify-content:center;
    }
    #jvd-assist-panel{
      position:fixed;bottom:92px;right:22px;width:320px;max-height:440px;
      background:#fff;border-radius:16px;box-shadow:0 16px 40px rgba(20,35,29,.25);
      display:none;flex-direction:column;overflow:hidden;z-index:998;font-family:'Manrope','Work Sans',sans-serif;
    }
    #jvd-assist-panel.open{display:flex;}
    #jvd-assist-head{
      background:var(--green-deep,#134429);color:#fff;padding:14px 16px;
      font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:.95rem;
      display:flex;justify-content:space-between;align-items:center;
    }
    #jvd-assist-head button{background:none;border:none;color:#fff;font-size:1.1rem;cursor:pointer;}
    #jvd-assist-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#FBF9F4;}
    .jvd-msg{max-width:82%;padding:9px 13px;border-radius:12px;font-size:.85rem;line-height:1.45;}
    .jvd-msg.bot{background:#fff;border:1px solid #E7E1D2;align-self:flex-start;color:#2b332c;}
    .jvd-msg.me{background:var(--gold-deep,#C9970E);color:#fff;align-self:flex-end;}
    #jvd-assist-form{display:flex;border-top:1px solid #eee;}
    #jvd-assist-input{flex:1;border:none;padding:12px 14px;font-size:.85rem;outline:none;}
    #jvd-assist-form button{background:var(--gold-deep,#C9970E);color:#fff;border:none;padding:0 16px;cursor:pointer;font-weight:700;}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const btn = document.createElement("button");
  btn.id = "jvd-assist-btn";
  btn.setAttribute("aria-label", "Ouvrir l'assistant JVD");
  btn.textContent = "💬";
  document.body.appendChild(btn);

  const panel = document.createElement("div");
  panel.id = "jvd-assist-panel";
  panel.innerHTML = `
    <div id="jvd-assist-head">
      <span>Assistant JVD</span>
      <button id="jvd-assist-close" aria-label="Fermer">✕</button>
    </div>
    <div id="jvd-assist-log"></div>
    <form id="jvd-assist-form">
      <input id="jvd-assist-input" type="text" placeholder="Pose ta question..." autocomplete="off">
      <button type="submit">➜</button>
    </form>
  `;
  document.body.appendChild(panel);

  const log = panel.querySelector("#jvd-assist-log");
  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = "jvd-msg " + who;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  let greeted = false;
  btn.addEventListener("click", () => {
    panel.classList.toggle("open");
    if (!greeted && panel.classList.contains("open")) {
      addMsg("Bonjour ! Je suis l'assistant virtuel de JVD 🌱 Pose-moi une question sur l'association, nos actions, ou comment nous rejoindre.", "bot");
      greeted = true;
    }
  });
  panel.querySelector("#jvd-assist-close").addEventListener("click", () => panel.classList.remove("open"));

  panel.querySelector("#jvd-assist-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = panel.querySelector("#jvd-assist-input");
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, "me");
    input.value = "";
    setTimeout(() => addMsg(findAnswer(text), "bot"), 350);
  });
})();
