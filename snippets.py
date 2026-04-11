class EnumLike():
    vals=[]
    def __init__(self,*values): self.vals=values
def join_expr(code,after=0,header="",sep=","):
    return f'{header}({sep.join(code)}{(","+after)if after else""})' if len(code)>1 else code[0]


def ash(t,n):
            return f'[{",".join(map(lambda x:f'"{x}"',t))}].includes({n})' if len(t) >1 else f'{n}=="{t[0]}"'
        
def type(uu) -> list:
    ret=[]
    for x in uu:
        warn,required=False,True
        try: warn = x[3]# noqa: E701
        except: pass  # noqa: E701, E722
        try: required = x[2]# noqa: E701
        except: pass  # noqa: E701, E722
        types = x[1]
        n=x[0]
        function="console.assert"if warn else"assert"
        base = f'{n} must be %BASE%'
        code=[]
        for i in types:
            if isinstance(i, str):
                i=[i]
            if not required: 
                i.append("undefined")
            F=0
            if 'EnumLike' in i[0]:
                F=eval(i[0]).vals
            msg = base.replace("%BASE%",' or '.join(i)).replace('or undefined','or not exist')
            code.append(f'{function}({ash(i if not F else F,f'typeof {n}' if not F else n)},"{msg}")')
        ret.append(join_expr(code))
    return join_expr(ret)
def namedd(o,con=False) -> str:
    new=[]
    for i in o:
        name=i.split('.')[-1]
        new.append(f'{name}:{i}')
    return (','if con else'{')+','.join(new)+"}"
def simpleTSexpr2JS(exprs,parent):
    t=[]
    for expr in exprs:
        q=0
        default, iden,split = None,"",expr.split("=",1)
        if split != [expr]: 
            default = split[1].lstrip() 
        split = split[0].split(':',1)
        if split != [expr]: 
            iden = split[1].strip()
        o=split[0]
        split[0] = split[0].replace('?','')
        if o==split[0]: 
            q=1
        check = type([[f"{parent}.{split[0]}",[iden],default is None or q]])
        r=[check]
        default_expr = f'{parent}.{split[0]}||={default}'
        r.append(default_expr) if default else None
        t.append(join_expr(r))
    return join_expr(t)
    
    
print(simpleTSexpr2JS(["description: string","placeholder?: string","onChange?: function","restartNeeded: boolean = !0","hidden: boolean = !1","target: EnumLike('WEB','DESKTOP','BOTH') = 'BOTH'"],'d'))
print(type([["d.description",["string"]],["d.placeholder",["string"],False],["d.onChange",["function"],False],["d.restartNeeded",["boolean"],]]))
