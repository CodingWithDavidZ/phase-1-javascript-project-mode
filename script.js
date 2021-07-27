const form = document.getElementById("searchForm");
const toggle = document.getElementById("sliderSwitch");
const saved = document.getElementById("savedSearches");

function fetchSaved() {
  fetch("http://localhost:3000/saved")
    .then((res) => res.json())
    .then((savedData) => {
      console.log(savedData);
      const html = savedData
        .slice(1, 51)
        .map((data) => {
          return `
          
          <p id=pTag${data.id}> <a target="_blank" href="${data.url}"><img src="${data.picture}" alt="${data.id}" width="100" height="100"/></a><button class="btn btn-link" id="removeButton${data.id}">Remove</button></p>`;
        })
        .join("");
      saved.innerHTML = html;
      savedData.slice(1, 51).map((data) => {
        document
          .getElementById(`removeButton${data.id}`)
          .addEventListener("click", (e) => {
            fetch(`http://localhost:3000/saved/${data.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
          });
      });
    })
    .catch((error) => {
      console.log(error);
      //Add Event listener for remove button
      //Abandoned the remove button for now because I am stuck and unable to get help.
      //I need to finish the Minimally Viable Product asap so I will make an easier event listener to check the box
    });
}

fetchSaved();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  //find name
  const search = document.getElementById("search").value;
  //remove spaces in search query
  const originalName = search.split(" ").join("");

  document.getElementById("searchResult").innerHTML = "";

  // api intergration
  fetch("https://api.github.com/users/" + originalName)
    .then((result) => result.json())
    // if(!result.ok){
    //     alert("User not found");
    // }
    .then((data) => {
      console.log(data);

      //display picture that when click, redirects to thier github
      document.getElementById("searchResult").innerHTML = `
        <a target="_blank" href="https://www.github.com/${originalName}"> <img src= "${data.avatar_url}" width="333" height="333"/></a>
      `;

      //pulled data to use in lists
      const hireable = `Seeking Employment: ${data.hireable}`;
      const location = `Location: ${data.location}`;
      const fullName = `Name: ${data.name}`;
      const email = `Email: ${data.email}`;
      const repoCount = `Repo Count: ${data.public_repos}`;
      const created = `Created: ${data.created_at}`;
      const createdNoTime = created.split("T")[0];
      const lastUpdated = `Last update: ${data.updated_at}`;
      const lastUpdatedNoTime = lastUpdated.split("T")[0];
      const twitterHandle = `Twitter: ${data.twitter_username}`;
      const userURL = data.html_url;
      const userAvatar = data.avatar_url;

      //display saveToggle
      const div = document.getElementById("saveToggle");
      if ((div.style.display = "none")) {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }

      const basicInfoArray = [fullName, location, email, twitterHandle];
      var str = "<ul>";

      basicInfoArray.forEach(function (slide) {
        str += "<li>" + slide + "</li>";
      });
      str += "</ul>";
      document.getElementById("moreInfo1").innerHTML = str;

      const moreInfoArray = [
        createdNoTime,
        lastUpdatedNoTime,
        repoCount,
        hireable,
      ];
      var str2 = "<ul>";
      moreInfoArray.forEach(function (slide) {
        str2 += "<li>" + slide + "</li>";
      });
      str2 += "</ul>";
      document.getElementById("moreInfo2").innerHTML = str2;

      toggle.addEventListener("click", function () {
        fetch("http://localhost:3000/saved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            url: userURL,
            picture: userAvatar,
          }),
        });
      });
    });
});
