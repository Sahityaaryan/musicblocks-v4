// -- model component -------------------------------------------------------------------------------
import IArtboardManagerModel from '../../models/artboard/ArtboardManager';
const _ArtboardManagerModel = new IArtboardManagerModel();
import IArtboardModel from '../../models/artboard/Artboard';
import { useEffect, useState } from 'react';
import Artboard from './Artboard';
// -- view-model component definition --------------------------------------------------------------

/**
 * ViewModel of the ArtboardManager Framework component.
 */
export default function (): JSX.Element {
  // list of all artboards generated by the user.
  const [artboardList, setartboardList] = useState([] as IArtboardModel[]);

  // current visible artboard on top of the screen.
  const [visibleArtboard, setVisibleArtboard] = useState<IArtboardModel>();

  // list of IDs of all artboards i.e. artboardIDList.length = artboardList.length .
  const [artboardIDList, setartboardIDList] = useState([0] as number[]);

  // default artboard on screen with id 0.
  const [visibleid, setVisibleId] = useState(0);

  // function to add a new Artboard
  const addArtboard = (id: number) => {
    // check if the artboard with same id already exists.
    const isPresent = artboardIDList.includes(id);
    if (isPresent) {
      return;
    }
    setartboardIDList([...artboardIDList, id]);
    const newArtboard = new IArtboardModel(id);
    _ArtboardManagerModel.addArtboard(newArtboard);
    setartboardList([...artboardList, newArtboard]);
  };
  // function to get all artboards.
  const getArtboards = () => {
    return _ArtboardManagerModel.getArtboards();
  };

  // manager can initialise several artboards at a time and store them
  // in the artboardList.
  useEffect(() => {
    addArtboard(4); // artboard with id 4.
    addArtboard(1); // artboard with id 1.
    addArtboard(16); // artboard with id 16.
  }, [addArtboard]);

  // manager sets the current visible artboard based on visibleID.
  useEffect(() => {
    const defaultArtboard = artboardList.find((board) => board._id == 0);
    setVisibleArtboard(defaultArtboard);
    const artboard = artboardList.find((board) => board._id == visibleid);
    if (artboard) {
      setVisibleArtboard(artboard);
    }
  }, [artboardList, visibleid]);

  // manager shows the visible artboard on the top of the screen.
  // manager hides all the non visible artboards.
  useEffect(() => {
    // hides all the artboards.
    const vid = `artboard-wrapper-${visibleid}`;
    for (let i = 0; i < artboardIDList.length; i++) {
      const currId = `artboard-wrapper-${artboardIDList[i]}`;
      const ele = document.getElementById(currId);
      if (ele === null) continue;
      if (currId == vid) {
        ele.style.position = 'absolute';
        ele.style.display = 'block';
        ele.style.zIndex = '1000';
        const turtle = document.getElementById(`art-board-${visibleid + 1}`);
        if (turtle != undefined) {
          turtle.style.position = 'absolute';
          turtle.style.display = 'block';
        }
      } else {
        ele.style.display = 'none';
      }
    }
  }, [artboardIDList, visibleid]);

  return (
    <>
      <div id="artboard-manager-wrapper">
        <div>
          {artboardList.map((board) => (
            <Artboard key={board._id} board={board} />
          ))}
          {/* {visibleArtboard && <Artboard board={visibleArtboard} />} */}
        </div>
      </div>
    </>
  );
}
