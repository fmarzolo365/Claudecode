assert(document.querySelector(".pm-store-hero"));
assert(document.querySelectorAll(".pm-store-category").length>0);
assert(currentCoinsBefore===currentCoinsAfterRender); // renderer must not mutate economy
