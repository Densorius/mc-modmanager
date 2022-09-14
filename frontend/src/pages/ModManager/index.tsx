import { Button, Modal, useMantineTheme } from "@mantine/core";
import { useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
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

const mods = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];

const renderMods = () => {
    return mods.map(mod => {
        return <li key={mod} className="mods-panel__list--item">{mod}</li>
    });
}

export default function ModManager() {

    const [selectedMods, setSelectedMods] = useState([] as string[]);
    const [modsList, setModsList] = useState(mods);
    const [buttonsDisabled, setButtonsDisabled] = useState(true);
    const [deleteAllButtonDisabled, setDeleteAllButtonDisabled] = useState(false);

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [deleteAllModalOpened, setDeleteAllModalOpened] = useState(false);

    // TOOD: filesystem interaction
    const addMods = () => {
        const modsArray = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscinf', 'elit', 'sed', 'do'];
        let timeOut = 0;
        
        while (timeOut != 500) {
            const randomIndex = Math.floor(Math.random() * modsArray.length);

            const modToAdd = modsArray[randomIndex];

            timeOut++; 

            if (!modsList.includes(modToAdd)) {
                setModsList(oldModsList => [...oldModsList, modToAdd]);

                break;
            }
        }
        
        // state has't updated so length is still one less.
        if (modsList.length == 0) {
            setDeleteAllButtonDisabled(false);
        }
    }

    // TOOD: filesystem interaction
    const deleteAllMods = () => {
        setDeleteAllModalOpened(false);
        setModsList(modsList => modsList = []);

        setButtonsDisabled(true);
        setDeleteAllButtonDisabled(true);
    }

    const deleteMods = () => {
        setDeleteModalOpened(false);

        setModsList(currentModsList => {
            let newModsList = currentModsList.filter(mod => !selectedMods.includes(mod));

            if (newModsList.length == 0) {
                setButtonsDisabled(true);
                setDeleteAllButtonDisabled(true);
            }

            return newModsList
        });
    }

    const replaceMods = () => {
        console.log("Replace");
    }

    const makePlural = () => selectedMods.length > 1 ? 's' : '';

    const displayModsOrEmpty = () => {
        if (modsList.length > 0) {
            return (
                <SelectList className="mods-panel__list" items={modsList} onChange={(selectedMods) => {
                    setSelectedMods(selectedMods);

                    if (selectedMods.length > 0) {
                        setButtonsDisabled(false);
                    }
                }} />
            );
        } else {
            return (
                <>
                    <p>Mods directory is empty.</p>
                    <br />
                    <p>Press the add button to start adding mods.</p>
                </>
            );
        }
    }

    return (
        <div className="mc-background page">
            <ConfirmModal 
                title={`Delete mod${makePlural()}`}
                text={`Are you sure you want to delete the selected mod${makePlural()}?`}

                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}

                yesPressed={deleteMods}
                noPressed={() => setDeleteModalOpened(false)}
            />

            <ConfirmModal 
                title="Delete all mods"
                text="Are you sure you want to delete all mods?"

                opened={deleteAllModalOpened}
                onClose={() => setDeleteAllModalOpened(false)}

                yesPressed={deleteAllMods}
                noPressed={() => setDeleteAllModalOpened(false)}
            />

            <InfoBar name={name} version={version} modloader={modloader} />

            <div className="mod-manager-container">
                <div className="mods-panel">
                    {displayModsOrEmpty()}
                </div>

                <SideBar 
                    buttonsDisabled={buttonsDisabled}
                    addPressed={addMods}
                    deleteAllButtonDisabled={deleteAllButtonDisabled}
                    deleteAllPressed={() => setDeleteAllModalOpened(true)}
                    deletePressed={() => setDeleteModalOpened(true)} 
                    replacePressed={replaceMods} 
                />
            </div>
        </div>
    )
}