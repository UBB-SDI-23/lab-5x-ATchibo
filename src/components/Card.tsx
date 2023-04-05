import './Card.scss';

const Card = (props: any) => {

    return (
        <div className={props.size || 'md'}>
            {props.children}
        </div>
    )
}

export default Card;