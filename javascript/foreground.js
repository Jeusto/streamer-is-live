// Retrieve objects
const AddNewStreamer = document.querySelector(".add-btn");
const StreamerName = document.querySelector(".input");

// Get favorite streamer
var favoriteStreamer;
chrome.storage.local.get("favorite", function (data) {
  favoriteStreamer = data.favorite;
});

// Get streamers informations from local storage and show it
chrome.storage.local.get("streamers", function (data) {
  console.log(data.streamers.length);
  if (data.streamers.length >= 1) {
    document.getElementById("empty-state").style.display = "none";
  } else {
    document.getElementById("empty-state").style.display = "flex";
  }
  data.streamers.forEach((S) => {
    const Template = `
    <div id="streamer" class="streamer" data-streamer="${S.name}">
      <a
        href="https://www.twitch.tv/${S.name}"
        target="_blank"
        class="streamer-info"
      >
        <img
          class="avatar ${S.status ? "live" : "offline"}"
          src="${S.logo}" data-streamer="${S.name}">
        <div class="info">
          <h3 class="name" data-streamer="${S.name}">${S.name}</h3>
          <h4 class="streamer-live game" data-streamer="${S.name}">
           ${S.status ? "LIVE" : "OFFLINE"}
          </h4>
        </div>
      </a>
      <div class="buttons">
        <svg
          id="favorite"
          class="favorite-btn"      
          data-favorite="${S.name}"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg
          id="close"
          class="close delete-btn"
          data-name="${S.name}"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.3249 9.4682C19.3249 9.4682 18.7819 16.2032 18.4669
          19.0402C18.3169 20.3952 17.4799 21.1892 16.1089 21.2142C13.4999
          21.2612 10.8879 21.2642 8.2799 21.2092C6.9609 21.1822 6.1379
          20.3782 5.9909 19.0472C5.6739 16.1852 5.1339 9.4682 5.1339
          9.4682"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M20.7082 6.23972H3.7502"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17.4406 6.2397C16.6556 6.2397 15.9796 5.6847 15.8256 4.9157L15.5826 3.6997C15.4326 3.1387 14.9246 2.7507 14.3456 2.7507H10.1126C9.5336 2.7507 9.0256 3.1387 8.8756 3.6997L8.6326 4.9157C8.4786 5.6847 7.8026 6.2397 7.0176 6.2397"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    `;

    document
      .querySelector(".streamer-list")
      .insertAdjacentHTML("beforeend", Template);
  });
});

// Update streamers information every 5 seconds and update
setInterval(function () {
  chrome.storage.local.get("streamers", function (data) {
    data.streamers.forEach((S) => {
      document.querySelector("[data-streamer='" + S.name + "'] img").src =
        S.logo;
      document
        .querySelector("[data-streamer='" + S.name + "'] img")
        .classList.add(S.status ? "live" : "offline");
      document.querySelector(
        "[data-streamer='" + S.name + "'] .streamer-live"
      ).innerHTML = S.status ? "LIVE" : "OFFLINE";
    });
  });
}, 5000);

// Add streamer after clicking add button
AddNewStreamer.addEventListener("click", addStreamer);

// Add streamer after pressing enter in the input
StreamerName.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    addStreamer();
  }
});

// Remove streamer after clicking on remove button
document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "close") {
    removeStreamer(e.target.dataset.name);
    return;
  }
});

// Favorite streamer after clicking on favorite button
document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "favorite") {
    var favoriteName = e.target.dataset.favorite;
    var favoriteDiv = document.querySelector(
      `.streamer[data-streamer='${favoriteName}']`
    );
    var streamerList = document.querySelector(".streamer-list");
    streamerList.insertBefore(favoriteDiv, streamerList.firstChild);

    chrome.storage.local.get("streamers", function (data) {
      var streamersModified;
      var favoriteToAdd;
      streamersModified = data.streamers.slice(0);
      favoriteToAdd = data.streamers.find((item) => item.name == favoriteName);
      streamersModified = streamersModified.filter(
        (item) => item.name !== favoriteName
      );
      streamersModified.unshift(favoriteToAdd);
      chrome.storage.local.set(
        { streamers: streamersModified },
        function () {}
      );
    });
  }
});

// Function to remove streamer
function removeStreamer(s) {
  chrome.storage.local.get("streamers", function (data) {
    let Streamers = [...data.streamers.filter((S) => S.name !== s)];
    chrome.storage.local.get("streamers", function (data) {
      if (data.streamers.length <= 1) {
        document.getElementById("empty-state").style.display = "flex";
      }
    });
    document.querySelector(".streamer[data-streamer='" + s + "']").remove();
    chrome.storage.local.set({ streamers: Streamers }, function () {});
  });
}

// Function to add streamer
async function addStreamer() {
  document.getElementById("empty-state").style.display = "none";
  const xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://api.twitch.tv/kraken/users?login=" +
      StreamerName.value.toLowerCase(),
    true
  );
  xhr.setRequestHeader("Accept", "application/vnd.twitchtv.v5+json");
  xhr.setRequestHeader("Client-ID", "atk7r2fb2gu39oak3myi7ydih6oooh");
  xhr.onreadystatechange = function () {
    if (this.readyState !== 4) return;
    if (this.status !== 200) return;
    const ParseText = JSON.parse(this.responseText);

    chrome.storage.local.get("streamers", function (data) {
      let Streamers = [...data.streamers];
      if (Streamers.find((S) => S.name == StreamerName.value.toLowerCase()))
        return;
      Streamers.push({
        name: StreamerName.value.toLowerCase(),
        status: false,
        logo: ParseText.users[0].logo,
      });

      const Template = `
      <div id="streamer" class="streamer" data-streamer="${StreamerName.value.toLowerCase()}">
        <a
          href="https://www.twitch.tv/${StreamerName.value.toLowerCase()}"
          target="_blank"
          class="streamer-info"
        >
          <img
            class="avatar"
            src="${ParseText.users[0].logo}" \
            data-streamer="${StreamerName.value.toLowerCase()}">
          <div class="info">
            <h3 class="name"
              data-streamer="${StreamerName.value.toLowerCase()}">${StreamerName.value.toLowerCase()}</h3>
            <h4 class="streamer-live game" data-streamer="${StreamerName.value.toLowerCase()}">
             Verifying information...
            </h4>
          </div>
        </a>
        <div class="buttons">
          <svg
            id="favorite"
            class="favorite-btn"
            data-favorite="${StreamerName.value.toLowerCase()}"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg
            id="close"
            class="close delete-btn"
            data-name="${StreamerName.value.toLowerCase()}"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.3249 9.4682C19.3249 9.4682 18.7819 16.2032 18.4669
            19.0402C18.3169 20.3952 17.4799 21.1892 16.1089 21.2142C13.4999
            21.2612 10.8879 21.2642 8.2799 21.2092C6.9609 21.1822 6.1379
            20.3782 5.9909 19.0472C5.6739 16.1852 5.1339 9.4682 5.1339
            9.4682"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M20.7082 6.23972H3.7502"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17.4406 6.2397C16.6556 6.2397 15.9796 5.6847 15.8256 4.9157L15.5826 3.6997C15.4326 3.1387 14.9246 2.7507 14.3456 2.7507H10.1126C9.5336 2.7507 9.0256 3.1387 8.8756 3.6997L8.6326 4.9157C8.4786 5.6847 7.8026 6.2397 7.0176 6.2397"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
      `;

      document
        .querySelector(".streamer-list")
        .insertAdjacentHTML("beforeend", Template);

      chrome.storage.local.set({ streamers: Streamers }, function () {
        StreamerName.value = "";
      });
    });
  };
  xhr.send();
}
