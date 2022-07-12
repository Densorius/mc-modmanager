import { Button } from '@mantine/core';

const style = {
    '&:not(.__mantine-ref-loading):disabled': {
        backgroundColor: '#3c3c47',

        '&:hover': {
            backgroundColor: '#3c3c47'
        }
    },
}

export default function SideBar(props: {buttonsDisabled: boolean}) {

    return (
        <div className="mod-manager-sidebar">
            <div className="mod-manager-sidebar--container">
                <Button>Add</Button>
                <div className="mod-manager-sidebar--divider"></div>
                <Button disabled={props.buttonsDisabled} sx={style}>Delete</Button>
                <Button disabled={props.buttonsDisabled} sx={style}>Replace</Button>
            </div>
        </div>
    )
}