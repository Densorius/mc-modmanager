import { useState } from "react";
import NavButton from "../../components/NavButton";
import SelectList from "../../components/SelectList";
import InfoBar from "./infobar";
import SideBar from "./sidebar";

import './style.scss'

const name = 'mc chocolate';
const version = '1.18.1';
const modloader = 'Fabric';

const mods = ["Lorem", "ipsum", "dolor", "sit", "amet"];

function renderMods(): JSX.Element[] {
    return mods.map(mod => {
        return <li key={mod} className="mods-panel__list--item">{mod}</li>
    });
}

export default function ModManager() {

    let [selectedMods, setSelectedMods] = useState([] as string[])
    let [buttonsDisabled, setButtonsDisabled] = useState(true)

    return (
        <div className="mc-background page">
            <InfoBar name={name} version={version} modloader={modloader} />

            <div className="mod-manager-container">
                <div className="mods-panel">
                    <ul className="mods-panel__list">
                        <SelectList items={mods} onChange={(selected) => {
                            setSelectedMods(selected);

                            if (selected.length > 0) {
                                setButtonsDisabled(false);
                            }
                        }} />
                    </ul>
                </div>

                <SideBar buttonsDisabled={buttonsDisabled} />
            </div>
        </div>
    )
}