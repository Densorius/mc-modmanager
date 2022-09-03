import { Button } from '@mantine/core';

const style = {
    '&:not(.__mantine-ref-loading):disabled': {
        backgroundColor: '#3c3c47',

        '&:hover': {
            backgroundColor: '#3c3c47'
        }
    },
}

interface IProps {
    buttonsDisabled: boolean,
    deleteAllButtonDisabled: boolean
    addPressed: () => void;
    deleteAllPressed: () => void;
    deletePressed: () => void,
    replacePressed: () => void
}

export default function SideBar(props: IProps) {

    return (
        <div className="mod-manager-sidebar">
            <div className="mod-manager-sidebar--container">
                <Button onClick={props.addPressed}>Add</Button>
                <Button disabled={props.deleteAllButtonDisabled} sx={style} color="red" onClick={props.deleteAllPressed}>Delete all</Button>
                <div className="mod-manager-sidebar--divider"></div>
                <Button disabled={props.buttonsDisabled} sx={style} onClick={props.deletePressed}>Delete</Button>
                <Button disabled={props.buttonsDisabled} sx={style} onClick={props.replacePressed}>Replace</Button>
            </div>
        </div>
    )
}