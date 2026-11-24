import { supabase, supabaseConfigured, SUPABASE_SETUP_MESSAGE } from "./supabase.js";

const communityFeed = document.getElementById("communityFeed");
const homeFeed = document.getElementById("homeFeed");

if (communityFeed && homeFeed) {
  let currentUser = null;
  let posts = [];

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

  function renderPost(post, comments, reactions) {
    const postComments = comments.filter((comment) => comment.post_id === post.id);
    const count = reactions.filter((reaction) => reaction.post_id === post.id).length;
    const liked = reactions.some((reaction) => reaction.post_id === post.id && reaction.user_id === currentUser?.id);
    const date = new Date(post.created_at).toLocaleString("fr-FR");
    return `<article class="feed-post" data-post="${escapeHtml(post.id)}">
      <div class="post-head"><div class="avatar">M</div><div class="post-meta"><strong>Membre de la communauté</strong><small>${escapeHtml(date)}</small></div></div>
      <span class="post-tag">${escapeHtml(post.category)}</span><p class="post-body">${escapeHtml(post.body)}</p>
      <div class="post-actions">
        <button class="like-btn ${liked ? "liked" : ""}" data-like="${escapeHtml(post.id)}">♡ ${count} soutien(s)</button>
        <button data-comment-toggle="${escapeHtml(post.id)}">💬 ${postComments.length} réponse(s)</button>
        <button data-report="${escapeHtml(post.id)}">⚑ Signaler</button>
      </div>
      <div class="comments" id="comments-${escapeHtml(post.id)}">
        ${postComments.map((comment) => `<div class="comment">${escapeHtml(comment.body)}</div>`).join("")}
        <form class="comment-form" data-comment-form="${escapeHtml(post.id)}">
          <input name="comment" maxlength="1000" placeholder="Écrire un commentaire..." required>
          <button type="submit">Envoyer</button>
        </form>
      </div>
    </article>`;
  }

  async function loadFeed() {
    if (!currentUser) {
      communityFeed.innerHTML = '<p class="record-empty">Connectez-vous pour consulter les échanges publiés par les membres.</p>';
      homeFeed.innerHTML = '<p class="record-empty">Aucun témoignage de démonstration n’est affiché.</p>';
      return;
    }

    const { data: loadedPosts, error: postsError } = await supabase
      .from("community_posts")
      .select("id, author_id, category, body, created_at")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(50);
    if (postsError) throw postsError;

    posts = loadedPosts;
    if (!posts.length) {
      communityFeed.innerHTML = '<p class="record-empty">Aucune publication pour le moment.</p>';
      homeFeed.innerHTML = '<p class="record-empty">Aucune publication pour le moment.</p>';
      return;
    }

    const postIds = posts.map((post) => post.id);
    const [commentResult, reactionResult] = await Promise.all([
      supabase.from("community_comments").select("id, post_id, author_id, body, created_at").in("post_id", postIds).order("created_at"),
      supabase.from("community_reactions").select("post_id, user_id").in("post_id", postIds)
    ]);
    if (commentResult.error) throw commentResult.error;
    if (reactionResult.error) throw reactionResult.error;

    communityFeed.innerHTML = posts.map((post) => renderPost(post, commentResult.data, reactionResult.data)).join("");
    homeFeed.innerHTML = posts.slice(0, 2).map((post) => renderPost(post, commentResult.data, reactionResult.data)).join("");
  }

  async function showActionError(error) {
    window.alert(`L’action n’a pas abouti : ${error.message}`);
  }

  document.addEventListener("click", async (event) => {
    const publishButton = event.target.closest("#publishPost");
    const likeButton = event.target.closest("[data-like]");
    const reportButton = event.target.closest("[data-report]");
    const commentToggle = event.target.closest("[data-comment-toggle]");

    if (publishButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!currentUser) {
        window.location.assign("./connexion.html");
        return;
      }
      const textarea = document.getElementById("newPostText");
      const text = textarea.value.trim();
      if (!text) {
        textarea.focus();
        return;
      }
      publishButton.disabled = true;
      const { error } = await supabase.from("community_posts").insert({
        author_id: currentUser.id,
        category: document.getElementById("newPostGroup").value,
        body: text
      });
      publishButton.disabled = false;
      if (error) {
        await showActionError(error);
        return;
      }
      textarea.value = "";
      await loadFeed();
      return;
    }

    if (likeButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!currentUser) {
        window.location.assign("./connexion.html");
        return;
      }
      const postId = likeButton.dataset.like;
      const existing = await supabase.from("community_reactions").select("post_id").eq("post_id", postId).eq("user_id", currentUser.id).maybeSingle();
      if (existing.error) return showActionError(existing.error);
      const result = existing.data
        ? await supabase.from("community_reactions").delete().eq("post_id", postId).eq("user_id", currentUser.id)
        : await supabase.from("community_reactions").insert({ post_id: postId, user_id: currentUser.id });
      if (result.error) return showActionError(result.error);
      await loadFeed();
      return;
    }

    if (reportButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!currentUser) {
        window.location.assign("./connexion.html");
        return;
      }
      const reason = window.prompt("Pourquoi signalez-vous cette publication ?");
      if (!reason?.trim()) return;
      const { error } = await supabase.from("community_reports").insert({
        post_id: reportButton.dataset.report,
        reporter_id: currentUser.id,
        reason: reason.trim()
      });
      if (error) return showActionError(error);
      window.alert("Signalement enregistré. Son examen par un responsable n’est pas encore automatisé.");
      return;
    }

    if (commentToggle) {
      event.preventDefault();
      event.stopImmediatePropagation();
      document.getElementById(`comments-${commentToggle.dataset.commentToggle}`)?.classList.toggle("open");
    }
  }, true);

  document.addEventListener("submit", async (event) => {
    const form = event.target.closest("[data-comment-form]");
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!currentUser) {
      window.location.assign("./connexion.html");
      return;
    }
    const body = form.querySelector('input[name="comment"]').value.trim();
    if (!body) return;
    const { error } = await supabase.from("community_comments").insert({
      post_id: form.dataset.commentForm,
      author_id: currentUser.id,
      body
    });
    if (error) return showActionError(error);
    await loadFeed();
    document.getElementById(`comments-${form.dataset.commentForm}`)?.classList.add("open");
  }, true);

  async function initialize() {
    communityFeed.innerHTML = "";
    homeFeed.innerHTML = "";
    if (!supabaseConfigured) {
      communityFeed.innerHTML = `<p class="record-empty" role="alert">${escapeHtml(SUPABASE_SETUP_MESSAGE)}</p>`;
      homeFeed.innerHTML = '<p class="record-empty">Les échanges seront visibles après configuration de Supabase.</p>';
      return;
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    currentUser = data.session?.user ?? null;
    const publish = document.getElementById("publishPost");
    if (!currentUser && publish) publish.textContent = "Connectez-vous pour publier";
    await loadFeed();
  }

  initialize().catch((error) => {
    communityFeed.innerHTML = `<p class="record-empty" role="alert">Impossible de charger la communauté : ${escapeHtml(error.message)}</p>`;
    homeFeed.innerHTML = "";
  });
}
