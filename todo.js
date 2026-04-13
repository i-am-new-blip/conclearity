PluginCheck=function(p){
                const _={STRING:'STRING',NUMBER:'NUMBER',BIGINT:'BIGINT',BOOLEAN:'BOOLEAN',SELECT:'SELECT',SLIDER:'SLIDER',COMPONENT:'COMPONENT',CUSTOM:'CUSTOM'}
                function typecheck(type,thing,def,name){var req=def==null;type=req?[type]:[type,'undefined'];assert(type.includes(typeof thing),`${name} must be ${type}${req?"":" or not exist"}`);thing||=def;return thing};["name","description","authors","start","stop"].forEach(i=>{assert(p[i],`Required field: ${i} is missing, please include it.`)});function normalChecks(d){typecheck('string',d.description,'',"The component's description");typecheck('string',d.placeholder,'',"The placeholder text");typecheck('function',d.onChange,undefined,"The component's onChange");typecheck('boolean',d.restartNeeded,!0,"The component's restartNeeded");typecheck('boolean',d.hidden,!1,"The component's visibility")}
                let i={
                STRING(d){
                    normalChecks(d)
                    typecheck('string',d.default,undefined,'d.default')
                    return {type:_.STRING,default:d.default,description:d.description,placeholder:d.placeholder,onChange:d.onChange,restartNeeded:d.restartNeeded,hidden:d.hidden}
                },NUMBER(d){
                    normalChecks(d)
                    typecheck('number',d.default,undefined,'d.default')
                    return {type:_.NUMBER,default:d.default,description:d.description,placeholder:d.placeholder,onChange:d.onChange,restartNeeded:d.restartNeeded,hidden:d.hidden}
                },BIGINT(d){
                    normalChecks(d)
                    typecheck('bigint',d.default,undefined,'d.default')
                    return {type:_.BIGINT,default:d.default,description:d.description,placeholder:d.placeholder,onChange:d.onChange,restartNeeded:d.restartNeeded,hidden:d.hidden}
                },BOOLEAN(d){
                    normalChecks(d)
                    typecheck('boolean',d.default,undefined,'d.default')
                    return {type:_.BOOLEAN,default:d.default,description:d.description,placeholder:d.placeholder,onChange:d.onChange,restartNeeded:d.restartNeeded,hidden:d.hidden}
                },SELECT(d){
                    normalChecks(d)
                    typecheck('string',d.default,undefined,'d.default')
                    if (d.options!==undefined){
                        assert(typeof d.options=="object"&&!Array.isArray(d.options),"options must be an dictionary")
                        assert((m=>(d.options.forEach(_=>{if(!(typeof _.label=="string"&&["string","number","boolean"].includes(typeof _.value)&&["boolean","undefined"].includes(typeof _.default)))m=1}),!m)(),"options must be valid options"))
                    }
                    return {type:_.SELECT,options:d.options,description:d.description,placeholder:d.placeholder,onChange:d.onChange,restartNeeded:d.restartNeeded,hidden:d.hidden}
                },SLIDER(d){
                    normalChecks(d)
                    assert(typeof d.markers=="object"&&Array.isArray(d.markers),"d.markers must be a array")
                    assert(d.markers.length>1,"d.markers must have length higher than 1")
                    typecheck('number',d.default,null,'d.default')
                    typecheck('boolean',d.stickToMarkers,true,'stickToMarkers')
                    return {type:_.SLIDER,markers:d.markers,default:d.default,stickToMarkers:d.stickToMarkers,description:d.description,placeholder:d.placeholder,onChange:d.onChange,restartNeeded:d.restartNeeded,hidden:d.hidden}
                },COMPONENT(d){
                    normalChecks(d)
                    typecheck('function',d.component,null,'d.component')
                    return {type:_.COMPONENT,component:d.component,default:d.default??null,onChange:d.onChange,restartNeeded:d.restartNeeded,hidden:d.hidden}
                },CUSTOM(d){
                    typecheck('function',d.onChange,undefined,"The component's onChange")
                    return {type:_.CUSTOM,'default':d.default,onChange:d.onChange}
                }}
                ,j=a=>Array.isArray(a)?a.map(a=>(
                        assert(typeof a=="object"&&!Array.isArray(a),"Must be an dictionary"),
                        assert(Object.entries(a).length==2,"Must be 2 in length, with name and id keys"),
                        assert(a.name && typeof a.name=="string", "Must have field name which has to be an string type"),
                        assert(a.id, "Must have field id"),
                        assert(typeof a.id=="bigint","Preferably must have id as bigints, future proofing."),{id:a.id, name:a.name}
                    )):null
                ,k=(v,t,r=0,c=0)=>(!c?typeof p[v]==t:t(p[v]))?p[v]:(r?(p[v]===undefined?null:assert(0,`${v} field must be a ${t} or not exist`)):assert(0,`${v} field must be a ${t}`))
                ,l={authors:j(p.authors),description:k('description','string'),name:k('name','string'),start:k('start','function'),stop:k('stop','function'),dependencies:((a=k('dependencies',T=>typeof T=='object'&&Array.isArray(T),1,1))=>(a?a.every(x=>typeof x==="string")?a:assert(0,"Some of the dependencies's values wasn't supplied \nthe correct type."):[])),required:k('required','boolean',1),hidden:k('hidden','boolean',1),enabledByDefault:k('enabledByDefault','boolean',1),settings:k('settings',a=>typeof a=="object"&&!Array.isArray(a),1,1)};
                return (l.settings?l.settings.map(X=>(assert(X.type,"Type must exist."),i[X.type](X))):0),l
}

MinimalisticIDB=function(v=1,k="ClarityStore",o="a",_="readwrite",__="readonly"){e=(b,a)=>new Promise((s,j)=>{r=indexedDB.open(k,v),r.onupgradeneeded=()=>{r.result.createObjectStore(o)},r.onsuccess=()=>{p=r.result,l=p.transaction(o,b),h=l.objectStore(o),q=a(h);l.oncomplete=()=>s(q),l.onerror=()=>j(l.error)},r.onerror=()=>j(r.error)});return{s:(k,v)=>e(_,s=>s.put(v,k)),g:k=>e(__,s=>s.get(k)),d:k=>e(_,s=>s.delete(k))}}
