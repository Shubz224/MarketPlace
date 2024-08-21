const Loader = () => {
  return <div>Loading... </div>;
};

export default Loader;

interface SkeletonProps {
  width?: string;
  length?: number;
  height?: string;
  containerHeight?: string;
}

export const Skeleton = ({
  width = "unset",
  length = 3,
  height = "30px",
  containerHeight = "unset",
}: SkeletonProps) => {
  const skeletions = Array.from({ length }, (_, idx) => (
    <div key={idx} className="skeleton-shape" style={{ height }}></div>
  ));

  return (
    <div className="skeleton-loader" style={{ width, height: containerHeight }}>
      {skeletions}
    </div>
  );
};
