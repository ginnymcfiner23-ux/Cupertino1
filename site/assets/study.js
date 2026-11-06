
document.querySelectorAll('table[data-filter]').forEach(function(t){
  var box=document.createElement('input');box.className='filter';box.placeholder='Filter rows…';
  t.parentElement.insertBefore(box,t);
  box.addEventListener('input',function(){var q=box.value.toLowerCase();
    t.querySelectorAll('tbody tr').forEach(function(r){r.style.display=r.textContent.toLowerCase().indexOf(q)>-1?'':'none';});});
});
