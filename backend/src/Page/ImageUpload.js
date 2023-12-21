import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageChange = (e) => {
    const files = e.target.files;
    setSelectedImages(files);

    // Generate image previews for selected files
    const previews = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();

    for (const image of selectedImages) {
      formData.append('images[]', image);
    }

    try {
      const response = await axios.post('http://localhost/Accident/api/location.php/?xCase=6', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        },
      });

      // Handle the response from the server
      console.log(response.data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <input type="file" multiple onChange={handleImageChange} />
      <div className="image-previews">
        {imagePreviews.map((preview, index) => (
          <img key={index} src={preview} alt={`Preview ${index + 1}`} style={{width:"100px"}}/>
        ))}
      </div>
      <button onClick={handleUpload}>Upload</button>
      <progress value={uploadProgress} max="100" />
    </div>
  );
}

export default ImageUpload;
