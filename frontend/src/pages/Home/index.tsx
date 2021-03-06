import NavButton from "../../components/NavButton";
import logisticGraphic from "../../assets/images/undraw_logistics_x-4-dc.svg";

import './style.scss'

export default function Home() {
    return (
        <div className="mc-background page home">
            <div className="home-panel">
                <div className="home-panel__grid">
                    <div className="home-panel__content">

                        <div className="content--top">
                            <h2>Welcome!</h2>
                            <p>
                                Use McModmanager to simplify 
                                running multiple mod 
                                installations with ease
                            </p>
                        </div>

                        <div className="content--bottom">
                            <button className="home-panel-button button-primary">Manage archives</button>
                            <NavButton className="home-panel-button button-primary--inverted" href='/mod-manager'>Manage active mods</NavButton>
                        </div>

                    </div>
                    <div className="home-panel__divider"></div>
                    <div className="home-panel__img">
                        <img id="logistic-graphic" src={logisticGraphic} />
                    </div>
                </div>
            </div>
        </div>
    )
}