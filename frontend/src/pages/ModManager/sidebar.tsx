export default function SideBar(props: {buttonsDisabled: boolean}) {
    return (
        <div className="mod-manager-sidebar">
            <div className="mod-manager-sidebar--container">
                <button className="button-primary">Add</button>
                <div className="mod-manager-sidebar--divider"></div>
                <button className="button-primary" disabled={props.buttonsDisabled}>Delete</button>
                <button className="button-primary" disabled={props.buttonsDisabled}>Replace</button>
            </div>
        </div>
    )
}