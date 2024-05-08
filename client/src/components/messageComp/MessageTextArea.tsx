import TextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

type Props =  TextareaAutosizeProps;

const MessageTextArea = (props: Props ) => {
  return (
    <TextareaAutosize
        placeholder="Start typing..."
        maxRows={6} // Maximum number of rows to grow
        // style={{ maxHeight: "200px" }} // Optional: Set a maximum height
      {...props}
    />
  );
};

export default MessageTextArea;
