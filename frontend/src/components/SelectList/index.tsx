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

        let listItems = document.querySelectorAll('li.selectlist--item') as NodeListOf<HTMLLIElement>;
        let range: {first: number | null, last: number | null} = {
            first: null,
            last: null
        }

        function swapRangeValues(range: {first: number | null, last: number | null}) {
            return {first: range.last, last: range.first}
        }

        function handleSelectChange(event: Event | KeyboardEvent) {

            let selectedItems: string[] = [];

            let shiftPressed = (event as KeyboardEvent).shiftKey;
            let ctrlPressed = (event as KeyboardEvent).ctrlKey;

            // deselect all items except when user is holding ctrl or shift key
            if (!ctrlPressed && !shiftPressed) {
                listItems.forEach(element => {
                    element.classList.remove(SELECTED_CLASS)
                });
            }

            if (shiftPressed) {
                
                let indexString = (event.target as HTMLLIElement).dataset.index!

                if (range.first == null) {
                    (event.target as Element).classList.add(SELECTED_CLASS)

                    range.first = parseInt(indexString)
                } else {
                    range.last = parseInt(indexString)
                }

                if (range.first != null && range.last != null) {
                    if (range.first > range.last) {
                        range = swapRangeValues(range);
                    }

                    listItems.forEach((element, index) => {
                        if (index >= range.first! && index <= range.last!) {
                            element.classList.add(SELECTED_CLASS)
                        }
                    });
                }
            }

            if (!shiftPressed) {
                let item = event.target as HTMLLIElement

                item.classList.add(SELECTED_CLASS);
                range.first = parseInt(item.dataset.index!);
            }
    
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
    return items.map((item, index) => {
        return (
            <li key={item} data-index={index} className="selectlist--item">{item}</li>
        )
    });
}