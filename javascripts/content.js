if (!window.BGO) {

  // Create a new Object inside a window.BGO
  window.BGO = {};

  window.BGO._ = null;

  window.BGO.isDebug = false;

  window.BGO.settings = {};

  window.BGO.fn = {};
  window.BGO.fn.debug = (callback) => window.BGO.isDebug && callback();

  window.BGO.fn.install = async () => {

    // Set some defaults settings
    const bgoDefaultsSettings = {
      container:   'container',
      columns:     12,
      opacity:     .5,
      background:  'rgb(255, 133, 0)', // RGB value for secondary color in CSS (--bgo-secondary)
      borderColor: 'rgb(0, 34, 277)',  // RGB value for primary color in CSS (--bgo-primary)
      borderWidth: 0,
    }

    // await window.BGO.fn.localStorage.remove('bgo');
    let localStorageSettings = await window.BGO.fn.localStorage.get('bgo');

    if (!localStorageSettings?.bgo) {
      await window.BGO.fn.localStorage.set({ bgo: bgoDefaultsSettings });
      localStorageSettings = await window.BGO.fn.localStorage.get('bgo');
    }

    window.BGO.settings = localStorageSettings.bgo;

    window.BGO.fn.debug(() => {
      console.group(`%cwindow.BGO.settings`, `color: coral; font-weight: bold;`)
      console.table(window.BGO.settings);
      console.groupEnd();
    });

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
      `<option value="${m.class}" ${m.class == window.BGO.settings.container ? 'selected' : ''}>${m.label}</option>`)

    // Courtesy of https://ionic.io/ionicons
    const icons = {
      close: '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>',
    }

    window.BGO._ = document.createElement('div');
    window.BGO._.className = `bgo`;
    window.BGO._.style = `display: none`;
    window.BGO._.innerHTML = `

      ${styles}

      <div class="bgo_wrapper __loading">

        <div class="bgo_grid">
          <div class="bgo_container ${window.BGO.settings.container}">
            <div class="bgo_row row">
              ${window.BGO.fn.columns(window.BGO.settings.columns)}
            </div>
          </div>
        </div>

        <div class="bgo_tools">

          <div class="bgo_tools__i" data-tool="toggle">
            <button class="bgo_tools__toggle">Toggle</button>
          </div>

          <div class="bgo_tools__i" data-tool="delete">
            <button>${icons.close}</button>
          </div>

          <div class="bgo_tools__nl"></div>

          <div class="bgo_tools__i" data-tool="columns">
            <label>Columns</label>
            <input type="number" value="${window.BGO.settings.columns}">
          </div>

          <div class="bgo_tools__i" data-tool="container">
            <label>Container</label>
            <select>
              ${containerOptions}
            </select>
          </div>

          <div class="bgo_tools__i" data-tool="background">
            <label>Background<br><span>Color / Opacity</span></label>
            <input type="color" value="${window.BGO.settings.background}">
            <input type="range" value="${window.BGO.settings.opacity}" min="0" max="1" step="0.01">
          </div>

          <div class="bgo_tools__i" data-tool="border">
            <label>Border<br><span>Color / Width</span></label>
            <input type="color" value="${window.BGO.settings.borderColor}">
            <input type="number" value="${window.BGO.settings.borderWidth}">
          </div>

        </div>
      </div>
    `;

    // Append the element to the body
    document.body.appendChild(window.BGO._);

    // Get some variables
    const wrapper   = window.BGO._.querySelector('.bgo_wrapper');
    const container = window.BGO._.querySelector('.bgo_container');
    const row       = window.BGO._.querySelector('.bgo_row');
    //
    const toolToggle      = window.BGO._.querySelector('.bgo_tools__i[data-tool="toggle"] > button');
    const toolDelete      = window.BGO._.querySelector('.bgo_tools__i[data-tool="delete"] > button');
    const toolColumns     = window.BGO._.querySelector('.bgo_tools__i[data-tool="columns"] > input');
    const toolContainer   = window.BGO._.querySelector('.bgo_tools__i[data-tool="container"] > select');
    const toolBackground  = window.BGO._.querySelector('.bgo_tools__i[data-tool="background"] > input[type="color"]');
    const toolOpacity     = window.BGO._.querySelector('.bgo_tools__i[data-tool="background"] > input[type="range"]');
    const toolBorderColor = window.BGO._.querySelector('.bgo_tools__i[data-tool="border"] > input[type="color"]');
    const toolBorderWidth = window.BGO._.querySelector('.bgo_tools__i[data-tool="border"] > input[type="number"]');

    // Update the current backgroung and border, by setting some CSS variables
    window.BGO.fn.innerProp('background',   window.BGO.settings.background);
    window.BGO.fn.innerProp('opacity',      window.BGO.settings.opacity);
    window.BGO.fn.innerProp('border-color', window.BGO.settings.borderColor);
    window.BGO.fn.innerProp('border-width', `${window.BGO.settings.borderWidth}px`);

    // Basically show the element, without any fancy "animation" (or better, glitch)
    setTimeout(() => {
      window.BGO._.style.display = '';
      wrapper.classList.remove('__loading');
    });

    // Events for "tools"
    toolToggle.addEventListener('click', () => wrapper.classList.toggle('__hidden'));

    toolDelete.addEventListener('click', (e) => window.BGO.fn.uninstall());

    toolColumns.addEventListener('input', (e) => {
      window.BGO.settings.columns = +e.target.value;
      window.BGO.fn.localStorage.set({ bgo: window.BGO.settings }).then(() => {
        row.innerHTML = window.BGO.fn.columns(window.BGO.settings.columns);
      });
    });

    toolContainer.addEventListener('change', (e) => {
      window.BGO.settings.container = e.target.value;
      window.BGO.fn.localStorage.set({ bgo: window.BGO.settings }).then(() => {
        container.classList.remove(...containerClasses);
        container.classList.add(window.BGO.settings.container);
      });
    });

    toolBackground.addEventListener('input', (e) => {
      window.BGO.settings.background = e.target.value;
      window.BGO.fn.localStorage.set({ bgo: window.BGO.settings }).then(() =>
        window.BGO.fn.innerProp('background', window.BGO.settings.background));
    });

    toolOpacity.addEventListener('input', (e) => {
      window.BGO.settings.opacity = e.target.value;
      window.BGO.fn.localStorage.set({ bgo: window.BGO.settings }).then(() =>
        window.BGO.fn.innerProp('opacity', window.BGO.settings.opacity));
    });

    toolBorderColor.addEventListener('input', (e) => {
      window.BGO.settings.borderColor = e.target.value;
      window.BGO.fn.localStorage.set({ bgo: window.BGO.settings }).then(() =>
        window.BGO.fn.innerProp('border-color', window.BGO.settings.borderColor));
    });

    toolBorderWidth.addEventListener('input', (e) => {
      window.BGO.settings.borderWidth = e.target.value;
      window.BGO.fn.localStorage.set({ bgo: window.BGO.settings }).then(() =>
        window.BGO.fn.innerProp('border-width', `${window.BGO.settings.borderWidth}px`));
    });

  };

  window.BGO.fn.uninstall = () => {
    // Remove the element
    document.body.removeChild(window.BGO._);

    // Delete the info stored in `window`
    delete window.BGO;
  };

  window.BGO.fn.columns = length => Array(length)
    .fill(true)
    .map(() => `<div class="col"><div class="bgo_inner"></div></div>`)
    .join('');

  window.BGO.fn.innerProp = (key, value) =>
    window.BGO._?.style.setProperty(`--bgo-inner-${key}`, value);

  window.BGO.fn.isFirefox = typeof browser != 'undefined' ? true : false;

  window.BGO.fn.localStorage = {
    remove: async (key) => {
      if (window.BGO.fn.isFirefox) {
        return browser.storage.local.remove();
      } else {
        return new Promise(resolve => chrome.storage.local.remove(key, resolve))
      }
    },
    get: async (key) => {
      if (window.BGO.fn.isFirefox) {
        return browser.storage.local.get();
      } else {
        return new Promise(resolve => chrome.storage.local.get([key], resolve))
      }
    },
    set: async (obj) => {
      if (window.BGO.fn.isFirefox) {
        return browser.storage.local.set(obj);
      } else {
        return new Promise(resolve => chrome.storage.local.set(obj, resolve))
      }
    },
  };

  // Install the component
  window.BGO.fn.install();

  window.BGO.fn.debug(() => console.log(window.BGO));

} else {

  // Uninstall the component
  window.BGO.fn.uninstall();

}
