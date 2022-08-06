// const tabId = getTabId();

if (!window.bgo) {

  window.bgo = {};

  const styles = `
    <style>
      .bgo_wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 10000;
      }

      .bgo_grid {
        width: 100%;
        height: 100%;
      }

      .bgo_grid * {
        height: 100%;
      }

      .bgo_inner {
        background: coral;
        opacity: .5;
        transition: opacity .35s ease;
      }

      .bgo_wrapper.__hidden .bgo_inner {
        opacity: 0;
      }

      /**/

      .bgo_tools {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 20px;
      }

      .bgo_tools__i {
        pointer-events: auto;
      }
    </style>
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

  const cols = Array(12).fill(true).map(() => `<div class="col-1"><div class="bgo_inner"></div></div>`);

  const containerClasses = containers.map(m => m.class)
  const containerOptions = containers.map(m => `<option value="${m.class}">${m.label}</option>`)

  window.bgo.wrapper = document.createElement('div');
  window.bgo.wrapper.className = `bgo_wrapper`;
  window.bgo.wrapper.innerHTML = `
    ${styles}
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
    </div>
  `;

  //

  document.body.appendChild(window.bgo.wrapper);

  //

  window.bgo.container = window.bgo.wrapper.querySelector('.bgo_container');

  document.querySelector('.bgo_tools__i[data-tool="toggle"] > button')
    .addEventListener('click', () => window.bgo.wrapper.classList.toggle('__hidden'));

  document.querySelector('.bgo_tools__i[data-tool="container"] > select')
    .addEventListener('change', (e) => {
      window.bgo.container.classList.remove(...containerClasses);
      window.bgo.container.classList.add(e.target.value);
    });

} else {

  document.body.removeChild(window.bgo.wrapper);

  delete window.bgo;

}
