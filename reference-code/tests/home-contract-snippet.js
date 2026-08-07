/* Home V1 contract snippets — port into existing node/browser harness style. */

function assertHomeModel(m){
  assert(m.greeting && typeof m.greeting==="string");
  assert(m.recommendation?.title);
  assert(typeof m.recommendation?.actionId==="string");
  assert(m.journey?.xpNext > 0);
  assert(m.journey.xpCurrent >= 0);
}

assertHomeModel(window.__TEST_HOME_MODEL__);

const home=document.getElementById("learn");
assert(home.querySelector(".pm-home-hero"));
assert(home.querySelector(".pm-home-rec"));
assert(home.querySelector(".pm-home-journey"));

/* Gold recommendation art */
for(const id of ["arzt","apotheke","werkstatt"]){
  const url=MARZI_HOME_V1.goldArt(id);
  assert(url.includes("/assets/call/characters/"));
}

/* browser */
assert(document.documentElement.scrollWidth <= document.documentElement.clientWidth);
assert(getBoundingClientRect(primaryRecommendationCTA).height >= 48);

/* 200%:
   recommendation title/CTA visible; no overlap with art.
   RTL:
   no horizontal overflow, logical order remains meaningful.
*/
