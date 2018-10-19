/* eslint-disable jsx-a11y/media-has-caption */

import React from 'react';
import PropTypes from 'prop-types';
import './Video.scss';

class Video extends React.Component {
  componentDidUpdate(prevProps) {
    const { videoPlayer, props } = this;
    const { play, position } = props;

    // Determine to play or pause the player
    if (prevProps.play !== play) {
      if (play) {
        videoPlayer.play();
      } else {
        videoPlayer.pause();
      }
    }

    // Player position
    if (videoPlayer.currentTime !== position) {
      videoPlayer.currentTime = position;
    }
  }

  render() {
    const { src, poster, type } = this.props;
    return (
      <video
        ref={(c) => {
          this.videoPlayer = c;
        }}
        data-object-fit
        preload="metadata"
        muted="true"
        className="c-video__element"
        poster={poster}
        loop
      >
        <source
          {...{
            src,
            type
          }}
        />
      </video>
    );
  }
}

Video.defaultProps = {
  play: false,
  position: 0
};

Video.propTypes = {
  src: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  poster: PropTypes.string.isRequired,
  play: PropTypes.bool,
  position: PropTypes.number
};

export default Video;
