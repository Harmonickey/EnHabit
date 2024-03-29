<?php
    session_start();
    
    if (isset($_SESSION["admin"]))
    {
        header("Location: /admin/", FALSE);
    }
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Login :: Admin</title>

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes"> 
    
    <!-- favicon -->
    <link rel="icon" type="image/jpg" href="../favicon.png">
    
	<link href="../Libraries/Styles/bootstrap.min.css" rel="stylesheet" type="text/css" />
	<link href="../Libraries/Styles/bootstrap-responsive.min.css" rel="stylesheet" type="text/css" />
	
	<link href="../Libraries/Styles/font-awesome.min.css" rel="stylesheet">
    <link href="//fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,400,600" rel="stylesheet">
    
    <link href="../Libraries/Styles/jquery-ui-1.10.0.custom.min.css" rel="stylesheet">    
    
    <link href="../Libraries/Styles/base-admin-3.css" rel="stylesheet">
    <link href="../Libraries/Styles/base-admin-3-responsive.css" rel="stylesheet">
	
    <link href="../Libraries/Styles/signin.css" rel="stylesheet" type="text/css">

    <link href="../Styles/admin/custom.css" rel="stylesheet">

</head>

<body>
	
<nav class="navbar navbar-inverse" role="navigation">

	<div class="container">
  <!-- Brand and toggle get grouped for better mobile display -->
  <div class="navbar-header">
    <a class="logo" href="/"><img src='/assets/images/theme_images/EnhabitLogo_Beta.png' height="56"/></a>
  </div>
</div> <!-- /.container -->
</nav>

<div class="account-container stacked">
	<div class="content clearfix">
			<h1>Sign In</h1>		
			<div class="login-fields">
				<p>Welcome - Please Sign In:</p>
				<div class="field">
					<label for="username">Username:</label>
					<input type="text" id="username" name="username" value="" placeholder="Username" class="form-control input-lg username-field" />
				</div> <!-- /field -->
				<div class="field">
					<label for="password">Password:</label>
					<input type="password" id="password" name="password" value="" placeholder="Password" class="form-control input-lg password-field"/>
				</div> <!-- /password -->
			</div> <!-- /login-fields -->
			<div class="login-actions">
				<button class="login-action btn btn-primary btn-success" onclick="Login()">Sign In</button>
			</div> <!-- .actions -->
            <p class="login-error alert alert-danger" style="display: none;"></p>
	</div> <!-- /content -->
</div> <!-- /account-container -->

<!-- Le javascript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="../Libraries/Javascript/jquery-1.9.1.min.js"></script>
<script src="../Libraries/Javascript/jquery-ui-1.10.0.custom.min.js"></script>
<script src="../Libraries/Javascript/bootstrap.min.js"></script>

<script src="../Javascript/admin/functions.js"></script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-64824617-1', 'auto');
  ga('send', 'pageview');

</script>

</body>
</html>
