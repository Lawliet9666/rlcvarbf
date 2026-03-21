/**
 * RoboMME-style rollout browser for this project page.
 * Update the SUITES config below to swap GIFs, labels, or comparison groupings.
 */
(function () {
  var COMPARE_BASE = './static/videos/compare/';
  var SCENE_BASE = './static/videos/';

  var METHOD_OPTIONS = [
    {
      value: 'rcbf',
      label: 'RCBF (collision cone)',
      src: COMPARE_BASE + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_rcbf_doubleint_v2_gamma0.1_betaNone_hcone.gif',
      note: 'Classical robust CBF baseline on the shared reference scene.'
    },
    {
      value: 'cbf',
      label: 'CBF (collision cone)',
      src: COMPARE_BASE + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cbf_doubleint_v2_gamma0.1_betaNone_hcone.gif',
      note: 'Standard control barrier function baseline on the same setup.'
    },
    {
      value: 'cvar_lo',
      label: 'CVaR (distance) beta = 0.1',
      src: COMPARE_BASE + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cvar_doubleint_v2_gamma0.1_beta0.01_hdist.gif',
      note: 'More conservative fixed-risk CVaR baseline.'
    },
    {
      value: 'cvar_hi',
      label: 'CVaR (distance) beta = 0.99',
      src: COMPARE_BASE + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cvar_doubleint_v2_gamma0.1_beta0.99_hdist.gif',
      note: 'More aggressive fixed-risk CVaR baseline.'
    },
    {
      value: 'orca',
      label: 'ORCA+',
      src: COMPARE_BASE + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_orca_plus_doubleint_v2_gamma0.1_betaNone_hdist.gif',
      note: 'Reciprocal collision avoidance baseline.'
    },
    {
      value: 'crowdnav',
      label: 'CrowdNav (RL)',
      src: COMPARE_BASE + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_trajectory_animation.gif',
      note: 'Learned social-navigation policy without the proposed filter.'
    },
    {
      value: 'crowdnavpp',
      label: 'CrowdNav++ (RL)',
      src: COMPARE_BASE + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_trajectory_animation_crowd++.gif',
      note: 'Improved RL baseline on the same reference rollout.'
    },
    {
      value: 'proposed',
      label: 'Proposed adaptive CVaR-BF',
      src: COMPARE_BASE + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
      note: 'Risk-adaptive CVaR barrier function on the shared reference scene.'
    }
  ];

  var LEARNED_OPTIONS = [
    findMethod('orca'),
    findMethod('crowdnav'),
    findMethod('crowdnavpp'),
    findMethod('proposed')
  ];

  var PROPOSED_SCENES = {
    seed19: {
      label: '2 obstacles, sigma = 0.05',
      src: SCENE_BASE + 'seed19_noise0.05_obs2_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
      note: 'Sparse scene with moderate noise.'
    },
    seed20: {
      label: '4 obstacles, sigma = 0.05',
      src: SCENE_BASE + 'seed20_noise0.05_obs4_umax0.9_besfm_umax0.3_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
      note: 'Mid-density scene with moderate noise.'
    },
    seed4: {
      label: '5 obstacles, sigma = 0.05',
      src: SCENE_BASE + 'seed4_noise0.05_obs5_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
      note: 'Higher crowd density at the same noise level.'
    },
    seed18: {
      label: '6 obstacles, sigma = 0.00',
      src: SCENE_BASE + 'seed18_noise0.0_obs6_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
      note: 'Low-uncertainty rollout used for the noise sweep.'
    },
    seed100: {
      label: '6 obstacles, sigma = 0.025',
      src: SCENE_BASE + 'seed100_noise0.025_obs6_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
      note: 'Reference 6-obstacle scene with moderate noise.'
    },
    seed21: {
      label: '6 obstacles, sigma = 0.075',
      src: SCENE_BASE + 'seed21_noise0.075_obs6_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
      note: 'Same obstacle count with higher stochasticity.'
    },
    seed13: {
      label: '8 obstacles, sigma = 0.025',
      src: SCENE_BASE + 'seed13_noise0.025_obs8_umax0.9_besfm_umax0.3_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
      note: 'Dense reference rollout with moderate noise.'
    },
    seed14: {
      label: '8 obstacles, sigma = 0.05',
      src: SCENE_BASE + 'seed14_noise0.05_obs8_umax0.9_besfm_umax0.9_besfm_cvar_beta_dt_doubleint_v2_gamma0.1_betaNone_hdist_cone.gif',
      note: 'Same dense setup with higher noise.'
    }
  };

  var SUITES = [
    {
      id: 'matched-baselines',
      label: 'Suite 1: Matched baselines',
      title: 'Matched-scene controller comparison',
      overview: 'Compare any two controllers on the same reference rollout.',
      cases: [
        {
          label: 'Reference scene',
          goal: 'Shared seed-13 setup for the classical filters, fixed-risk CVaR baselines, ORCA, RL methods, and the adaptive CVaR-BF controller.',
          columns: [
            {
              kind: 'select',
              heading: 'Controller A',
              options: METHOD_OPTIONS,
              defaultValue: 'rcbf'
            },
            {
              kind: 'select',
              heading: 'Controller B',
              options: METHOD_OPTIONS,
              defaultValue: 'proposed'
            }
          ]
        }
      ]
    },
    {
      id: 'noise-sweep',
      label: 'Suite 2: Noise sweep',
      title: 'Proposed controller under increasing noise',
      overview: 'Keep the controller fixed and inspect how the rollout changes as scene uncertainty rises.',
      cases: [
        {
          label: 'Obs 6: low vs mid',
          goal: 'Hold obstacle count fixed at 6 and compare low noise against moderate noise.',
          columns: [
            fixedColumn('Lower noise', PROPOSED_SCENES.seed18),
            fixedColumn('Moderate noise', PROPOSED_SCENES.seed100)
          ]
        },
        {
          label: 'Obs 6: mid vs high',
          goal: 'Same 6-obstacle setup, now compare moderate noise against the highest-noise rollout.',
          columns: [
            fixedColumn('Moderate noise', PROPOSED_SCENES.seed100),
            fixedColumn('Higher noise', PROPOSED_SCENES.seed21)
          ]
        },
        {
          label: 'Obs 8: mid vs high',
          goal: 'Dense scene comparison under moderate and higher noise using the adaptive controller only.',
          columns: [
            fixedColumn('Moderate noise', PROPOSED_SCENES.seed13),
            fixedColumn('Higher noise', PROPOSED_SCENES.seed14)
          ]
        }
      ]
    },
    {
      id: 'density-sweep',
      label: 'Suite 3: Density sweep',
      title: 'Proposed controller across crowd densities',
      overview: 'Switch cases to inspect how the adaptive controller behaves as the number of nearby obstacles increases.',
      cases: [
        {
          label: '2 vs 4 obstacles',
          goal: 'Moderate-noise comparison from a sparse scene to a mid-density scene.',
          columns: [
            fixedColumn('Sparser scene', PROPOSED_SCENES.seed19),
            fixedColumn('Mid-density scene', PROPOSED_SCENES.seed20)
          ]
        },
        {
          label: '4 vs 5 obstacles',
          goal: 'Small density increase at the same nominal noise level.',
          columns: [
            fixedColumn('4 obstacles', PROPOSED_SCENES.seed20),
            fixedColumn('5 obstacles', PROPOSED_SCENES.seed4)
          ]
        },
        {
          label: '6 vs 8 obstacles',
          goal: 'Moderate-noise comparison between a 6-obstacle rollout and a denser 8-obstacle rollout.',
          columns: [
            fixedColumn('6 obstacles', PROPOSED_SCENES.seed100),
            fixedColumn('8 obstacles', PROPOSED_SCENES.seed13)
          ]
        }
      ]
    },
    {
      id: 'learned-vs-filtered',
      label: 'Suite 4: Learned vs filtered',
      title: 'Learned and social-navigation baselines',
      overview: 'Focus the comparison on ORCA and the RL planners against the adaptive filter.',
      cases: [
        {
          label: 'Reference scene',
          goal: 'Shared reference rollout for ORCA, CrowdNav, CrowdNav++, and the adaptive CVaR-BF controller.',
          columns: [
            {
              kind: 'select',
              heading: 'Baseline policy',
              options: LEARNED_OPTIONS,
              defaultValue: 'crowdnavpp'
            },
            {
              kind: 'select',
              heading: 'Filtered / comparison policy',
              options: LEARNED_OPTIONS,
              defaultValue: 'proposed'
            }
          ]
        }
      ]
    }
  ];

  function findMethod(value) {
    for (var i = 0; i < METHOD_OPTIONS.length; i++) {
      if (METHOD_OPTIONS[i].value === value) {
        return METHOD_OPTIONS[i];
      }
    }
    return null;
  }

  function fixedColumn(heading, asset) {
    return {
      kind: 'fixed',
      heading: heading,
      asset: asset
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderApp(root) {
    if (!root) return;

    root.innerHTML =
      '<div class="tabs-container sim-suite-tabs-wrap">' +
        '<div class="sim-suite-tabs" role="tablist">' +
          renderSuiteTabs() +
        '</div>' +
      '</div>' +
      '<div class="sim-suite-panels">' +
        renderSuitePanels() +
      '</div>';

    wireSuiteTabs(root);
    wireAllPanels(root);
  }

  function renderSuiteTabs() {
    return SUITES.map(function (suite, index) {
      return '' +
        '<button type="button" class="sim-suite-tab' + (index === 0 ? ' active' : '') + '"' +
        ' data-suite-id="' + escapeHtml(suite.id) + '"' +
        ' role="tab" aria-selected="' + (index === 0 ? 'true' : 'false') + '">' +
          escapeHtml(suite.label) +
        '</button>';
    }).join('');
  }

  function renderSuitePanels() {
    return SUITES.map(function (suite, index) {
      return '' +
        '<div class="sim-suite-panel' + (index === 0 ? ' active' : '') + '" data-suite-panel="' + escapeHtml(suite.id) + '"></div>';
    }).join('');
  }

  function wireSuiteTabs(root) {
    var tabs = root.querySelectorAll('.sim-suite-tab');
    var panels = root.querySelectorAll('.sim-suite-panel');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var suiteId = tab.getAttribute('data-suite-id');
        tabs.forEach(function (item) {
          var isActive = item === tab;
          item.classList.toggle('active', isActive);
          item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        panels.forEach(function (panel) {
          panel.classList.toggle('active', panel.getAttribute('data-suite-panel') === suiteId);
        });
      });
    });
  }

  function wireAllPanels(root) {
    SUITES.forEach(function (suite) {
      suite.activeCaseIndex = 0;
      var panel = root.querySelector('[data-suite-panel="' + suite.id + '"]');
      if (panel) {
        renderSuitePanel(panel, suite);
      }
    });
  }

  function renderSuitePanel(panel, suite) {
    var currentCase = suite.cases[suite.activeCaseIndex] || suite.cases[0];
    panel.innerHTML =
      '<div class="sim-rollout-card">' +
        '<div class="sim-task-header">' +
          '<div class="sim-task-copy">' +
            '<span class="demo-task-name">' + escapeHtml(suite.title) + '</span>' +
            '<p class="sim-suite-overview">' + escapeHtml(suite.overview) + '</p>' +
            '<p class="demo-task-goal"><strong>Rollout setup:</strong> ' + escapeHtml(currentCase.goal) + '</p>' +
          '</div>' +
          renderCaseTabs(suite) +
        '</div>' +
        '<div class="sim-compare-row">' +
          renderColumns(currentCase.columns) +
        '</div>' +
      '</div>';

    wireCaseTabs(panel, suite);
    wireColumnSelects(panel, currentCase);
  }

  function renderCaseTabs(suite) {
    if (!suite.cases || suite.cases.length <= 1) {
      return '<div class="sim-episode-block sim-episode-block-static"><span class="sim-chip-label">Scene</span><span class="sim-static-pill">' + escapeHtml(suite.cases[0].label) + '</span></div>';
    }

    var buttons = suite.cases.map(function (entry, index) {
      return '' +
        '<button type="button" class="sim-episode-tab' + (index === suite.activeCaseIndex ? ' active' : '') + '"' +
        ' data-case-index="' + index + '">' +
          escapeHtml(entry.label) +
        '</button>';
    }).join('');

    return '' +
      '<div class="sim-episode-block">' +
        '<span class="sim-chip-label">Scenes</span>' +
        '<div class="sim-episode-tabs">' + buttons + '</div>' +
      '</div>';
  }

  function renderColumns(columns) {
    return columns.map(function (column, index) {
      if (column.kind === 'select') {
        return renderSelectColumn(column, index);
      }
      return renderFixedColumn(column);
    }).join('');
  }

  function renderSelectColumn(column, index) {
    var selected = getSelectedOption(column);
    var selectOptions = column.options.map(function (option) {
      return '' +
        '<option value="' + escapeHtml(option.value) + '"' +
        (option.value === selected.value ? ' selected' : '') +
        '>' + escapeHtml(option.label) + '</option>';
    }).join('');

    return '' +
      '<article class="sim-compare-col" data-column-index="' + index + '">' +
        '<div class="sim-card-head">' +
          '<span class="sim-card-label">' + escapeHtml(column.heading) + '</span>' +
          '<select class="sim-select sim-model-select" aria-label="' + escapeHtml(column.heading) + '">' +
            selectOptions +
          '</select>' +
        '</div>' +
        '<img class="sim-demo-img" src="' + escapeHtml(selected.src) + '" alt="' + escapeHtml(selected.label) + '" loading="lazy">' +
        '<p class="sim-card-note">' + escapeHtml(selected.note || '') + '</p>' +
      '</article>';
  }

  function renderFixedColumn(column) {
    return '' +
      '<article class="sim-compare-col sim-compare-col-fixed">' +
        '<div class="sim-card-head">' +
          '<span class="sim-card-label">' + escapeHtml(column.heading) + '</span>' +
          '<span class="sim-static-pill">' + escapeHtml(column.asset.label) + '</span>' +
        '</div>' +
        '<img class="sim-demo-img" src="' + escapeHtml(column.asset.src) + '" alt="' + escapeHtml(column.asset.label) + '" loading="lazy">' +
        '<p class="sim-card-note">' + escapeHtml(column.asset.note || '') + '</p>' +
      '</article>';
  }

  function getSelectedOption(column) {
    var fallback = column.options[0];
    for (var i = 0; i < column.options.length; i++) {
      if (column.options[i].value === column.defaultValue) {
        return column.options[i];
      }
    }
    return fallback;
  }

  function wireCaseTabs(panel, suite) {
    var buttons = panel.querySelectorAll('.sim-episode-tab');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        suite.activeCaseIndex = parseInt(button.getAttribute('data-case-index'), 10) || 0;
        renderSuitePanel(panel, suite);
      });
    });
  }

  function wireColumnSelects(panel, currentCase) {
    var columns = panel.querySelectorAll('[data-column-index]');
    columns.forEach(function (columnEl) {
      var columnIndex = parseInt(columnEl.getAttribute('data-column-index'), 10) || 0;
      var column = currentCase.columns[columnIndex];
      if (!column || column.kind !== 'select') return;

      var select = columnEl.querySelector('.sim-model-select');
      var image = columnEl.querySelector('.sim-demo-img');
      var note = columnEl.querySelector('.sim-card-note');

      function applySelection(value) {
        var selected = column.options[0];
        for (var i = 0; i < column.options.length; i++) {
          if (column.options[i].value === value) {
            selected = column.options[i];
            break;
          }
        }
        column.defaultValue = selected.value;
        image.src = selected.src;
        image.alt = selected.label;
        note.textContent = selected.note || '';
      }

      select.addEventListener('change', function () {
        applySelection(select.value);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderApp(document.getElementById('simRolloutApp'));
  });
})();
