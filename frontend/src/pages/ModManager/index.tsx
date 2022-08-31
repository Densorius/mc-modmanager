import { Button, Modal, useMantineTheme } from "@mantine/core";
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

    let [selectedMods, setSelectedMods] = useState([] as string[]);
    let [modsList, setModsList] = useState(mods);
    let [buttonsDisabled, setButtonsDisabled] = useState(true);

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);

    const theme = useMantineTheme();

    const deleteMods = () => {
        setDeleteModalOpened(false);
        setModsList(currentModsList => currentModsList.filter(mod => !selectedMods.includes(mod)));
    }

    const replaceMods = () => {
        console.log("Replace");
    }

    const makePlural = () => selectedMods.length > 1 ? 's' : '';

    return (
        <div className="mc-background page">
            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title={`Delete mod${makePlural()}`}
                className="delete-mods-modal"

                overlayColor={theme.colors.dark[7]}
                overlayBlur={5}
            >
                <p className="delete-mods-modal__text">Are you sure you want to delete the selected mod{makePlural()}?</p>
                <div className="delete-mods-modal__button-container">
                    <Button className="delete-mods-modal__yes-button" color="red" onClick={deleteMods}>Yes</Button>
                    <Button className="delete-mods-modal__no-button" color="green" onClick={() => setDeleteModalOpened(false)}>No</Button>
                </div>
            </Modal>

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

                <SideBar buttonsDisabled={buttonsDisabled} deletePressed={() => setDeleteModalOpened(true)} replacePressed={replaceMods} />
            </div>
        </div>
    )
}