import { Tooltip, IconButton } from '@mui/material';
import { useState } from 'react';
import './GoUpButton.scss';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const GoUpButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    window.addEventListener('scroll', handleScroll);

    const scrollToTop = () => {
        window.scrollTo({
        top: 0,
        behavior: 'smooth'
        });
    };

    return (
        <Tooltip title='Go to top' placement='left'>
            <IconButton 
                className='go-top-btn'
                style={{display: isVisible ? 'flex' : 'none'}}
                onClick={scrollToTop}
            >
                <KeyboardArrowUpIcon id="arrow-icon"/>
            </IconButton>
        </Tooltip>
    )
}

export default GoUpButton;