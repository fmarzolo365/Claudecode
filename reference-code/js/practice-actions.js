/* Practice V1 — authoritative-handler adapters only. */
function practiceExisting(name){
  const fn=window[name];
  return typeof fn==="function" ? fn : null;
}
function practiceActions(){
  const a={};
  if(practiceExisting("startPrep")) a.prep=()=>window.startPrep();
  if(practiceExisting("startDialog")) a.dialog=()=>window.startDialog();
  if(practiceExisting("startVocab")) a.vocab=()=>window.startVocab();
  if(practiceExisting("startDrill")) a.drill=()=>window.startDrill();
  if(practiceExisting("renderMistakes") && practiceExisting("show")){
    a.mistakes=()=>{window.renderMistakes();window.show("mistakes");};
  }
  return a;
}
window.MARZI_PRACTICE_V1_ACTIONS=Object.freeze({build:practiceActions});
