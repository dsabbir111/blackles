<script>
(function () {
  var allowedDomains = [
    "https://blackworld729.blogspot.com/",
    "blackworld729.blogspot.com"
  ];

  var target = "https://blackworld729.blogspot.com/";
  var host = location.hostname.toLowerCase();

  // আগেই redirect হলে সাথে সাথে পাঠাবে
  if (localStorage.getItem("domain_redirected") === "yes") {
    if (location.href.indexOf(target) === -1) {
      location.replace(target);
    }
    return;
  }

  var isBlogspot = host.indexOf("blogspot.com") !== -1;
  var isAllowed = allowedDomains.includes(host);

  if (isBlogspot || !isAllowed) {

    // ===== POPUP CREATE =====
    var overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;" +
      "background:rgba(0,0,0,.6);z-index:99999;display:flex;" +
      "align-items:center;justify-content:center;font-family:sans-serif";

    var box = document.createElement("div");
    box.style.cssText =
      "background:#fff;padding:25px 30px;border-radius:8px;" +
      "text-align:center;max-width:300px;width:90%";

    var text = document.createElement("div");
    text.style.cssText = "font-size:16px;margin-bottom:10px;";
    text.innerHTML = "আপনাকে মূল ওয়েবসাইটে নেওয়া হচ্ছে";

    var counter = document.createElement("div");
    counter.style.cssText = "font-size:20px;font-weight:bold;color:#e53935";
    
    box.appendChild(text);
    box.appendChild(counter);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // ===== COUNTDOWN =====
    var sec = 5;
    counter.innerHTML = sec + " সেকেন্ড";

    var timer = setInterval(function () {
      sec--;
      counter.innerHTML = sec + " সেকেন্ড";
      if (sec <= 0) {
        clearInterval(timer);
        localStorage.setItem("domain_redirected", "yes");
        location.replace(target); // back disable
      }
    }, 1000);
  }
})();
</script>
