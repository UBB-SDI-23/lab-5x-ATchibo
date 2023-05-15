import './TableManagementPage.scss';
import GoUpButton from '../components/GoUpButton';
import TableView from '../components/tableview/TableView';

const TableManagementPage = () => {

    return (
        <div className='table-data-menu-div'>
            <TableView/>
            <GoUpButton/>
        </div>
    )
}

export default TableManagementPage;