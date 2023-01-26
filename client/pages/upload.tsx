//@ts-nocheck
import { FormEventHandler, useState } from "react";
import axios from "axios";
import { useAddImageMutation } from "../generated/graphql";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [addImage] = useAddImageMutation();

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event) => {
    const body = new FormData();
    body.append("media", image);
    await fetch("http://localhost:3001/graphql", {
      method: "POST",
      body,
      headers: {
        "content-type": "multipart/form-data",
      },
      
    });
    // const response = await fetch("http://localhost:3001/media", {
    //   method: "POST",
    //   body,
    // });
  };
  // const [file, setFile] = useState<any>();

  // function handleChange(event: any) {
  //   setFile(event.target.files[0]);
  // }

  // async function handleSubmit(event: any) {
  //   event.preventDefault();
  //   const formData:any = new FormData();
  //   formData.append("media", file);

  //   await fetch("http://localhost:3001/media", {
  //     method: "POST",
  //     body: formData,
  //     headers: {
  //       "content-type": "multipart/form-data",
  //     },
  //   });
  // }

  return (
    <div>
      <div>
        <img src={createObjectURL} />
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Send to server
        </button>
      </div>
    </div>
  );
};

export default Upload;
