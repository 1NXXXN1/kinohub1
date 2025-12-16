
import { create } from 'zustand';
const KEY='kinohub:favorites';
export const useFavoritesStore=create((set,get)=>{
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  const save=(v)=>localStorage.setItem(KEY,JSON.stringify(v));
  return{
    items:[],
    hydrate:()=>set({items:load()}),
    isFavorite:(id)=>get().items.some(i=>i.id===id),
    toggle:(item)=>{
      const ex=get().items.some(i=>i.id===item.id);
      const v=ex?get().items.filter(i=>i.id!==item.id):[...get().items,item];
      save(v);set({items:v});
    },
    exportJSON:()=>JSON.stringify(get().items,null,2),
    importJSON:(json,mode='merge')=>{
      try{
        const inc=JSON.parse(json)||[];
        const cur=get().items;
        const map=new Map();
        (mode==='replace'?inc:cur).forEach(i=>map.set(i.id,i));
        if(mode==='merge') inc.forEach(i=>map.set(i.id,{...map.get(i.id),...i}));
        const v=[...map.values()]; save(v); set({items:v});
      }catch{}
    }
  }
});
