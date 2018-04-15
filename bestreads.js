//Name: Mayank Kathuria
//Student Number: 1534791
//Use Ajax to fetch data in text, XML and JSON formats and display the initial page with all
//the books or descriptive information about the selected book
(function(){

	"use strict";
  	
  	//calls the function to display the initial page when the page loads or an event takes place
	window.onload = function(){
		requestInitialPage();
		document.getElementById("back").onclick = requestInitialPage;
	};

	//throws an ajax request to get the content of the initial page 
	function requestInitialPage(){
		document.getElementById("allbooks").innerHTML = "";
		document.getElementById("singlebook").style.display = "none";

		ajaxRequest("bestreads.php?mode=books",displayInitialPage);
	}

	//displays the initial page 
	function displayInitialPage(){
		var node = this.responseXML;
		var titleAll = node.querySelectorAll("title");
		var folderAll = node.querySelectorAll("folder");
		var length = titleAll.length;

		for(var i = 0; i < length; i++){
			var div = document.createElement("div");
			var img = document.createElement("img");
			img.src = "books/" + folderAll[i].textContent + "/cover.jpg";
			img.value = folderAll[i].textContent;
			img.onclick = requestSingleBook;
			div.appendChild(img);
			
			var p = document.createElement("p");
			p.innerHTML = titleAll[i].textContent;
			p.value = folderAll[i].textContent;
			p.onclick = requestSingleBook;
			div.appendChild(p);
			document.getElementById("allbooks").appendChild(div);
		}
	}

	//throws an ajax request to get the contents of the selected book
	function requestSingleBook(){
		document.getElementById("allbooks").innerHTML = "";
		document.getElementById("singlebook").style.display = "";
		var title = this.value; 
		
		var cover = document.getElementById("cover");
		cover.src = "books/" + title + "/cover.jpg";

		ajaxRequest("bestreads.php?mode=info&title=" + title, displayInfo);
		ajaxRequest("bestreads.php?mode=description&title=" + title, displayDescription);
		ajaxRequest("bestreads.php?mode=reviews&title=" + title, displayReviews);
		
	}

	//display the information of the selected book such as its title, author and stars
	function displayInfo(){
		var data = JSON.parse(this.responseText);
		document.getElementById("title").innerHTML = data.title;
		document.getElementById("author").innerHTML = data.author;
		document.getElementById("stars").innerHTML = data.stars;
	}

	//displays the description of the selected book
	function displayDescription(){
		document.getElementById("description").innerHTML = this.responseText;
	}

	//displays the reviews of the selected book
	function displayReviews(){
		document.getElementById("reviews").innerHTML = this.responseText;
	}

	//throws an ajax request to the passed url and calls the passed function 
	function ajaxRequest(url, functionCall){
		var ajax = new XMLHttpRequest();
		ajax.onload = functionCall;
		ajax.open("GET", url , true);
		ajax.send();
	}
})();

