const GradientBlur = ({ style = {}, className = '' }) => {
  return (
    <div
      className={className}
      style={{ ...styles.container, ...style }} // Allows overriding height/position
    >
      {/* Layer 1 */}
      <div style={{ ...styles.layer, ...styles.layer1 }} />

      {/* Layer 2 */}
      <div style={{ ...styles.layer, ...styles.layer2 }} />
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
    left: 0,
    bottom: 0,
    pointerEvents: 'none',
    height: '12rem',
  },
  layer: {
    position: 'absolute',
    inset: 0, // Shorthand for top:0, right:0, bottom:0, left:0
  },
  layer1: {
    zIndex: 6,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)', // Safari Support
    maskImage:
      'linear-gradient(to top, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 0) 100%)',
    WebkitMaskImage:
      'linear-gradient(to top, rgba(0, 0, 0, 1) 5%, rgba(0, 0, 0, 0) 100%)',
  },
  layer2: {
    zIndex: 7,
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
    maskImage:
      'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)',
    WebkitMaskImage:
      'linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)',
  },
};

export default GradientBlur;
