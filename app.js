
// https://github.com/syedhumzasalman

console.log("Hello World!");

document.title = "GitHub User Finder";

const userNameInput = document.querySelector('#username-input');
let searchButton = document.querySelector('#search-btn');

searchButton.addEventListener('click', () => {
    const userName = userNameInput.value.trim();
    if (userName) {
        checkUser(userName);
    }
})

userNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const userName = userNameInput.value.trim();
        if (userName) {
            checkUser(userName);
        }
    }
})

function checkUser(userName) {
    const URL = `https://api.github.com/users/${userName}`;
    let data = getUserData(URL);
    data.then((res) => {
        // console.log(res);
        console.log("Name: " + res.name);
        console.log("Bio: " + res.bio);
        console.log("Blog: " + res.blog);
        console.log("Location: " + res.location);
        console.log("Company: " + res.company);
        console.log("Created at: " + res.created_at);
        console.log("Followers: " + res.followers);
        console.log("Following: " + res.following);
        console.log("Public Repos: " + res.public_repos);
        renderUserProfile(res);
        let repos = getUserRepos(res.repos_url);
        repos.then((res) => {
            console.log(res);
            displayRepos(res);
        }).catch((error) => {
            console.log(error);
        })
    }).catch((error) => {
        console.log(error);
    })
}

// searchButton.addEventListener("click", checkUser);

// const URL = "https://api.github.com/";

async function getUserData(URL) {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error: ', error);
    }
}

async function getUserRepos(URL) {
    try {
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error: ', error);
    }
}

console.log(typeof new Date().toDateString());

function renderUserProfile(user) {
    let userProfile = document.querySelector('#user-profile');
    userProfile.innerHTML = `
    <div class="profile-header">
        <img src="${user.avatar_url}" alt="User Avatar" class="avatar" id="avatar">
        <div class="profile-info">
            <h2 id="name">${user.name}</h2>
            <span class="username" id="username">@${user.login}</span>
            <p class="bio" id="bio">${user.bio || "No bio available."}</p>
            <div class="profile-stats">
                <div class="stat">
                    <i class="fas fa-users"></i>
                    <span id="followers">${user.followers}</span> followers
                </div>
                <div class="stat">
                    <i class="fas fa-user-friends"></i>
                    <span id="following">${user.following}</span> following
                </div>
                <div class="stat">
                    <i class="fas fa-book"></i>
                    <span id="repos-count">${user.public_repos}</span> repos
                </div>
            </div>
        </div>
    </div>

    <div class="profile-details">
        <div class="detail-card">
            <h3><i class="fas fa-map-marker-alt"></i> Location</h3>
            <p id="location">${user.location || "Not specified"}</p>
        </div>
        <div class="detail-card">
            <h3><i class="fas fa-link"></i> Website</h3>
            <p id="blog">${user.blog || "Not specified"}</p>
        </div>
        <div class="detail-card">
            <h3><i class="fas fa-building"></i> Company</h3>
            <p id="company">${user.company || "Not specified"}</p>
        </div>
        <div class="detail-card">
            <h3><i class="fas fa-calendar-alt"></i> Joined</h3>
            <p id="joined">${new Date(user.created_at).toDateString()}</p>
        </div>
    </div>
    `;
}

function displayRepos(repos) {
    const reposGrid = document.getElementById('repos-grid');
    reposGrid.innerHTML = '';
    console.log("inside");
    console.log(repos);
    if (repos.length === 0) {
        reposGrid.innerHTML = '<p>No repositories found.</p>';
        return;
    }
    
    // Sort by most stars and take first 6
    // const sortedRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
    
    repos.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.className = 'repo-card';
        repoCard.innerHTML = `
            <h3 class="repo-name"><i class="fas fa-book"></i> ${repo.name}</h3>
            <p class="repo-desc">${repo.description || 'No description available.'}</p>
            <div class="repo-stats">
                <span class="repo-stat"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span class="repo-stat"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                ${repo.language ? `<span class="repo-stat"><i class="fas fa-circle" style="color: "></i> ${repo.language}</span>` : ''}
            </div>
        `;
        reposGrid.appendChild(repoCard);
    });
}
