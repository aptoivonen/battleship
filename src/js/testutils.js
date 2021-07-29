const randoms = [
  0.3919558927805378, 0.19892293738538835, 0.21277705062867447,
  0.5887127394911915, 0.168602308584608, 0.9670477961732985,
  0.25392549191372416, 0.40918011393434794, 0.5680136498412085,
  0.7165882990792429, 0.9336095219902588, 0.04516006665961103,
  0.9147263060152049, 0.9732954150922256, 0.5793720270410425,
  0.43025799560536526, 0.6639296960546723, 0.015564951672467853,
  0.42028857527591257, 0.6607999588979612, 0.33974297759491223,
  0.6079729089252114, 0.8608457991381447, 0.5964984354288743,
  0.7822899102065971, 0.9605097569847153, 0.7070936772764271,
  0.3395379011645068, 0.19594836440660335, 0.9677806357986548,
  0.5676430461993018, 0.9665183792625585, 0.4004483377813406,
  0.24590462289433468, 0.22139026994889477, 0.489099994923196,
  0.9460778044611196, 0.33067689231829545, 0.10868543695538813,
  0.9697232912383167, 0.33254215019961375, 0.8816157147748271,
  0.655866168151127, 0.38290832206067527, 0.5419766664621535,
  0.21924724609000934, 0.3277627087701346, 0.943422247632215,
  0.47622173772819354, 0.9271493431150127, 0.9939057911699423,
  0.6674922436742854, 0.25735935101614893, 0.3035646774514479,
  0.33578324841676466, 0.6181222256242496, 0.24949607034926802,
  0.5936940461763452, 0.542999545037322, 0.5694761179735222, 0.731306400545951,
  0.2007062101860254, 0.1945489313764206, 0.7074215919202562,
  0.22979089018810173, 0.9337727817936804, 0.8891972650760605,
  0.029554783828776743, 0.39540959001045195, 0.861241411796942,
  0.4209989412969024, 0.15028373693927666, 0.8740951098704903,
  0.1161570949983961, 0.013404386802180257, 0.546060270708486,
  0.3153824698381028, 0.07769890920693034, 0.6615684650905433,
  0.022585395014869447, 0.8451589297017513, 0.8029995317020049,
  0.6643367472004452, 0.13576866557071765, 0.9195590162183106,
  0.833383282563101, 0.036072338853521235, 0.36239580263846205,
  0.6181289171352484, 0.6664769891864056, 0.23210510944467877,
  0.8919614019921367, 0.41369760657029364, 0.9448201527856924,
  0.6417930100123381, 0.577345910766451, 0.8565755053829971, 0.8170736484294908,
  0.07329179407680331, 0.8348694728421096, 0.374165945277365,
  0.6581881527091653, 0.7067157800028694, 0.5728907074371131,
  0.13225706935388604, 0.11953311571471736, 0.28247015170198986,
  0.6978313403368143, 0.7824111260922091, 0.6465097627058116,
  0.5570350129412219, 0.060147388444116046, 0.14486052674986516,
  0.9374514603167172, 0.7520375787791322, 0.5109900671059393,
  0.30633180134465676, 0.681581459965717, 0.4774192886805788,
  0.10838531761339532, 0.7801421483794215, 0.6655222753885836,
  0.5920254016112741, 0.4138959271499698, 0.751426894047501,
  0.17095004918624024, 0.3076668256856253, 0.0766322851656116,
  0.6521692508012562, 0.6246338799947119, 0.019204136603759636,
  0.6588880910006119, 0.6110332789441374, 0.7318010468716857,
  0.40126582321497284, 0.5471741447710301, 0.8482740288889938,
  0.6928326001138948, 0.908914173706062, 0.06515611082590134,
  0.8269089691393376, 0.32856528187479206, 0.19823352233486158,
  0.012579557571472777, 0.5053604938974442, 0.5371691055413162,
  0.11020020919306306, 0.48980933767904034, 0.9633386146050031,
  0.9026608812893768, 0.9449271671258491, 0.2571471758796917,
  0.21883959381468787, 0.17745097243484598, 0.028525050842515665,
  0.10954981655220097, 0.6120284093613317, 0.03553993831983915,
  0.940515002880545, 0.5661867726797334, 0.10739401485682876,
  0.6720243612990029, 0.3553236178845883, 0.626070693143123, 0.7233700875425664,
  0.9667378583908747, 0.07629137572598543, 0.9189557962097658,
  0.4775379683755031, 0.578374553653078, 0.2949736366004888,
  0.06337463126934983, 0.43825647649097554, 0.3023059031213965,
  0.08939338600463309, 0.37134444087155916, 0.1993330298614684,
  0.47049246213783824, 0.6670674555726528, 0.03135274001304433,
  0.9805754332267678, 0.2901226188060273, 0.39223691884642176,
  0.8983641041538554, 0.7640371654439141, 0.6825997131885702,
  0.13236729876994058, 0.7949585215875429, 0.29966023828858523,
  0.1858158564866893, 0.6588491127907101, 0.35330097669483573,
  0.7714081213708783, 0.9526245980223028, 0.09073556875294242,
  0.7827344960292772, 0.5881383758884802, 0.6582939216593158,
  0.3436509599877541, 0.09409175263624203,
];
function makeRandomMock() {
  let mock = jest.fn();
  for (const random of randoms) {
    mock = mock.mockReturnValueOnce(random);
  }
  return mock;
}

export { makeRandomMock };