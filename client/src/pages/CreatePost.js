import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null); 
  const [redirect, setRedirect] = useState(false);
  const username = localStorage.getItem('username');

  async function createNewPost(ev) {
    ev.preventDefault();

    if (!title || !summary || !content || !file || !username) {
      return;
    }

    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "t53wj7bi");
    formData.append("cloud_name", "toyesh");
    formData.append('api_key', "959387661847641");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/t53wj7bi/image/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const fileData = await response.json();
        const imageUrl = fileData.secure_url;
        console.log({ title, summary, content, imageUrl });

        
        const postData = {
          title,
          summary,
          content,
          imageUrl,
        };

        const postResponse = await fetch('http://localhost:4000/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
          credentials: 'include',
        });

        if (postResponse.ok) {
          setRedirect(true);
        }
      } else {
        console.log("Error uploading the file to Cloudinary.");
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  const isButtonDisabled = !title || !summary || !content || !file || !username;

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text" // Use type 'text' for input fields
        placeholder={'Title'}
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <input
        type="text" // Use type 'text' for input fields
        placeholder={'Summary'}
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
      />
      <input
        type="file"
        onChange={ev => setFile(ev.target.files[0])}
      />
      <Editor value={content} onChange={setContent} />
      <button
        style={{ marginTop: '5px' }}
        disabled={isButtonDisabled}
      >
        Create post
      </button>
    </form>
  );
}
