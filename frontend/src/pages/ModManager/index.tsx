import { Button, Modal, useMantineTheme } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";
import NavButton from "../../components/NavButton";
import SelectList from "../../components/SelectList";
import InfoBar from "./infobar";
import SideBar from "./sidebar";

import { GetUserHomeDir, GetMods, OpenFileDialog, MoveFile, DeleteFile, GetArchiveInfo } from '../../../wailsjs/go/backend/App';

import './style.scss'
import { backend } from "../../../wailsjs/go/models";

interface ArchiveInfo {
    name:      string,
    version:   string,
    modloader: string
}

/**
 * Extracts the file name from a given path.
 * 
 * @param path Path to extract the file name from.
 * 
 * @returns The file name.
 */
const getFileNameFromPath = (path: string) => {
    const pathSplitted = path.split('\\');

    return pathSplitted[pathSplitted.length - 1];
}

/**
 * Opens a open file dialog and runs a given function when the user has selected mods.
 * 
 * @param action Function that runs when user has selected mods.
 */
const handleOpenFileDialog = async (action: (result: backend.OpenFileDialogResult) => void) => {
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

    const [modsDirectory, setModsDirectory] = useState("");
    const [archiveInfo, setArchiveInfo] = useState({} as ArchiveInfo);

    useEffect(() => {
        const getData = async () => {
            const userDirectory = await GetUserHomeDir();
            const modsDir = userDirectory + `\\AppData\\Roaming\\.minecraft\\mods`;

            setModsDirectory(modsDir);
            setModsList(await GetMods(modsDir));

            const archiveInfoResult = await GetArchiveInfo(`${modsDir}\\archive-info.json`);

            if (archiveInfoResult.StatusCode === 'get-archive-info/error') {
                console.log(archiveInfoResult.Message);
            }

            if (archiveInfoResult.StatusCode === 'get-archive-info/success') {
                setArchiveInfo(info => info = JSON.parse(archiveInfoResult.Json));
            }
        }

        getData();
    }, []);

    const addMods = async () => {
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
            handleMoveMods(openFileResult.Files, movedFiles => {
                setModsList(oldModsList => [...oldModsList, ...movedFiles]);
            });
        }
    }

    const deleteAllMods = async () => {
        setDeleteAllModalOpened(false);
        
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

    /**
     * Deletes the selected mods. Then updates the modslist accordingly without requirering a file system request.
     */
    const deleteMods = async () => {
        // User agreed to delete selected mods.
        setDeleteModalOpened(false);

        await handleDeleteMods(modsList, deletedMods => {
            setModsList(currentModsList => {
                let newModsList = currentModsList.filter(mod => !deletedMods.includes(mod));

                if (newModsList.length === 0) {
                    setButtonsDisabled(true);
                    setDeleteAllButtonDisabled(true);
                }

                return newModsList;
            });
        });
    }

    /**
     * Replaces mods the user has selected with mods selected through a open file dialog.
     */
    const replaceMods = async () => {
        setReplaceModalOpened(false);

        await handleOpenFileDialog(async openFileResult => {
            // user accepted to replace mods and selected mods
            let modsListCopy = [...modsList];

            await handleDeleteMods(modsListCopy, deletedMods => {
                modsListCopy = modsListCopy.filter(mod => !deletedMods.includes(mod));
            });

            await handleMoveMods(openFileResult.Files, movedFiles => {
                modsListCopy = [...modsListCopy, ...movedFiles];

                setModsList(oldModsList => oldModsList = modsListCopy);
            });
        });
    }

    /**
     * Moves mods the user has selected to the mods directory.
     * A given function runs after the move with mods that have been moved.
     * 
     * @param files Mods to move. 
     * @param action Function to run after the move (array of moved files as argument).
     */
    const handleMoveMods = async (files: string[], action: (movedFiles: string[]) => void) => {
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

    /**
     * Deletes mods the user selected. 
     * After deletion is succesful a given function runs with the deleted mods as a argument.
     * 
     * @param modsList List of mods to check for deletion
     * @param action A function to run after mods have been deleted (array of deleted mods as the argument)
     */
    const handleDeleteMods = async (modsList: string[], action: (deletedMods: string[]) => void) => {
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

    /**
     * returns a 's' if selected mods array is longer than 1, no character otherwise.
     * @returns a 's' if selected mods array is longer than 1, no character otherwise.
     */
    const makePlural = () => selectedMods.length > 1 ? 's' : '';

    /**
     * Displays mods in the users mod directory.
     * If mods folder is empty it displays a message telling the user the folder is empty instead.
     */
    const displayModsOrEmpty = () => {
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
                text={`Are you sure you want to replace the selected mod${makePlural()}?`}

                opened={replaceModalOpened}
                onClose={() => setReplaceModalOpened(false)}

                yesPressed={replaceMods}
                noPressed={() => setReplaceModalOpened(false)}
            />

            <InfoBar name={archiveInfo.name} version={archiveInfo.version} modloader={archiveInfo.modloader} />

            <div className="mod-manager-container">
                <div className="mods-panel">
                    {displayModsOrEmpty()}
                </div>

                <SideBar 
                    buttonsDisabled={buttonsDisabled}
                    settingsPressed={() => console.log('Settings pressed')}
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