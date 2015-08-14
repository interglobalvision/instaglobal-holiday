<?php
if (isset($_POST['image'])) {
	// Get the data
	$imageData=$_POST['image'];

	// Remove the headers (data:,) part.
	// A real application should use them according to needs such as to check image type
	$filteredData=substr($imageData, strpos($imageData, ",")+1);

	// Need to decode before saving since the data we received is already base64 encoded
	$decodedData=base64_decode($filteredData);

  // Create image with Imagemagick
  $im = new Imagick();
  $im->readimageblob($decodedData);
  $im->setImageFormat('jpeg');
  $im->setImageCompressionQuality(100);

	// Save file. This example uses a hard coded filename for testing,
	// but a real application can specify filename in POST variable
	$filename = time() . '.jpg';

  $im->writeImage('img/' . $filename); // . $filename);
	echo $filename;

} else {
	echo 'post data empty';
}
?>
