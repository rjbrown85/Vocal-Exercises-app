(() => {
  const controls = [];
  let opened;
  function close(focus = false) {
    if (!opened) return;
    const {button, menu} = opened;
    menu.remove(); button.setAttribute('aria-expanded', 'false');
    if (focus) button.focus();
    opened = null;
  }
  function sync() {
    controls.forEach(({select, button}) => {
      button.querySelector('span').textContent = select.selectedOptions[0]?.textContent || '';
      button.disabled = select.disabled;
      button.setAttribute('aria-label', button.dataset.label + ': ' + button.querySelector('span').textContent);
    });
  }
  document.querySelectorAll('select').forEach(select => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'menu-trigger';
    if (select.id === 'exercise') button.classList.add('exercise-trigger');
    button.innerHTML = '<span></span><span aria-hidden="true">⌄</span>';
    button.id = select.id + '-menu';
    if(select.hasAttribute('aria-describedby'))button.setAttribute('aria-describedby',select.getAttribute('aria-describedby'));
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    const label = document.querySelector(`label[for="${select.id}"]`);
    if (label) { label.htmlFor = button.id; label.id = select.id + '-label'; button.dataset.label = label.childNodes[0].textContent.trim(); }
    select.hidden = true;
    select.after(button);
    const entry = {select,button}; controls.push(entry);
    new MutationObserver(sync).observe(select,{childList:true,subtree:true,attributes:true});
    function open() {
      if (opened?.button === button) return close();
      close(); sync();
      const menu = document.createElement('div');
      menu.className = 'option-menu'; menu.id = select.id + '-options';
      menu.setAttribute('role','listbox');
      menu.setAttribute('aria-label',label?.childNodes[0]?.textContent.trim() || 'Exercise');
      button.setAttribute('aria-controls',menu.id);
      Array.from(select.options).forEach(option => {
        const row = document.createElement('button'); row.type = 'button'; row.className = 'option-row';
        row.textContent = option.textContent; row.setAttribute('role','option');
        row.setAttribute('aria-selected',String(option.selected)); row.disabled = option.disabled;
        row.addEventListener('click', () => {select.value = option.value;select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));sync();close(true);});
        menu.append(row);
      });
      document.body.append(menu);
      const rect = button.getBoundingClientRect();
      menu.style.width = Math.min(Math.max(rect.width,220),innerWidth-24)+'px';
      menu.style.left = Math.max(12,Math.min(rect.left,innerWidth-menu.offsetWidth-12))+'px';
      const below = innerHeight-rect.bottom-12, above = rect.top-12;
      const down = below >= Math.min(menu.scrollHeight,280) || below >= above;
      menu.style.maxHeight = Math.max(100,Math.min(360,down?below:above))+'px';
      if(down) menu.style.top = rect.bottom+6+'px'; else menu.style.bottom = innerHeight-rect.top+6+'px';
      button.setAttribute('aria-expanded','true');opened = {...entry,menu};
      const rows = Array.from(menu.querySelectorAll('button:not(:disabled)'));
      (rows.find(row=>row.getAttribute('aria-selected')==='true') || rows[0])?.focus();
      menu.addEventListener('keydown',e=>{
        const i = rows.indexOf(document.activeElement);
        let next;
        if(e.key==='ArrowDown') next=(i+1)%rows.length;
        if(e.key==='ArrowUp') next=(i-1+rows.length)%rows.length;
        if(e.key==='Home') next=0;
        if(e.key==='End') next=rows.length-1;
        if(next!==undefined){e.preventDefault();rows[next]?.focus();}
        if(e.key==='Escape'){e.preventDefault();close(true);}
        if(e.key==='Tab')close(true);
        if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){const match=rows.find((r,j)=>j>i&&r.textContent.toLowerCase().startsWith(e.key.toLowerCase()))||rows.find(r=>r.textContent.toLowerCase().startsWith(e.key.toLowerCase()));match?.focus();}
      });
    }
    button.addEventListener('click',open);
    button.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open();}});
  });
  document.addEventListener('pointerdown',e=>{if(opened&&!opened.menu.contains(e.target)&&!opened.button.contains(e.target))close();});
  document.addEventListener('change',()=>queueMicrotask(sync));
  document.addEventListener('click',()=>queueMicrotask(sync));
  window.addEventListener('resize',()=>close());
  window.addEventListener('scroll',e=>{if(opened&&!opened.menu.contains(e.target))close();},true);
  sync();
})();
