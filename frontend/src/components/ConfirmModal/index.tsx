import { Button, Modal, useMantineTheme } from "@mantine/core";

import './style.scss';

interface Iprops {
    title: string;
    text: string;
    opened: boolean;
    onClose: () => void;
    yesPressed: () => void;
    noPressed: () => void;
}

export default function ConfirmModal(props: Iprops) {

    const theme = useMantineTheme();

    return (
        <Modal
            opened={props.opened}
            onClose={props.onClose}
            title={props.title}

            overlayColor={theme.colors.dark[7]}
            overlayBlur={5}

            className="confirm-modal"
        >
            <p className="confirm-modal__text">{props.text}</p>
            <div className="confirm-modal__button-container">
                <Button className="confirm-modal__yes-button" color="red" onClick={props.yesPressed}>Yes</Button>
                <Button className="confirm-modal__no-button" color="green" onClick={props.noPressed}>No</Button>
            </div>
        </Modal>
    )
}