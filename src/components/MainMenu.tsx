import { useState } from 'react';

import './MainMenu.scss';

import MenuItem from './MenuItem';

const MainMenu = () => {
    const [btnText, setBtnText] = useState<string>("Go");

    const goToPage = () => {
        if (btnText === "Go")
            setBtnText("dute dica");
        else setBtnText("Go");
    }

    return (
        <div className='main-menu'>
            <MenuItem 
                title='Manage your database' 
                description='Add, remove or update the entries from your database'
                btnText={btnText}
                btnClick={goToPage}
            />
            <MenuItem
                title='View statistics'
                description='Check out some statistics about the data currently stored in your database'
                btnText='Go'
                btnClick={goToPage}
            />
        </div>
    )
}

export default MainMenu;