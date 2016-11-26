<?php

if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    die("Upload failed with error " . $_FILES['file']['error']);
}
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $_FILES['file']['tmp_name']);
$ok = false;
switch ($mime) {
   case 'application/pdf':
        $ok = true;
   default:
       die("Unknown/not permitted file type. Please select a PDF document.");
}

if (file_exists("upload/" . $_FILES["file"]["name"])) {
  echo $_FILES["file"]["name"] . " already exists. ";
}

else {
  move_uploaded_file($_FILES["file"]["tmp_name"],
  "upload/" . $_FILES["file"]["name"]);
  echo "Stored in: " . "upload/" . $_FILES["file"]["name"];
}
