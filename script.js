// Global variable declaration
const form = document.getElementById("searchForm");
const toggle = document.getElementById("sliderSwitch");
const saved = document.getElementById("savedSearches");

// fetch data from localhost JSON server
function fetchSaved() {
  fetch("http://localhost:3000/saved")
    .then((res) => res.json())
    .then((savedData) => {
      console.log(savedData);
      const html = savedData
        .slice(1, 51) //the splice prevents an undefined object od id:1 and limits saved searches to 50
        .map((data) => {
          //Create saved elements with picture that redirects to user Github, limit picture size, and add the remove buttons that appear to be links
          return `         
          <p id=pTag${data.id}> <a target="_blank" href="${data.url}"><img src="${data.picture}" alt="${data.id}" width="100" height="100"/></a><button class="btn btn-link" id="removeButton${data.id}">Remove</button></p>`;
        })
        .join("");
      //display the above elements on the DOM
      saved.innerHTML = html;
      //Re-loop over map to recover data to use in event listener
      savedData.slice(1, 51).map((data) => {
        //the splice prevents an undefined object od id:1 and limits saved searches to 50
        //Event listener to remove saved entries
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
    });
}

fetchSaved();

//Search form event listner
//conjoins seperated words and feeds them into the api URL
form.addEventListener("submit", function (e) {
  e.preventDefault();
  //find name
  const search = document.getElementById("search").value;
  //remove spaces in search query
  const originalName = search.split(" ").join("");
  //clears the search bar for the next search
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

      //fetched data from api to use in lists
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

      //display and hide the saveToggle
      const div = document.getElementById("saveToggle");
      if ((div.style.display = "none")) {
        div.style.display = "block";
      } else {
        div.style.display = "none";
      }

      //create an unordered list of the info wanted without forcing the DOM to loop through and display the info each time
      const basicInfoArray = [fullName, location, email, twitterHandle];
      var str = "<ul>";
      basicInfoArray.forEach(function (slide) {
        str += "<li>" + slide + "</li>";
      });
      str += "</ul>";
      document.getElementById("moreInfo1").innerHTML = str;

      // third column of info
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

      //listener to allow saved searches to post to JSON server
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
