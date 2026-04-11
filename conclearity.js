(function(noreuse=0){
    if (!window.version){window.version=1.00}
    const pallete = {system: "#22c55e",ui:"#3b82f6",base:"#a855f7",unsafe:"#f59e0b",asserts:"#ef4444",unknown:"#94a3b8"}
    if(window.Conclearity){
        var oldconc = window.Conclearity
        if (noreuse)window.Conclearity.uload()
        else 
            return window.Conclearity.Logger("Reuse",pallete.unsafe
            ).info("Conclearity has already been launched. to rerun it do `window.Conclearity.uload()`, then initialize this again or alternativelly do with 1 being the arg")
    }
    window.Conclearity = (function(){
        const ConclearityObject = {
            observing:0,
            hashmaps:{},
            uload:function(){
                for (let i=0;i<this.uload.evl.length;i++){let v=this.uload.evl[i];v[0].removeEventListener(v[1],v[2])} // kills event listeners
                for (let i=0;i<this.uload.el.length;i++) this.uload.el[i].remove() // kills elements
                if (location.pathname.startsWith('/my/settings')) {
                    const nav = document.querySelector(".nav.nav-pills.flex-column");
                    if (!nav.querySelector('.active'))nav.parentElement.parentElement.children[1].innerHTML=`Sadly, this was also <b>removed</b> due to the usage of <code>window.Conclearity.uload()</code>. <br>So do something else... idk? or go to an <a href='/my/settings/profile'><b>PT config page</b></a> to put to the original state <br><b style="font-size: 50px">.̮.</b>`
                } // puts you into another page if you were on a deleted settings
                delete window.Conclearity // and destroys itself
            },
            addEventListener:function(a,b,c){
                a.addEventListener(b,c);this.uload.evl.push([a,b,c])
            },
            
            RestartWarner:(function(r=[]){return {a:p=>(r.push(p)),b:()=>{if(r.length)Swal.fire({title:"RELOAD REQUIRED",html:`The following plugins require a restart:<br><pre><code>${r.join(", ")}</code></pre>`,icon:"warning",showCancelButton:!0,confirmButtonText:"Restart now",cancelButtonText:"Later!"}).then(res=>{if(res.isConfirmed)location.reload()});r=[]}}}),


            Logger(name, color){
                    function _log(level, levelColor, args ,customFmt = ""){
                        console[level](
                            `%c Conclearity %c %c ${name} ${customFmt}`,
                            `background:${levelColor}; color:black; font-weight:bold; border-radius:5px;`,
                            "",
                            `background:${color}; color:black; font-weight:bold; border-radius:5px;`
                            , ...args
                        );
                    }
                    return{
                    makeTitle(color, title){
                        return ["%c %c %s ", "", `background:${color}; color:black; font-weight:bold; border-radius:5px;`, title]            
                    },
                    log(...t){ _log('log',"#a6d189",t) },
                    info(...t){ _log('info', "#a6d189",t) },
                    error(...t){  _log('error',"#e78284",t)},
                    errorCustomFmt(fmt, ...t){ _log('error',"#e78284",t,fmt) },
                    warn(...t){ _log('warn', "#e5c890",t) },
                    debug(...t){ _log('debug','#eebebe',t) }}
            },
            Inject(selec, html, onMounted) {
                    const sel = selec instanceof HTMLElement ? selec : document.querySelector(selec)
                    if (!sel) return null
                    sel.insertAdjacentHTML("beforeend", html)
                    const elem = sel.lastElementChild
                    if (onMounted) onMounted(elem)
                    return elem
            },
            Components: class {
                #helper = document.createElement('div');

                constructor(Conclearity) {
                    this.Conclearity = Conclearity;
                    this.Conclearity.uload.el.push(this.#helper)
                }

                #createElement(html) {
                    this.#helper.innerHTML = html;
                    const element = this.#helper.firstElementChild;
                    this.#helper.innerHTML = ""; // clear helper for reuse
                    this.Conclearity.uload.el.push(element)
                    return {
                        element,
                        inject(target){ element.appendChild(target)}
                    }
                }

                selectElement(options) {
                    const elem = this.#createElement(`<select class="form-select bg-dark mb-3 mt-1"></select>`);
                    if (options) {
                        var i=0
                        Object.entries(options).forEach(([key, value]) => {
                            const option = document.createElement('option');
                            option.value = value;
                            option.textContent = key;
                            if(!i)option.selected="";i++
                            elem.element.appendChild(option);
                        });
                    }

                    return {
                        ...elem,
                        setOptions: (newOptions) => {
                            const select = this.element.querySelector('select');
                            elem.element.innerHTML = "";
                            Object.entries(newOptions).forEach(([key, value]) => {
                                const option = document.createElement('option');
                                option.value = value;
                                option.textContent = key;
                                select.appendChild(option);
                            });
                            return this.element;
                        },
                    };
                }

                tabElementName(firstelem,name) {
                    const elem = this.#createElement(`<a class="nav-link">${firstelem}<span class="pilltitle">${name}</span></a>`);

                    return {
                        ...elem,
                        setViewName: (newName) => {
                            this.element.querySelector('span.pilltitle').textContent = newName;
                            return this.element;
                        }
                    };
                }

                TabCard(names){
                    const elem=this.#createElement(`<div class="card mcard"><div class="card-header"></div><div class="card-body"></div></div>`)
                    const tabselem=this.#createElement(`<ul class="nav nav-tabs card-header-tabs"></ul>`)
                    if (!names||typeof names!=="object"||Array.isArray(names)){
                        this.Conclearity.Logger("Validation error",pallete.asserts).error("names must be a object being like this: {viewname:html,...}");return
                    }
                    var header=elem.element.querySelector('.card-header'),body=elem.element.querySelector('.card-body')
                    const entries = Object.entries(names)
                    if (entries.length === 1){
                        const [name, html] = entries[0]
                        header.innerHTML=name
                        body.innerHTML=html
                        return elem 
                    } else {
                        entries.forEach(([name, html], i)=>{
                            var li=document.createElement('li')
                            li.className="nav-item"
                            li.innerHTML=`<a class="nav-link${!i?' active':''}">${name}</a>`
                            this.Conclearity.addEventListener(li.querySelector('a'),'click',function(){
                                console.log('click into the my a')
                                body.innerHTML=html
                            }) // o i dont work
                            if(!i) body.innerHTML=html
                            tabselem.inject(li)
                        })
                    }
                    header.appendChild(tabselem.element)

                    return elem
                }

            },
            CreateTab(firstelemHTML, name, viewHTML,hashid) {
                    if (!location.pathname.startsWith('/my/settings')) {this.Logger("CreateTab Logger",pallete.ui).warn("CreateTab can only work on /my/settings");return}
                    const nav = document.querySelector(".nav.nav-pills.flex-column");
                    viewHTML = viewHTML instanceof HTMLElement ? viewHTML.outerHTML : viewHTML

                    if (!this.observing){
                        this.observing=1
                        const content = nav.parentElement.parentElement.children[1]
                        this.addEventListener(document,'hashchange',()=>{
                            var active = nav.querySelector('a.nav-link.active')
                            [elem, html] = this.hashmaps[location.hash]// console.log(active,lastGuy)
                            // why do the same thing? polythoria can change, Conclearity won't.
                            active.classList.remove("active") // removes the highlight
                            elem.element .classList.add("active")
                            // html now
                            if (content) content.innerHTML = html
                            this.RestartWarner.b()
                        })
                    }

                    var template = this.Components.tabElementName(firstelemHTML,name)
                    template.element.href = `#conctab:${hashid}`
                    nav.appendChild(template.element)
                    this.hashmaps[`conctab:${hashid}`] = [template,viewHTML]

                    return template
            },
            initTabs(){
                this.CreateTab('<i class="fas fa-cog me-1"></i>','Conclearity','ello my friends!')
            }
        }
        ConclearityObject.RestartWarner=ConclearityObject.RestartWarner()
        ConclearityObject.uload.el=[]
        ConclearityObject.uload.evl=[];
        ConclearityObject.Components = new ConclearityObject.Components(ConclearityObject)
        ConclearityObject.initTabs()
        return ConclearityObject
    })()

    if (oldconc){
        version += 0.01
    }

    window.Conclearity.Logger(`UP & running on version: v${version}`,pallete.system).log()
})(1)