function createStore(reducer){
    let callbacks = [];
    let state = reducer(undefined, {});

    return {
        dispatch(action){
            const newState = reducer(state, action)
            if (newState !== state){
                state = newState
                for (const cb of callbacks) cb()
            }
        },
        subscribe(callback){
            callbacks.push(callback)
            return () => callbacks = callbacks.filter(c => c !== callback)
        },
        getState(){
            return state;
        }
    }
}

const cartReducer = (state={}, {type, id, amount=1}) => {
    if (type === 'ADD') return {...state, [id]: amount + (state[id] || 0)}
    if (type === 'DEL') {
        delete state[id];
        console.log(state);
        return {...state};
      }
    return state;
}

const actionInc = id => ({type: 'ADD', id});
const actionDel = id => ({type: 'DEL', id});
const actionAdd = (id, amount=1) => ({type: 'ADD', id, amount});
const actionDec = (id, amount=-1) => ({type: 'ADD', id, amount});

let store = createStore(cartReducer);
let unsubscribe = store.subscribe(() => console.log(store.getState()));
let unsubscribeTable = store.subscribe(() => {
    let items = 
    `<table id='table'><tbody>${Object.entries(store.getState())
    .map(([id, count]) => `<tr>
    <td>${id}</td>
    <td>${count}</td>
    <td>
    <button class="btn t-inc">INC</button>
    <button class="btn t-dec">DEC</button>
    <button class="btn t-del">DEL</button>
    </td>
    </tr>`)
    .join('\n')}</tbody></table>`;
    document.getElementById("goods-table").innerHTML = items;
  });

let unsubscribeCart = store.subscribe(() => {
    document.getElementById("cart").innerHTML = `<h1>${Object.entries(store.getState()).length}</h1>`;
});

document.getElementById("add-button").onclick = () => { 
    store.dispatch(actionAdd(document.getElementById("name-input").value,+document.getElementById("number-input").value ));
  }

document.getElementById("del-button").onclick = () => {
    store.dispatch(actionDel(document.getElementById("name-input").value));
  }

document.getElementById("goods").onclick = function(event){
    let target = event.target;
    if(target.tagName === 'BUTTON'){
        let tr = target.parentNode.parentNode;
        let idx = tr.querySelector("td").innerText;

        if(target.classList.contains("t-inc")){
        console.log("t-inc");
        store.dispatch(actionInc(idx));
        }
        if(target.classList.contains("t-dec")){
        console.log("t-dec");
        store.dispatch(actionDec(idx));
        }
        if(target.classList.contains("t-del")){
        store.dispatch(actionDel(idx));
        }
    }
}