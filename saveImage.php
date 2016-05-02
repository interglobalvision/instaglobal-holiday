<?php
$newpath = "bg.jpg";
$data = file_get_contents($_POST['image']);
file_put_contents($newpath, $data);
?>