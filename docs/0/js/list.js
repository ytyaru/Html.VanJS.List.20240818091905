console.log(hook)
console.log(hook.errors)
console.log(hook.errors.valid)
console.log(new hook.errors.valid())
class List {
    static of(v, typeName=null, options={}, insOpts={}) { return new List(v, typeName, options, insOpts) }
    constructor(v, typeName=null, options={}, insOpts={}) {
        if (Type.isNU(v)) { v = [] }
        if (!Type.isAry(v)) { throw new TypeError(`引数vは配列のみ有効です: ${v}`) }
        if (null!==typeName && !(typeName in Type)) { throw new TypeError(`引数typeNameはnullかTypeにあるis系メソッド名のみ有効です: ${typeName}`) }
        this._options = {
            onBefore:()=>{},
            onValidate:()=>true,
            onValid:()=>{},
            onSet:(v, i)=>v,
            onSetDefault:(v, i)=>{throw new hook.errors.valid()},
            onInvalid:()=>{},
            onChanged:()=>{},
            onUnchanged:()=>{},
            onAfter:()=>{},
            ...options,
        }
        this._typeName = typeName
//        this._v = v
        this._v = {n: v, o: null, i:null} // 値(n:現在値, o:前回値, i:入力値)
        this._i = {n: 0, l: Math.max(0, this._v.n.length-1)}
        if (typeName in Type) { this._options.onValidate = (v, i)=>Type[`is${this._typeName.capitalize()}`](v) }
        //return hook.ins(this, insOpts)
        return hook.ins(this, {
            onGetUndefined:(target, key, receiver)=>{
                //console.log(key, Type.isInt(key), Type.isInt(parseInt(key)), key < this._v.n.length)
                const idx = parseInt(key)
                if (Type.isInt(idx) && idx < this._v.n.length) { return this._v.n[idx] }
                if (this._options.getUndefined) { return target[key] }
                else { throw new TypeError(`未定義プロパティへの参照禁止: ${key}`) }
            },
            onSetUndefined:(target, key, value, receiver)=>{
                const idx = parseInt(key)
                if (Type.isInt(idx) && idx < this._v.n.length && Type) { return this.set(value, idx) }
                if (this._options.setUndefined) { target[key] = value }
                else { throw new TypeError(`未定義プロパティへの代入禁止: ${key}`) }
                return true
            },
            ...insOpts,
        })
    }
    get index() { return this._i.n }
    get lastIndex() { return this._i.l }
    get length() { return this._v.n.length }
    get(i) { return this._v.n[i ?? this._i.n] }
    set(v, i) {
        this._v.i = v
        this._v.o = this._v.n
        this._options.onBefore(v, i)
        const [onSet, onValid] = ifel(this._options.onValidate(v, i), 
            ()=>['onSet', 'onValid'],
            ()=>['onSetDefault', 'onInvalid'])
        this._o = this._v
//        this._v = this._options[onSet](this._i, this._o)
        this._v.n[i ?? this._i.n] = this._options[onSet](v, i)
        this._options[onValid](v, i)
        this._options[this._v === this._o ? 'onUnchanged' : 'onChanged'](this._v.i, this._v.n, this._v.o)
        this._options.onAfter(this._v.i, this._v.n, this._v.o)
//        return this._v[i ?? this._i.n] = v
        return this
    }
    /*
    set(v, i) { return this._set(v, i, ()=>this._options[onSet](v, i)) }
    _set(v, i, onSet) {
        this._v.i = v
        this._v.o = this._v.n
        this._options.onBefore(v, i)
        const [onSet, onValid] = ifel(this._options.onValidate(v, i), 
            ()=>['onSet', 'onValid'],
            ()=>['onSetDefault', 'onInvalid'])
        this._o = this._v
//        this._v = this._options[onSet](this._i, this._o)
        this._v.n[i ?? this._i.n] = this._options[onSet](v, i)
        this._options[onValid](v, i)
        this._options[this._v === this._o ? 'onUnchanged' : 'onChanged'](this._v.i, this._v.n, this._v.o)
        this._options.onAfter(this._v.i, this._v.n, this._v.o)
//        return this._v[i ?? this._i.n] = v
        return this
    }
    */
    add(v, i) {
        //i = (Type.isInt(i) && i < this._v.n.length) ? i : this._i.l
//        i = (Type.isInt(i) && i < this._v.n.length) ? i : this._v.n.length
//        Type.isNU(i) ? this._v.n.length : ()
        i = ifel(Type.isInt(i) && 0<=i && i<this._v.n.length, i,
            Type.isInt(i) && i<0, 0<this._v.n.length ? this._v.n.length+i : 0,
//            Type.isInt(i) && i<0, this._v.n.length+i,
            this._v.n.length)
//        if (i<0) { i=0 } // length=0のときi=-1指定したら0にする
        this._v.i = v
        this._v.o = this._v.n
        this._options.onBefore(v, i)
        const [onSet, onValid] = ifel(this._options.onValidate(v, i), 
            ()=>['onSet', 'onValid'],
            ()=>['onSetDefault', 'onInvalid'])
        this._v.o = this._v
//        this._v = this._options[onSet](this._i, this._o)
        //this._v.n[i ?? this._i.n] = this._options[onSet](v, i)
        //this._v.n.push(v)
        this._v.n.splice(i ?? this._i.l, 0, this._options[onSet](this._v.i, this._v.o))
//        console.log(i ?? this.length)
        //this._v.n.splice(i ?? this.length, 0, this._options[onSet](this._v.i, this._v.o))
        this._options[onValid](v, i)
        this._options[this._v === this._v.o ? 'onUnchanged' : 'onChanged'](this._v.i, this._v.n, this._v.o)
        this._options.onAfter(this._v.i, this._v.n, this._v.o)
//        return this._v[i ?? this._i.n] = v
        return this
    }
    append(...vs) {

    }
    prepend(...vs) {

    }
}
/*
*/
