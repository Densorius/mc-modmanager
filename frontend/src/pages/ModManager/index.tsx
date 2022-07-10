import NavButton from "../../components/NavButton";
import SelectList from "../../components/SelectList";

import './style.scss'

const name = 'Vanilla Performance';
const version = '1.18.1';
const modloader = 'Fabric';

const mods = ["Lorem", "ipsum", "dolor", "sit", "amet"];

function renderMods(): JSX.Element[] {
    return mods.map(mod => {
        return <li key={mod} className="mods-panel__list--item">{mod}</li>
    });
}

export default function ModManager() {
    return (
        <div className="mc-background page">
            <div className="info-bar">
                <div className="info-bar-button-container">
                    <NavButton className="home-button button-primary" href="/">⌂ Home</NavButton>
                </div>
                <div className="archive-info-main">
                    <h4 className="archive-info-main__header">Selected Archive</h4>
                    <p className="archive-info-main__info">{name}</p>
                </div>
                <div className="archive-info-rest">
                    <p>Minecraft: <span className="highlight">{version}</span></p>
                    <p className="border">Modloader: <span className="highlight">{modloader}</span></p>
                </div>
            </div>

            <div className="mod-manager-container">
                <div className="mods-panel">
                    <ul className="mods-panel__list">
                        <SelectList items={mods} onChange={(selected) => {
                            let text = 'selected: ';
                            
                            selected.forEach(item => text += item + ' ');

                            console.log(text);
                        }} />
                    </ul>
                </div>

                <div className="mod-manager-sidebar">
                    <div className="mod-manager-sidebar--container">
                        <button className="button-primary">Add</button>
                        <div className="mod-manager-sidebar--divider"></div>
                        <button className="button-primary">Delete</button>
                        <button className="button-primary">Replace</button>
                    </div>
                </div>
            </div>
        </div>
    )
}