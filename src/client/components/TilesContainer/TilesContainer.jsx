import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import Tile from "./../Tile";
import ContentRenderer from "./../../utility/ContentRenderer";
import "./TilesContainer.component.scss";

const TilesContainer = props => {

  const [contentRenderer, setContentRenderer] = useState();

  useEffect(() => {
    if (!contentRenderer) {
      setContentRenderer(new ContentRenderer());
    }
  }, []);

  const tilesRenders = contentRenderer && props.tiles && props.tiles.map((tile, key) => <Tile key={key} data={tile} contentRenderer={contentRenderer} />);

  return (
    <div className="c-TilesContainer row display-flex px-4 mx-0">
      {tilesRenders}
    </div>
  );
};

TilesContainer.propTypes = {
  tiles: PropTypes.array
};

export default TilesContainer;
