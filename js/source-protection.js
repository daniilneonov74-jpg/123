(() => {
  document.addEventListener('contextmenu', event => {
    event.preventDefault();
  }, true);

  document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    const isModifier = event.ctrlKey || event.metaKey;
    const isContextMenuShortcut = event.key === 'ContextMenu'
      || (event.shiftKey && event.key === 'F10');
    const isDeveloperToolsShortcut = event.key === 'F12'
      || (isModifier && key === 'u')
      || (isModifier && event.shiftKey && ['c', 'i', 'j', 'k'].includes(key))
      || (event.metaKey && event.altKey && ['c', 'i', 'j'].includes(key));

    if (isContextMenuShortcut || isDeveloperToolsShortcut) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
})();
