import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Iprops {
    children: ReactNode | ReactNode[];
    className?: string;
    href: string;
}

export default function NavButton(props: Iprops) {
    const navigate = useNavigate()

    return (
        <button 
            className={props.className} 
            onClick={() => navigate(props.href, { replace: true })}
        >
            {props.children}
        </button>
    );
}

NavButton.defaultProps = {
    className: null,
    href: '#'
}