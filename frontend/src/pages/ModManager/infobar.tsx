import NavButton from "../../components/NavButton"

interface IProps {
    name: string,
    version: string,
    modloader: string
}

export default function InfoBar(props: IProps) {
    return (
        <div className="info-bar">
            <div className="info-bar-button-container">
                <NavButton className="home-button button-primary" href="/">⌂ Home</NavButton>
            </div>
            <div className="archive-info-main">
                <h4 className="archive-info-main__header">Selected Archive</h4>
                <p className="archive-info-main__info">{props.name}</p>
            </div>
            <div className="archive-info-rest">
                <p>Minecraft: <span className="highlight">{props.version}</span></p>
                <p className="border">Modloader: <span className="highlight">{props.modloader}</span></p>
            </div>
        </div>
    )
}