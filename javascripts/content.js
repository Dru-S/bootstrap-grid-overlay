if (!window.bgo) {

  window.bgo = {};
  window.bgo.fn = {};

  window.bgo.fn.install = async () => {

    // Set some defaults settings
    const bgoDefaultsSettings = {
      container:   'container-fluid',
      columns:     24,
      background:  'rgb(255, 133, 0)', // RGB value for secondary color in CSS (--bgo-secondary)
      borderColor: 'rgb(0, 34, 277)', // RGB value for primary color in CSS (--bgo-primary)
      borderWidth: 0,
    }

    // await window.bgo.fn.localStorage.remove('bgo');
    let localStorageSettings = await window.bgo.fn.localStorage.get('bgo');

    if (!localStorageSettings?.bgo) {
      await window.bgo.fn.localStorage.set({ bgo: bgoDefaultsSettings });
      localStorageSettings = await window.bgo.fn.localStorage.get('bgo');
    }

    window.bgo.settings = localStorageSettings.bgo;
    console.log(window.bgo.settings);

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

    const containerClasses = containers.map(m => m.class);
    const containerOptions = containers.map(m =>
      `<option value="${m.class}" ${m.class == window.bgo.settings.container ? 'selected' : ''}>${m.label}</option>`)

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
          <div class="bgo_container ${window.bgo.settings.container}">
            <div class="bgo_row row">
              ${window.bgo.fn.columns(window.bgo.settings.columns)}
            </div>
          </div>
        </div>

        <div class="bgo_tools">
          <div class="bgo_tools__i" data-tool="toggle">
            <button class="bgo_tools__toggle">Toggle</button>
          </div>

          <div class="bgo_tools__i" data-tool="columns">
            <input type="number" value="${window.bgo.settings.columns}">
          </div>

          <div class="bgo_tools__i" data-tool="container">
            <select>
              ${containerOptions}
            </select>
          </div>

          <div class="bgo_tools__i" data-tool="background">
            <label>Background</label>
            <input type="color" value="${window.bgo.settings.background}">
          </div>

          <div class="bgo_tools__i" data-tool="border">
            <label>Border</label>
            <input type="color" value="${window.bgo.settings.borderColor}">
            <input type="number" value="${window.bgo.settings.borderWidth}">
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

    const wrapper   = window.bgo._.querySelector('.bgo_wrapper');
    const container = window.bgo._.querySelector('.bgo_container');
    const row       = window.bgo._.querySelector('.bgo_row');
    //
    let inners = window.bgo._.querySelectorAll('.bgo_inner');
    //
    const toolToggle      = window.bgo._.querySelector('.bgo_tools__i[data-tool="toggle"] > button');
    const toolColumns     = window.bgo._.querySelector('.bgo_tools__i[data-tool="columns"] > input');
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

    toolColumns.addEventListener('input', (e) => {
      window.bgo.settings.columns = +e.target.value;
      window.bgo.fn.localStorage.set({ bgo: window.bgo.settings }).then(() => {
        row.innerHTML = window.bgo.fn.columns(window.bgo.settings.columns);
        inners = window.bgo._.querySelectorAll('.bgo_inner');
      })
    });

    toolContainer.addEventListener('change', (e) => {
      window.bgo.settings.container = e.target.value;
      window.bgo.fn.localStorage.set({ bgo: window.bgo.settings }).then(() => {
        container.classList.remove(...containerClasses);
        container.classList.add(window.bgo.settings.container);
      })
    });

    toolBackground.addEventListener('input', (e) => {
      inners.forEach(el => el.style.backgroundColor = e.target.value);
    });

    toolBorderColor.addEventListener('input', (e) => {
      inners.forEach(el => el.style.borderColor = e.target.value);
    });

    toolBorderWidth.addEventListener('input', (e) => {
      inners.forEach(el => {
        el.style.borderLeftWidth = `${e.target.value}px`;
        el.style.borderRightWidth = `${e.target.value}px`;
      });
    });

    toolDelete.addEventListener('click', (e) => window.bgo.fn.uninstall());
  };

  window.bgo.fn.uninstall = () => {
    // Remove the element
    document.body.removeChild(window.bgo._);

    // Delete the info stored in `window`
    delete window.bgo;
  };

  window.bgo.fn.columns = length => Array(length)
    .fill(true)
    .map(() => `<div class="col"><div class="bgo_inner"></div></div>`)
    .join('');

  window.bgo.fn.isFirefox = typeof browser != 'undefined' ? true : false;

  window.bgo.fn.localStorage = {
    remove: async (key) => {
      if (window.bgo.fn.isFirefox) {
        return browser.storage.local.remove();
      } else {
        return new Promise(resolve => chrome.storage.local.remove(key, resolve))
      }
    },
    get: async (key) => {
      if (window.bgo.fn.isFirefox) {
        return browser.storage.local.get();
      } else {
        return new Promise(resolve => chrome.storage.local.get([key], resolve))
      }
    },
    set: async (obj) => {
      if (window.bgo.fn.isFirefox) {
        return browser.storage.local.set(obj);
      } else {
        return new Promise(resolve => chrome.storage.local.set(obj, resolve))
      }
    },
  };

  window.bgo.fn.install();

} else {

  window.bgo.fn.uninstall();

}
