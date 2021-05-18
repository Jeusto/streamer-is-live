// Retrieve objects
const Alerts = document.querySelector("#alerts");
const AlertSounds = document.querySelector("#alert-sounds");
const Sound = document.querySelector("#sound");

// Retrieve and show values
chrome.storage.local.get("alerts", function (data) {
  Alerts.checked = data.alerts;
});
chrome.storage.local.get("alertSounds", function (data) {
  AlertSounds.checked = data.alertSounds;
});
chrome.storage.local.get("sound", function (data) {
  Sound.value = data.sound;
});

// Change values in local storage
Alerts.addEventListener("change", function () {
  chrome.storage.local.set(
    {
      alerts: Alerts.checked,
    },
    function () {}
  );
});
AlertSounds.addEventListener("change", function () {
  chrome.storage.local.set(
    {
      alertSounds: AlertSounds.checked,
    },
    function () {}
  );
});
Sound.onchange = (event) => {
  chrome.storage.local.set(
    {
      sound: event.target.value,
    },
    function () {}
  );
};
