import React, {useContext} from 'react';
import { Theme } from '../Store/Store.js';

function Error() {
    const { store } = useContext(Theme);
    return(
        <h1 className="text-center mt-3" style={{ color: store.themeColor.isDarkMode ? '#fff' : '#000'}}>404 not found</h1>
    )
}

export default Error;