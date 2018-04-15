<?php
	#To make web services to generate a variety of data about different books and allow Ajax to
	#retrieve it
	$mode = $_GET["mode"];
	$title = $_GET["title"];
	
	#calls the function if the mode is books
	if($mode == "books"){ 
		getInitialPage();
	}
	
	#calls the function if the mode is info
	if($mode == "info"){
		getInfo($title);
	}

	#calls the function if the mode is description
	if($mode == "description"){
		getDescription($title);
	}

	#calls the function if the mode is reviews
	if($mode == "reviews"){
		getReviews($title);
	}

	#get the contents of the initial page and print it as XML 
	function getInitialPage(){
		$allBooks = glob("books/*");
		
		$xmldoc = new DOMDocument();
		$books_tag = $xmldoc -> createElement("books");
		for($i = 0; $i < count($allBooks); $i++){
			$infoContent = file("$allBooks[$i]/info.txt");
			$title = $infoContent[0];
			$folder = explode("/",$allBooks[$i]);
			
			$book_tag = $xmldoc -> createElement("book");
			$title_tag = $xmldoc -> createElement("title");
			$title_tag -> appendChild($xmldoc -> createTextNode($title));
			$book_tag -> appendChild($title_tag);
			$folder_tag = $xmldoc -> createElement("folder");
			$folder_tag -> appendChild($xmldoc -> createTextNode($folder[1]));
			$book_tag -> appendChild($folder_tag);
			$books_tag -> appendChild($book_tag);
		}
		$xmldoc -> appendChild($books_tag);
		header("Content-type: text/xml");
		print $xmldoc -> saveXML();
	}

	#get the information of the selected books and print it as JSON
	function getInfo($title){
		list($titleBook,$author,$stars) = file("books/$title/info.txt", FILE_IGNORE_NEW_LINES);
		$data= array(
			"title" => $titleBook ,
			"author" => $author ,
			"stars" => $stars ,
		);
		header("Content-type: application/json");
		print json_encode($data);
	}

	#get the description of the selected book and print it as a plain text
	function getDescription($title){
		$description = file_get_contents("books/$title/description.txt");
		header("Content-type: text/plain");
		print $description;
	}

	#get the reviews of the selected book and print it as html
	function getReviews($title){
		header("Content-type: text/html");
		$reviews = glob("books/$title/review*.txt");
		for($i=0 ; $i<count($reviews); $i++){
			$text = file($reviews[$i]);?>
			<h3><?= $text[0] ?><span><?= $text[1]?></span></h3>
			<p><?= $text[2] ?></p>
	<?php }
}?>
