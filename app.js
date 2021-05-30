const username = localStorage.getItem("username");

let content = {
  query: `query($username: String!) {
    user(login: $username) {
      name
    	avatarUrl
    	bio
      status {
        emojiHTML
        message
        __typename
      }
      repositories(first: 20, isFork: false, privacy:PUBLIC, ownerAffiliations:OWNER, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          id
          name
          description
          url
          stargazerCount
          updatedAt
          forkCount
          primaryLanguage {
            name
            color
          }
        }
      }
    }
  }
  `,
  variables: `{
    "username": "${username}"
  }`,
};

let body = JSON.stringify(content);

let token = config.MY_API_TOKEN;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const formatDate = (val) => {
  const dt = new Date(val);
  const month = months[dt.getMonth()];
  const date = dt.getDate();
  const year = dt.getFullYear();
  const fDate = date < 10 ? `0${date}` : date;
  return `${fDate} ${month}`;
};

fetch("https://api.github.com/graphql", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  },
  body: body,
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const html = data.data.user.repositories.nodes
      .map((repo) => {
        return `
          <div id="repo_container" key="${repo.id}">
          <button>
            <svg class="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
              </path>
            </svg>
            <span>Star</span>
          </button>
          <h3><a href="${repo.url}">${repo.name}</a></h3>
          
          ${repo.description == null ? "" : `<p>${repo.description}</p>`}
            
          <div id="subrepo_text">
            ${
              repo.primaryLanguage == null
                ? ""
                : `<span>
                <div class="repo-language-color" style="background-color: ${
                  repo.primaryLanguage.color
                }"></div>
                ${repo.primaryLanguage == null ? "" : repo.primaryLanguage.name}
                  </span>`
            }
            ${
              repo.stargazerCount == 0
                ? ""
                : `
              <span>
              <svg aria-label="star" role="img" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-star">
            <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
        </svg>${repo.stargazerCount}
              </span>`
            }
            
        ${
          repo.forkCount == 0
            ? ""
            : `<span><svg aria-label="fork" role="img" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="octicon octicon-repo-forked">
        <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
    </svg>${repo.forkCount}</span>`
        }
        
            <span class="date">Updated on ${formatDate(repo.updatedAt)}</span>

          </div>
        </div>`;
      })
      .join("");

    let sub_userthumb = `<img class="user_thumb" src="${data.data.user.avatarUrl}"/>
      <span class="dropdown-caret"></span>`;

    document.querySelector("#repo").insertAdjacentHTML("beforeend", html);
    document
      .querySelector("#user")
      .insertAdjacentHTML("afterbegin", sub_userthumb);
    document
      .querySelector("#name")
      .insertAdjacentHTML("afterbegin", data.data.user.name);
    document
      .querySelector("#bio")
      .insertAdjacentHTML("beforeend", data.data.user.bio);
    document
      .querySelector("#username")
      .insertAdjacentHTML("beforeend", username);
    document
      .querySelector("#title")
      .insertAdjacentHTML(
        "afterbegin",
        `${username} (${data.data.user.name}) / Repositories`
      );

    const thumb = document.querySelector(".thumbnail");

    thumb.style.backgroundImage = `url('${data.data.user.avatarUrl}')`;
  });
