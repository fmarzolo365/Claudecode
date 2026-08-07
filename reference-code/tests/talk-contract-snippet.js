for(const id of ["arzt","apotheke","werkstatt"]){
  const u=MARZI_TALK_ROOT_ART.url(id);
  assert(u.includes("/assets/call/characters/"));
}
assert(document.querySelector(".pm-talk-root"));
