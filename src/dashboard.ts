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
  --bg:#06060F;
  --surface:rgba(255,255,255,.04);
  --surface2:rgba(255,255,255,.07);
  --border:rgba(255,255,255,.08);
  --border2:rgba(255,255,255,.15);
  --text:#F0F0F8;
  --muted:#7A7A9A;
  --subtle:#3A3A5A;
  --accent:#8B7FFF;
  --accent-dim:rgba(139,127,255,.15);
  --accent-glow:rgba(139,127,255,.25);
  --green:#2EE8A4;
  --green-dim:rgba(46,232,164,.12);
  --amber:#FCD34D;
  --red:#F87171;
  --blue:#6AB4FF;
  --blue-dim:rgba(106,180,255,.12);
  --pink:#FF85C0;
  --sb:220px;
  --r:12px;--r-sm:8px;
}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.5;min-height:100vh;font-size:14px}

/* ── Sidebar ── */
.sidebar{position:fixed;top:0;left:0;bottom:0;width:var(--sb);background:#0A0A16;border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:20;overflow-y:auto;scrollbar-width:none}
.sidebar::-webkit-scrollbar{display:none}
.sb-logo{padding:20px 18px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--border);flex-shrink:0}
.sb-mark{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#7C6FFF,#4AAFFF);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;flex-shrink:0;box-shadow:0 4px 16px rgba(124,111,255,.35)}
.sb-name{font-size:14px;font-weight:700;letter-spacing:-.3px;line-height:1.2}
.sb-sub{font-size:10px;color:var(--muted)}
.sb-nav{flex:1;padding:10px 0}
.sb-section{padding:18px 12px 6px;font-size:10px;font-weight:700;color:var(--subtle);text-transform:uppercase;letter-spacing:.6px}
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 16px;font-size:13px;font-weight:500;color:var(--muted);cursor:pointer;border-radius:0;transition:color .12s,background .12s;border:none;background:none;width:100%;text-align:left;line-height:1.3}
.nav-item:hover{color:var(--text);background:rgba(255,255,255,.04)}
.nav-item.active{color:var(--text);background:var(--accent-dim);position:relative}
.nav-item.active::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:var(--accent);border-radius:0 2px 2px 0}
.nav-icon{font-size:16px;flex-shrink:0;width:18px;text-align:center}
.nav-badge{margin-left:auto;font-size:10px;font-weight:700;background:var(--accent-dim);color:var(--accent);border-radius:20px;padding:1px 7px;border:1px solid rgba(139,127,255,.2)}
.nav-sub{padding-left:44px}
.nav-sub .nav-item{padding:6px 16px 6px 0;font-size:12px}
.nav-sub .nav-item.active::before{display:none}
.nav-sub .nav-item.active{background:none;color:var(--accent)}
.sb-footer{padding:12px;border-top:1px solid var(--border);flex-shrink:0}
.sb-actions{display:flex;gap:6px;margin-bottom:10px}
.sb-user{font-size:11px;color:var(--muted);padding:6px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* ── Content ── */
.content{margin-left:var(--sb);min-height:100vh;display:flex;flex-direction:column}
.page{display:none;flex:1;flex-direction:column}
.page.active{display:flex}

/* ── Page topbar ── */
.topbar{padding:20px 28px 0;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
.topbar-left{}
.page-title{font-size:22px;font-weight:800;letter-spacing:-.5px;color:var(--text);line-height:1.2}
.page-sub{font-size:13px;color:var(--muted);margin-top:3px}
.topbar-right{display:flex;align-items:center;gap:8px;padding-top:4px;flex-wrap:wrap}

/* ── Tab bar ── */
.tab-bar{display:flex;gap:4px;padding:16px 28px 0;flex-wrap:wrap}
.tab{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r-sm);font-size:13px;font-weight:500;color:var(--muted);cursor:pointer;border:1px solid transparent;transition:all .12s;background:none}
.tab:hover{color:var(--text);background:var(--surface)}
.tab.active{color:var(--text);background:var(--surface2);border-color:var(--border2)}
.tab-count{font-size:11px;font-weight:700;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:0 7px}
.tab.active .tab-count{color:var(--accent);background:var(--accent-dim);border-color:rgba(139,127,255,.2)}

/* ── Card grid ── */
.grid-wrap{padding:20px 28px 40px;flex:1}
.card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media(max-width:1200px){.card-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:740px){.card-grid{grid-template-columns:1fr}}
.grid-section{margin-bottom:28px}
.grid-sec-hd{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.grid-sec-label{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px}
.grid-sec-line{flex:1;height:1px;background:var(--border)}

/* ── Opportunity cards ── */
.opp-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px;transition:border-color .15s,background .15s,box-shadow .15s;display:flex;flex-direction:column;gap:10px;cursor:default}
.opp-card:hover{border-color:var(--border2);background:var(--surface2);box-shadow:0 8px 32px rgba(0,0,0,.4)}
.opp-card.hi{border-top:2px solid var(--green)}
.opp-card.md{border-top:2px solid var(--accent)}
.opp-card.lo{border-top:2px solid var(--border2)}
.card-head{display:flex;align-items:flex-start;gap:12px}
.score-badge{flex-shrink:0;width:40px;height:40px;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}
.score-badge.hi{background:var(--green-dim);border:1px solid rgba(46,232,164,.2)}
.score-badge.md{background:var(--accent-dim);border:1px solid rgba(139,127,255,.2)}
.score-badge.lo{background:rgba(255,255,255,.04);border:1px solid var(--border)}
.score-n{font-size:15px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}
.score-n.hi{color:var(--green)}.score-n.md{color:var(--accent)}.score-n.lo{color:var(--subtle)}
.score-lbl{font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;color:var(--muted)}
.card-info{flex:1;min-width:0}
.card-title{font-size:14px;font-weight:600;line-height:1.35;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;color:var(--text)}
.card-org{font-size:12px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card-tags{display:flex;flex-wrap:wrap;gap:4px}
.tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;letter-spacing:.1px}
.t-internship{background:#1A1040;color:#A89FFF}
.t-conference{background:#2A2010;color:#FCD34D}
.t-ngo{background:#0A2218;color:var(--green)}
.t-certificate{background:#0F1D38;color:var(--blue)}
.t-hackathon{background:#2A1028;color:#F9A8D4}
.t-competition{background:#0C1E10;color:#86EFAC}
.t-default{background:var(--surface2);color:var(--muted)}
.t-loc{background:var(--surface2);color:var(--muted);border:1px solid var(--border)}
.card-desc{font-size:12px;color:var(--muted);line-height:1.5;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.card-reason{font-size:10px;color:var(--subtle);font-style:italic}
.card-foot{display:flex;align-items:center;justify-content:flex-end;gap:6px;flex-wrap:wrap;margin-top:2px}
.apply-link{font-size:11px;font-weight:500;color:var(--accent);text-decoration:none;padding:5px 10px;border-radius:var(--r-sm);border:1px solid rgba(139,127,255,.25);background:var(--accent-dim);transition:all .12s;white-space:nowrap}
.apply-link:hover{border-color:rgba(139,127,255,.45);background:rgba(139,127,255,.22)}

/* ── Buttons ── */
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:var(--r-sm);font-size:13px;font-weight:500;border:none;cursor:pointer;transition:background .12s,opacity .12s;white-space:nowrap;line-height:1.4}
.btn:disabled{opacity:.45;cursor:not-allowed}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn-primary{background:var(--accent);color:#fff}
.btn-primary:hover:not(:disabled){background:#9E99FF}
.btn-secondary{background:var(--surface2);color:var(--text);border:1px solid var(--border)}
.btn-secondary:hover:not(:disabled){border-color:var(--border2);background:rgba(255,255,255,.09)}
.btn-sm{padding:5px 10px;font-size:12px}
.btn-xs{padding:3px 8px;font-size:11px}
.btn-draft{background:var(--accent-dim);color:var(--accent);border:1px solid rgba(139,127,255,.25);font-size:11px;padding:5px 10px}
.btn-draft:hover:not(:disabled){background:rgba(139,127,255,.22)}
.btn-ghost{background:none;border:1px solid var(--border);color:var(--muted)}
.btn-ghost:hover:not(:disabled){border-color:var(--border2);color:var(--text)}

/* ── Show more ── */
.show-more-wrap{grid-column:1/-1;display:flex;justify-content:center;padding:8px 0}

/* ── Empty / loading ── */
.empty{text-align:center;padding:48px 16px;color:var(--muted);font-size:13px;line-height:1.6;grid-column:1/-1}
.empty-icon{font-size:32px;margin-bottom:12px;opacity:.5}
.spinner{width:15px;height:15px;border:2px solid rgba(255,255,255,.1);border-top-color:rgba(255,255,255,.5);border-radius:50%;animation:spin .6s linear infinite;display:inline-block}
.spinner.accent{border-color:var(--accent-dim);border-top-color:var(--accent)}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── CV Tools page ── */
.cv-page-grid{display:grid;grid-template-columns:1fr 320px;gap:20px;padding:20px 28px 40px;align-items:start}
@media(max-width:900px){.cv-page-grid{grid-template-columns:1fr}}
.cv-main-col{display:flex;flex-direction:column;gap:16px}
.cv-side-col{display:flex;flex-direction:column;gap:16px;position:sticky;top:20px}
@media(max-width:900px){.cv-side-col{position:static}}
.cv-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.cv-card-hd{padding:12px 16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
.cv-card-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)}
.cv-card-body{padding:14px 16px}
.cv-textarea{width:100%;min-height:220px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:'SFMono-Regular',Consolas,monospace;font-size:12px;line-height:1.65;resize:vertical;color:var(--text);background:rgba(0,0,0,.3);display:block}
.cv-textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim)}
.cv-textarea::placeholder{color:var(--subtle)}
.cv-toolbar{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}
.save-status{font-size:12px;color:var(--green);display:none}
.save-status.on{display:inline}

/* ── Analysis sections ── */
.a-section{border-radius:var(--r-sm);overflow:hidden;margin-bottom:8px}
.a-hd{padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
.a-hd.missing{background:#2A1018;color:#F87171}
.a-hd.gaps{background:#2A1808;color:var(--amber)}
.a-hd.wins{background:#0A2218;color:var(--green)}
.a-hd.strengths{background:var(--accent-dim);color:#A5A0FF}
.a-body{padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-top:none;border-radius:0 0 var(--r-sm) var(--r-sm)}
.skill-list{display:flex;flex-wrap:wrap;gap:4px}
.skill-chip{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:500;background:#2A1018;color:#F87171;border:1px solid #4A2030}
.skill-chip .cnt{background:#C41840;color:#fff;border-radius:10px;padding:0 4px;font-size:9px;font-weight:700}
.text-list{list-style:none;display:flex;flex-direction:column;gap:6px}
.text-list li{font-size:11px;line-height:1.5;padding-left:16px;position:relative;color:var(--text)}
.text-list.gaps li::before{content:'!';position:absolute;left:0;font-size:10px;color:var(--amber);font-weight:700}
.text-list.wins li::before{content:'\\2192';position:absolute;left:0;font-size:11px;color:var(--green);font-weight:700}
.text-list.str li::before{content:'\\2713';position:absolute;left:0;font-size:10px;color:var(--accent);font-weight:700}

/* ── Suggestions ── */
.sug-list{display:flex;flex-direction:column;gap:8px}
.sug-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:12px;transition:opacity .2s}
.sug-card.accepted{opacity:.35}
.sug-hd{display:flex;align-items:center;gap:6px;margin-bottom:5px}
.sug-type{display:inline-block;padding:1px 7px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px}
.sug-skill{background:#0F1D38;color:var(--blue)}
.sug-section{background:#2A2010;color:var(--amber)}
.sug-target{font-size:12px;font-weight:600;color:var(--text)}
.sug-rationale{font-size:11px;color:var(--muted);margin-bottom:6px;line-height:1.45}
.sug-text{font-family:'SFMono-Regular',Consolas,monospace;font-size:10px;background:rgba(0,0,0,.3);border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 10px;white-space:pre-wrap;margin-bottom:8px;max-height:100px;overflow-y:auto}
.sug-actions{display:flex;gap:6px}
.btn-accept{background:var(--green-dim);color:var(--green);border:1px solid rgba(46,232,164,.2)}
.btn-accept:hover:not(:disabled){background:rgba(46,232,164,.18)}
.btn-dismiss{background:var(--surface2);color:var(--muted);border:1px solid var(--border)}

/* ── Queue ── */
.queue-notice{font-size:12px;background:var(--accent-dim);border:1px solid rgba(139,127,255,.2);border-radius:var(--r-sm);padding:10px 12px;color:#A5A0FF;line-height:1.5;margin-bottom:12px}
.draft-item{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 12px;display:flex;align-items:center;gap:10px;margin-bottom:8px;transition:border-color .12s,background .12s}
.draft-item:hover{border-color:var(--border2);background:var(--surface2)}
.draft-info{flex:1;min-width:0}
.draft-subject{font-size:12px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.draft-opp{font-size:11px;color:var(--muted);margin-top:2px}
.s-badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600}
.s-pending{background:#2A2010;color:var(--amber)}
.s-approved{background:var(--green-dim);color:var(--green)}

/* ── Toast ── */
#toast{position:fixed;bottom:24px;right:24px;max-width:340px;background:#1A1A2E;border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 14px;font-size:13px;color:var(--text);z-index:200;box-shadow:0 8px 32px rgba(0,0,0,.6);transition:opacity .3s,transform .3s;opacity:0;transform:translateY(8px);pointer-events:none}
#toast.on{opacity:1;transform:none;pointer-events:auto}

/* ── Overlays (onboarding, forms) ── */
.overlay{position:fixed;inset:0;z-index:100;display:none;background:var(--bg);overflow-y:auto;margin-left:var(--sb)}
.overlay.on{display:block}
.overlay-inner{max-width:480px;margin:0 auto;padding:60px 24px}
.ob-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:36px 32px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.5)}
.ob-heading{font-size:22px;font-weight:800;letter-spacing:-.4px;color:var(--text);margin-bottom:10px}
.ob-sub{font-size:14px;color:var(--muted);line-height:1.6;margin-bottom:24px}
.ob-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.ob-step-ind{font-size:12px;color:var(--muted);margin-bottom:20px;text-align:left;letter-spacing:.2px}
.ob-input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);font-size:14px;background:rgba(0,0,0,.3);color:var(--text);font-family:inherit;display:block;margin-top:14px}
.ob-input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim)}
.ob-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.ob-chip{padding:7px 15px;border-radius:20px;font-size:13px;font-weight:500;background:var(--surface2);color:var(--text);border:1px solid var(--border);cursor:pointer;transition:all .1s;white-space:nowrap}
.ob-chip:hover{border-color:var(--border2)}
.ob-chip.selected{background:var(--accent-dim);color:var(--accent);border-color:rgba(139,127,255,.4)}
.ob-nav{display:flex;align-items:center;justify-content:space-between;margin-top:28px}
.ob-err{font-size:13px;color:var(--red);margin-top:14px;line-height:1.5;text-align:left}
.cv-upload-area{display:flex;flex-direction:column;align-items:center;gap:8px;padding:32px 20px;border:2px dashed var(--border);border-radius:var(--r);cursor:pointer;transition:border-color .15s,background .15s;margin-top:16px;background:var(--surface2)}
.cv-upload-area:hover{border-color:var(--accent);background:var(--accent-dim)}
.cv-upload-prompt{font-size:14px;font-weight:600;color:var(--text)}
.cv-upload-types{font-size:12px;color:var(--subtle)}
.cv-txt-area{width:100%;min-height:180px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:'SFMono-Regular',Consolas,monospace;font-size:11px;line-height:1.65;resize:vertical;color:var(--text);background:rgba(0,0,0,.3);margin-top:8px;display:block}
.cv-txt-area:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-dim)}
.cv-field-lbl{font-size:11px;font-weight:700;color:var(--muted);text-align:left;margin-top:18px;letter-spacing:.4px;display:block;text-transform:uppercase}
#edit-form-overlay .ob-card{text-align:left}

/* ── Modal ── */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:150;display:flex;align-items:center;justify-content:center;padding:20px}
.modal-bg.hidden{display:none}
.modal-box{background:#0F0F1C;border:1px solid var(--border);border-radius:var(--r);box-shadow:0 24px 64px rgba(0,0,0,.8);width:100%;max-width:640px;max-height:90vh;display:flex;flex-direction:column}
.modal-hd{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.modal-title{font-size:14px;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.modal-body{padding:16px 18px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:12px}
.modal-foot{padding:12px 18px;border-top:1px solid var(--border);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.modal-notice{font-size:12px;background:#2A1808;border:1px solid #4A3010;border-radius:var(--r-sm);padding:9px 12px;color:var(--amber);line-height:1.5}
.modal-label{font-size:11px;font-weight:600;display:block;margin-bottom:4px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px}
.modal-input{width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:var(--r-sm);font-size:13px;background:rgba(0,0,0,.3);color:var(--text);font-family:inherit}
.modal-input:focus{outline:none;border-color:var(--accent)}
.modal-textarea{width:100%;min-height:220px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--r-sm);font-family:'SFMono-Regular',Consolas,monospace;font-size:12px;line-height:1.65;resize:vertical;background:rgba(0,0,0,.3);color:var(--text)}
.modal-textarea:focus{outline:none;border-color:var(--accent)}
.modal-spacer{flex:1}
.btn-dismiss-red{background:#2A1018;color:var(--red);border:1px solid #4A2030}
.btn-dismiss-red:hover:not(:disabled){background:#3A1820}

/* ── Login message ── */
#login-msg{display:none;max-width:400px;margin:80px auto 0;padding:0 24px;text-align:center;color:var(--muted);font-size:14px;margin-left:calc(var(--sb) + 50%);transform:translateX(-50%)}

/* ── Mobile sidebar toggle ── */
.sb-toggle{display:none;position:fixed;top:12px;left:12px;z-index:30;width:36px;height:36px;border-radius:9px;background:#0A0A16;border:1px solid var(--border);cursor:pointer;align-items:center;justify-content:center;font-size:18px}
@media(max-width:760px){
  .sidebar{transform:translateX(-100%);transition:transform .2s}
  .sidebar.open{transform:none}
  .content,.overlay{margin-left:0}
  #login-msg{margin-left:50%}
  .sb-toggle{display:flex}
  .cv-page-grid{padding:16px}
  .grid-wrap{padding:16px}
  .topbar{padding:16px 16px 0}
  .tab-bar{padding:12px 16px 0}
}
</style>
</head>
<body>

<button class="sb-toggle" onclick="toggleSidebar()" aria-label="Menu">&#9776;</button>

<!-- Sidebar -->
<aside class="sidebar" id="sidebar">
  <div class="sb-logo">
    <div class="sb-mark">m</div>
    <div>
      <div class="sb-name">CV Engine</div>
      <div class="sb-sub">maamla.ai</div>
    </div>
  </div>
  <nav class="sb-nav">
    <div class="sb-section">Opportunities</div>
    <button class="nav-item" id="nav-intern" onclick="showPage('intern','india')">
      <span class="nav-icon">💼</span> Internships
      <span class="nav-badge" id="nb-intern">—</span>
    </button>
    <div class="nav-sub">
      <button class="nav-item active" id="nav-india" onclick="showPage('intern','india')">
        <span>🇮🇳 India</span>
      </button>
      <button class="nav-item" id="nav-global" onclick="showPage('intern','global')">
        <span>🌍 Global / Remote</span>
      </button>
      <button class="nav-item" id="nav-all" onclick="showPage('intern','all')">
        <span>All internships</span>
      </button>
    </div>
    <button class="nav-item" id="nav-cert" onclick="showPage('cert')">
      <span class="nav-icon">🎓</span> Certificates
      <span class="nav-badge" id="nb-cert">—</span>
    </button>
    <button class="nav-item" id="nav-ngo" onclick="showPage('ngo')">
      <span class="nav-icon">🤝</span> NGOs
      <span class="nav-badge" id="nb-ngo">—</span>
    </button>
    <button class="nav-item" id="nav-conf" onclick="showPage('conf')">
      <span class="nav-icon">📢</span> Conferences
      <span class="nav-badge" id="nb-conf">—</span>
    </button>
    <div class="sb-section" style="margin-top:8px">Tools</div>
    <button class="nav-item" id="nav-cv" onclick="showPage('cv')">
      <span class="nav-icon">📄</span> CV Tools
    </button>
    <button class="nav-item" id="nav-queue" onclick="showPage('queue')">
      <span class="nav-icon">📥</span> Application Queue
      <span class="nav-badge" id="nb-queue">0</span>
    </button>
  </nav>
  <div class="sb-footer">
    <div class="sb-actions">
      <button id="btn-collect" class="btn btn-ghost btn-sm" style="flex:1" onclick="runCollect()">Collect</button>
      <button id="btn-rerank" class="btn btn-primary btn-sm" style="flex:1" onclick="runRerank()">Re-rank</button>
    </div>
    <button class="btn btn-ghost btn-sm" style="width:100%;margin-bottom:8px" onclick="openEditProfile()">Edit profile</button>
    <div class="sb-user" id="sb-user-email"></div>
  </div>
</aside>

<!-- Login message -->
<div id="login-msg">Please log in to access CV Engine.</div>

<!-- Onboarding overlays -->
<div class="overlay" id="onboarding-overlay">
  <div class="overlay-inner">
    <div class="ob-card">
      <h2 class="ob-heading">Let&#8217;s set up your profile</h2>
      <p class="ob-sub">To find opportunities matched to you, we need your details.</p>
      <div class="ob-actions">
        <button class="btn btn-primary" onclick="onboardCv()">I have a CV</button>
        <button class="btn btn-secondary" onclick="onboardQuestions()">I&#8217;ll answer questions</button>
      </div>
    </div>
  </div>
</div>

<div class="overlay" id="ob-form-overlay">
  <div class="overlay-inner">
    <div class="ob-card" style="text-align:left">
      <div id="ob-step-ind" class="ob-step-ind"></div>
      <div id="ob-step-body"></div>
      <div class="ob-nav">
        <button class="btn btn-secondary" id="ob-back" onclick="obBack()">Back</button>
        <button class="btn btn-primary" id="ob-next" onclick="obNext()">Next</button>
      </div>
    </div>
  </div>
</div>

<div class="overlay" id="cv-form-overlay">
  <div class="overlay-inner">
    <div class="ob-card" style="text-align:left">
      <div id="cv-step-body"></div>
      <div class="ob-nav">
        <button class="btn btn-secondary" id="cv-back" onclick="cvBack()">Back</button>
        <button class="btn btn-primary" id="cv-next" onclick="cvNext()" style="display:none">Save my CV</button>
      </div>
    </div>
  </div>
</div>

<div class="overlay" id="edit-form-overlay">
  <div class="overlay-inner">
    <div class="ob-card" id="edit-form" style="text-align:left">
      <h2 class="ob-heading" style="text-align:left">Edit your profile</h2>
      <div id="edit-form-body"></div>
      <div class="ob-nav">
        <button class="btn btn-secondary" onclick="closeEditProfile()">Cancel</button>
        <button class="btn btn-primary" id="edit-save-btn" onclick="editProfileSave()">Save changes</button>
      </div>
    </div>
  </div>
</div>

<!-- Main content -->
<div class="content" id="content">

  <!-- ── PAGE: Internships ── -->
  <div class="page active" id="page-intern">
    <div class="topbar">
      <div class="topbar-left">
        <div class="page-title">💼 Internships</div>
        <div class="page-sub">Sourced from Greenhouse, Lever &amp; curated listings &mdash; scored for your profile</div>
      </div>
    </div>
    <div class="tab-bar">
      <button class="tab active" id="tab-india" onclick="switchTab('india')">
        🇮🇳 India <span class="tab-count" id="tc-india">—</span>
      </button>
      <button class="tab" id="tab-global" onclick="switchTab('global')">
        🌍 Global / Remote <span class="tab-count" id="tc-global">—</span>
      </button>
      <button class="tab" id="tab-all" onclick="switchTab('all')">
        All <span class="tab-count" id="tc-all">—</span>
      </button>
    </div>
    <div class="grid-wrap">
      <div id="pane-india"><div class="card-grid" id="india-list">
        <div class="empty"><div class="empty-icon">⏳</div><span class="spinner accent"></span></div>
      </div></div>
      <div id="pane-global" style="display:none"><div class="card-grid" id="global-list">
        <div class="empty"><div class="empty-icon">⏳</div><span class="spinner accent"></span></div>
      </div></div>
      <div id="pane-all" style="display:none">
        <div class="grid-section">
          <div class="grid-sec-hd"><span class="grid-sec-label">🇮🇳 India</span><span class="grid-sec-line"></span></div>
          <div class="card-grid" id="all-india-list"></div>
        </div>
        <div class="grid-section">
          <div class="grid-sec-hd"><span class="grid-sec-label">🌍 Global / Remote</span><span class="grid-sec-line"></span></div>
          <div class="card-grid" id="all-global-list"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── PAGE: Certificates ── -->
  <div class="page" id="page-cert">
    <div class="topbar">
      <div class="topbar-left">
        <div class="page-title">🎓 Certificates &amp; Courses</div>
        <div class="page-sub">Free certificates from Google, Coursera, AWS, Microsoft, NPTEL and more &mdash; ranked by skill match</div>
      </div>
    </div>
    <div class="grid-wrap">
      <div class="card-grid" id="cert-list">
        <div class="empty"><div class="empty-icon">⏳</div><span class="spinner accent"></span></div>
      </div>
    </div>
  </div>

  <!-- ── PAGE: NGOs ── -->
  <div class="page" id="page-ngo">
    <div class="topbar">
      <div class="topbar-left">
        <div class="page-title">🤝 NGOs &amp; Volunteering</div>
        <div class="page-sub">India offline &amp; global online programmes ranked by time commitment and skills match</div>
      </div>
    </div>
    <div class="grid-wrap">
      <div class="card-grid" id="ngo-list">
        <div class="empty"><div class="empty-icon">⏳</div><span class="spinner accent"></span></div>
      </div>
    </div>
  </div>

  <!-- ── PAGE: Conferences ── -->
  <div class="page" id="page-conf">
    <div class="topbar">
      <div class="topbar-left">
        <div class="page-title">📢 Conferences &amp; Competitions</div>
        <div class="page-sub">Tech conferences, hackathons and academic competitions</div>
      </div>
    </div>
    <div class="grid-wrap">
      <div class="card-grid" id="conf-list">
        <div class="empty"><div class="empty-icon">⏳</div><span class="spinner accent"></span></div>
      </div>
    </div>
  </div>

  <!-- ── PAGE: CV Tools ── -->
  <div class="page" id="page-cv">
    <div class="topbar">
      <div class="topbar-left">
        <div class="page-title">📄 CV Tools</div>
        <div class="page-sub">Edit your CV, get analysis, and generate tailored application drafts</div>
      </div>
    </div>
    <div class="cv-page-grid">
      <div class="cv-main-col">
        <div class="cv-card">
          <div class="cv-card-hd">
            <span class="cv-card-title">CV Editor</span>
            <button id="btn-save-cv" class="btn btn-primary btn-sm" onclick="saveCv()">Save CV</button>
          </div>
          <div class="cv-card-body">
            <textarea id="cv-textarea" class="cv-textarea" placeholder="Paste or type your CV text here to enable analysis and smart drafting&#8230;"></textarea>
            <div class="cv-toolbar">
              <button id="btn-suggest" class="btn btn-secondary btn-sm" onclick="triggerSuggestions()">Suggest improvements</button>
              <span id="cv-save-status" class="save-status"></span>
            </div>
            <div id="suggestions-area" style="margin-top:14px"></div>
          </div>
        </div>
      </div>
      <div class="cv-side-col">
        <div class="cv-card">
          <div class="cv-card-hd"><span class="cv-card-title">CV Analysis</span></div>
          <div class="cv-card-body" id="cv-analysis-panel">
            <div class="empty" style="padding:20px 0"><span class="spinner accent"></span></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ── PAGE: Queue ── -->
  <div class="page" id="page-queue">
    <div class="topbar">
      <div class="topbar-left">
        <div class="page-title">📥 Application Queue</div>
        <div class="page-sub">Drafted applications awaiting your review — nothing is sent automatically</div>
      </div>
    </div>
    <div class="grid-wrap" style="max-width:720px">
      <div class="queue-notice">
        <strong>You send these yourself.</strong> Click &ldquo;Prepare application&rdquo; on any opportunity card to generate a draft.
        Copy the text and submit it on the organisation&rsquo;s website or via your own email.
      </div>
      <div id="queue-list">
        <div class="empty"><span class="spinner accent"></span></div>
      </div>
    </div>
  </div>

</div><!-- /content -->

<!-- Draft modal -->
<div id="draft-modal" class="modal-bg hidden" onclick="modalBgClick(event)">
  <div class="modal-box" onclick="event.stopPropagation()">
    <div class="modal-hd">
      <div class="modal-title" id="modal-title">Application Draft</div>
      <button class="btn btn-ghost btn-sm" onclick="closeDraftModal()">Close</button>
    </div>
    <div class="modal-body">
      <div class="modal-notice">
        &#9888;&#65039; <strong>You send this yourself.</strong> Copy the draft and submit it on the organisation&rsquo;s site or via your own email. Clicking &ldquo;Mark approved&rdquo; only flags it in your queue.
      </div>
      <div>
        <label class="modal-label" for="modal-subject">Subject</label>
        <input type="text" id="modal-subject" class="modal-input">
      </div>
      <div>
        <label class="modal-label" for="modal-body-text">Body — edit freely before sending</label>
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

<div id="toast"></div>

<script>
/* ── Helpers ── */
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function sc(n){if(n>=70)return 'hi';if(n>=40)return 'md';return 'lo';}
function typeTag(t){var m={internship:'t-internship',conference:'t-conference',ngo:'t-ngo',certificate:'t-certificate',hackathon:'t-hackathon',competition:'t-competition'};return m[(t||'').toLowerCase()]||'t-default';}
var _toastTimer;
function showStatus(msg){
  var el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('on');
  clearTimeout(_toastTimer);
  _toastTimer=setTimeout(function(){el.classList.remove('on');},4000);
}
function setBtn(id,loading,label){var b=document.getElementById(id);if(!b)return;b.disabled=loading;b.innerHTML=loading?('<span class="spinner"></span> '+label):label;}
function sugTypeClass(t){return t==='add_skill'?'sug-skill':'sug-section';}

/* ── Sidebar toggle (mobile) ── */
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open');}

/* ── Page routing ── */
var _loadedPages = {};
var _activePage = 'intern';
var _activeTab = 'india';
var _activeInternTab = 'india';

function showPage(page, subTab) {
  // hide all pages
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.getElementById('page-'+page).classList.add('active');
  _activePage = page;

  // sidebar active state
  document.querySelectorAll('.sidebar .nav-item').forEach(function(n){n.classList.remove('active');});
  var navEl = document.getElementById('nav-'+page);
  if(navEl) navEl.classList.add('active');
  // internship sub-items
  if(page==='intern'){
    if(navEl) navEl.classList.add('active');
    document.getElementById('nav-intern').classList.add('active');
  }

  // tab switching within internships
  if(page==='intern' && subTab){
    switchTab(subTab);
  } else if(page==='intern'){
    switchTab(_activeInternTab);
  }

  // load data for page if not yet loaded
  if(page==='cert' && !_loadedPages['cert']){
    _loadedPages['cert']=true;
    loadSection('cert','cert-list','nb-cert');
  }
  if(page==='ngo' && !_loadedPages['ngo']){
    _loadedPages['ngo']=true;
    loadSection('ngo','ngo-list','nb-ngo');
  }
  if(page==='conf' && !_loadedPages['conf']){
    _loadedPages['conf']=true;
    loadSection('conf','conf-list','nb-conf');
  }
  if(page==='cv' && !_loadedPages['cv']){
    _loadedPages['cv']=true;
    loadCvAnalysis();
    loadCvText();
  }
  if(page==='queue'){
    loadQueue();
  }

  // close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
}

function switchTab(tab){
  _activeInternTab = tab;
  // update sub-nav
  ['india','global','all'].forEach(function(t){
    var n=document.getElementById('nav-'+t);
    if(n) n.classList.toggle('active', t===tab);
  });
  // update tab buttons
  ['india','global','all'].forEach(function(t){
    var tb=document.getElementById('tab-'+t);
    if(tb) tb.classList.toggle('active', t===tab);
  });
  // show/hide panes
  ['india','global','all'].forEach(function(t){
    var p=document.getElementById('pane-'+t);
    if(p) p.style.display=(t===tab)?'':'none';
  });
  // load data
  if(tab==='india' && !_loadedPages['india']){
    _loadedPages['india']=true;
    loadSection('india','india-list','nb-intern',function(t){
      document.getElementById('tc-india').textContent=String(t);
      updateAllCount();
    });
  }
  if(tab==='global' && !_loadedPages['global']){
    _loadedPages['global']=true;
    loadSection('global','global-list','nb-none',function(t){
      document.getElementById('tc-global').textContent=String(t);
      updateAllCount();
    });
  }
  if(tab==='all'){
    if(!_loadedPages['india']){
      _loadedPages['india']=true;
      loadSection('india','all-india-list','nb-intern',function(t){
        document.getElementById('tc-india').textContent=String(t);
        updateAllCount();
      });
    } else {
      // mirror india cards to all-india-list
      var src=document.getElementById('india-list');
      var dst=document.getElementById('all-india-list');
      if(src && dst && dst.children.length===0) dst.innerHTML=src.innerHTML;
    }
    if(!_loadedPages['global']){
      _loadedPages['global']=true;
      loadSection('global','all-global-list','nb-none',function(t){
        document.getElementById('tc-global').textContent=String(t);
        updateAllCount();
      });
    } else {
      var gsrc=document.getElementById('global-list');
      var gdst=document.getElementById('all-global-list');
      if(gsrc && gdst && gdst.children.length===0) gdst.innerHTML=gsrc.innerHTML;
    }
  }
}

function updateAllCount(){
  var ic=document.getElementById('tc-india').textContent;
  var gc=document.getElementById('tc-global').textContent;
  var iN=parseInt(ic)||0, gN=parseInt(gc)||0;
  document.getElementById('tc-all').textContent=String(iN+gN);
}

/* ── Section loader ── */
var sectionState={};
['india','global','cert','ngo','conf'].forEach(function(k){sectionState[k]={offset:0,total:0,loaded:0};});

function loadSection(key, listId, badgeId, onTotal, more){
  var state=sectionState[key];
  if(!state) state=sectionState[key]={offset:0,total:0,loaded:0};
  var listEl=document.getElementById(listId);
  if(!listEl) return;
  if(!more){
    listEl.innerHTML='<div class="empty"><span class="spinner accent"></span></div>';
  } else {
    var smr=listEl.querySelector('.show-more-wrap');
    if(smr) smr.remove();
  }
  return fetch('/opportunities?section='+key+'&sort=fit&limit=24&offset='+state.offset)
    .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
    .then(function(d){
      var items=Array.isArray(d.results)?d.results:[];
      state.total=typeof d.total==='number'?d.total:0;
      state.offset+=items.length;
      state.loaded+=items.length;
      if(badgeId && badgeId!=='nb-none'){
        var bEl=document.getElementById(badgeId);
        if(bEl) bEl.textContent=String(state.total);
      }
      if(onTotal) onTotal(state.total);
      if(!more){
        if(!items.length){
          listEl.innerHTML='<div class="empty"><div class="empty-icon">🔍</div>None found. Try collecting first.</div>';
        } else {
          listEl.innerHTML=items.map(buildCard).join('');
        }
      } else {
        items.forEach(function(o){listEl.insertAdjacentHTML('beforeend',buildCard(o));});
      }
      if(state.loaded<state.total){
        var rem=state.total-state.loaded;
        var smw=document.createElement('div');
        smw.className='show-more-wrap';
        var smb=document.createElement('button');
        smb.className='btn btn-secondary btn-sm';
        smb.textContent='Show '+rem+' more';
        smb.onclick=function(){loadSection(key,listId,badgeId,onTotal,true);};
        smw.appendChild(smb);
        listEl.appendChild(smw);
      }
    })
    .catch(function(e){
      if(!more) listEl.innerHTML='<div class="empty">Failed to load: '+esc(String(e))+'</div>';
    });
}

/* ── Card builder ── */
function buildCard(o){
  var s=o.fit_score!=null?o.fit_score:0;
  var c=sc(s);
  var h='<div class="opp-card '+c+'">';
  h+='<div class="card-head">';
  h+='<div class="score-badge '+c+'"><span class="score-n '+c+'">'+s+'</span><span class="score-lbl">fit</span></div>';
  h+='<div class="card-info">';
  h+='<div class="card-title" title="'+esc(o.title)+'">'+esc(o.title)+'</div>';
  if(o.organization) h+='<div class="card-org">'+esc(o.organization)+'</div>';
  h+='</div></div>';
  h+='<div class="card-tags">';
  if(o.type) h+='<span class="tag '+typeTag(o.type)+'">'+esc(o.type)+'</span>';
  if(o.location) h+='<span class="tag t-loc">📍 '+esc(o.location)+'</span>';
  h+='</div>';
  if(o.description) h+='<div class="card-desc">'+esc(o.description)+'</div>';
  if(o.fit_reason) h+='<div class="card-reason">Fit: '+esc(o.fit_reason)+'</div>';
  h+='<div class="card-foot">';
  if(o.url) h+='<a class="apply-link" href="'+esc(o.url)+'" target="_blank" rel="noopener">Apply ↗</a>';
  h+='<button class="btn btn-draft" onclick="prepareDraft('+o.id+')">Prepare draft</button>';
  h+='</div></div>';
  return h;
}

/* ── Collect / Re-rank ── */
function runCollect(){
  setBtn('btn-collect',true,'Collecting…');
  showStatus('Collecting opportunities…');
  fetch('/collect').then(function(r){return r.json();}).then(function(d){
    showStatus('Collected: '+(d.inserted||0)+' new, '+(d.skipped||0)+' skipped');
    _loadedPages={};
    sectionState={};
    ['india','global','cert','ngo','conf'].forEach(function(k){sectionState[k]={offset:0,total:0,loaded:0};});
    showPage(_activePage, _activeInternTab);
  }).catch(function(e){showStatus('Collect failed: '+e);}).then(function(){setBtn('btn-collect',false,'Collect');});
}

function runRerank(){
  setBtn('btn-rerank',true,'Ranking…');
  showStatus('Re-ranking…');
  fetch('/rank',{method:'POST'}).then(function(r){return r.json();}).then(function(d){
    showStatus('Scored '+(d.scored||0)+' opportunities');
    _loadedPages={};
    sectionState={};
    ['india','global','cert','ngo','conf'].forEach(function(k){sectionState[k]={offset:0,total:0,loaded:0};});
    showPage(_activePage, _activeInternTab);
    if(_loadedPages['cv']) loadCvAnalysis();
  }).catch(function(e){showStatus('Re-rank failed: '+e);}).then(function(){setBtn('btn-rerank',false,'Re-rank');});
}

/* ── CV Analysis ── */
function renderCvAnalysis(d){
  var el=document.getElementById('cv-analysis-panel');
  var h='';
  h+='<div class="a-section"><div class="a-hd missing">Missing Skills ('+((d.missing_skills||[]).length)+')</div><div class="a-body">';
  if(d.missing_skills&&d.missing_skills.length){
    h+='<div class="skill-list">';
    d.missing_skills.forEach(function(sk){h+='<span class="skill-chip">'+esc(sk.keyword)+'<span class="cnt">'+sk.demand_count+'</span></span>';});
    h+='</div>';
  } else h+='<span style="font-size:12px;color:var(--muted)">CV covers demand well.</span>';
  h+='</div></div>';
  h+='<div class="a-section"><div class="a-hd gaps">Structural Gaps</div><div class="a-body">';
  if(d.structural_gaps&&d.structural_gaps.length){
    h+='<ul class="text-list gaps">';
    d.structural_gaps.forEach(function(g){h+='<li>'+esc(g)+'</li>';});
    h+='</ul>';
  } else h+='<span style="font-size:12px;color:var(--muted)">No gaps found.</span>';
  h+='</div></div>';
  h+='<div class="a-section"><div class="a-hd wins">Quick Wins</div><div class="a-body">';
  if(d.quick_wins&&d.quick_wins.length){
    h+='<ul class="text-list wins">';
    d.quick_wins.forEach(function(w){h+='<li>'+esc(w)+'</li>';});
    h+='</ul>';
  } else h+='<span style="font-size:12px;color:var(--muted)">None listed.</span>';
  h+='</div></div>';
  h+='<div class="a-section"><div class="a-hd strengths">Strengths to Keep</div><div class="a-body">';
  if(d.strengths_to_keep&&d.strengths_to_keep.length){
    h+='<ul class="text-list str">';
    d.strengths_to_keep.forEach(function(s){h+='<li>'+esc(s)+'</li>';});
    h+='</ul>';
  } else h+='<span style="font-size:12px;color:var(--muted)">None listed.</span>';
  h+='</div></div>';
  el.innerHTML=h;
}

function loadCvAnalysis(){
  return fetch('/cv-analysis').then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
    .then(renderCvAnalysis)
    .catch(function(e){document.getElementById('cv-analysis-panel').innerHTML='<div class="empty">Failed: '+esc(String(e))+'</div>';});
}

/* ── CV Editor ── */
function loadCvText(){
  return fetch('/cv').then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json();})
    .then(function(d){
      var ta=document.getElementById('cv-textarea');
      ta.value=d.cv_text||'';
      ta.placeholder=d.cv_text?'':'Paste or type your CV text here…';
    })
    .catch(function(e){console.error('[cv-engine] loadCvText:',e);});
}

var currentSuggestions=[];
function renderSuggestions(suggestions){
  currentSuggestions=suggestions;
  var el=document.getElementById('suggestions-area');
  if(!suggestions.length){el.innerHTML='<div class="empty" style="padding:12px 0">No suggestions — CV looks solid.</div>';return;}
  var h='<div class="sug-list">';
  suggestions.forEach(function(s,i){
    var tl=s.type==='add_skill'?'skill':'section';
    h+='<div class="sug-card" id="sug-'+esc(s.id)+'">';
    h+='<div class="sug-hd"><span class="sug-type '+sugTypeClass(s.type)+'">'+tl+'</span><span class="sug-target">'+esc(s.target)+'</span></div>';
    h+='<div class="sug-rationale">'+esc(s.rationale)+'</div>';
    h+='<pre class="sug-text">'+esc(s.suggestion)+'</pre>';
    h+='<div class="sug-actions"><button class="btn btn-accept btn-xs" onclick="acceptSuggestion('+i+')">Accept</button><button class="btn btn-dismiss btn-xs" onclick="dismissSuggestion('+i+')">Dismiss</button></div>';
    h+='</div>';
  });
  h+='</div>';
  el.innerHTML=h;
}

function acceptSuggestion(idx){
  var s=currentSuggestions[idx];if(!s)return;
  var ta=document.getElementById('cv-textarea');
  ta.value=ta.value.replace(/\\s+$/,'')+'\\n\\n'+s.suggestion;
  ta.scrollTop=ta.scrollHeight;
  var card=document.getElementById('sug-'+s.id);
  if(card){card.classList.add('accepted');var b=card.querySelector('.btn-accept');if(b)b.disabled=true;}
}

function dismissSuggestion(idx){
  var s=currentSuggestions[idx];if(!s)return;
  var card=document.getElementById('sug-'+s.id);if(card)card.remove();
}

function triggerSuggestions(){
  setBtn('btn-suggest',true,'Analyzing…');
  document.getElementById('suggestions-area').innerHTML='<div class="empty"><span class="spinner accent"></span></div>';
  fetch('/cv-suggestions').then(function(r){return r.json();}).then(function(d){
    renderSuggestions(Array.isArray(d)?d:[]);
  }).catch(function(e){
    document.getElementById('suggestions-area').innerHTML='<div class="empty">Failed: '+esc(String(e))+'</div>';
  }).then(function(){setBtn('btn-suggest',false,'Suggest improvements');});
}

function saveCv(){
  setBtn('btn-save-cv',true,'Saving…');
  var text=document.getElementById('cv-textarea').value;
  fetch('/cv',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cv_text:text})})
    .then(function(r){return r.json();}).then(function(d){
      var el=document.getElementById('cv-save-status');
      el.textContent=d.ok?'Saved ✓':'Error: '+(d.error||'unknown');
      el.classList.add('on');setTimeout(function(){el.classList.remove('on');},3000);
    }).catch(function(e){showStatus('Save failed: '+e);}).then(function(){setBtn('btn-save-cv',false,'Save CV');});
}

/* ── Draft modal ── */
var activeDraftId=null;

function prepareDraft(oppId){
  var btn=document.querySelector('[onclick="prepareDraft('+oppId+')"]');
  if(btn){btn.disabled=true;btn.innerHTML='<span class="spinner"></span>';}
  fetch('/draft/'+oppId,{method:'POST'}).then(function(r){return r.json();}).then(function(d){
    if(d.error)throw new Error(d.error);
    openDraftModal(d);loadQueue();
  }).catch(function(e){showStatus('Could not prepare draft: '+e);}).then(function(){
    if(btn){btn.disabled=false;btn.textContent='Prepare draft';}
  });
}

function openDraftModal(d){
  activeDraftId=d.id;
  document.getElementById('modal-title').textContent=(d.opp_title||'Draft')+(d.opp_organization?' — '+d.opp_organization:'');
  document.getElementById('modal-subject').value=d.subject||'';
  document.getElementById('modal-body-text').value=d.body||'';
  var link=document.getElementById('modal-apply-link');
  if(d.opp_url){link.href=d.opp_url;link.style.display='';}else{link.style.display='none';}
  document.getElementById('draft-modal').classList.remove('hidden');
}

function closeDraftModal(){document.getElementById('draft-modal').classList.add('hidden');activeDraftId=null;}
function modalBgClick(e){if(e.target===document.getElementById('draft-modal'))closeDraftModal();}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDraftModal();});

function copyDraft(){
  var txt='Subject: '+document.getElementById('modal-subject').value+'\\n\\n'+document.getElementById('modal-body-text').value;
  if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){showStatus('Draft copied to clipboard');}).catch(function(){fbCopy(txt);});}
  else fbCopy(txt);
}

function fbCopy(text){
  var ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta);ta.select();
  try{document.execCommand('copy');showStatus('Draft copied to clipboard');}catch(e){showStatus('Copy failed — select manually');}
  document.body.removeChild(ta);
}

function approveDraft(){
  if(!activeDraftId)return;
  var id=activeDraftId;
  var subject=document.getElementById('modal-subject').value;
  var bodyText=document.getElementById('modal-body-text').value;
  fetch('/drafts/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({subject:subject,body:bodyText})})
    .then(function(){return fetch('/drafts/'+id+'/approve',{method:'POST'});})
    .then(function(r){return r.json();}).then(function(d){
      if(d.error)throw new Error(d.error);
      showStatus('Draft marked as approved ✓');closeDraftModal();loadQueue();
    }).catch(function(e){showStatus('Error: '+e);});
}

function dismissDraft(){
  if(!activeDraftId)return;
  var id=activeDraftId;
  fetch('/drafts/'+id+'/dismiss',{method:'POST'}).then(function(r){return r.json();}).then(function(d){
    if(d.error)throw new Error(d.error);
    showStatus('Draft dismissed');closeDraftModal();loadQueue();
  }).catch(function(e){showStatus('Error: '+e);});
}

/* ── Queue ── */
var queueDrafts={};
function loadQueue(){
  var listEl=document.getElementById('queue-list');
  fetch('/drafts').then(function(r){return r.json();}).then(function(drafts){
    if(!Array.isArray(drafts))drafts=[];
    queueDrafts={};
    var active=drafts.filter(function(d){return d.status!=='dismissed';});
    active.forEach(function(d){queueDrafts[d.id]=d;});
    var nb=document.getElementById('nb-queue');
    if(nb)nb.textContent=String(active.length);
    if(!active.length){
      listEl.innerHTML='<div class="empty"><div class="empty-icon">📭</div>No drafts yet — click &ldquo;Prepare draft&rdquo; on any opportunity.</div>';return;
    }
    listEl.innerHTML=active.map(function(d){
      var isApproved=d.status==='approved';
      var h='<div class="draft-item">';
      h+='<div class="draft-info"><div class="draft-subject">'+esc(d.subject||'(no subject)')+'</div>';
      if(d.opp_organization||d.opp_title) h+='<div class="draft-opp">'+esc(d.opp_organization||'')+(d.opp_title?' — '+esc(d.opp_title):'')+'</div>';
      h+='</div>';
      h+='<div style="display:flex;align-items:center;gap:6px">';
      h+='<span class="s-badge '+(isApproved?'s-approved':'s-pending')+'">'+(isApproved?'Ready to send':'Pending review')+'</span>';
      h+='<button class="btn btn-draft btn-xs" onclick="reviewQueueDraft('+d.id+')">Review</button>';
      h+='</div></div>';
      return h;
    }).join('');
  }).catch(function(e){if(listEl)listEl.innerHTML='<div class="empty">Failed to load queue: '+esc(String(e))+'</div>';});
}

function reviewQueueDraft(id){var d=queueDrafts[id];if(d)openDraftModal(d);}

/* ── Sources ── */
function loadSources(){
  fetch('/sources').then(function(r){return r.json();}).then(function(d){
    var n=Array.isArray(d)?d.length:0;
    var nb=document.getElementById('nb-intern');
    // only update if no total loaded yet
    if(nb&&nb.textContent==='—')nb.textContent=n+' srcs';
  }).catch(function(){});
}

/* ── Profile edit ── */
var editStage='',editSkills=[],editInterests=[],editLocs=[];

function openEditProfile(){
  fetch('/profile').then(function(r){return r.json();}).then(function(d){
    if(d.error)return;
    editStage=d.stage||'';editSkills=(d.skills||[]).slice();editInterests=(d.interests||[]).slice();editLocs=(d.target_locations||[]).slice();
    document.getElementById('edit-form-overlay').classList.add('on');
    editFormRender(d.name||'',d.experience||'');
  }).catch(function(){});
}

function closeEditProfile(){document.getElementById('edit-form-overlay').classList.remove('on');}

function editLocsHtml(){
  var h='<div class="ob-chips" id="edit-locs-chips">';
  OB_LOCATIONS.forEach(function(l,li){
    h+='<button class="ob-chip'+(editLocs.indexOf(l)>=0?' selected':'')+'" onclick="editToggleLoc('+li+')">'+esc(l)+'</button>';
  });
  editLocs.forEach(function(l,ci){
    if(OB_LOCATIONS.indexOf(l)<0) h+='<button class="ob-chip selected" onclick="editRemoveLoc('+ci+')">'+esc(l)+' &times;</button>';
  });
  h+='</div><div style="display:flex;gap:8px;margin-top:8px"><input id="edit-loc-inp" class="ob-input" style="margin-top:0;flex:1" type="text" placeholder="Add a city"><button class="btn btn-secondary btn-sm" onclick="editAddLoc()">Add</button></div>';
  return h;
}

function editFormRender(nameVal,expVal){
  var body=document.getElementById('edit-form-body');
  var stageHtml='<div class="ob-chips" id="edit-stage-chips">';
  OB_STAGES.forEach(function(s,si){stageHtml+='<button class="ob-chip'+(editStage===s?' selected':'')+'" onclick="editSelectStage('+si+')">'+esc(s)+'</button>';});
  stageHtml+='</div>';
  var skillsHtml='<div class="ob-chips" id="edit-skills-chips">';
  OB_SKILLS.forEach(function(s,ki){skillsHtml+='<button class="ob-chip'+(editSkills.indexOf(s)>=0?' selected':'')+'" onclick="editToggleSkill('+ki+')">'+esc(s)+'</button>';});
  skillsHtml+='</div>';
  var intHtml='<div class="ob-chips" id="edit-interests-chips">';
  OB_INTERESTS.forEach(function(s,ii){intHtml+='<button class="ob-chip'+(editInterests.indexOf(s)>=0?' selected':'')+'" onclick="editToggleInterest('+ii+')">'+esc(s)+'</button>';});
  intHtml+='</div>';
  body.innerHTML=
    '<span class="cv-field-lbl">Name</span><input id="edit-name-inp" class="ob-input" type="text" value="'+esc(nameVal)+'" placeholder="Your full name">'+
    '<span class="cv-field-lbl">Stage</span>'+stageHtml+
    '<span class="cv-field-lbl">Skills</span>'+skillsHtml+
    '<span class="cv-field-lbl">Interests</span>'+intHtml+
    '<span class="cv-field-lbl">Target locations</span><div id="edit-locs-wrap">'+editLocsHtml()+'</div>'+
    '<span class="cv-field-lbl">Experience</span><textarea id="edit-exp-ta" class="cv-txt-area" style="min-height:80px" placeholder="Brief description of work experience">'+esc(expVal)+'</textarea>'+
    '<div id="edit-save-err" class="ob-err" style="display:none"></div>';
}

function editSelectStage(idx){editStage=OB_STAGES[idx];var c=document.getElementById('edit-stage-chips');if(!c)return;c.querySelectorAll('.ob-chip').forEach(function(ch,i){ch.classList.toggle('selected',i===idx);});}
function editToggleSkill(idx){var s=OB_SKILLS[idx];var p=editSkills.indexOf(s);if(p>=0)editSkills.splice(p,1);else editSkills.push(s);var c=document.getElementById('edit-skills-chips');if(!c)return;c.querySelectorAll('.ob-chip').forEach(function(ch,i){ch.classList.toggle('selected',editSkills.indexOf(OB_SKILLS[i])>=0);});}
function editToggleInterest(idx){var s=OB_INTERESTS[idx];var p=editInterests.indexOf(s);if(p>=0)editInterests.splice(p,1);else editInterests.push(s);var c=document.getElementById('edit-interests-chips');if(!c)return;c.querySelectorAll('.ob-chip').forEach(function(ch,i){ch.classList.toggle('selected',editInterests.indexOf(OB_INTERESTS[i])>=0);});}
function editToggleLoc(idx){var l=OB_LOCATIONS[idx];var p=editLocs.indexOf(l);if(p>=0)editLocs.splice(p,1);else editLocs.push(l);var w=document.getElementById('edit-locs-wrap');if(w)w.innerHTML=editLocsHtml();}
function editAddLoc(){var inp=document.getElementById('edit-loc-inp');var val=inp?inp.value.trim():'';if(!val||editLocs.indexOf(val)>=0){if(inp)inp.value='';return;}editLocs.push(val);var w=document.getElementById('edit-locs-wrap');if(w)w.innerHTML=editLocsHtml();}
function editRemoveLoc(idx){editLocs.splice(idx,1);var w=document.getElementById('edit-locs-wrap');if(w)w.innerHTML=editLocsHtml();}

function editProfileSave(){
  var nameEl=document.getElementById('edit-name-inp'),expEl=document.getElementById('edit-exp-ta'),errEl=document.getElementById('edit-save-err'),saveBtn=document.getElementById('edit-save-btn');
  var nameVal=nameEl?nameEl.value.trim():'';
  if(!nameVal){if(nameEl)nameEl.focus();return;}
  saveBtn.disabled=true;saveBtn.textContent='Saving…';errEl.style.display='none';
  fetch('/profile',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:nameVal,stage:editStage,skills:editSkills,interests:editInterests,target_locations:editLocs,experience:expEl?expEl.value.trim():''})})
    .then(function(r){return r.json();}).then(function(d){
      if(d.ok){
        closeEditProfile();
        fetch('/rank',{method:'POST'}).then(function(){
          _loadedPages={};sectionState={};['india','global','cert','ngo','conf'].forEach(function(k){sectionState[k]={offset:0,total:0,loaded:0};});
          showPage(_activePage,_activeInternTab);
          if(_loadedPages['cv'])loadCvAnalysis();
        }).catch(function(){});
        return;
      }
      saveBtn.disabled=false;saveBtn.textContent='Save changes';
      errEl.textContent=d.error==='name_required'?'Name is required.':(d.error||'Something went wrong.');errEl.style.display='block';
    }).catch(function(){saveBtn.disabled=false;saveBtn.textContent='Save changes';errEl.textContent='Network error.';errEl.style.display='block';});
}

/* ── Onboarding ── */
var cvCurrentStep=0,cvParsed={},cvAnswers={name:'',stage:'',skills:[],cvText:''};

function onboardCv(){
  document.getElementById('onboarding-overlay').classList.remove('on');
  document.getElementById('cv-form-overlay').classList.add('on');
  cvCurrentStep=0;cvRenderStep(0);
}

function cvBack(){
  if(cvCurrentStep===0){document.getElementById('cv-form-overlay').classList.remove('on');document.getElementById('onboarding-overlay').classList.add('on');return;}
  cvCurrentStep=0;cvRenderStep(0);
}

function cvNext(){if(cvCurrentStep===1)cvSave();}

function cvSwitchToQuestions(){
  document.getElementById('cv-form-overlay').classList.remove('on');
  document.getElementById('ob-form-overlay').classList.add('on');
  currentStep=0;obRenderStep(0);
}

function cvRenderStep(step){
  var body=document.getElementById('cv-step-body');
  var nextBtn=document.getElementById('cv-next');
  nextBtn.disabled=false;
  if(step===0){
    nextBtn.style.display='none';
    body.innerHTML='<h2 class="ob-heading">Upload your CV</h2>'+
      '<p class="ob-sub">We\\'ll pull out the text so you can review it before saving.</p>'+
      '<label class="cv-upload-area" for="cv-file-inp"><span class="cv-upload-prompt">Click to browse your files</span><span class="cv-upload-types">.pdf &nbsp;&bull;&nbsp; .docx &nbsp;&bull;&nbsp; .txt &nbsp;&bull;&nbsp; max 2 MB</span></label>'+
      '<input type="file" id="cv-file-inp" accept=".pdf,.docx,.txt" style="display:none" onchange="cvHandleFile(this)">'+
      '<div id="cv-upload-msg"></div>';
  } else if(step===1){
    nextBtn.style.display='';nextBtn.textContent='Save my CV';
    var stageHtml='<div class="ob-chips" id="cv-stage-chips">';
    OB_STAGES.forEach(function(s,si){stageHtml+='<button class="ob-chip'+(cvAnswers.stage===s?' selected':'')+'" onclick="cvSelectStage('+si+')">'+esc(s)+'</button>';});
    stageHtml+='</div>';
    var skillsHtml='<div class="ob-chips" id="cv-skills-chips">';
    OB_SKILLS.forEach(function(s,ki){skillsHtml+='<button class="ob-chip'+(cvAnswers.skills.indexOf(s)>=0?' selected':'')+'" onclick="cvToggleSkill('+ki+')">'+esc(s)+'</button>';});
    skillsHtml+='</div>';
    body.innerHTML='<h2 class="ob-heading">Review what we found</h2>'+
      '<span class="cv-field-lbl">Name</span><input id="cv-name-inp" class="ob-input" type="text" placeholder="Your full name" value="'+esc(cvAnswers.name||'')+'" oninput="cvAnswers.name=this.value;cvValidateConfirm()">'+
      '<span class="cv-field-lbl">Stage</span>'+stageHtml+
      '<span class="cv-field-lbl">Skills detected</span>'+skillsHtml+
      '<span class="cv-field-lbl">CV text</span>'+
      '<textarea id="cv-txt-area" class="cv-txt-area" oninput="cvAnswers.cvText=this.value">'+esc(cvAnswers.cvText)+'</textarea>'+
      '<div id="cv-save-err" class="ob-err" style="display:none"></div>';
    cvValidateConfirm();
  }
}

function cvValidateConfirm(){var inp=document.getElementById('cv-name-inp');var btn=document.getElementById('cv-next');if(inp&&btn)btn.disabled=inp.value.trim().length===0;}
function cvSelectStage(idx){cvAnswers.stage=OB_STAGES[idx];var c=document.getElementById('cv-stage-chips');if(!c)return;c.querySelectorAll('.ob-chip').forEach(function(ch,i){ch.classList.toggle('selected',i===idx);});}
function cvToggleSkill(idx){var s=OB_SKILLS[idx];var p=cvAnswers.skills.indexOf(s);if(p>=0)cvAnswers.skills.splice(p,1);else cvAnswers.skills.push(s);var c=document.getElementById('cv-skills-chips');if(!c)return;c.querySelectorAll('.ob-chip').forEach(function(ch,i){ch.classList.toggle('selected',cvAnswers.skills.indexOf(OB_SKILLS[i])>=0);});}

function cvHandleFile(input){
  var file=input.files[0];if(!file)return;
  var msgEl=document.getElementById('cv-upload-msg');
  msgEl.innerHTML='<p style="margin-top:14px;font-size:13px;color:var(--muted)"><span class="spinner accent"></span> Reading file…</p>';
  var fd=new FormData();fd.append('file',file);
  fetch('/parse-cv',{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(d){
    if(d.error||d.warning){
      var msg=d.error||d.warning;
      msgEl.innerHTML='<p class="ob-err">'+esc(msg)+'</p><button class="btn btn-secondary" style="margin-top:12px" onclick="cvSwitchToQuestions()">Answer questions instead</button>';
      return;
    }
    cvParsed=d;
    cvAnswers.name=(d.detected&&d.detected.name)?d.detected.name:'';
    cvAnswers.stage=(d.detected&&d.detected.stage)?d.detected.stage:'';
    cvAnswers.skills=(d.detected&&d.detected.skills)?d.detected.skills.slice():[];
    cvAnswers.cvText=d.text||'';
    cvCurrentStep=1;cvRenderStep(1);
  }).catch(function(){
    msgEl.innerHTML='<p class="ob-err">Could not read the file. Try a different format.</p><button class="btn btn-secondary" style="margin-top:12px" onclick="cvSwitchToQuestions()">Answer questions instead</button>';
  });
}

function cvSave(){
  var nameEl=document.getElementById('cv-name-inp'),txtEl=document.getElementById('cv-txt-area'),errEl=document.getElementById('cv-save-err'),nextBtn=document.getElementById('cv-next');
  var nameVal=nameEl?nameEl.value.trim():'';
  if(!nameVal){if(nameEl)nameEl.focus();return;}
  var cvText=txtEl?txtEl.value.trim():'';
  nextBtn.disabled=true;nextBtn.textContent='Saving…';errEl.style.display='none';
  fetch('/onboard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:nameVal,stage:cvAnswers.stage,skills:cvAnswers.skills,interests:[],target_locations:[],achievements:[],experience:'',cv_text:cvText})})
    .then(function(r){return r.json();}).then(function(d){
      if(d.ok){document.getElementById('cv-form-overlay').classList.remove('on');showDashboardAfterOnboard();return;}
      if(d.error==='already_onboarded'){document.getElementById('cv-form-overlay').classList.remove('on');showDashboard();return;}
      nextBtn.disabled=false;nextBtn.textContent='Save my CV';
      errEl.textContent=d.error==='name_required'?'Name is required.':(d.error||'Something went wrong.');errEl.style.display='block';
    }).catch(function(){nextBtn.disabled=false;nextBtn.textContent='Save my CV';errEl.textContent='Network error.';errEl.style.display='block';});
}

/* ── Onboarding multi-step form ── */
var answers={},currentStep=0,OB_TOTAL_STEPS=9;
var OB_STAGES=['School student','Undergraduate','Graduate','Working professional','Other'];
var OB_SKILLS=['Programming','Public speaking','Writing','Design','Languages','Debate & MUN','Leadership','Research','Sports'];
var OB_INTERESTS=['Computer Science','Technology','Business','Design','Research','Social work','Finance','Healthcare'];
var OB_LOCATIONS=['India','Remote','Global'];
var OB_MULTI={};
OB_MULTI[2]={key:'skills',presets:OB_SKILLS,addLabel:'Add your own',inputId:'ob-add-inp'};
OB_MULTI[3]={key:'interests',presets:OB_INTERESTS,addLabel:'Add your own',inputId:'ob-add-inp'};
OB_MULTI[4]={key:'target_locations',presets:OB_LOCATIONS,addLabel:'Add a city',inputId:'ob-add-inp'};
var OB_EDU_BOARDS=['CBSE','ICSE','State board','IB','Other'];
var OB_EDU_STREAMS=['PCM','PCB','Commerce','Arts','Other'];
var OB_ACHV_CATS=['Sports','MUN & Debate','Olympiads','Certificates','Competitions','Volunteering & NGO','Academic honors'];
var OB_ACHV_PROMPTS=['Which sport and what level?','Which event and award?','Which olympiad and result?','Which certificate?','Which competition and result?','Which org and what you did?','Which honor?'];

function obRenderStep(step){
  var body=document.getElementById('ob-step-body'),nextBtn=document.getElementById('ob-next'),indEl=document.getElementById('ob-step-ind');
  nextBtn.textContent='Next';nextBtn.disabled=false;
  if(step===0){
    indEl.textContent='Step 1 of '+OB_TOTAL_STEPS;
    body.innerHTML='<h2 class="ob-heading">What\\'s your name?</h2><input id="ob-name" class="ob-input" type="text" placeholder="Your full name" value="'+esc(answers.name||'')+'" oninput="obNameInput(this.value)">';
    nextBtn.disabled=!(answers.name&&answers.name.trim().length>0);
  } else if(step===1){
    indEl.textContent='Step 2 of '+OB_TOTAL_STEPS;
    var html='<h2 class="ob-heading">What\\'s your current stage?</h2><div class="ob-chips">';
    OB_STAGES.forEach(function(s,i){html+='<button class="ob-chip'+(answers._stageChip===s?' selected':'')+'" onclick="obSelectStage('+i+')">'+esc(s)+'</button>';});
    html+='</div>';
    if(answers._stageChip==='Other') html+='<input id="ob-stage-other" class="ob-input" type="text" placeholder="Describe your situation" value="'+esc(answers._stageOther||'')+'" oninput="obStageOtherInput(this.value)">';
    body.innerHTML=html;nextBtn.disabled=!answers.stage;
  } else if(step===2){
    indEl.textContent='Step 3 of '+OB_TOTAL_STEPS;
    body.innerHTML=obRenderMultiStep(2,'What are your skills?','Select all that apply.');
  } else if(step===3){
    indEl.textContent='Step 4 of '+OB_TOTAL_STEPS;
    body.innerHTML=obRenderMultiStep(3,'What are your interests?','Select all that apply.');
  } else if(step===4){
    indEl.textContent='Step 5 of '+OB_TOTAL_STEPS;
    body.innerHTML=obRenderMultiStep(4,'Where do you want opportunities?','Select all that apply.');
  } else if(step===5){
    indEl.textContent='Step 6 of '+OB_TOTAL_STEPS;
    body.innerHTML=obRenderEducationStep();
  } else if(step===6){
    indEl.textContent='Step 7 of '+OB_TOTAL_STEPS;
    body.innerHTML=obRenderAchievementsStep();
  } else if(step===7){
    indEl.textContent='Step 8 of '+OB_TOTAL_STEPS;
    body.innerHTML=obRenderExperienceStep();
  } else if(step===8){
    indEl.textContent='Step 9 of '+OB_TOTAL_STEPS;
    body.innerHTML=obRenderReviewStep();
    nextBtn.textContent='Submit';
  }
}

function onboardQuestions(){document.getElementById('onboarding-overlay').classList.remove('on');document.getElementById('ob-form-overlay').classList.add('on');currentStep=0;obRenderStep(0);}
function obBack(){if(currentStep===0){document.getElementById('ob-form-overlay').classList.remove('on');document.getElementById('onboarding-overlay').classList.add('on');return;}currentStep--;obRenderStep(currentStep);}
function obNext(){if(currentStep===OB_TOTAL_STEPS-1){obSubmit();return;}currentStep++;obRenderStep(currentStep);}
function obNameInput(val){answers.name=val;document.getElementById('ob-next').disabled=!(val&&val.trim().length>0);}
function obSelectStage(idx){var chosen=OB_STAGES[idx];answers._stageChip=chosen;if(chosen==='Other'){answers.stage=(answers._stageOther&&answers._stageOther.trim())?answers._stageOther.trim():null;}else{answers.stage=chosen;answers._stageOther=null;}obRenderStep(currentStep);}
function obStageOtherInput(val){answers._stageOther=val;answers.stage=val.trim()?val.trim():null;document.getElementById('ob-next').disabled=!answers.stage;}

function obAssembleEducation(){
  var board=answers._eduBoard==='Other'?(answers._eduBoardOther||'').trim():(answers._eduBoard||'').trim();
  var stream=answers._eduStream==='Other'?(answers._eduStreamOther||'').trim():(answers._eduStream||'').trim();
  var school=(answers._eduSchool||'').trim(),marks=(answers._eduMarks||'').trim();
  var parts=[];if(board)parts.push(board);if(stream)parts.push(stream);if(school)parts.push(school);if(marks)parts.push(marks);
  answers.education=parts.length?parts.join(', '):null;
}

function obRenderEducationStep(){
  var html='<h2 class="ob-heading">Your education</h2><p class="ob-sub" style="margin-bottom:0">Fill in what applies to you.</p>';
  html+='<p style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin:20px 0 8px">Board</p><div class="ob-chips">';
  OB_EDU_BOARDS.forEach(function(b,i){html+='<button class="ob-chip'+(answers._eduBoard===b?' selected':'')+'" onclick="obEduSelectBoard('+i+')">'+esc(b)+'</button>';});
  html+='</div>';
  if(answers._eduBoard==='Other') html+='<input id="ob-edu-board-other" class="ob-input" type="text" placeholder="Your board" value="'+esc(answers._eduBoardOther||'')+'" oninput="obEduBoardOtherInput(this.value)">';
  html+='<p style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin:20px 0 8px">Stream</p><div class="ob-chips">';
  OB_EDU_STREAMS.forEach(function(s,j){html+='<button class="ob-chip'+(answers._eduStream===s?' selected':'')+'" onclick="obEduSelectStream('+j+')">'+esc(s)+'</button>';});
  html+='</div>';
  if(answers._eduStream==='Other') html+='<input id="ob-edu-stream-other" class="ob-input" type="text" placeholder="Your stream" value="'+esc(answers._eduStreamOther||'')+'" oninput="obEduStreamOtherInput(this.value)">';
  html+='<input id="ob-edu-school" class="ob-input" type="text" placeholder="School or university name" value="'+esc(answers._eduSchool||'')+'" oninput="obEduSchoolInput(this.value)">';
  html+='<input id="ob-edu-marks" class="ob-input" type="text" placeholder="Marks or percentage, e.g. 83.2%" value="'+esc(answers._eduMarks||'')+'" oninput="obEduMarksInput(this.value)">';
  return html;
}

function obEduSelectBoard(idx){answers._eduBoard=OB_EDU_BOARDS[idx];if(answers._eduBoard!=='Other')answers._eduBoardOther=null;obAssembleEducation();obRenderStep(currentStep);}
function obEduBoardOtherInput(val){answers._eduBoardOther=val;obAssembleEducation();}
function obEduSelectStream(idx){answers._eduStream=OB_EDU_STREAMS[idx];if(answers._eduStream!=='Other')answers._eduStreamOther=null;obAssembleEducation();obRenderStep(currentStep);}
function obEduStreamOtherInput(val){answers._eduStreamOther=val;obAssembleEducation();}
function obEduSchoolInput(val){answers._eduSchool=val;obAssembleEducation();}
function obEduMarksInput(val){answers._eduMarks=val;obAssembleEducation();}

function obRenderAchievementsStep(){
  obEnsureArr('achievements');
  var html='<h2 class="ob-heading">Any achievements?</h2><p class="ob-sub" style="margin-bottom:0">Tap a category, add a detail. Optional.</p><div class="ob-chips" style="margin-top:18px">';
  OB_ACHV_CATS.forEach(function(c,i){html+='<button class="ob-chip'+(answers._achvCat===i?' selected':'')+'" onclick="obAchvSelectCat('+i+')">'+esc(c)+'</button>';});
  html+='</div>';
  if(answers._achvCat!==null&&answers._achvCat!==undefined){
    html+='<div style="display:flex;gap:8px;margin-top:14px;align-items:center"><input id="ob-achv-inp" class="ob-input" type="text" placeholder="'+esc(OB_ACHV_PROMPTS[answers._achvCat])+'" style="margin-top:0;flex:1"><button class="btn btn-secondary btn-sm" onclick="obAchvAdd()">Add</button></div>';
  }
  if(answers.achievements.length){
    html+='<div style="margin-top:14px;display:flex;flex-direction:column;gap:6px">';
    answers.achievements.forEach(function(a,j){
      html+='<div style="display:flex;align-items:center;gap:8px;font-size:12px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-sm);padding:6px 10px"><span style="flex:1;color:var(--text)">'+esc(a)+'</span><button class="btn btn-xs" style="background:transparent;color:var(--muted);border:none" onclick="obAchvRemove('+j+')">×</button></div>';
    });
    html+='</div>';
  }
  return html;
}

function obAchvSelectCat(idx){answers._achvCat=(answers._achvCat===idx)?null:idx;obRenderStep(currentStep);}
function obAchvAdd(){if(answers._achvCat===null||answers._achvCat===undefined)return;var el=document.getElementById('ob-achv-inp');if(!el)return;var d=el.value.trim();if(!d)return;obEnsureArr('achievements');answers.achievements.push(OB_ACHV_CATS[answers._achvCat]+' — '+d);el.value='';obRenderStep(currentStep);}
function obAchvRemove(idx){obEnsureArr('achievements');answers.achievements.splice(idx,1);obRenderStep(currentStep);}

function obEnsureArr(key){if(!Array.isArray(answers[key]))answers[key]=[];}

function obRenderMultiStep(stepIdx,heading,sub){
  var cfg=OB_MULTI[stepIdx];obEnsureArr(cfg.key);var arr=answers[cfg.key];
  var html='<h2 class="ob-heading">'+esc(heading)+'</h2><p class="ob-sub" style="margin-bottom:0">'+esc(sub)+'</p><div class="ob-chips">';
  cfg.presets.forEach(function(p,i){html+='<button class="ob-chip'+(arr.indexOf(p)!==-1?' selected':'')+'" onclick="obTogglePresetChip('+stepIdx+','+i+')">'+esc(p)+'</button>';});
  arr.forEach(function(v,j){if(cfg.presets.indexOf(v)===-1)html+='<button class="ob-chip selected" onclick="obRemoveCustomChip('+stepIdx+','+j+')">'+esc(v)+' ×</button>';});
  html+='</div><div style="display:flex;gap:8px;margin-top:16px;align-items:center"><input id="ob-add-inp" class="ob-input" type="text" placeholder="'+esc(cfg.addLabel)+'" style="margin-top:0;flex:1"><button class="btn btn-secondary btn-sm" onclick="obAddCustomChip('+stepIdx+')">Add</button></div>';
  return html;
}

function obTogglePresetChip(stepIdx,presetIdx){var cfg=OB_MULTI[stepIdx];if(!cfg)return;var val=cfg.presets[presetIdx];obEnsureArr(cfg.key);var i=answers[cfg.key].indexOf(val);if(i===-1)answers[cfg.key].push(val);else answers[cfg.key].splice(i,1);obRenderStep(currentStep);}
function obRemoveCustomChip(stepIdx,arrIdx){var cfg=OB_MULTI[stepIdx];if(!cfg)return;obEnsureArr(cfg.key);answers[cfg.key].splice(arrIdx,1);obRenderStep(currentStep);}
function obAddCustomChip(stepIdx){var cfg=OB_MULTI[stepIdx];if(!cfg)return;var el=document.getElementById(cfg.inputId);if(!el)return;var val=el.value.trim();if(!val)return;obEnsureArr(cfg.key);if(answers[cfg.key].indexOf(val)===-1)answers[cfg.key].push(val);el.value='';obRenderStep(currentStep);}

function obRenderExperienceStep(){
  var html='<h2 class="ob-heading">Any work or internship experience?</h2><p class="ob-sub" style="margin-bottom:0">Internships, part-time, freelance — anything counts.</p><div class="ob-chips" style="margin-top:18px">';
  html+='<button class="ob-chip'+(answers._expChoice==='Yes'?' selected':'')+'" onclick="obExpSelect(1)">Yes</button>';
  html+='<button class="ob-chip'+(answers._expChoice==='No'?' selected':'')+'" onclick="obExpSelect(0)">No</button>';
  html+='</div>';
  if(answers._expChoice==='Yes') html+='<textarea id="ob-exp-text" class="ob-input" style="min-height:100px;resize:vertical" placeholder="Briefly describe your experience…" oninput="obExpTextInput(this.value)">'+esc(answers.experience||'')+'</textarea>';
  return html;
}

function obExpSelect(isYes){answers._expChoice=isYes?'Yes':'No';if(!isYes)answers.experience='';obRenderStep(currentStep);}
function obExpTextInput(val){answers.experience=val;}

function obRenderReviewStep(){
  obEnsureArr('skills');obEnsureArr('interests');obEnsureArr('target_locations');obEnsureArr('achievements');
  function row(label,val){return '<div style="border:1px solid var(--border);border-radius:var(--r-sm);padding:8px 12px"><div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">'+label+'</div><div style="font-size:13px;color:var(--text)">'+(val||'<span style="color:var(--subtle)">Not set</span>')+'</div></div>';}
  var html='<h2 class="ob-heading">Review your profile</h2><p class="ob-sub" style="margin-bottom:0">Check everything, then submit.</p><div style="margin-top:20px;display:flex;flex-direction:column;gap:10px">';
  html+=row('Name',esc(answers.name||''));
  html+=row('Stage',esc(answers.stage||''));
  html+=row('Education',esc(answers.education||''));
  html+=row('Skills',esc(answers.skills.join(', ')));
  html+=row('Interests',esc(answers.interests.join(', ')));
  html+=row('Target locations',esc(answers.target_locations.join(', ')));
  html+=row('Achievements',answers.achievements.length?answers.achievements.map(function(a){return esc(a);}).join('<br>'):'');
  html+=row('Experience',answers.experience?esc(answers.experience):'None');
  html+='</div>';
  return html;
}

function obSubmit(){
  var btn=document.getElementById('ob-next');if(btn){btn.disabled=true;btn.textContent='Saving…';}
  obEnsureArr('skills');obEnsureArr('interests');obEnsureArr('target_locations');obEnsureArr('achievements');
  fetch('/onboard',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:answers.name||'',stage:answers.stage||'',education:answers.education||'',skills:answers.skills,interests:answers.interests,target_locations:answers.target_locations,achievements:answers.achievements,experience:answers.experience!=null?answers.experience:''})})
    .then(function(r){return r.json().then(function(d){return{status:r.status,body:d};});})
    .then(function(res){
      if(res.status===200&&res.body.ok){document.getElementById('ob-form-overlay').classList.remove('on');showDashboardAfterOnboard();}
      else if(res.status===409&&res.body.error==='already_onboarded'){document.getElementById('ob-form-overlay').classList.remove('on');showStatus('You already have a profile');showDashboard();}
      else if(res.status===400&&res.body.error==='name_required'){showStatus('Please enter your name');currentStep=0;obRenderStep(0);}
      else{showStatus('Something went wrong, please try again');if(btn){btn.disabled=false;btn.textContent='Submit';}}
    }).catch(function(){showStatus('Something went wrong, please try again');if(btn){btn.disabled=false;btn.textContent='Submit';}});
}

/* ── Init ── */
function showDashboard(){
  document.getElementById('content').style.visibility='visible';
  // load initial page (India internships)
  _loadedPages['india']=true;
  loadSection('india','india-list','nb-intern',function(t){
    document.getElementById('tc-india').textContent=String(t);
    updateAllCount();
  });
  loadSources();
  loadQueue();
  // route to hash
  var h=window.location.hash.replace('#','');
  var map={india:'india',global:'global',all:'all',cert:'cert',ngo:'ngo',conf:'conf',cv:'cv',queue:'queue',internships:'india',certificates:'cert',ngos:'ngo',conferences:'conf'};
  if(h&&map[h]){
    var pg=map[h];
    if(pg==='india'||pg==='global'||pg==='all'){showPage('intern',pg);}
    else showPage(pg);
  }
}

function showDashboardAfterOnboard(){
  document.getElementById('content').style.visibility='visible';
  setBtn('btn-rerank',true,'Ranking…');
  fetch('/rank',{method:'POST'}).then(function(){
    setBtn('btn-rerank',false,'Re-rank');
    showStatus('Ranked! Opportunities scored for your profile.');
    showDashboard();
  }).catch(function(){setBtn('btn-rerank',false,'Re-rank');showDashboard();});
}

document.getElementById('content').style.visibility='hidden';

fetch('/me').then(function(r){if(r.status===401)return{authenticated:false};return r.json();})
  .then(function(me){
    if(!me.authenticated){document.getElementById('login-msg').style.display='block';return;}
    var sbUser=document.getElementById('sb-user-email');if(sbUser)sbUser.textContent=me.email||'';
    if(!me.onboarded){document.getElementById('onboarding-overlay').classList.add('on');return;}
    showDashboard();
  }).catch(function(e){console.error('[cv-engine] /me:',e);showDashboard();});
</script>
</body>
</html>`;
}
