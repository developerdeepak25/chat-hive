import  { SVGProps } from 'react'

const AddIcon = ({ height = "10" }: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      //   width="10"
      height={height}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.761719 5.60547H4.39453V9.23828C4.39453 9.5722 4.66608 9.84375 5 9.84375C5.33392 9.84375 5.60547 9.5722 5.60547 9.23828V5.60547H9.23828C9.5722 5.60547 9.84375 5.33392 9.84375 5C9.84375 4.66608 9.5722 4.39453 9.23828 4.39453H5.60547V0.761719C5.60547 0.4278 5.33392 0.15625 5 0.15625C4.66608 0.15625 4.39453 0.4278 4.39453 0.761719V4.39453H0.761719C0.4278 4.39453 0.15625 4.66608 0.15625 5C0.15625 5.33392 0.4278 5.60547 0.761719 5.60547Z"
        fill="white"
      />
    </svg>
  );
};

export default AddIcon