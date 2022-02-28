"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// Open and close new story form, using close button and nav link
$('#exit-button').on('click', function(){
  $('#exit-button').addClass('hidden');
  $('#new-story-container').addClass('hidden');
})

$('#submit-tag').on('click', function(e){
  e.preventDefault();
  $('#exit-button').removeClass("hidden");
  $('#new-story-container').removeClass("hidden");
})

//   Navigate Favorites Tab to create new faves list
const favoriteTab = document.querySelector('#fav-link');

favoriteTab.addEventListener('click', function(){
  storyList.stories = currentUser.favorites;
  putStoriesOnPage();
})

//    Navigate to main story list
const mainPageStories = document.querySelector('#nav-all');

mainPageStories.addEventListener('click', function(){
  getAndShowStoriesOnStart()
});
