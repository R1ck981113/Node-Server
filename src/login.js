document.getElementById('uploadButton').addEventListener('click', function() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0]; // 获取选中的文件
  console.log('filechoose',file);
  if (file) {
      const formData = new FormData();
      formData.append('file', file); // 添加文件到 FormData 对象

      fetch('http://localhost:3060/upload', { // 替换为你的上传接口 URL
          method: 'POST',
          body: formData
      })
      .then(data => console.log(data))
      .catch(error => console.error('上传失败:', error));
  } else {
      console.log('请选择一个文件');
  }
});