// const tabId = getTabId();

if (!window.bgo) {

  window.bgo = {};

  const stylesUrl = chrome.runtime.getURL('stylesheets/content.css');

  const styles = `
    <link href="${stylesUrl}" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;700&display=swap" rel="stylesheet">
  `;

  const containers = [
    { class: 'container'      , label: 'Container' },
    { class: 'container-fluid', label: 'Container Fluid' },
    { class: 'container-sm'   , label: 'Container SM' },
    { class: 'container-md'   , label: 'Container MD' },
    { class: 'container-lg'   , label: 'Container LG' },
    { class: 'container-xl'   , label: 'Container XL' },
    { class: 'container-xxl'  , label: 'Container XXL' },
  ];

  const cols = Array(12).fill(true).map(() => `<div class="col"><div class="bgo_inner"></div></div>`);

  const containerClasses = containers.map(m => m.class)
  const containerOptions = containers.map(m => `<option value="${m.class}">${m.label}</option>`)

  // Courtesy of https://ionic.io/ionicons
  const icons = {
    close: '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>',
  }

  window.bgo._ = document.createElement('div');
  window.bgo._.className = `bgo`;
  window.bgo._.style = `display: none`;
  window.bgo._.innerHTML = `

    ${styles}

    <div class="bgo_wrapper __loading">

      <div class="bgo_grid">
        <div class="bgo_container container">
          <div class="row">
            ${cols.join('')}
          </div>
        </div>
      </div>

      <div class="bgo_tools">
        <div class="bgo_tools__i" data-tool="toggle">
          <button class="bgo_tools__toggle">Toggle</button>
        </div>

        <div class="bgo_tools__i" data-tool="container">
          <select>
            ${containerOptions}
          </select>
        </div>

        <div class="bgo_tools__i" data-tool="background">
          <label>Background</label>
          <input type="color">
        </div>

        <div class="bgo_tools__i" data-tool="border">
          <label>Border</label>
          <input type="color">
          <input type="number" value="0">
        </div>

        <div class="bgo_tools__i" data-tool="delete">
          <button>${icons.close}</button>
        </div>
      </div>

    </div>
  `;

  //

  document.body.appendChild(window.bgo._);

  //

  const wrapper = window.bgo._.querySelector('.bgo_wrapper');
  const container = window.bgo._.querySelector('.bgo_container');
  const inners = window.bgo._.querySelectorAll('.bgo_inner');
  //
  const toolToggle      = window.bgo._.querySelector('.bgo_tools__i[data-tool="toggle"] > button');
  const toolContainer   = window.bgo._.querySelector('.bgo_tools__i[data-tool="container"] > select');
  const toolBackground  = window.bgo._.querySelector('.bgo_tools__i[data-tool="background"] > input[type="color"]');
  const toolBorderColor = window.bgo._.querySelector('.bgo_tools__i[data-tool="border"] > input[type="color"]');
  const toolBorderWidth = window.bgo._.querySelector('.bgo_tools__i[data-tool="border"] > input[type="number"]');
  const toolDelete      = window.bgo._.querySelector('.bgo_tools__i[data-tool="delete"] > button');

  setTimeout(() => {
    window.bgo._.style = '';
    wrapper.classList.remove('__loading');
  });

  toolToggle.addEventListener('click', () => wrapper.classList.toggle('__hidden'));

  toolContainer.addEventListener('change', (e) => {
    container.classList.remove(...containerClasses);
    container.classList.add(e.target.value);
  });

  toolBackground.addEventListener('change', (e) => {
    inners.forEach(el => el.style.backgroundColor = e.target.value);
  });

  toolBorderColor.addEventListener('change', (e) => {
    inners.forEach(el => el.style.borderColor = e.target.value);
  });

  toolBorderWidth.addEventListener('change', (e) => {
    inners.forEach(el => {
      el.style.borderLeftWidth = `${e.target.value}px`;
      el.style.borderRightWidth = `${e.target.value}px`;
    });
  });

  toolDelete.addEventListener('click', (e) => {
    // Remove the element
    document.body.removeChild(window.bgo._);

    // Delete the info stored in `window`
    delete window.bgo;
  });

} else {

  // Remove the element
  document.body.removeChild(window.bgo._);

  // Delete the info stored in `window`
  delete window.bgo;

}
