chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.storage.local.get("alerts", function (data) {
    alerts = data.alerts;
    if (request.command === "notify" && alerts) {
      Notify(request.streamer);
    }
    sendResponse({ result: "success" });
  });
});

function Notify(Streamer) {
  const Template = `
  <a class="alerttt" href="https://www.twitch.tv/${
    Streamer.name
  }" data-deleteTime='${Date.now() + 5000}' target="_blank">
    <img
      class="alerttt-avatar"
      src="${Streamer.logo}"
    />
    <div>
      <h3 class="alerttt-name">
        <span style="color: #857ff3; font-size: 20px; font-weight: 600"
          >${Streamer.name}</span
        ><br />
        just went live!
      </h3>
    </div>
  </a>
  `;
  document
    .querySelector(".alertttbox")
    .insertAdjacentHTML("beforeend", Template);
}

window.onload = function () {
  var css = `.alertttbox{font-family:Arial,Helvetica,sans-serif;display:inline-block}.alerttt{font-family:Arial,Helvetica,sans-serif;z-index:99999;width:auto;background-color:#171717;display:flex;justify-content:flex-end;height:fit-content;position:fixed;right:0;top:0;align-items:center;color:inherit;text-decoration:none;border-radius:10px;border-top:4px #6c63ff solid;padding:10px 20px 10px 20px;margin-top:16px;margin-right:16px}.alerttt-avatar{font-family:Arial,Helvetica,sans-serif;width:45px;height:45px;border-radius:50%;border:3px #868686 solid;margin-right:16px}.alerttt-name{font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:400;margin:0;color:#c2c1c1;padding:0;text-align:center}`,
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
  NList.className = "alertttbox";
  document.body.appendChild(NList);
};

setInterval(function () {
  const FindRemovables = document.querySelectorAll(".alerttt");
  if (!FindRemovables.length) return;
  FindRemovables.forEach((E) => {
    if (E.dataset.deletetime < Date.now()) {
      E.remove();
    }
  });
}, 10);
