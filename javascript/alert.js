chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "notify") {
    Notify(request.streamer);
  }
  sendResponse({ result: "success" });
});

function Notify(Streamer) {
  const Template = `
  <a class="alert" href="https://www.twitch.tv/${
    Streamer.name
  }" data-deleteTime='${Date.now() + 5000}' target="_blank">
    <img
      class="alert-avatar"
      src="${Streamer.logo}"
    />
    <div>
      <h3 class="alert-text">
        <span class="span">${Streamer.name}</span>
      </h3>
      <h3 class="alert-game">just went live!</h3>
    </div>
  </a>
  `;
  document.querySelector(".alertbox").insertAdjacentHTML("beforeend", Template);
}

window.onload = function () {
  var css =
      ".alertbox{display:inline-block}.alert{width:auto;background-color:#171717;display:flex;justify-content:center;align-items:center;color:inherit;text-decoration:none;border-radius:.6rem;border-top:4px #6c63ff solid;padding:.6rem 1rem .6rem 1rem}.alert-avatar{width:3.4rem;height:3.4rem;border-radius:50%;border:3px #868686 solid;margin-right:1rem}.alert-text{font-size:1.4rem;margin:0;text-align:center}.alert-game{font-size:1.1rem;font-weight:400;text-align:center;color:#c2c1c1;margin:0}.span{color:#857ff3}",
    head = document.head || document.getElementsByTagName("head")[0],
    style = document.createElement("style");

  head.appendChild(style);
  style.type = "text/css";
  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  const NList = document.createElement("div");
  NList.className = "alertbox";
  document.body.appendChild(NList);
};

setInterval(function () {
  const FindRemovables = document.querySelectorAll(".alert");
  if (!FindRemovables.length) return;
  FindRemovables.forEach((E) => {
    if (E.dataset.deletetime < Date.now()) {
      E.remove();
    }
  });
}, 10);
