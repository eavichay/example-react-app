import { useState } from "react";
import { IAsteroidLookupInfo } from "../model/useAsteroidLookup";
import OwnStyles from './map.module.css';

const NEVER_USER_API_KEYS_IN_SOURCE_CODE = 'nq6kbRT6hsMOH604P0HB4gXomLeAC7aOooEZvF5wmpBMgiTUstOnWXy0ts7j5bXh';

export const MapModal = (props: { incident?: IAsteroidLookupInfo, onClose: Function }) => {
  const [zoom, setZoom] = useState(5);
  if (!props.incident) return null;
  
  const { name, year, reclat, reclong } = props.incident;
  if (!reclat || !reclong) {
    return (
      <>
        {name} ({year}) has an unknow location
      </>
    );
  }

  // 

  // eslint-disable-next-line react/no-unescaped-entities
  const url = `https://api.jawg.io/static/?marker=color:FF4444,size:small%7C${reclat},${reclong}&zoom=${zoom}&center=${reclat},${reclong}&size=800x640&layer=jawg-light&format=png&access-token=${NEVER_USER_API_KEYS_IN_SOURCE_CODE}`;
  return (
    <>
      <div className="modal-backdrop" onClick={() => props.onClose()}/>
      <div className="modal">
        <img src={url} />
        <button className={OwnStyles.closeButton} onClick={() => props.onClose()}>X</button>
        <span className={OwnStyles.buttonBar}>
          <button className={OwnStyles.zoomControl} onClick={() => setZoom(Math.min(zoom + 1, 15))}>+</button>
          <button className={OwnStyles.zoomControl} onClick={() => setZoom(Math.max(zoom - 1, 4))}>-</button>
        </span>
      </div>
    </>
  );
};
