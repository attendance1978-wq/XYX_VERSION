// List of XYZ files (treated as ZIP)
const xyzFiles = [
  "files/repo1.xyz",
  "files/repo2.xyz"
];

const fileList = document.getElementById('fileList');
const fileContents = document.getElementById('fileContents');

// Display links
xyzFiles.forEach(file => {
  const fileName = file.split("/").pop();
  const li = document.createElement('li');
  li.innerHTML = `<a onclick="loadXYZ('${file}')">${fileName}</a>`;
  fileList.appendChild(li);
});

// Load XYZ (ZIP renamed) and display contents
function loadXYZ(url) {
  fileContents.innerHTML = "Loading...";
  
  fetch(url)
    .then(res => res.arrayBuffer())
    .then(data => JSZip.loadAsync(data))
    .then(zip => {
      fileContents.innerHTML = "";
      const files = Object.keys(zip.files).sort();
      const tree = buildTree(files);
      displayTree(tree, fileContents);
    })
    .catch(err => {
      fileContents.innerHTML = "Failed to load XYZ: " + err;
    });
}

// Convert flat list to tree
function buildTree(files) {
  const root = {};
  files.forEach(f => {
    const parts = f.split('/');
    let current = root;
    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = (index === parts.length - 1) ? null : {};
      }
      current = current[part];
    });
  });
  return root;
}

// Display tree recursively
function displayTree(node, container) {
  Object.keys(node).forEach(key => {
    const div = document.createElement('div');
    if (node[key] === null) {
      div.textContent = key;
      div.className = 'file';
    } else {
      div.textContent = key;
      div.className = 'folder';
      displayTree(node[key], div);
    }
    container.appendChild(div);
  });
}
