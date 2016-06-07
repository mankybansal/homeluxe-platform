<?php

    $name = $_GET['name'];
    $email = $_GET['email'];
    $phone = $_GET['phone'];
    $message = $_GET['message'];

require_once 'mandrill-master/src/Mandrill.php'; //Not required with Composer

try {
    $mandrill = new Mandrill('LhA0hFaZZCV7_xU3lDcgrA');
    $message = array(
        'html' => '<p>Hi, someone wants to get in touch. Contact details are:<br>
				    Name: <b>'.$name.'</b><br>
					Email: <b>'.$email.'</b><br>
					Phone: <b>'.$phone.'</b><br><br>
					Message: <b>'.$message.'</b><br><br>
					Please try to get back to this person as soon as possible!<br><br>
					Regards,<br>
					<b>Web Admin</b>
				   </p>',
        'subject' => 'New Contact Information',
        'from_email' => 'postman@homeluxe.in',
        'from_name' => 'HomeLuxe.in',
        'to' => array(

			array(
                'email' => 'info@homeluxe.in',
                'name' => 'HomeLuxe.in Info',
                'type' => 'to'
            )
        ),
    );

    $result = $mandrill->messages->send($message);

	$file1 = 'logs.txt';
	$current1 = file_get_contents($file1);
	$current1 .= print_r($result,true)."\n\n\n";
	file_put_contents($file1, $current1);

} catch(Mandrill_Error $e) {
    // Mandrill errors are thrown as exceptions
    echo 'A mandrill error occurred: ' . get_class($e) . ' - ' . $e->getMessage();
    // A mandrill error occurred: Mandrill_Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    throw $e;
}


?>
