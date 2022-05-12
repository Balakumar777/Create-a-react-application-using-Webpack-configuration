const initialState = {
    themeColor: {
        back: "#fff",
        color: "#000",
        isDarkMode: false
    }
}

function dispatch({ type, store , setStore, payload, ...props}) {
    switch (type) {
        case 'changeBack':
            setStore({ ...store, themeColor:payload});
            break;
        default:
            setStore({ ...store });
            break;
    }
}

export { initialState, dispatch };