import { useState } from "react";
import NavButton from "../../components/NavButton";
import SelectList from "../../components/SelectList";
import InfoBar from "./infobar";
import SideBar from "./sidebar";

import './style.scss'

type Mod = {
    name: string,
    selected: boolean
}

const name = 'mc chocolate';
const version = '1.18.1';
const modloader = 'Fabric';

const mods = ["Lorem", "ipsum", "dolor", "sit", "amet"];

const renderMods = () => {
    return mods.map(mod => {
        return <li key={mod} className="mods-panel__list--item">{mod}</li>
    });
}

export default function ModManager() {

    let [selectedMods, setSelectedMods] = useState([] as string[])
    let [modsList, setModsList] = useState(mods);
    let [buttonsDisabled, setButtonsDisabled] = useState(true)

    const deleteMods = () => {
        setModsList(currentModsList => currentModsList.filter(mod => !selectedMods.includes(mod)));
    }

    const replaceMods = () => {
        console.log("Replace");
    }

    return (
        <div className="mc-background page">
            <InfoBar name={name} version={version} modloader={modloader} />

            <div className="mod-manager-container">
                <div className="mods-panel">
                    <ul className="mods-panel__list">
                        <SelectList items={modsList} onChange={(selectedMods) => {
                            setSelectedMods(selectedMods);

                            if (selectedMods.length > 0) {
                                setButtonsDisabled(false);
                            }
                        }} />
                    </ul>
                </div>

                <SideBar buttonsDisabled={buttonsDisabled} deletePressed={deleteMods} replacePressed={replaceMods} />
            </div>
        </div>
    )
}