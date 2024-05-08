type HeadingType = {
  children: string;
};

const Heading = ({ children }: HeadingType) => {
  return <h6 className=" text-2xl font-semibold">{children}</h6>;
};

export default Heading;
