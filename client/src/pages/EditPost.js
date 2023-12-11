import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [file, setFile] = useState(null);
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/post/'+id)
      .then(response => {
        response.json().then(postInfo => {
          setTitle(postInfo.title);
          setContent(postInfo.content);
          setSummary(postInfo.summary);
        });
      });
  }, [id]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (file) {
      const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "t53wj7bi");
    formData.append("cloud_name", "toyesh");
    formData.append('api_key', "959387661847641");

      const response = await fetch("https://api.cloudinary.com/v1_1/t53wj7bi/image/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const fileData = await response.json();
        const imageUrl = fileData.secure_url;
        console.log({ title, summary, content, imageUrl });

        
      data.set('imageUrl', imageUrl);
      
    }
    }
    
    const putresponse = await fetch('http://localhost:4000/post', {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    if (putresponse.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form onSubmit={updatePost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
         <input
        type="file"
        onChange={ev => setFile(ev.target.files[0])}
      />
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px'}}>Update post</button>
    </form>
  );
}

