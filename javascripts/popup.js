//
let $button = document.querySelector('button');

//

$button.addEventListener('click', () => {
  getCurrentTab().then((tab) => {
    // console.log(tab);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showGrid
    });
  });
})

//

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function showGrid() {
  document.body.style.backgroundColor = 'orange';
}