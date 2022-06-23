interface Iprops {
    id: string;
    text: string;
}

export default function Checkbox(props: Iprops) {
    return (
        <div>
            <input type="checkbox" id={props.id} />
            <label htmlFor={props.id}>{props.text}</label>
        </div>
    )
}