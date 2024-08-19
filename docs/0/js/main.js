window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const {h1, p} = van.tags
    const author = 'ytyaru'
    van.add(document.querySelector('main'), 
        h1(van.tags.a({href:`https://github.com/${author}/Html.VanJS.List.20240818091905/`}, 'List')),
        p('List'),
//        p('List'),
    )
    van.add(document.querySelector('footer'),  new Footer('ytyaru', '../').make())

    const a = new Assertion()
    const bb = new BlackBox(a)
    a.t((new List()) instanceof List)
    a.t(List.of() instanceof List)
    a.t(0===List.of().index)
    a.t(0===List.of().lastIndex)
    a.t(0===List.of().length)
    a.e(TypeError, `未定義プロパティへの参照禁止: 0`, ()=>List.of()[0])
    a.e(TypeError, `未定義プロパティへの代入禁止: 0`, ()=>List.of()[0]=1)
    a.t(5===List.of([5])[0])
    //a.t(6===List.of([5])[0]=6) // SyntaxError: Invalid left-hand side in assignment
    a.t(()=>{
        const l = List.of([5])
        l[0] = 6
        return 6===l[0]
    })
    a.t(()=>{
        const l = List.of([5])
        l.add(6)
        console.log(l, l.index, l.lastIndex)
        return 2===l.length && 5===l[0] && 6===l[1]
    })
    a.fin()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

