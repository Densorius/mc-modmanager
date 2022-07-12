import NavButton from "../../components/NavButton";
import logisticGraphic from "../../assets/images/undraw_logistics_x-4-dc.svg";

import { Button } from '@mantine/core';

import './style.scss'
import { Link } from "react-router-dom";

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
                            <Button className="home-panel-button">Manage archives</Button>
                            <Button className="home-panel-button" component={Link} to='/mod-manager' variant="outline">Manage active mods</Button>
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