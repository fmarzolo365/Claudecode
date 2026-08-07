function pm2Require(v,name){if(v===undefined||v===null||v==='')throw new Error(`premium UI model missing: ${name}`);return v}
function pm2SafeArray(v){return Array.isArray(v)?v:[]}
function pm2ValidateHomeModel(m){pm2Require(m?.greeting,'home.greeting');pm2Require(m?.recommendation?.title,'home.recommendation.title');return m}
function pm2ValidatePracticeModel(m){return {...m,groups:pm2SafeArray(m?.groups)}}
function pm2ValidateTalkModel(m){return {...m,people:pm2SafeArray(m?.people),recommended:pm2SafeArray(m?.recommended)}}
