import { Button, Modal, useMantineTheme } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import NavButton from "../../components/NavButton";
import SelectList from "../../components/SelectList";
import InfoBar from "./infobar";
import SideBar from "./sidebar";

import { GetUserHomeDir, GetMods, OpenFileDialog, MoveFile, DeleteFile } from '../../../wailsjs/go/backend/App';

import './style.scss'
import { backend } from "../../../wailsjs/go/models";

const name = 'mc chocolate';
const version = '1.18.1';
const modloader = 'Fabric';

function getFileNameFromPath(path: string) {
    const pathSplitted = path.split('\\');

    return pathSplitted[pathSplitted.length - 1];
}

/**
 * Opens a open file dialog and runs a given function when the user has selected mods.
 * 
 * @param action function that runs when user has selected mods.
 */
async function handleOpenFileDialog(action: (result: backend.OpenFileDialogResult) => void) {
    const openFileResult = await OpenFileDialog();

    if (openFileResult.StatusCode === 'open-file-dialog/cancelled') {
        return;
    }

    if (openFileResult.StatusCode === 'open-file-dialog/error') {
        // TODO: tell user a error occured
        console.log('something happened: ', openFileResult.Message);

        return;
    }

    if (openFileResult.StatusCode === 'open-file-dialog/success') {
        action(openFileResult);
    }
}

export default function ModManager() {

    const [selectedMods, setSelectedMods] = useState([] as string[]);
    const [modsList, setModsList] = useState([] as string[]);
    const [buttonsDisabled, setButtonsDisabled] = useState(true);
    const [deleteAllButtonDisabled, setDeleteAllButtonDisabled] = useState(false);

    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [deleteAllModalOpened, setDeleteAllModalOpened] = useState(false);
    const [replaceModalOpened, setReplaceModalOpened] = useState(false);

    const openFileInput = useRef<HTMLInputElement>(null);
    const [modsDirectory, setModsDirectory] = useState("");

    useEffect(() => {
        async function getData() {
            const userDirectory = await GetUserHomeDir();
            const modsDir = userDirectory + `\\AppData\\Roaming\\.minecraft\\mods`;

            setModsDirectory(modsDir);

            const mods = await GetMods(modsDir);

            setModsList(mods);
        }

        getData();
    }, []);

    async function addMods() {
        const openFileResult = await OpenFileDialog();

        if (openFileResult.StatusCode === 'open-file-dialog-cancelled') {
            return;
        }

        if (openFileResult.StatusCode === 'open-file-dialog/error') {
            // TODO: tell user a error occured
            console.log('something happened: ', openFileResult.Message);

            return;
        }

        if (openFileResult.StatusCode === 'open-file-dialog/success') {
            const movedFiles: string[] = [];

            for (const file of openFileResult.Files) {
                if (modsList.includes(getFileNameFromPath(file))) {
                    // TODO: tell user they tried to add a mod that already exists
                    console.log('Mod already in mods list.');

                    continue;
                }

                const moveFileResult = await MoveFile(file, modsDirectory);

                if (moveFileResult.StatusCode === 'file-move/error') {
                    // TODO: tell user a error occured
                    console.log('Something happened: ', moveFileResult.Message);
                    
                    break;
                }

                if (moveFileResult.StatusCode === 'file-move/success') {
                    movedFiles.push(moveFileResult.File);
                }
            }
            setModsList(oldModsList => [...oldModsList, ...movedFiles]);
        }
    }

    async function deleteAllMods() {
        setDeleteAllModalOpened(false);
        
        // make 
        let deletedMods: string[] = [];
        let errorMessages: string[] = [];

        for (const mod of modsList) {
            const deleteResult = await DeleteFile(`${modsDirectory}\\${mod}`);

            if (deleteResult.StatusCode === 'deletion/error') {
                errorMessages = [...errorMessages, deleteResult.Message];
            }

            if (deleteResult.StatusCode === 'deletion/success') {
                deletedMods = [...deletedMods, mod];
            }
        }

        if (modsList.length === deletedMods.length) {
            setModsList(modsList => modsList = []);

            setButtonsDisabled(true);
            setDeleteAllButtonDisabled(true);
        } else {
            // not all mods where deleted.
            console.log("Error(s) while deleting mods:");
            errorMessages.forEach(message => console.log(message));

            setModsList(modsList => modsList.filter(mod => !deletedMods.includes(mod)));
        }
    }

    async function deleteMods() {
        // User agreed to delete selected mods.

        setDeleteModalOpened(false);

        const modsToDelete = modsList.filter(mod => selectedMods.includes(mod));
        let deletedMods: string[] = [];

        for (const modToDelete of modsToDelete) {
            const deleteResult = await DeleteFile(`${modsDirectory}\\${modToDelete}`);

            if (deleteResult.StatusCode === 'deletion/error') {
                console.log('Error deleting file: ', deleteResult.Message);
                continue; // error, skip to next mod to delete
            }

            if (deleteResult.StatusCode === 'deletion/success') {
                // add the deleted mod to deletedMods array
                deletedMods = [...deletedMods, modToDelete];
            }
        }

        if (deletedMods.length > 0) {
            setModsList(currentModsList => {
                let newModsList = currentModsList.filter(mod => !deletedMods.includes(mod));

                if (newModsList.length === 0) {
                    setButtonsDisabled(true);
                    setDeleteAllButtonDisabled(true);
                }

                return newModsList;
            });
        } else {
            console.error('No mods where deleted...');
        }
    }

    async function replaceMods() {
        setReplaceModalOpened(false);

        await handleOpenFileDialog(async openFileResult => {
            // user accepted to replace mods and selected mods
            let modsListCopy = [...modsList];

            await handleDeleteMods(modsListCopy, deletedMods => {
                modsListCopy = modsListCopy.filter(mod => !deletedMods.includes(mod));
            });

            await handleMoveMods(openFileResult.Files, movedFiles => {
                modsListCopy = [...modsListCopy, ...movedFiles];

                setModsList(oldModsList => oldModsList = modsListCopy)
            });
        });
    }

    async function handleMoveMods(files: string[], action: (movedFiles: string[]) => void) {
        let movedFiles: string[] = [];

        for (const file of files) {
            if (modsList.includes(getFileNameFromPath(file))) {
                // TODO: tell user they tried to add a mod that already exists
                console.log('Mod already in mods list.');

                continue;
            }

            const moveFileResult = await MoveFile(file, modsDirectory);

            if (moveFileResult.StatusCode === 'file-move/error') {
                // TODO: tell user a error occured
                console.log('Something happened: ', moveFileResult.Message);
                
                break;
            }

            if (moveFileResult.StatusCode === 'file-move/success') {
                movedFiles = [...movedFiles, moveFileResult.File];
            }
        }

        action(movedFiles);
    }

    async function handleDeleteMods(modsList: string[], action: (deletedMods: string[]) => void) {
        const modsToDelete = modsList.filter(mod => selectedMods.includes(mod));
        let deletedMods: string[] = [];

        for (const modToDelete of modsToDelete) {
            const deleteResult = await DeleteFile(`${modsDirectory}\\${modToDelete}`);

            if (deleteResult.StatusCode === 'deletion/error') {
                console.log('Error deleting file: ', deleteResult.Message);
                continue; // error, skip to next mod to delete
            }

            if (deleteResult.StatusCode === 'deletion/success') {
                // add the deleted mod to deletedMods array
                deletedMods = [...deletedMods, modToDelete];
            }
        }

        if (deletedMods.length > 0) {
            action(deletedMods);
        } else {
            console.error('No mods where deleted...');
        }
    }

    const makePlural = () => selectedMods.length > 1 ? 's' : '';

    function displayModsOrEmpty() {
        if (modsList != null && modsList.length > 0) {
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
            <input type="file" id="manager-open-file" ref={openFileInput} multiple />

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

            <ConfirmModal
                title={`Replace mod${makePlural()}`}
                text={`Are you sure you want to replace the selected mod${makePlural()}`}

                opened={replaceModalOpened}
                onClose={() => setReplaceModalOpened(false)}

                yesPressed={replaceMods}
                noPressed={() => setReplaceModalOpened(false)}
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
                    replacePressed={() => setReplaceModalOpened(true)} 
                />
            </div>
        </div>
    )
}