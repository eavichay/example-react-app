import { MouseEvent } from "react";

type OwnProps = {
    width?: string;
    height?: string;
    className?: string;
    onClick?: React.EventHandler<MouseEvent>;
}
export const LocationIcon = (props: OwnProps) => {
    return <img style={{cursor: 'pointer'}} {...props} src="https://nordhealth.design/assets/icons/assets/generic-location.svg" />
}