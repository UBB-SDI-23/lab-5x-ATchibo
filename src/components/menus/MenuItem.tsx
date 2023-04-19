import { Button } from '@mui/material';
import Card from '../Card';
import './MenuItem.scss';

type MenuItemProps = {
    title: string,  
    description: string,
    btnText: string,
    btnClick: any
}

const MenuItem = ({title, description, btnText, btnClick}: MenuItemProps) => {

    return (
        <Card>
            <p className='title'>{title}</p>
            <p className='description'>{description}</p>
            <Button
                variant='contained'
                className='go-btn'
                onClick={btnClick}
            >
                {btnText}
            </Button>
        </Card>
    );
}

export default MenuItem;