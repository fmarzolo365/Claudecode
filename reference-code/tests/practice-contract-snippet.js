const root=document.getElementById("practice");
assert(root);
assert(root.querySelector(".pm2-page-title"));
assert(!/My progress/i.test([...root.querySelectorAll(".pm2-row-title")].map(x=>x.textContent).join("|")));
for(const btn of root.querySelectorAll("button")) assert(btn.getBoundingClientRect().height>=48);
