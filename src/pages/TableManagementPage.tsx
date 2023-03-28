import TableDataMenu from '../components/TableDataMenu';
import './TableManagementPage.scss';
import GoUpButton from '../components/GoUpButton';

const TableManagementPage = () => {

    return (
        <div className='table-data-menu-div'>
            <TableDataMenu/>
            <GoUpButton/>
        </div>
    )
}

export default TableManagementPage;