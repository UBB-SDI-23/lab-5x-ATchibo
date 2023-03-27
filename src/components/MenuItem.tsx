import { Button } from '@mui/material';
import './MenuItem.scss';

type MenuItemProps = {
    title: string,  
    description: string,
    btnText: string,
    btnClick: any
}

const MenuItem = ({title, description, btnText, btnClick}: MenuItemProps) => {

    return (
        <div className='menu-item'>
            <p className='title'>{title}</p>
            <p className='description'>{description}</p>
            <Button
                variant='contained'
                className='go-btn'
                onClick={btnClick}
            >
                {btnText}
            </Button>
        </div>
    );
}

export default MenuItem;