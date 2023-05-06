
import { Button } from '@mui/material';
import './UsersTableRow.scss';

type UsersTableRowProps = {
    user: any;
}

const UsersTableRow = ({ user }: UsersTableRowProps) => {
    
    return (
        <tr className="users-table-row">
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
                <Button size="small" className="edit-role-button">
                    Edit role
                </Button>
            </td>
        </tr>
    );
}

export default UsersTableRow;