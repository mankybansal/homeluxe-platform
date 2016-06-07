<?php

	$name = $_GET['name'];
	$email = $_GET['email'];
	$phone = $_GET['phone'];

	$file = 'contacts.txt';
    $current = file_get_contents($file);
    $current .= $name."\n".$email."\n".$phone."\n\n\n";
    file_put_contents($file, $current);
?>