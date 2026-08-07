assert(document.querySelector(".pm-profile-summary"));
assert(!/85Monedas|1días seguidos|0llamadas/i.test(document.getElementById("profile").innerText));
assert(storageKeysBefore.join("|")===storageKeysAfter.join("|"));
