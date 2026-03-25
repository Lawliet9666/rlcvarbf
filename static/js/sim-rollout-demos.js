/**
 * RoboMME-style rollout browser for this project page.
 * Update the SUITES config below to swap GIFs, labels, or comparison groupings.
 */
(function () {
  var COMPARE_BASE = './static/videos/compare/';
  var SCENE_BASE = './static/videos/';
  var SINGLE_INTEGRATOR_ID_SEED106_BASE = './static/videos/single_integrator_obs_20/eval_seeds_100_1000_n901/seed_106/';
  var UNICYCLE_ID_SEED176_BASE = './static/videos/unicycle_obs_20/eval_seeds_100_1000_n901/seed_176/';
  var SINGLE_INTEGRATOR_OOD_ORCA_SEED226_BASE = './static/videos/si_human_orca/single_integrator_obs_20/eval_seeds_100_1000_n901/seed_226/';
  var SINGLE_INTEGRATOR_OOD_DENSITY_SEED135_BASE = './static/videos/si_obs_30/single_integrator_obs_30/eval_seeds_100_1000_n901/seed_135/';
  var UNICYCLE_OOD_ORCA_SEED126_BASE = './static/videos/uni_human_orca/unicycle_obs_20/eval_seeds_100_1000_n901/seed_126/';
  var UNICYCLE_OOD_RADIUS_SEED168_BASE = './static/videos/uni_human_radius_0p5/unicycle_obs_20/eval_seeds_100_1000_n901/seed_168/';

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

  var SINGLE_INTEGRATOR_ID_OPTIONS = [
    {
      value: 'orca',
      label: 'ORCA',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'orca_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for ORCA on the single-integrator robot.'
    },
    {
      value: 'cbfqp',
      label: 'CBF-QP',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'cbfqp_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the CBF-QP controller.'
    },
    {
      value: 'cvarqp',
      label: 'CVaR-BF-QP',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'cvarqp_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the fixed-risk CVaR-BF-QP baseline.'
    },
    {
      value: 'adapcvarqp',
      label: 'Adaptive-CVaR-BF',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'adapcvarqp_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the adaptive optimization-only baseline.'
    },
    {
      value: 'rl',
      label: 'Vanilla RL',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'rl_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the vanilla RL policy.'
    },
    {
      value: 'Crowdnav_const_vel',
      label: 'CrowdNav++ const vel',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'Crowdnav_const_vel_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the CrowdNav++ const-velocity prior.'
    },
    {
      value: 'Crowdnav_inferred',
      label: 'CrowdNav++ inferred',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'Crowdnav_inferred_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the inferred CrowdNav++ prior.'
    },
    {
      value: 'rl_sf',
      label: 'Vanilla RL + Safety Filter',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'rl_sf_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for vanilla RL with the safety filter.'
    },
    {
      value: 'Crowdnav_const_vel_sf',
      label: 'CrowdNav++ const vel + Safety Filter',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'Crowdnav_const_vel_sf_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the CrowdNav++ const-velocity prior with the safety filter.'
    },
    {
      value: 'Crowdnav_inferred_sf',
      label: 'CrowdNav++ inferred + Safety Filter',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'Crowdnav_inferred_sf_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the inferred CrowdNav++ prior with the safety filter.'
    },
    {
      value: 'rlcbfgamma',
      label: 'BarrierNet',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'rlcbfgamma_seed_106_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the BarrierNet baseline.'
    },
    {
      value: 'rlcvarbetaradius',
      label: 'Proposed adaptive CVaR-BF',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'rlcvarbetaradius_seed_106_succ_1_coll_0.gif',
      note: 'In-distribution rollout for the proposed adaptive CVaR-BF method.'
    }
  ];

  var UNICYCLE_ID_OPTIONS = [
    {
      value: 'orca',
      label: 'ORCA',
      src: UNICYCLE_ID_SEED176_BASE + 'orca_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for ORCA on the unicycle robot.'
    },
    {
      value: 'cbfqp',
      label: 'CBF-QP',
      src: UNICYCLE_ID_SEED176_BASE + 'cbfqp_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the CBF-QP controller.'
    },
    {
      value: 'cvarqp',
      label: 'CVaR-BF-QP',
      src: UNICYCLE_ID_SEED176_BASE + 'cvarqp_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the fixed-risk CVaR-BF-QP baseline.'
    },
    {
      value: 'adapcvarqp',
      label: 'Adaptive-CVaR-BF',
      src: UNICYCLE_ID_SEED176_BASE + 'adapcvarqp_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the adaptive optimization-only baseline.'
    },
    {
      value: 'rl',
      label: 'Vanilla RL',
      src: UNICYCLE_ID_SEED176_BASE + 'rl_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the vanilla RL policy.'
    },
    {
      value: 'Crowdnav_const_vel',
      label: 'CrowdNav++ const vel',
      src: UNICYCLE_ID_SEED176_BASE + 'Crowdnav_const_vel_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the CrowdNav++ const-velocity prior.'
    },
    {
      value: 'Crowdnav_inferred',
      label: 'CrowdNav++ inferred',
      src: UNICYCLE_ID_SEED176_BASE + 'Crowdnav_inferred_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the inferred CrowdNav++ prior.'
    },
    {
      value: 'rl_sf',
      label: 'Vanilla RL + Safety Filter',
      src: UNICYCLE_ID_SEED176_BASE + 'rl_sf_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for vanilla RL with the safety filter.'
    },
    {
      value: 'Crowdnav_const_vel_sf',
      label: 'CrowdNav++ const vel + Safety Filter',
      src: UNICYCLE_ID_SEED176_BASE + 'Crowdnav_const_vel_sf_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the CrowdNav++ const-velocity prior with the safety filter.'
    },
    {
      value: 'Crowdnav_inferred_sf',
      label: 'CrowdNav++ inferred + Safety Filter',
      src: UNICYCLE_ID_SEED176_BASE + 'Crowdnav_inferred_sf_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the inferred CrowdNav++ prior with the safety filter.'
    },
    {
      value: 'rlcbfgamma',
      label: 'BarrierNet',
      src: UNICYCLE_ID_SEED176_BASE + 'rlcbfgamma_seed_176_succ_0_coll_1.gif',
      note: 'In-distribution rollout for the BarrierNet baseline.'
    },
    {
      value: 'rlcvarbetaradius',
      label: 'Proposed adaptive CVaR-BF',
      src: UNICYCLE_ID_SEED176_BASE + 'rlcvarbetaradius_seed_176_succ_1_coll_0.gif',
      note: 'In-distribution rollout for the proposed adaptive CVaR-BF method.'
    }
  ];

  var SINGLE_INTEGRATOR_OOD_PLACEHOLDER_OPTIONS = [
    {
      value: 'orca',
      label: 'ORCA',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'orca_seed_106_succ_0_coll_1.gif',
      note: 'Current local single-integrator rollout used as a placeholder while dedicated OOD exports are not checked into this repo yet.'
    },
    {
      value: 'cbfqp',
      label: 'CBF-QP',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'cbfqp_seed_106_succ_0_coll_1.gif',
      note: 'Current local single-integrator rollout used as a placeholder while dedicated OOD exports are not checked into this repo yet.'
    },
    {
      value: 'cvarqp',
      label: 'CVaR-BF-QP',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'cvarqp_seed_106_succ_0_coll_1.gif',
      note: 'Current local single-integrator rollout used as a placeholder while dedicated OOD exports are not checked into this repo yet.'
    },
    {
      value: 'adapcvarqp',
      label: 'Adaptive-CVaR-BF',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'adapcvarqp_seed_106_succ_0_coll_1.gif',
      note: 'Current local single-integrator rollout used as a placeholder while dedicated OOD exports are not checked into this repo yet.'
    },
    {
      value: 'rl',
      label: 'Vanilla RL',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'rl_seed_106_succ_0_coll_1.gif',
      note: 'Current local single-integrator rollout used as a placeholder while dedicated OOD exports are not checked into this repo yet.'
    },
    {
      value: 'rl_sf',
      label: 'Vanilla RL + Safety Filter',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'rl_sf_seed_106_succ_0_coll_1.gif',
      note: 'Current local single-integrator rollout used as a placeholder while dedicated OOD exports are not checked into this repo yet.'
    },
    {
      value: 'rlcbfgamma',
      label: 'BarrierNet',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'rlcbfgamma_seed_106_succ_0_coll_1.gif',
      note: 'Current local single-integrator rollout used as a placeholder while dedicated OOD exports are not checked into this repo yet.'
    },
    {
      value: 'rlcvarbetaradius',
      label: 'Proposed adaptive CVaR-BF',
      src: SINGLE_INTEGRATOR_ID_SEED106_BASE + 'rlcvarbetaradius_seed_106_succ_1_coll_0.gif',
      note: 'Current local single-integrator rollout used as a placeholder while dedicated OOD exports are not checked into this repo yet.'
    }
  ];

  var SINGLE_INTEGRATOR_OOD_ORCA_OPTIONS = [
    {
      value: 'orca',
      label: 'ORCA',
      src: SINGLE_INTEGRATOR_OOD_ORCA_SEED226_BASE + 'orca_seed_226_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'cbfqp',
      label: 'CBF-QP',
      src: SINGLE_INTEGRATOR_OOD_ORCA_SEED226_BASE + 'cbfqp_seed_226_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'cvarqp',
      label: 'CVaR-BF-QP',
      src: SINGLE_INTEGRATOR_OOD_ORCA_SEED226_BASE + 'cvarqp_seed_226_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'adapcvarqp',
      label: 'Adaptive-CVaR-BF',
      src: SINGLE_INTEGRATOR_OOD_ORCA_SEED226_BASE + 'adapcvarqp_seed_226_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'rl',
      label: 'Vanilla RL',
      src: SINGLE_INTEGRATOR_OOD_ORCA_SEED226_BASE + 'rl_seed_226_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'rl_sf',
      label: 'Vanilla RL + Safety Filter',
      src: SINGLE_INTEGRATOR_OOD_ORCA_SEED226_BASE + 'rl_sf_seed_226_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'rlcbfgamma',
      label: 'BarrierNet',
      src: SINGLE_INTEGRATOR_OOD_ORCA_SEED226_BASE + 'rlcbfgamma_seed_226_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'rlcvarbetaradius',
      label: 'Proposed adaptive CVaR-BF',
      src: SINGLE_INTEGRATOR_OOD_ORCA_SEED226_BASE + 'rlcvarbetaradius_seed_226_succ_1_coll_0.gif',
      note: 'Rollout from the single-integrator ORCA-obstacle-policy OOD export.'
    }
  ];

  var SINGLE_INTEGRATOR_OOD_DENSITY_OPTIONS = [
    {
      value: 'orca',
      label: 'ORCA',
      src: SINGLE_INTEGRATOR_OOD_DENSITY_SEED135_BASE + 'orca_seed_135_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator 30-obstacle OOD export.'
    },
    {
      value: 'cbfqp',
      label: 'CBF-QP',
      src: SINGLE_INTEGRATOR_OOD_DENSITY_SEED135_BASE + 'cbfqp_seed_135_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator 30-obstacle OOD export.'
    },
    {
      value: 'cvarqp',
      label: 'CVaR-BF-QP',
      src: SINGLE_INTEGRATOR_OOD_DENSITY_SEED135_BASE + 'cvarqp_seed_135_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator 30-obstacle OOD export.'
    },
    {
      value: 'adapcvarqp',
      label: 'Adaptive-CVaR-BF',
      src: SINGLE_INTEGRATOR_OOD_DENSITY_SEED135_BASE + 'adapcvarqp_seed_135_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator 30-obstacle OOD export.'
    },
    {
      value: 'rl',
      label: 'Vanilla RL',
      src: SINGLE_INTEGRATOR_OOD_DENSITY_SEED135_BASE + 'rl_seed_135_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator 30-obstacle OOD export.'
    },
    {
      value: 'rl_sf',
      label: 'Vanilla RL + Safety Filter',
      src: SINGLE_INTEGRATOR_OOD_DENSITY_SEED135_BASE + 'rl_sf_seed_135_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator 30-obstacle OOD export.'
    },
    {
      value: 'rlcbfgamma',
      label: 'BarrierNet',
      src: SINGLE_INTEGRATOR_OOD_DENSITY_SEED135_BASE + 'rlcbfgamma_seed_135_succ_0_coll_1.gif',
      note: 'Rollout from the single-integrator 30-obstacle OOD export.'
    },
    {
      value: 'rlcvarbetaradius',
      label: 'Proposed adaptive CVaR-BF',
      src: SINGLE_INTEGRATOR_OOD_DENSITY_SEED135_BASE + 'rlcvarbetaradius_seed_135_succ_1_coll_0.gif',
      note: 'Rollout from the single-integrator 30-obstacle OOD export.'
    }
  ];

  var UNICYCLE_OOD_ORCA_OPTIONS = [
    {
      value: 'orca',
      label: 'ORCA',
      src: UNICYCLE_OOD_ORCA_SEED126_BASE + 'orca_seed_126_succ_0_coll_1.gif',
      note: 'Rollout from the ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'cbfqp',
      label: 'CBF-QP',
      src: UNICYCLE_OOD_ORCA_SEED126_BASE + 'cbfqp_seed_126_succ_0_coll_1.gif',
      note: 'Rollout from the ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'cvarqp',
      label: 'CVaR-BF-QP',
      src: UNICYCLE_OOD_ORCA_SEED126_BASE + 'cvarqp_seed_126_succ_0_coll_1.gif',
      note: 'Rollout from the ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'adapcvarqp',
      label: 'Adaptive-CVaR-BF',
      src: UNICYCLE_OOD_ORCA_SEED126_BASE + 'adapcvarqp_seed_126_succ_0_coll_1.gif',
      note: 'Rollout from the ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'rl',
      label: 'Vanilla RL',
      src: UNICYCLE_OOD_ORCA_SEED126_BASE + 'rl_seed_126_succ_0_coll_1.gif',
      note: 'Rollout from the ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'rl_sf',
      label: 'Vanilla RL + Safety Filter',
      src: UNICYCLE_OOD_ORCA_SEED126_BASE + 'rl_sf_seed_126_succ_0_coll_1.gif',
      note: 'Rollout from the ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'rlcbfgamma',
      label: 'BarrierNet',
      src: UNICYCLE_OOD_ORCA_SEED126_BASE + 'rlcbfgamma_seed_126_succ_0_coll_1.gif',
      note: 'Rollout from the ORCA-obstacle-policy OOD export.'
    },
    {
      value: 'rlcvarbetaradius',
      label: 'Proposed adaptive CVaR-BF',
      src: UNICYCLE_OOD_ORCA_SEED126_BASE + 'rlcvarbetaradius_seed_126_succ_1_coll_0.gif',
      note: 'Rollout from the ORCA-obstacle-policy OOD export.'
    }
  ];

  var UNICYCLE_OOD_DENSITY_OPTIONS = [
    {
      value: 'orca',
      label: 'ORCA',
      src: UNICYCLE_ID_SEED176_BASE + 'orca_seed_176_succ_0_coll_1.gif',
      note: 'Current local unicycle rollout used as the higher-density placeholder because a dedicated 30-obstacle export is not checked into this repo yet.'
    },
    {
      value: 'cbfqp',
      label: 'CBF-QP',
      src: UNICYCLE_ID_SEED176_BASE + 'cbfqp_seed_176_succ_0_coll_1.gif',
      note: 'Current local unicycle rollout used as the higher-density placeholder because a dedicated 30-obstacle export is not checked into this repo yet.'
    },
    {
      value: 'cvarqp',
      label: 'CVaR-BF-QP',
      src: UNICYCLE_ID_SEED176_BASE + 'cvarqp_seed_176_succ_0_coll_1.gif',
      note: 'Current local unicycle rollout used as the higher-density placeholder because a dedicated 30-obstacle export is not checked into this repo yet.'
    },
    {
      value: 'adapcvarqp',
      label: 'Adaptive-CVaR-BF',
      src: UNICYCLE_ID_SEED176_BASE + 'adapcvarqp_seed_176_succ_0_coll_1.gif',
      note: 'Current local unicycle rollout used as the higher-density placeholder because a dedicated 30-obstacle export is not checked into this repo yet.'
    },
    {
      value: 'rl',
      label: 'Vanilla RL',
      src: UNICYCLE_ID_SEED176_BASE + 'rl_seed_176_succ_0_coll_1.gif',
      note: 'Current local unicycle rollout used as the higher-density placeholder because a dedicated 30-obstacle export is not checked into this repo yet.'
    },
    {
      value: 'rl_sf',
      label: 'Vanilla RL + Safety Filter',
      src: UNICYCLE_ID_SEED176_BASE + 'rl_sf_seed_176_succ_0_coll_1.gif',
      note: 'Current local unicycle rollout used as the higher-density placeholder because a dedicated 30-obstacle export is not checked into this repo yet.'
    },
    {
      value: 'rlcbfgamma',
      label: 'BarrierNet',
      src: UNICYCLE_ID_SEED176_BASE + 'rlcbfgamma_seed_176_succ_0_coll_1.gif',
      note: 'Current local unicycle rollout used as the higher-density placeholder because a dedicated 30-obstacle export is not checked into this repo yet.'
    },
    {
      value: 'rlcvarbetaradius',
      label: 'Proposed adaptive CVaR-BF',
      src: UNICYCLE_ID_SEED176_BASE + 'rlcvarbetaradius_seed_176_succ_1_coll_0.gif',
      note: 'Current local unicycle rollout used as the higher-density placeholder because a dedicated 30-obstacle export is not checked into this repo yet.'
    }
  ];

  var UNICYCLE_OOD_RADIUS_OPTIONS = [
    {
      value: 'orca',
      label: 'ORCA',
      src: UNICYCLE_OOD_RADIUS_SEED168_BASE + 'orca_seed_168_succ_0_coll_1.gif',
      note: 'Rollout from the increased-obstacle-radius OOD export.'
    },
    {
      value: 'cbfqp',
      label: 'CBF-QP',
      src: UNICYCLE_OOD_RADIUS_SEED168_BASE + 'cbfqp_seed_168_succ_0_coll_1.gif',
      note: 'Rollout from the increased-obstacle-radius OOD export.'
    },
    {
      value: 'cvarqp',
      label: 'CVaR-BF-QP',
      src: UNICYCLE_OOD_RADIUS_SEED168_BASE + 'cvarqp_seed_168_succ_0_coll_1.gif',
      note: 'Rollout from the increased-obstacle-radius OOD export.'
    },
    {
      value: 'adapcvarqp',
      label: 'Adaptive-CVaR-BF',
      src: UNICYCLE_OOD_RADIUS_SEED168_BASE + 'adapcvarqp_seed_168_succ_0_coll_1.gif',
      note: 'Rollout from the increased-obstacle-radius OOD export.'
    },
    {
      value: 'rl',
      label: 'Vanilla RL',
      src: UNICYCLE_OOD_RADIUS_SEED168_BASE + 'rl_seed_168_succ_0_coll_1.gif',
      note: 'Rollout from the increased-obstacle-radius OOD export.'
    },
    {
      value: 'rl_sf',
      label: 'Vanilla RL + Safety Filter',
      src: UNICYCLE_OOD_RADIUS_SEED168_BASE + 'rl_sf_seed_168_succ_0_coll_1.gif',
      note: 'Rollout from the increased-obstacle-radius OOD export.'
    },
    {
      value: 'rlcbfgamma',
      label: 'BarrierNet',
      src: UNICYCLE_OOD_RADIUS_SEED168_BASE + 'rlcbfgamma_seed_168_succ_0_coll_1.gif',
      note: 'Rollout from the increased-obstacle-radius OOD export.'
    },
    {
      value: 'rlcvarbetaradius',
      label: 'Proposed adaptive CVaR-BF',
      src: UNICYCLE_OOD_RADIUS_SEED168_BASE + 'rlcvarbetaradius_seed_168_succ_1_coll_0.gif',
      note: 'Rollout from the increased-obstacle-radius OOD export.'
    }
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

  function buildSuites(robotLabel, robotPhrase, robotId) {
    var isUnicycle = robotId === 'unicycle';
    var orcaCaseOptions = isUnicycle ? UNICYCLE_OOD_ORCA_OPTIONS : SINGLE_INTEGRATOR_OOD_ORCA_OPTIONS;
    var densityCaseOptions = isUnicycle ? UNICYCLE_OOD_DENSITY_OPTIONS : SINGLE_INTEGRATOR_OOD_DENSITY_OPTIONS;
    var radiusCaseOptions = isUnicycle ? UNICYCLE_OOD_RADIUS_OPTIONS : SINGLE_INTEGRATOR_OOD_PLACEHOLDER_OPTIONS;

    return [
      {
        id: 'case-orca-policy',
        label: 'Case I: ORCA-based obstacle policy',
        title: robotLabel + ' OOD generalization',
        overview: 'Out-of-distribution generalization performance of the ' + robotPhrase + ' under ORCA-based obstacle policy.',
        cases: [
          {
            label: 'Episode 1',
            goal: isUnicycle
              ? 'Compare all methods available in the local unicycle ORCA-obstacle-policy OOD export, shown here as Episode 1.'
              : 'Compare all methods available in the local single-integrator ORCA-obstacle-policy OOD export, shown here as Episode 1.',
            columns: [
              {
                kind: 'select',
                heading: 'Method A',
                options: orcaCaseOptions,
                defaultValue: 'orca'
              },
              {
                kind: 'select',
                heading: 'Method B',
                options: orcaCaseOptions,
                defaultValue: 'rlcvarbetaradius'
              }
            ]
          }
        ]
      },
      {
        id: 'case-high-density',
        label: 'Case II: High obstacle density (30 obstacles)',
        title: robotLabel + ' OOD generalization',
        overview: 'Out-of-distribution generalization performance of the ' + robotPhrase + ' under higher obstacle density.',
        cases: [
          {
            label: isUnicycle ? 'Case II' : 'Episode 1',
            goal: isUnicycle
              ? 'Compare available local methods on the current higher-density placeholder rollout while the dedicated 30-obstacle export is being prepared.'
              : 'Compare all methods available in the local single-integrator 30-obstacle OOD export, shown here as Episode 1.',
            columns: [
              {
                kind: 'select',
                heading: 'Method A',
                options: densityCaseOptions,
                defaultValue: 'rl'
              },
              {
                kind: 'select',
                heading: 'Method B',
                options: densityCaseOptions,
                defaultValue: 'rlcvarbetaradius'
              }
            ]
          }
        ]
      },
      {
        id: 'case-increased-radius',
        label: 'Case III: Increased obstacle radius (0.5 m)',
        title: robotLabel + ' OOD generalization',
        overview: 'Out-of-distribution generalization performance of the ' + robotPhrase + ' under increased obstacle radius.',
        cases: [
          {
            label: isUnicycle ? 'Episode 1' : 'Case III',
            goal: isUnicycle
              ? 'Compare all methods available in the local unicycle increased-obstacle-radius OOD export, shown here as Episode 1.'
              : 'Compare available local methods for the increased-obstacle-radius shift.',
            columns: [
              {
                kind: 'select',
                heading: 'Method A',
                options: radiusCaseOptions,
                defaultValue: 'cvarqp'
              },
              {
                kind: 'select',
                heading: 'Method B',
                options: radiusCaseOptions,
                defaultValue: 'rlcvarbetaradius'
              }
            ]
          }
        ]
      }
    ];
  }

  function buildIdSuites(robotLabel, robotPhrase, robotId) {
    var idOptions = METHOD_OPTIONS;

    if (robotId === 'single-integrator') {
      idOptions = SINGLE_INTEGRATOR_ID_OPTIONS;
    } else if (robotId === 'unicycle') {
      idOptions = UNICYCLE_ID_OPTIONS;
    }

    var hasLocalSeedEpisode = robotId === 'single-integrator' || robotId === 'unicycle';
    var caseLabel = hasLocalSeedEpisode ? 'Episode 1' : 'Reference';
    var suiteLabel = hasLocalSeedEpisode ? 'Episode 1' : 'Reference scene';
    var overview = hasLocalSeedEpisode
      ? 'In-distribution comparison for the ' + robotPhrase + ', shown here as Episode 1.'
      : 'In-distribution comparison for the ' + robotPhrase + ' on the shared reference scene.';
    var goal = hasLocalSeedEpisode
      ? 'Compare all available methods on the same in-distribution ' + robotPhrase + ' rollout.'
      : 'Compare available local baselines on the in-distribution reference rollout.';

    return [
      {
        id: 'id-reference',
        label: suiteLabel,
        title: robotLabel + ' ID comparison',
        overview: overview,
        cases: [
          {
            label: caseLabel,
            goal: goal,
            columns: [
              {
                kind: 'select',
                heading: 'Method A',
                options: idOptions,
                defaultValue: hasLocalSeedEpisode ? 'orca' : 'rcbf'
              },
              {
                kind: 'select',
                heading: 'Method B',
                options: idOptions,
                defaultValue: hasLocalSeedEpisode ? 'rlcvarbetaradius' : 'proposed'
              }
            ]
          }
        ]
      }
    ];
  }

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

  function renderApp(root, suites) {
    if (!root) return;

    var tabsMarkup = '';
    if (suites.length > 1) {
      tabsMarkup =
        '<div class="tabs-container sim-suite-tabs-wrap">' +
          '<div class="sim-suite-tabs" role="tablist">' +
            renderSuiteTabs(suites) +
          '</div>' +
        '</div>';
    }

    root.innerHTML =
      tabsMarkup +
      '<div class="sim-suite-panels">' +
        renderSuitePanels(suites) +
      '</div>';

    wireSuiteTabs(root, suites);
    wireAllPanels(root, suites);
  }

  function renderModeApp(root, modes, initialModeId) {
    if (!root) return;

    var activeModeId = initialModeId || (modes[0] && modes[0].id);

    root.innerHTML =
      '<div class="sim-mode-tabs-wrap">' +
        '<div class="sim-mode-tabs" role="tablist" aria-label="Robot mode">' +
          renderModeTabs(modes, activeModeId) +
        '</div>' +
      '</div>' +
      '<div class="sim-mode-active" data-mode-active-app></div>';

    var activeRoot = root.querySelector('[data-mode-active-app]');

    function applyMode(modeId) {
      var selectedMode = modes[0];
      for (var i = 0; i < modes.length; i++) {
        if (modes[i].id === modeId) {
          selectedMode = modes[i];
          break;
        }
      }

      activeModeId = selectedMode.id;
      root.querySelectorAll('.sim-mode-tab').forEach(function (item) {
        var isActive = item.getAttribute('data-mode-id') === activeModeId;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      renderApp(activeRoot, selectedMode.suites);
    }

    root.querySelectorAll('.sim-mode-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        applyMode(tab.getAttribute('data-mode-id'));
      });
    });

    applyMode(activeModeId);
  }

  function renderModeTabs(modes, activeModeId) {
    return modes.map(function (mode) {
      var isActive = mode.id === activeModeId;
      return '' +
        '<button type="button" class="sim-mode-tab' + (isActive ? ' active' : '') + '"' +
        ' data-mode-id="' + escapeHtml(mode.id) + '"' +
        ' role="tab" aria-selected="' + (isActive ? 'true' : 'false') + '">' +
          escapeHtml(mode.label) +
        '</button>';
    }).join('');
  }

  function wireStaticModePanels(root) {
    if (!root) return;

    var tabs = root.querySelectorAll('.sim-mode-tab');
    var panels = root.querySelectorAll('.sim-mode-panel');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var modeId = tab.getAttribute('data-mode-id');
        tabs.forEach(function (item) {
          var isActive = item === tab;
          item.classList.toggle('active', isActive);
          item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        panels.forEach(function (panel) {
          panel.classList.toggle('active', panel.getAttribute('data-mode-panel') === modeId);
        });
      });
    });
  }

  function renderSuiteTabs(suites) {
    return suites.map(function (suite, index) {
      return '' +
        '<button type="button" class="sim-suite-tab' + (index === 0 ? ' active' : '') + '"' +
        ' data-suite-id="' + escapeHtml(suite.id) + '"' +
        ' role="tab" aria-selected="' + (index === 0 ? 'true' : 'false') + '">' +
          escapeHtml(suite.label) +
        '</button>';
    }).join('');
  }

  function renderSuitePanels(suites) {
    return suites.map(function (suite, index) {
      return '' +
        '<div class="sim-suite-panel' + (index === 0 ? ' active' : '') + '" data-suite-panel="' + escapeHtml(suite.id) + '"></div>';
    }).join('');
  }

  function wireSuiteTabs(root, suites) {
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

  function wireAllPanels(root, suites) {
    suites.forEach(function (suite) {
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
    var resultStatus = getResultStatus(selected);
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
        '<div class="result-label ' + escapeHtml(resultStatus.className) + '" data-result-badge>' + escapeHtml(resultStatus.label) + '</div>' +
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

  function getResultStatus(option) {
    var isSuccess = option && option.value === 'rlcvarbetaradius';
    return {
      label: isSuccess ? 'Success' : 'Collision',
      className: isSuccess ? 'success' : 'failure'
    };
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
      var badge = columnEl.querySelector('[data-result-badge]');
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
        if (badge) {
          var resultStatus = getResultStatus(selected);
          badge.textContent = resultStatus.label;
          badge.className = 'result-label ' + resultStatus.className;
        }
        note.textContent = selected.note || '';
      }

      select.addEventListener('change', function () {
        applySelection(select.value);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderApp(
      document.getElementById('simIdRolloutAppSingle'),
      buildIdSuites('Single Integrator', 'single-integrator robot', 'single-integrator')
    );
    renderApp(
      document.getElementById('simIdRolloutAppUnicycle'),
      buildIdSuites('Unicycle', 'unicycle robot', 'unicycle')
    );
    wireStaticModePanels(document.getElementById('simIdRolloutModeApp'));

    renderModeApp(
      document.getElementById('simRolloutModeApp'),
      [
        {
          id: 'single-integrator',
          label: 'Single Integrator',
          suites: buildSuites('Single Integrator', 'single-integrator robot', 'single-integrator')
        },
        {
          id: 'unicycle',
          label: 'Unicycle',
          suites: buildSuites('Unicycle', 'unicycle robot', 'unicycle')
        }
      ],
      'unicycle'
    );
  });
})();
