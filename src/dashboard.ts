export function getDashboardHtml(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CV Engine</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#000000;
  --surface:#0D0D14;
  --surface-2:#16161F;
  --border:#28283A;
  --border-2:#333348;
  --text:#F0F0F8;
  --muted:#8A8AA8;
  --subtle:#4A4A62;
  --accent:#7C75FF;
  --accent-bg:#1A1730;
  --accent-hover:#9E99FF;
  --green:#34D399;
  --green-bg:#0A2218;
  --amber:#FCD34D;
  --red:#F87171;
  --shadow:0 1px 4px rgba(0,0,0,.6),0 1px 2px rgba(0,0,0,.5);
  --shadow-md:0 4px 20px rgba(0,0,0,.7),0 2px 6px rgba(0,0,0,.5);
  --r:12px;--r-sm:8px;
}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);line-height:1.5;min-height:100vh;font-size:14px}

/* ── header ── */
header{background:#08080E;border-bottom:1px solid var(--border);padding:0 24px;height:52px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:10;box-shadow:0 1px 0 var(--border)}
.h-title{font-size:16px;font-weight:700;flex:1;min-width:120px;letter-spacing:-.3px;color:var(--text)}
.h-title span{color:var(--accent)}
.h-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.src-badge{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--muted);padding:3px 10px;background:var(--surface-2);border:1px solid var(--border);border-radius:20px;white-space:nowrap}
.src-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0}
.status{font-size:12px;color:var(--muted);padding:3px 10px;background:var(--surface);border:1px solid var(--border);border-radius:20px;display:none;max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.status.on{display:block}

/* ── buttons ── */
.btn{display:inline-flex;align-items:center;gap:5px;padding:6px 14px;border-radius:var(--r-sm);font-size:13px;font-weight:500;border:none;cursor:pointer;transition:background .12s,opacity .12s;white-space:nowrap;line-height:1.4}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn:disabled{opacity:.45;cursor:not-allowed}
.btn-primary{background:var(--accent);color:#fff}
.btn-primary:hover:not(:disabled){background:var(--accent-hover)}
.btn-secondary{background:var(--surface-2);color:var(--text);border:1px solid var(--border)}
.btn-secondary:hover:not(:disabled){background:#1E1E2C;border-color:var(--border-2)}
.btn-sm{padding:4px 10px;font-size:12px}

/* ── layout ── */
.main{max-width:1400px;margin:0 auto;padding:20px 24px;display:grid;grid-template-columns:1fr 360px;gap:20px;align-items:start}
@media(max-width:960px){.main{grid-template-columns:1fr;padding:16px}}

/* ── section headings ── */
.sec-hd{display:flex;align-items:center;gap:8px;margin-bottom:14px}
.sec-title{font-size:14px;font-weight:600;color:var(--text)}
.sec-meta{font-size:12px;color:var(--muted)}

/* ── opportunity groups ── */
.group{margin-bottom:24px}
.group-hd{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.group-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;white-space:nowrap}
.group-divider{flex:1;height:1px;background:var(--border)}
.group-count{font-size:11px;font-weight:600;color:var(--accent);background:var(--accent-bg);border-radius:20px;padding:1px 8px;white-space:nowrap}

/* ── opportunity grid (max 2 columns) ── */
.opp-list{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(max-width:560px){.opp-list{grid-template-columns:1fr}}
.show-more-row{grid-column:1/-1;padding:8px 0 2px;text-align:center}

/* ── opportunity cards ── */
.opp-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--shadow);padding:12px;transition:box-shadow .15s,border-color .15s,background .15s;display:flex;flex-direction:column;gap:8px;cursor:default}
.opp-card:hover{box-shadow:var(--shadow-md);border-color:var(--border-2);background:var(--surface-2)}
.opp-card.hi{border-top:2px solid var(--green)}
.opp-card.md{border-top:2px solid var(--accent)}
.opp-card.lo{border-top:2px solid var(--border-2)}
.opp-row{display:flex;align-items:flex-start;gap:10px}
.score-col{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:3px;min-width:34px}
.score-num{font-size:16px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
.score-num.hi{color:var(--green)}.score-num.md{color:var(--accent)}.score-num.lo{color:var(--subtle)}
.bar-track{width:30px;height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.bar-fill{height:100%;border-radius:2px;transition:width .5s ease}
.bar-fill.hi{background:var(--green)}.bar-fill.md{background:var(--accent)}.bar-fill.lo{background:var(--border-2)}
.opp-info{flex:1;min-width:0}
.opp-title{font-size:13px;font-weight:600;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;color:var(--text)}
.opp-org{font-size:11px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.opp-tags{display:flex;flex-wrap:wrap;gap:4px;align-items:center}
.tag{display:inline-flex;align-items:center;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:600;letter-spacing:.1px}
.t-internship{background:#1A1040;color:#A89FFF}
.t-conference{background:#2A2010;color:#FCD34D}
.t-ngo{background:#0A2218;color:#34D399}
.t-certificate{background:#0F1D38;color:#7CB8FF}
.t-hackathon{background:#2A1028;color:#F9A8D4}
.t-competition{background:#0C1E10;color:#86EFAC}
.t-default{background:var(--surface-2);color:var(--muted)}
.t-loc{background:var(--surface-2);color:var(--muted)}
.opp-reason{font-size:10px;color:var(--subtle);font-style:italic;line-height:1.4}
.opp-foot{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-top:2px;flex-wrap:wrap}
.apply-link{font-size:11px;font-weight:500;color:var(--accent);text-decoration:none;padding:4px 9px;border-radius:var(--r-sm);border:1px solid #302860;background:var(--accent-bg);transition:all .12s;white-space:nowrap}
.apply-link:hover{background:#221D3C;border-color:#483D80}
.apply-link:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* ── right panel ── */
.cv-panel{position:sticky;top:60px;max-height:calc(100vh - 72px);overflow-y:auto;display:flex;flex-direction:column;gap:0;padding-right:2px;scrollbar-width:thin;scrollbar-color:var(--border) transparent}
@media(max-width:960px){.cv-panel{position:static;max-height:none}}

/* ── CV analysis sections ── */
.a-section{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;margin-bottom:8px}
.a-hd{padding:8px 14px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;border-bottom:1px solid var(--border)}
.a-hd.missing{background:#2A1018;color:#F87171}
.a-hd.gaps{background:#2A2010;color:#FCD34D}
.a-hd.wins{background:#0A2218;color:#34D399}
.a-hd.strengths{background:var(--accent-bg);color:#A5A0FF}
.a-body{padding:10px 14px}
.skill-list{display:flex;flex-wrap:wrap;gap:4px}
.skill-chip{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:500;background:#2A1018;color:#F87171;border:1px solid #4A2030}
.skill-chip .cnt{background:#C41840;color:#fff;border-radius:10px;padding:0 4px;font-size:9px;font-weight:700}
.text-list{list-style:none;display:flex;flex-direction:column;gap:6px}
.text-list li{font-size:11px;line-height:1.5;padding-left:15px;position:relative;color:var(--text)}
.text-list.gaps li::before{content:'!';position:absolute;left:0;font-size:10px;color:var(--amber);font-weight:700}
.text-list.wins li::before{content:'\\2192';position:absolute;left:0;font-size:11px;color:var(--green);font-weight:700}
.text-list.str li::before{content:'\\2713';position:absolute;left:0;font-size:10px;color:var(--accent);font-weight:700}

/* ── CV editor ── */
.cv-editor{border-top:1px solid var(--border);margin-top:8px;padding-top:14px}
.cv-textarea{width:100%;min-height:180px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:'SFMono-Regular',Consolas,monospace;font-size:11px;line-height:1.65;resize:vertical;color:var(--text);background:var(--surface-2);display:block}
.cv-textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(124,117,255,.15)}
.cv-textarea::placeholder{color:var(--subtle)}
.editor-toolbar{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}
.cv-save-status{font-size:12px;font-weight:500;color:var(--green);display:none}
.cv-save-status.on{display:inline}

/* ── suggestion cards ── */
.sug-list{margin-top:10px;display:flex;flex-direction:column;gap:8px}
.sug-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:11px;transition:opacity .2s}
.sug-card.accepted{opacity:.35}
.sug-hd{display:flex;align-items:center;gap:6px;margin-bottom:5px}
.sug-type{display:inline-block;padding:1px 7px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px}
.sug-skill{background:#0F1D38;color:#7CB8FF}
.sug-section{background:#2A2010;color:#FCD34D}
.sug-target{font-size:12px;font-weight:600;color:var(--text)}
.sug-rationale{font-size:11px;color:var(--muted);margin-bottom:6px;line-height:1.45}
.sug-text{font-family:'SFMono-Regular',Consolas,monospace;font-size:10px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 10px;white-space:pre-wrap;margin-bottom:8px;max-height:100px;overflow-y:auto;color:var(--text)}
.sug-actions{display:flex;gap:6px}
.btn-accept{background:var(--green-bg);color:var(--green);border:1px solid #1A4030}
.btn-accept:hover:not(:disabled){background:#0D2E1E}
.btn-dismiss{background:var(--surface-2);color:var(--muted);border:1px solid var(--border)}
.btn-dismiss:hover:not(:disabled){background:#1E1E2C}

/* ── empty / loading ── */
.empty{text-align:center;padding:24px 16px;color:var(--muted);font-size:13px;line-height:1.6}
.spinner{width:15px;height:15px;border:2px solid rgba(255,255,255,.12);border-top-color:#fff;border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
.spinner.dk{border-color:rgba(124,117,255,.2);border-top-color:var(--accent)}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── prepare-application button ── */
.btn-draft{background:var(--accent-bg);color:var(--accent);border:1px solid #302860}
.btn-draft:hover:not(:disabled){background:#221D3C;border-color:#483D80}

/* ── draft review modal ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal-overlay.hidden{display:none}
.modal-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);box-shadow:0 24px 64px rgba(0,0,0,.8);width:100%;max-width:660px;max-height:90vh;display:flex;flex-direction:column;overflow:hidden}
.modal-hd{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.modal-title{font-size:14px;font-weight:600;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)}
.modal-body{padding:16px 18px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:12px}
.modal-foot{padding:12px 18px;border-top:1px solid var(--border);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.modal-notice{font-size:12px;background:#2A2010;border:1px solid #4A3A18;border-radius:var(--r-sm);padding:9px 12px;color:#FCD34D;line-height:1.5}
.modal-label{font-size:11px;font-weight:600;display:block;margin-bottom:4px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
.modal-input{width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--r-sm);font-size:13px;background:var(--surface-2);color:var(--text);font-family:inherit}
.modal-input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(124,117,255,.15)}
.modal-textarea{width:100%;min-height:240px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:'SFMono-Regular',Consolas,monospace;font-size:12px;line-height:1.65;resize:vertical;background:var(--surface-2);color:var(--text)}
.modal-textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(124,117,255,.15)}
.btn-dismiss-red{background:#2A1018;color:#F87171;border:1px solid #4A2030}
.btn-dismiss-red:hover:not(:disabled){background:#3A1820}
.modal-spacer{flex:1}

/* ── application queue ── */
.queue-notice{font-size:12px;background:var(--accent-bg);border:1px solid #302860;border-radius:var(--r-sm);padding:9px 12px;color:#A5A0FF;line-height:1.5;margin-bottom:10px}
.draft-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 12px;display:flex;align-items:center;gap:10px;margin-bottom:8px;transition:border-color .15s,background .15s}
.draft-card:hover{border-color:var(--border-2);background:var(--surface-2)}
.draft-info{flex:1;min-width:0}
.draft-subject{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)}
.draft-opp{font-size:11px;color:var(--muted);margin-top:2px}
.draft-meta{display:flex;align-items:center;gap:6px;flex-shrink:0}
.s-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600}
.s-pending{background:#2A2010;color:#FCD34D}
.s-approved{background:var(--green-bg);color:var(--green)}

/* ── onboarding screen ── */
#login-msg{display:none;max-width:480px;margin:80px auto 0;padding:0 24px;text-align:center;color:var(--muted);font-size:14px}
#onboarding{display:none;max-width:480px;margin:80px auto 0;padding:0 24px}
.ob-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--shadow-md);padding:40px 32px;text-align:center}
.ob-heading{font-size:22px;font-weight:700;letter-spacing:-.4px;color:var(--text);margin-bottom:12px}
.ob-sub{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:28px}
.ob-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}

/* ── onboarding form steps ── */
.ob-form-wrap{max-width:480px;margin:80px auto 0;padding:0 24px}
.ob-step-ind{font-size:12px;color:var(--muted);margin-bottom:20px;text-align:left;letter-spacing:.2px}
.ob-input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);font-size:14px;background:var(--surface-2);color:var(--text);font-family:inherit;display:block;margin-top:16px}
.ob-input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(124,117,255,.15)}
.ob-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.ob-chip{padding:8px 16px;border-radius:20px;font-size:13px;font-weight:500;background:var(--surface-2);color:var(--text);border:1px solid var(--border);cursor:pointer;transition:background .1s,border-color .1s,color .1s;white-space:nowrap;line-height:1.4}
.ob-chip:hover{background:#1E1E2C;border-color:var(--border-2)}
.ob-chip.selected{background:var(--accent-bg);color:var(--accent);border-color:#483D80}
.ob-chip:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.ob-nav{display:flex;align-items:center;justify-content:space-between;margin-top:28px}
</style>
</head>
<body>

<header>
  <h1 class="h-title">CV <span>Engine</span></h1>
  <div class="h-actions">
    <span class="src-badge"><span class="src-dot"></span><span id="src-count">— sources</span></span>
    <button id="btn-collect" class="btn btn-secondary btn-sm" onclick="runCollect()">Collect</button>
    <button id="btn-rerank" class="btn btn-primary btn-sm" onclick="runRerank()">Re-rank</button>
  </div>
  <span id="status" class="status"></span>
</header>

<div id="login-msg">Please log in to access CV Engine.</div>

<div id="onboarding">
  <div class="ob-card">
    <h2 class="ob-heading">Let&#8217;s set up your profile</h2>
    <p class="ob-sub">To find opportunities matched to you, we need your details.</p>
    <div class="ob-actions">
      <button class="btn btn-primary" onclick="onboardCv()">I have a CV</button>
      <button class="btn btn-secondary" onclick="onboardQuestions()">I&#8217;ll answer a few questions</button>
    </div>
  </div>
</div>

<!-- ── Onboarding multi-step form (rendered by JS into #ob-step-body) ── -->
<div id="ob-form" style="display:none" class="ob-form-wrap">
  <div class="ob-card">
    <div id="ob-step-ind" class="ob-step-ind"></div>
    <div id="ob-step-body"></div>
    <div class="ob-nav">
      <button class="btn btn-secondary" id="ob-back" onclick="obBack()">Back</button>
      <button class="btn btn-primary" id="ob-next" onclick="obNext()">Next</button>
    </div>
  </div>
</div>

<main class="main">

  <!-- ── Left: grouped opportunity sections ── -->
  <section>
    <div class="sec-hd">
      <h2 class="sec-title">Opportunities</h2>
      <div id="opp-meta" class="sec-meta"></div>
    </div>

    <div class="group">
      <div class="group-hd">
        <h3 class="group-label">Internships &#8212; India</h3>
        <span class="group-divider"></span>
        <span class="group-count" id="india-count">&#8212;</span>
      </div>
      <div id="india-list" class="opp-list">
        <div class="empty" style="grid-column:1/-1"><span class="spinner dk"></span></div>
      </div>
    </div>

    <div class="group">
      <div class="group-hd">
        <h3 class="group-label">Internships &#8212; Global / Remote</h3>
        <span class="group-divider"></span>
        <span class="group-count" id="global-count">&#8212;</span>
      </div>
      <div id="global-list" class="opp-list"></div>
    </div>

    <div class="group">
      <div class="group-hd">
        <h3 class="group-label">Conferences &amp; Competitions</h3>
        <span class="group-divider"></span>
        <span class="group-count" id="conf-count">&#8212;</span>
      </div>
      <div id="conf-list" class="opp-list"></div>
    </div>

    <!-- ── Application Queue ── -->
    <div class="group">
      <div class="group-hd">
        <h3 class="group-label">Application Queue</h3>
        <span class="group-divider"></span>
        <span class="group-count" id="queue-count">&#8212;</span>
      </div>
      <div class="queue-notice">
        <strong>You send these yourself &#8212; nothing here is submitted automatically.</strong>
        Click &#8220;Prepare application&#8221; on any card above to generate a draft.
        Copy the text and paste it into your own email or application form.
      </div>
      <div id="queue-list" class="opp-list">
        <div class="empty" style="grid-column:1/-1"><span class="spinner dk"></span></div>
      </div>
    </div>
  </section>

  <!-- ── Right: CV analysis + editor ── -->
  <aside class="cv-panel">

    <!-- CV Analysis -->
    <div>
      <div class="sec-hd"><h2 class="sec-title">CV Analysis</h2></div>
      <div id="cv-analysis-panel">
        <div class="empty"><span class="spinner dk"></span></div>
      </div>
    </div>

    <!-- CV Editor -->
    <div class="cv-editor">
      <div class="sec-hd" style="margin-bottom:10px">
        <h2 class="sec-title">CV Editor</h2>
        <button id="btn-save-cv" class="btn btn-primary btn-sm" onclick="saveCv()">Save CV</button>
      </div>
      <textarea id="cv-textarea" class="cv-textarea" placeholder="No CV loaded yet &#8212; paste your text here to enable analysis and smart drafting."></textarea>
      <div class="editor-toolbar">
        <button id="btn-suggest" class="btn btn-secondary btn-sm" onclick="triggerSuggestions()">Suggest improvements</button>
        <span id="cv-save-status" class="cv-save-status"></span>
      </div>
      <div id="suggestions-area"></div>
    </div>

  </aside>
</main>

<!-- ── Draft review modal ── -->
<div id="draft-modal" class="modal-overlay hidden" onclick="modalBgClick(event)">
  <div class="modal-box" onclick="event.stopPropagation()">
    <div class="modal-hd">
      <div class="modal-title" id="modal-title">Application Draft</div>
      <button class="btn btn-secondary btn-sm" onclick="closeDraftModal()">Close</button>
    </div>
    <div class="modal-body">
      <div class="modal-notice">
        &#9888;&#65039; <strong>You send this yourself.</strong>
        Copy the draft below and submit it on the organisation&#8217;s website or via your own email.
        Nothing is sent automatically &#8212; clicking &#8220;Mark approved&#8221; only flags it as ready in your queue.
      </div>
      <div>
        <label class="modal-label" for="modal-subject">Subject</label>
        <input type="text" id="modal-subject" class="modal-input">
      </div>
      <div>
        <label class="modal-label" for="modal-body-text">Body &#8212; edit freely before sending</label>
        <textarea id="modal-body-text" class="modal-textarea"></textarea>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-secondary btn-sm" onclick="copyDraft()">Copy draft</button>
      <a id="modal-apply-link" href="#" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="text-decoration:none;display:none">Open apply page &#8599;</a>
      <span class="modal-spacer"></span>
      <button class="btn btn-primary btn-sm" onclick="approveDraft()">Mark approved</button>
      <button class="btn btn-sm btn-dismiss-red" onclick="dismissDraft()">Dismiss</button>
    </div>
  </div>
</div>

<script>
/* ── State ── */
var currentSuggestions = [];

/* ── Helpers ── */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function sc(n) {
  if (n >= 70) return 'hi';
  if (n >= 40) return 'md';
  return 'lo';
}
function typeTag(t) {
  var m = {
    internship:'t-internship', conference:'t-conference', ngo:'t-ngo',
    certificate:'t-certificate', hackathon:'t-hackathon', competition:'t-competition'
  };
  return m[(t||'').toLowerCase()] || 't-default';
}
function showStatus(msg, autohide) {
  var el = document.getElementById('status');
  el.textContent = msg;
  el.classList.add('on');
  if (autohide !== false) setTimeout(function(){ el.classList.remove('on'); }, 4500);
}
function showCvSaveStatus(msg) {
  var el = document.getElementById('cv-save-status');
  el.textContent = msg;
  el.classList.add('on');
  setTimeout(function(){ el.classList.remove('on'); }, 3500);
}
function setBtn(id, loading, label) {
  var b = document.getElementById(id);
  if (!b) return;
  b.disabled = loading;
  b.innerHTML = loading ? ('<span class="spinner"></span> ' + label) : label;
}
function sugTypeClass(type) {
  return type === 'add_skill' ? 'sug-skill' : 'sug-section';
}

/* ── Sources ── */
function loadSources() {
  fetch('/sources')
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(d) {
      var n = Array.isArray(d) ? d.length : 0;
      document.getElementById('src-count').textContent = n === 1 ? '1 source' : (n + ' sources');
    })
    .catch(function(e) { console.error('[cv-engine] loadSources:', e); });
}

/* ── Opportunity card builder ── */
function buildCard(o) {
  var s = o.fit_score != null ? o.fit_score : 0;
  var c = sc(s);
  var h = '<div class="opp-card ' + c + '">';
  h += '<div class="opp-row">';
  h += '<div class="score-col">';
  h += '<span class="score-num ' + c + '">' + s + '</span>';
  h += '<div class="bar-track"><div class="bar-fill ' + c + '" style="width:' + s + '%"></div></div>';
  h += '</div>';
  h += '<div class="opp-info">';
  h += '<div class="opp-title" title="' + esc(o.title) + '">' + esc(o.title) + '</div>';
  if (o.organization) h += '<div class="opp-org">' + esc(o.organization) + '</div>';
  h += '</div></div>';
  h += '<div class="opp-tags">';
  if (o.type) h += '<span class="tag ' + typeTag(o.type) + '">' + esc(o.type) + '</span>';
  if (o.location) h += '<span class="tag t-loc">&#128205; ' + esc(o.location) + '</span>';
  h += '</div>';
  if (o.fit_reason) h += '<div class="opp-reason">Fit: ' + esc(o.fit_reason) + '</div>';
  h += '<div class="opp-foot">';
  if (o.url) h += '<a class="apply-link" href="' + esc(o.url) + '" target="_blank" rel="noopener">Apply / View &#8599;</a>';
  h += '<button class="btn btn-sm btn-draft" data-prep="' + o.id + '" onclick="prepareDraft(' + o.id + ')">Prepare application</button>';
  h += '</div></div>';
  return h;
}

/* ── Per-section pagination state ── */
var sectionState = {
  india:  { offset: 0, total: 0, loaded: 0 },
  global: { offset: 0, total: 0, loaded: 0 },
  conf:   { offset: 0, total: 0, loaded: 0 }
};

function updateTotalMeta() {
  var t = sectionState.india.total + sectionState.global.total + sectionState.conf.total;
  document.getElementById('opp-meta').textContent = t + ' total';
}

function loadSection(key, listId, countId, more) {
  var state = sectionState[key];
  var listEl = document.getElementById(listId);
  if (!more) {
    listEl.innerHTML = '<div class="empty" style="grid-column:1/-1"><span class="spinner dk"></span></div>';
  } else {
    var existing = listEl.querySelector('.show-more-row');
    if (existing) existing.remove();
  }
  return fetch('/opportunities?section=' + key + '&sort=fit&limit=25&offset=' + state.offset)
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(d) {
      var items = Array.isArray(d.results) ? d.results : [];
      state.total  = typeof d.total === 'number' ? d.total : 0;
      state.offset += items.length;
      state.loaded += items.length;

      document.getElementById(countId).textContent = String(state.total);
      updateTotalMeta();

      if (!more) {
        if (!items.length) {
          listEl.innerHTML = '<div class="empty" style="grid-column:1/-1">None found.</div>';
        } else {
          var h = '';
          for (var i = 0; i < items.length; i++) h += buildCard(items[i]);
          listEl.innerHTML = h;
        }
      } else {
        var frag = '';
        for (var j = 0; j < items.length; j++) frag += buildCard(items[j]);
        if (frag) listEl.insertAdjacentHTML('beforeend', frag);
      }

      if (state.loaded < state.total) {
        var rem = state.total - state.loaded;
        var wrap = document.createElement('div');
        wrap.className = 'show-more-row';
        var smBtn = document.createElement('button');
        smBtn.className = 'btn btn-secondary btn-sm';
        smBtn.textContent = 'Show more (' + rem + ' remaining)';
        smBtn.onclick = function() { loadSection(key, listId, countId, true); };
        wrap.appendChild(smBtn);
        listEl.appendChild(wrap);
      }
    })
    .catch(function(e) {
      console.error('[cv-engine] loadSection ' + key + ':', e);
      if (!more) {
        listEl.innerHTML = '<div class="empty" style="grid-column:1/-1">Failed to load: ' + esc(String(e)) + '</div>';
      }
    });
}

function showMore(key) {
  loadSection(key, key + '-list', key + '-count', true);
}

function loadOpps() {
  sectionState.india  = { offset: 0, total: 0, loaded: 0 };
  sectionState.global = { offset: 0, total: 0, loaded: 0 };
  sectionState.conf   = { offset: 0, total: 0, loaded: 0 };
  return Promise.all([
    loadSection('india',  'india-list',  'india-count',  false),
    loadSection('global', 'global-list', 'global-count', false),
    loadSection('conf',   'conf-list',   'conf-count',   false),
  ]);
}

/* ── CV Analysis ── */
function renderCvAnalysis(d) {
  var el = document.getElementById('cv-analysis-panel');
  var h = '';

  h += '<div class="a-section"><div class="a-hd missing">Missing Skills (' + ((d.missing_skills||[]).length) + ')</div><div class="a-body">';
  if (d.missing_skills && d.missing_skills.length) {
    h += '<div class="skill-list">';
    for (var i = 0; i < d.missing_skills.length; i++) {
      var sk = d.missing_skills[i];
      h += '<span class="skill-chip">' + esc(sk.keyword) + '<span class="cnt">' + sk.demand_count + '</span></span>';
    }
    h += '</div>';
  } else { h += '<span style="font-size:12px;color:var(--muted)">CV covers demand.</span>'; }
  h += '</div></div>';

  h += '<div class="a-section"><div class="a-hd gaps">Structural Gaps</div><div class="a-body">';
  if (d.structural_gaps && d.structural_gaps.length) {
    h += '<ul class="text-list gaps">';
    for (var j = 0; j < d.structural_gaps.length; j++) h += '<li>' + esc(d.structural_gaps[j]) + '</li>';
    h += '</ul>';
  } else { h += '<span style="font-size:12px;color:var(--muted)">No gaps found.</span>'; }
  h += '</div></div>';

  h += '<div class="a-section"><div class="a-hd wins">Quick Wins</div><div class="a-body">';
  if (d.quick_wins && d.quick_wins.length) {
    h += '<ul class="text-list wins">';
    for (var k = 0; k < d.quick_wins.length; k++) h += '<li>' + esc(d.quick_wins[k]) + '</li>';
    h += '</ul>';
  } else { h += '<span style="font-size:12px;color:var(--muted)">None listed.</span>'; }
  h += '</div></div>';

  h += '<div class="a-section"><div class="a-hd strengths">Strengths to Keep</div><div class="a-body">';
  if (d.strengths_to_keep && d.strengths_to_keep.length) {
    h += '<ul class="text-list str">';
    for (var l = 0; l < d.strengths_to_keep.length; l++) h += '<li>' + esc(d.strengths_to_keep[l]) + '</li>';
    h += '</ul>';
  } else { h += '<span style="font-size:12px;color:var(--muted)">None listed.</span>'; }
  h += '</div></div>';

  el.innerHTML = h;
}

function loadCvAnalysis() {
  return fetch('/cv-analysis')
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(d) {
      renderCvAnalysis(d);
    })
    .catch(function(e) {
      console.error('[cv-engine] loadCvAnalysis:', e);
      document.getElementById('cv-analysis-panel').innerHTML = '<div class="empty">Failed: ' + esc(String(e)) + '</div>';
    });
}

/* ── CV Editor ── */
function loadCvText() {
  return fetch('/cv')
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(d) {
      var ta = document.getElementById('cv-textarea');
      ta.value = d.cv_text || '';
      ta.placeholder = d.cv_text ? '' : 'Paste or type your CV text here…';
    })
    .catch(function(e) {
      console.error('[cv-engine] loadCvText:', e);
      document.getElementById('cv-textarea').placeholder = 'Could not load CV text.';
    });
}

function renderSuggestions(suggestions) {
  currentSuggestions = suggestions;
  var el = document.getElementById('suggestions-area');
  if (!suggestions.length) {
    el.innerHTML = '<div class="empty" style="padding:14px 0">No suggestions — CV looks solid for now.</div>';
    return;
  }
  var h = '<div class="sug-list">';
  for (var i = 0; i < suggestions.length; i++) {
    var s = suggestions[i];
    var typeLabel = s.type === 'add_skill' ? 'skill' : 'section';
    h += '<div class="sug-card" id="sug-' + esc(s.id) + '">';
    h += '<div class="sug-hd">';
    h += '<span class="sug-type ' + sugTypeClass(s.type) + '">' + typeLabel + '</span>';
    h += '<span class="sug-target">' + esc(s.target) + '</span>';
    h += '</div>';
    h += '<div class="sug-rationale">' + esc(s.rationale) + '</div>';
    h += '<pre class="sug-text">' + esc(s.suggestion) + '</pre>';
    h += '<div class="sug-actions">';
    h += '<button class="btn btn-accept btn-sm" onclick="acceptSuggestion(' + i + ')">Accept</button>';
    h += '<button class="btn btn-dismiss btn-sm" onclick="dismissSuggestion(' + i + ')">Dismiss</button>';
    h += '</div></div>';
  }
  h += '</div>';
  el.innerHTML = h;
}

function acceptSuggestion(idx) {
  var s = currentSuggestions[idx];
  if (!s) return;
  var ta = document.getElementById('cv-textarea');
  ta.value = ta.value.replace(/\\s+$/, '') + '\\n\\n' + s.suggestion;
  ta.scrollTop = ta.scrollHeight;
  var card = document.getElementById('sug-' + s.id);
  if (card) {
    card.classList.add('accepted');
    var acceptBtn = card.querySelector('.btn-accept');
    if (acceptBtn) acceptBtn.disabled = true;
  }
}

function dismissSuggestion(idx) {
  var s = currentSuggestions[idx];
  if (!s) return;
  var card = document.getElementById('sug-' + s.id);
  if (card) card.remove();
}

function triggerSuggestions() {
  setBtn('btn-suggest', true, 'Analyzing…');
  document.getElementById('suggestions-area').innerHTML = '<div class="empty"><span class="spinner dk"></span></div>';
  fetch('/cv-suggestions').then(function(r){ return r.json(); }).then(function(d) {
    renderSuggestions(Array.isArray(d) ? d : []);
  }).catch(function(e) {
    document.getElementById('suggestions-area').innerHTML = '<div class="empty">Failed: ' + esc(String(e)) + '</div>';
  }).then(function() {
    setBtn('btn-suggest', false, 'Suggest improvements');
  });
}

function saveCv() {
  setBtn('btn-save-cv', true, 'Saving…');
  var text = document.getElementById('cv-textarea').value;
  fetch('/cv', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ cv_text: text })
  }).then(function(r){ return r.json(); }).then(function(d) {
    showCvSaveStatus(d.ok ? 'Saved ✓' : 'Error: ' + (d.error || 'unknown'));
  }).catch(function(e) {
    showCvSaveStatus('Error: ' + e);
  }).then(function() {
    setBtn('btn-save-cv', false, 'Save CV');
  });
}

/* ── Action buttons ── */
function runCollect() {
  setBtn('btn-collect', true, 'Collecting…');
  showStatus('Collecting opportunities…', false);
  fetch('/collect').then(function(r){ return r.json(); }).then(function(d) {
    showStatus('Collected: ' + (d.inserted||0) + ' new, ' + (d.skipped||0) + ' skipped, ' + (d.errors||0) + ' errors');
    return Promise.all([loadOpps(), loadSources()]);
  }).catch(function(e) {
    showStatus('Collect failed: ' + e);
  }).then(function() {
    setBtn('btn-collect', false, 'Collect');
  });
}

function runRerank() {
  setBtn('btn-rerank', true, 'Ranking…');
  showStatus('Re-ranking…', false);
  fetch('/rank', {method:'POST'}).then(function(r){ return r.json(); }).then(function(d) {
    showStatus('Scored ' + (d.scored||0) + ' opportunities');
    return Promise.all([loadOpps(), loadCvAnalysis()]);
  }).catch(function(e) {
    showStatus('Re-rank failed: ' + e);
  }).then(function() {
    setBtn('btn-rerank', false, 'Re-rank');
  });
}

/* ── Draft modal ── */
var activeDraftId = null;

function prepareDraft(oppId) {
  var btn = document.querySelector('[data-prep="' + oppId + '"]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>'; }
  fetch('/draft/' + oppId, { method: 'POST' })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.error) throw new Error(d.error);
      openDraftModal(d);
      loadQueue();
    })
    .catch(function(e) { showStatus('Could not prepare draft: ' + e); })
    .then(function() {
      if (btn) { btn.disabled = false; btn.textContent = 'Prepare application'; }
    });
}

function openDraftModal(d) {
  activeDraftId = d.id;
  document.getElementById('modal-title').textContent =
    (d.opp_title || 'Draft') + (d.opp_organization ? ' — ' + d.opp_organization : '');
  document.getElementById('modal-subject').value = d.subject || '';
  document.getElementById('modal-body-text').value = d.body || '';
  var link = document.getElementById('modal-apply-link');
  if (d.opp_url) { link.href = d.opp_url; link.style.display = ''; }
  else { link.style.display = 'none'; }
  document.getElementById('draft-modal').classList.remove('hidden');
}

function closeDraftModal() {
  document.getElementById('draft-modal').classList.add('hidden');
  activeDraftId = null;
}

function modalBgClick(e) {
  if (e.target === document.getElementById('draft-modal')) closeDraftModal();
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeDraftModal();
});

function copyDraft() {
  var subject = document.getElementById('modal-subject').value;
  var body = document.getElementById('modal-body-text').value;
  var text = 'Subject: ' + subject + '\\n\\n' + body;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(function() { showStatus('Draft copied to clipboard'); })
      .catch(function() { fallbackCopy(text); });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showStatus('Draft copied to clipboard'); }
  catch(e) { showStatus('Copy failed — select and copy manually'); }
  document.body.removeChild(ta);
}

function approveDraft() {
  if (!activeDraftId) return;
  var id = activeDraftId;
  var subject = document.getElementById('modal-subject').value;
  var bodyText = document.getElementById('modal-body-text').value;
  fetch('/drafts/' + id, {
    method: 'PATCH',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ subject: subject, body: bodyText })
  })
  .then(function() {
    return fetch('/drafts/' + id + '/approve', { method: 'POST' });
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    if (d.error) throw new Error(d.error);
    showStatus('Draft marked as approved ✓');
    closeDraftModal();
    loadQueue();
  })
  .catch(function(e) { showStatus('Error: ' + e); });
}

function dismissDraft() {
  if (!activeDraftId) return;
  var id = activeDraftId;
  fetch('/drafts/' + id + '/dismiss', { method: 'POST' })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.error) throw new Error(d.error);
      showStatus('Draft dismissed');
      closeDraftModal();
      loadQueue();
    })
    .catch(function(e) { showStatus('Error: ' + e); });
}

/* ── Application Queue ── */
var queueDrafts = {};

function loadQueue() {
  var listEl = document.getElementById('queue-list');
  var countEl = document.getElementById('queue-count');
  fetch('/drafts')
    .then(function(r) { return r.json(); })
    .then(function(drafts) {
      if (!Array.isArray(drafts)) drafts = [];
      queueDrafts = {};
      var active = drafts.filter(function(d) { return d.status !== 'dismissed'; });
      active.forEach(function(d) { queueDrafts[d.id] = d; });
      countEl.textContent = String(active.length);
      if (!active.length) {
        listEl.innerHTML = '<div class="empty" style="grid-column:1/-1">No drafts yet — click "Prepare application" on any card above.</div>';
        return;
      }
      var h = '';
      for (var i = 0; i < active.length; i++) h += buildQueueCard(active[i]);
      listEl.innerHTML = h;
    })
    .catch(function(e) {
      listEl.innerHTML = '<div class="empty" style="grid-column:1/-1">Failed to load queue: ' + esc(String(e)) + '</div>';
    });
}

function buildQueueCard(d) {
  var isApproved = d.status === 'approved';
  var badgeClass = isApproved ? 's-approved' : 's-pending';
  var badgeLabel = isApproved ? 'Ready to send' : 'Pending review';
  var h = '<div class="draft-card">';
  h += '<div class="draft-info">';
  h += '<div class="draft-subject">' + esc(d.subject || '(no subject)') + '</div>';
  if (d.opp_organization || d.opp_title) {
    h += '<div class="draft-opp">' + esc(d.opp_organization || '') +
         (d.opp_title ? ' — ' + esc(d.opp_title) : '') + '</div>';
  }
  h += '</div>';
  h += '<div class="draft-meta">';
  h += '<span class="s-badge ' + badgeClass + '">' + badgeLabel + '</span>';
  h += '<button class="btn btn-sm btn-draft" onclick="reviewQueueDraft(' + d.id + ')">Review</button>';
  h += '</div>';
  h += '</div>';
  return h;
}

function reviewQueueDraft(id) {
  var d = queueDrafts[id];
  if (d) openDraftModal(d);
}

/* ── Onboarding button stubs ── */
function onboardCv() { /* placeholder — built in a later piece */ }

/* ── Onboarding multi-step form ── */

/* In-memory answers object. Keys are added as steps complete.
   _stageChip and _stageOther are internal helpers for step 2. */
var answers = {};
var currentStep = 0;

/* Update OB_TOTAL_STEPS as later pieces add real steps. */
var OB_TOTAL_STEPS = 8;

/* Stage options for step 2 — defined once so obSelectStage can reference by index. */
var OB_STAGES = ['School student', 'Undergraduate', 'Graduate', 'Working professional', 'Other'];

var OB_SKILLS    = ['Programming', 'Public speaking', 'Writing', 'Design', 'Languages', 'Debate & MUN', 'Leadership', 'Research', 'Sports'];
var OB_INTERESTS = ['Computer Science', 'Technology', 'Business', 'Design', 'Research', 'Social work', 'Finance', 'Healthcare'];
var OB_LOCATIONS = ['India', 'Remote', 'Global'];
var OB_MULTI = {};
OB_MULTI[2] = { key: 'skills',           presets: OB_SKILLS,    addLabel: 'Add your own', inputId: 'ob-add-inp' };
OB_MULTI[3] = { key: 'interests',        presets: OB_INTERESTS, addLabel: 'Add your own', inputId: 'ob-add-inp' };
OB_MULTI[4] = { key: 'target_locations', presets: OB_LOCATIONS, addLabel: 'Add a city',   inputId: 'ob-add-inp' };

/* Render the step at index 'step' into #ob-step-body.
   ADD NEW STEPS: insert else-if blocks for step 2, 3, … before the final else (placeholder). */
function obRenderStep(step) {
  var body    = document.getElementById('ob-step-body');
  var nextBtn = document.getElementById('ob-next');
  var indEl   = document.getElementById('ob-step-ind');
  nextBtn.textContent = 'Next';
  nextBtn.disabled = false;

  if (step === 0) {
    /* ── Step 1: Name ── */
    indEl.textContent = 'Step 1 of ' + OB_TOTAL_STEPS;
    body.innerHTML =
      '<h2 class="ob-heading">What\\'s your name?</h2>' +
      '<input id="ob-name" class="ob-input" type="text" placeholder="Your full name"' +
      ' value="' + esc(answers.name || '') + '" oninput="obNameInput(this.value)">';
    nextBtn.disabled = !(answers.name && answers.name.trim().length > 0);

  } else if (step === 1) {
    /* ── Step 2: Stage ── */
    indEl.textContent = 'Step 2 of ' + OB_TOTAL_STEPS;
    var html = '<h2 class="ob-heading">What\\'s your current stage?</h2><div class="ob-chips">';
    for (var i = 0; i < OB_STAGES.length; i++) {
      var sel = (answers._stageChip === OB_STAGES[i]) ? ' selected' : '';
      html += '<button class="ob-chip' + sel + '" onclick="obSelectStage(' + i + ')">' +
              esc(OB_STAGES[i]) + '</button>';
    }
    html += '</div>';
    /* "Other" chip reveals a free-text input whose value becomes answers.stage */
    if (answers._stageChip === 'Other') {
      html += '<input id="ob-stage-other" class="ob-input" type="text"' +
              ' placeholder="Describe your situation"' +
              ' value="' + esc(answers._stageOther || '') + '"' +
              ' oninput="obStageOtherInput(this.value)">';
    }
    body.innerHTML = html;
    nextBtn.disabled = !answers.stage;

  } else if (step === 2) {
    /* ── Step 3: Skills ── */
    indEl.textContent = 'Step 3 of ' + OB_TOTAL_STEPS;
    body.innerHTML = obRenderMultiStep(2, 'What are your skills?', 'Select all that apply.');
    nextBtn.disabled = false;

  } else if (step === 3) {
    /* ── Step 4: Interests ── */
    indEl.textContent = 'Step 4 of ' + OB_TOTAL_STEPS;
    body.innerHTML = obRenderMultiStep(3, 'What are your interests?', 'Select all that apply.');
    nextBtn.disabled = false;

  } else if (step === 4) {
    /* ── Step 5: Target locations ── */
    indEl.textContent = 'Step 5 of ' + OB_TOTAL_STEPS;
    body.innerHTML = obRenderMultiStep(4, 'Where do you want opportunities?', 'Select all that apply.');
    nextBtn.disabled = false;

  } else {
    /* ── Placeholder: remove once later pieces add real steps ── */
    indEl.textContent = 'Step 6 of ' + OB_TOTAL_STEPS;
    body.innerHTML =
      '<h2 class="ob-heading">More steps coming</h2>' +
      '<p class="ob-sub">Education, achievements, experience, and review will be added here.</p>';
    nextBtn.textContent = 'Submit';
    nextBtn.disabled = true;
  }
}

/* Entry point called from the intro card button */
function onboardQuestions() {
  document.getElementById('onboarding').style.display = 'none';
  document.getElementById('ob-form').style.display = 'block';
  currentStep = 0;
  obRenderStep(0);
}

function obBack() {
  if (currentStep === 0) {
    /* Step 1 Back → return to intro card */
    document.getElementById('ob-form').style.display = 'none';
    document.getElementById('onboarding').style.display = 'block';
    return;
  }
  currentStep--;
  obRenderStep(currentStep);
}

function obNext() {
  currentStep++;
  obRenderStep(currentStep);
}

/* Step 1 helpers */
function obNameInput(val) {
  answers.name = val;
  document.getElementById('ob-next').disabled = !(val && val.trim().length > 0);
}

/* Step 2 helpers */
function obSelectStage(idx) {
  var chosen = OB_STAGES[idx];
  answers._stageChip = chosen;
  if (chosen === 'Other') {
    /* Don't commit answers.stage until they type something */
    answers.stage = (answers._stageOther && answers._stageOther.trim()) ? answers._stageOther.trim() : null;
  } else {
    answers.stage = chosen;
    answers._stageOther = null;
  }
  obRenderStep(currentStep); /* re-render to update highlights + show/hide Other input */
}

function obStageOtherInput(val) {
  answers._stageOther = val;
  answers.stage = val.trim() ? val.trim() : null;
  document.getElementById('ob-next').disabled = !answers.stage;
}

/* ── Multi-select step helpers (steps 3, 4, 5) ── */

function obEnsureArr(key) {
  if (!Array.isArray(answers[key])) answers[key] = [];
}

function obRenderMultiStep(stepIdx, heading, sub) {
  var cfg = OB_MULTI[stepIdx];
  obEnsureArr(cfg.key);
  var arr = answers[cfg.key];
  var html = '<h2 class="ob-heading">' + esc(heading) + '</h2>';
  html += '<p class="ob-sub" style="margin-bottom:0">' + esc(sub) + '</p>';
  html += '<div class="ob-chips">';
  for (var i = 0; i < cfg.presets.length; i++) {
    var sel = arr.indexOf(cfg.presets[i]) !== -1 ? ' selected' : '';
    html += '<button class="ob-chip' + sel + '" onclick="obTogglePresetChip(' + stepIdx + ',' + i + ')">' + esc(cfg.presets[i]) + '</button>';
  }
  for (var j = 0; j < arr.length; j++) {
    if (cfg.presets.indexOf(arr[j]) === -1) {
      html += '<button class="ob-chip selected" onclick="obRemoveCustomChip(' + stepIdx + ',' + j + ')">' + esc(arr[j]) + ' ×</button>';
    }
  }
  html += '</div>';
  html += '<div style="display:flex;gap:8px;margin-top:16px;align-items:center">';
  html += '<input id="ob-add-inp" class="ob-input" type="text" placeholder="' + esc(cfg.addLabel) + '" style="margin-top:0;flex:1">';
  html += '<button class="btn btn-secondary btn-sm" style="flex-shrink:0" onclick="obAddCustomChip(' + stepIdx + ')">Add</button>';
  html += '</div>';
  return html;
}

function obTogglePresetChip(stepIdx, presetIdx) {
  var cfg = OB_MULTI[stepIdx];
  if (!cfg) return;
  var val = cfg.presets[presetIdx];
  obEnsureArr(cfg.key);
  var i = answers[cfg.key].indexOf(val);
  if (i === -1) answers[cfg.key].push(val);
  else answers[cfg.key].splice(i, 1);
  obRenderStep(currentStep);
}

function obRemoveCustomChip(stepIdx, arrIdx) {
  var cfg = OB_MULTI[stepIdx];
  if (!cfg) return;
  obEnsureArr(cfg.key);
  answers[cfg.key].splice(arrIdx, 1);
  obRenderStep(currentStep);
}

function obAddCustomChip(stepIdx) {
  var cfg = OB_MULTI[stepIdx];
  if (!cfg) return;
  var el = document.getElementById(cfg.inputId);
  if (!el) return;
  var val = el.value.trim();
  if (!val) return;
  obEnsureArr(cfg.key);
  if (answers[cfg.key].indexOf(val) === -1) answers[cfg.key].push(val);
  el.value = '';
  obRenderStep(currentStep);
}

/* ── Init ── */
(function() {
  var mainEl = document.querySelector('main.main');
  if (mainEl) mainEl.style.display = 'none';

  function showDashboard() {
    if (mainEl) mainEl.style.display = '';
    Promise.all([loadOpps(), loadCvAnalysis(), loadSources(), loadCvText(), loadQueue()]);
  }

  fetch('/me')
    .then(function(r) {
      if (r.status === 401) return { authenticated: false };
      return r.json();
    })
    .then(function(me) {
      if (!me.authenticated) {
        document.getElementById('login-msg').style.display = 'block';
        return;
      }
      if (!me.onboarded) {
        document.getElementById('onboarding').style.display = 'block';
        return;
      }
      showDashboard();
    })
    .catch(function(e) {
      console.error('[cv-engine] /me check failed:', e);
      showDashboard();
    });
}());
</script>
</body>
</html>`;
}
