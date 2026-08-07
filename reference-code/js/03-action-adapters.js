function pm2Existing(name){const fn=window[name];if(typeof fn!=='function')throw new Error(`missing existing handler: ${name}`);return fn}
const PM2_ACTIONS={practice:{prep:()=>pm2Existing('startPrep')(),dialog:()=>pm2Existing('startDialog')(),vocab:()=>pm2Existing('startVocab')(),drill:()=>pm2Existing('startDrill')(),mistakes:()=>{pm2Existing('renderMistakes')();pm2Existing('show')('mistakes')}},talk:{allSituations:()=>pm2Existing('openDrawer')()},plan:()=>pm2Existing('openPlanScreen')()};
window.MARZI_PM2_ACTIONS=PM2_ACTIONS;
