"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;
//const faveStories = [];

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // Create HTML for each story
  $(`
      <li id="${story.storyId}" class="parentLi">
        <input type="checkbox" value="favorite">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <button class="delete">Delete</button>
      </li>
    `).appendTo($($allStoriesList));

  // ================================================
  //         Added click event for fave stories
  // ================================================
  $('input[type="checkbox"]').on('click', function(e){
    let tgt = e.target.parentElement;
    tgt.classList.toggle('fave');
    tgt.classList.contains('fave') ? addToFaves(tgt.id) : removeFaves(tgt.id);
  })

  // ================================================
  //         Add click event to delete button
  // ================================================
  // Have to refresh before click listeners work on new stories. Need to provide click listener in generateStoryMarkup()?
  $('.delete').on('click', function(e){
    const del = e.target.parentElement;
    deleteStory(del.id);
    del.remove();
  })

}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    generateStoryMarkup(story);
  }

  $allStoriesList.show();
}

// ===========================================
//         Add and Remove Favorites             Does not store when you logout and back in?
// ===========================================
async function getStoryById(id) {
  let storyList = []
  let story = await axios({
    url: `https://private-anon-b3a3043498-hackorsnoozev3.apiary-proxy.com/stories/${id}`,
    method: 'get',
  });
  storyList.push(story.data.story)
  console.log(storyList)
  return storyList;
}

async function addToFaves(id){
  console.debug('addToFaves', id);

  const token = currentUser.loginToken;
  await axios({
    url: `https://private-anon-b3a3043498-hackorsnoozev3.apiary-proxy.com/users/${currentUser.username}/favorites/${id}`,
    method: 'post',
    data: { token },
  });
  console.log('added fave to server')
}

async function removeFaves(id){
  console.debug('removeFaves', id);

  const token = currentUser.loginToken;

  await axios({
    url: `https://private-anon-b3a3043498-hackorsnoozev3.apiary-proxy.com/users/${currentUser.username}/favorites/${id}`,
    method: 'delete',
    data: { token },
  });
}

// ============================================================
//                      Delete Story
// ============================================================
async function deleteStory(id){
  console.debug('deleteStory', id);

  const token = currentUser.loginToken;
  await axios({
    url: `https://private-anon-b3a3043498-hackorsnoozev3.apiary-proxy.com/stories/${id}`,
    method: 'delete',
    data: { token },
  });
}

// ====================================================
//  Take new story submission and create a new story
// ====================================================

async function uploadNewStory() {
  const title = $('#title').val();
  const author = $('#author').val();
  const url = $('#url').val();
  const username = currentUser.username;
  const storyObj = {title, author, url, username};

  const newStory = await storyList.addStory(currentUser, storyObj);

  generateStoryMarkup(newStory);
}

$('#new-story-form').on('submit', function(evt){
  evt.preventDefault();
  uploadNewStory();
  $('#new-story-form').trigger('reset');
})
