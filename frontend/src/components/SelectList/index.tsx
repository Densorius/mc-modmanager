import { useEffect } from "react";
import Checkbox from "../Checkbox";

import './style.scss'

interface Iprops {
    items: string[];
    onChange: (selected: string[]) => void
}

const SELECTED_CLASS = 'selectlist--item__selected';

let ctrlPressed = false;
let shiftPressed = false;

export default function SelectList(props: Iprops) {

    useEffect(() => {

        let listItems = document.querySelectorAll('li.selectlist--item');

        function handleSelectChange(event: Event | KeyboardEvent) {

            let selectedItems: string[] = [];

            // deselect all items except when user is holding ctrl key
            if (!(event as KeyboardEvent).ctrlKey) {
                listItems.forEach(element => {
                    element.classList.remove(SELECTED_CLASS)
                });
            }

            (event.target as Element).classList.toggle(SELECTED_CLASS);
    
            listItems.forEach(element => {
                if (element.classList.contains(SELECTED_CLASS)) {
                    selectedItems.push(element.textContent!);
                }
            });

            props.onChange(selectedItems);
        }

        listItems.forEach(element => {
            element.addEventListener('click', handleSelectChange);
        });

        return () => {
            listItems.forEach(element => {
                element.removeEventListener('click', handleSelectChange);
            });
        }
    }, []);

    return (
        <ul className="selectlist">
            {renderItems(props.items)}
        </ul>
    )
}

function renderItems(items: string[]) {
    return items.map(item => {
        return (
            <li key={item} className="selectlist--item">{item}</li>
        )
    });
}