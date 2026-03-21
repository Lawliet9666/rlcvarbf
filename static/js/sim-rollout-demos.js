/**
 * RoboMME-style simulation rollout tabs + model/episode switching.
 * Edit METHODS_* and EPISODE_PRESETS to point at your own rollouts.
 */
(function () {
  var C = './static/videos/compare/';
  var V = './static/videos/';

  var METHODS_SEED13 = {
    rcbf: C + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_rcbf_doubleint_v2_gamma0.1_betaNone_hcone.gif',
    cbf: C + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cbf_doubleint_v2_gamma0.1_betaNone_hcone.gif',
    cvar_lo: C + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cvar_doubleint_v2_gamma0.1_beta0.01_hdist.gif',
    cvar_hi: C + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cvar_doubleint_v2_gamma0.1_beta0.99_hdist.gif',
    orca: C + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_orca_plus_doubleint_v2_gamma0.1_betaNone_hdist.gif',
    crowdnav: C + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_trajectory_animation.gif',
    crowdnavpp: C + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_trajectory_animation_crowd++.gif',
    proposed: C + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif'
  };

  var PROPOSED_ONLY = {
    seed13: V + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
    seed14: V + 'seed14_noise0.05_obs8_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
    seed18: V + 'seed18_noise0.0_obs6_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
    seed100: V + 'seed100_noise0.025_obs6_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
    seed20: V + 'seed20_noise0.05_obs4_umax0.9_besfm_umax0.3_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
    seed21: V + 'seed21_noise0.075_obs6_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif'
  };

  function fillSelect(select, options, selected) {
    select.innerHTML = '';
    options.forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      select.appendChild(o);
    });
    if (selected) select.value = selected;
  }

  function setImg(col, src) {
    var img = col.querySelector('.sim-demo-img');
    if (img) {
      img.src = src;
      img.alt = col.querySelector('.sim-model-select option:checked') ?
        col.querySelector('.sim-model-select option:checked').textContent : '';
    }
  }

  function wireSuiteFullMethod(panel, methodMap, defaults) {
    var cols = panel.querySelectorAll('[data-sim-column]');
    cols.forEach(function (col, idx) {
      var sel = col.querySelector('.sim-model-select');
      if (!sel) return;
      var keys = Object.keys(methodMap);
      var labels = {
        rcbf: 'RCBF (collision cone)',
        cbf: 'CBF (collision cone)',
        cvar_lo: 'CVaR (distance) β = 0.1',
        cvar_hi: 'CVaR (distance) β = 0.99',
        orca: 'ORCA+',
        crowdnav: 'CrowdNav (RL)',
        crowdnavpp: 'CrowdNav++ (RL)',
        proposed: 'Proposed (CVaR-BF)'
      };
      fillSelect(sel, keys.map(function (k) {
        return { value: k, label: labels[k] || k };
      }), defaults[idx] || keys[0]);
      sel.addEventListener('change', function () {
        setImg(col, methodMap[sel.value] || methodMap[keys[0]]);
      });
      setImg(col, methodMap[sel.value] || methodMap[keys[0]]);
    });
  }

  function wireSuiteProposedPicker(panel, defaults) {
    var cols = panel.querySelectorAll('[data-sim-column]');
    var keys = Object.keys(PROPOSED_ONLY);
    var labels = {
      seed13: '20 obs, σ=0.025 (seed 13)',
      seed14: '20 obs, σ=0.05 (seed 14)',
      seed18: '15 obs, σ=0 (seed 18)',
      seed100: '15 obs, σ=0.025 (seed 100)',
      seed20: '10 obs, σ=0.05 (seed 20)',
      seed21: '15 obs, σ=0.075 (seed 21)'
    };
    cols.forEach(function (col, idx) {
      var sel = col.querySelector('.sim-model-select');
      if (!sel) return;
      fillSelect(sel, keys.map(function (k) {
        return { value: k, label: labels[k] || k };
      }), defaults[idx] || keys[0]);
      sel.addEventListener('change', function () {
        setImg(col, PROPOSED_ONLY[sel.value]);
      });
      setImg(col, PROPOSED_ONLY[sel.value]);
    });
  }

  function wireSuiteScenarioPairs(panel) {
    var pairs = [
      { left: 'seed13', right: 'seed14', goal: 'Compare σ=0.025 vs σ=0.05 (proposed).' },
      { left: 'seed18', right: 'seed13', goal: 'Compare lower obstacle count vs 20-obstacle hall (proposed).' },
      { left: 'seed100', right: 'seed21', goal: 'Compare scenario densities (proposed).' }
    ];
    var ep = panel.querySelector('[data-sim-episode]');
    var goalEl = panel.querySelector('[data-sim-task-goal]');
    function applyEp(i) {
      var p = pairs[i] || pairs[0];
      if (goalEl) goalEl.textContent = p.goal;
      var cols = panel.querySelectorAll('[data-sim-column]');
      if (cols[0]) setImg(cols[0], PROPOSED_ONLY[p.left]);
      if (cols[1]) setImg(cols[1], PROPOSED_ONLY[p.right]);
      [].forEach.call(cols, function (col) {
        var sel = col.querySelector('.sim-model-select');
        if (sel) sel.style.display = 'none';
      });
    }
    if (ep) {
      ep.addEventListener('change', function () {
        applyEp(parseInt(ep.value, 10) || 0);
      });
      applyEp(0);
    }
  }

  function wireSuiteRlCompare(panel) {
    var map = {
      orca: METHODS_SEED13.orca,
      crowdnav: METHODS_SEED13.crowdnav,
      crowdnavpp: METHODS_SEED13.crowdnavpp,
      proposed: METHODS_SEED13.proposed
    };
    var cols = panel.querySelectorAll('[data-sim-column]');
    var opts = [
      { value: 'orca', label: 'ORCA+' },
      { value: 'crowdnav', label: 'CrowdNav (RL)' },
      { value: 'crowdnavpp', label: 'CrowdNav++ (RL)' },
      { value: 'proposed', label: 'Proposed (CVaR-BF)' }
    ];
    cols.forEach(function (col, idx) {
      var sel = col.querySelector('.sim-model-select');
      if (!sel) return;
      fillSelect(sel, opts, idx === 0 ? 'crowdnavpp' : 'proposed');
      sel.addEventListener('change', function () {
        setImg(col, map[sel.value]);
      });
      setImg(col, map[sel.value]);
    });
  }

  function initTabs(root) {
    var tabs = root.querySelectorAll('[data-sim-suite-tab]');
    var panels = root.querySelectorAll('[data-sim-suite-panel]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-sim-suite-tab');
        tabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
        panels.forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-sim-suite-panel') === id);
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('sec-sim-rollouts');
    if (!root) return;
    initTabs(root);

    var p1 = root.querySelector('[data-sim-suite-panel="suite1"]');
    if (p1) wireSuiteFullMethod(p1, METHODS_SEED13, ['rcbf', 'proposed']);

    var p2 = root.querySelector('[data-sim-suite-panel="suite2"]');
    if (p2) wireSuiteScenarioPairs(p2);

    var p3 = root.querySelector('[data-sim-suite-panel="suite3"]');
    if (p3) wireSuiteProposedPicker(p3, ['seed13', 'seed100']);

    var p4 = root.querySelector('[data-sim-suite-panel="suite4"]');
    if (p4) wireSuiteRlCompare(p4);
  });
})();
