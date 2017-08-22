var elementtolook="";
var tag="";
var localdataurl="";
var templist=[];
var listnames=[];

function gettagline(argu,name) {
    if (argu.endsWith("</") && argu.indexOf("<"+elementtolook)!==-1) {
       var codetoadd="<"+tag+argu.split("<"+tag)[argu.split("<"+tag).length-1]+tag+">";
       document.getElementById("HTMLelements").innerHTML=document.getElementById("HTMLelements").innerHTML+name+": "+codetoadd+",<br>";
       document.getElementById("TextElements").innerText=document.getElementById("TextElements").innerText+codetoadd;
    }
}

function readlocaldata(code) {
	var xhr=new XMLHttpRequest();
	xhr.open("GET",localdataurl, true);
	xhr.onreadystatechange=function() {
		if (xhr.readyState===4) {
			var data=xhr.responseText;
			data=data.replace('"','');
			templist=data.split("_");
			data=""
			templist.pop();
			for (i=0;i<templist.length;i++) {
				templist[i]=templist[i].split("-");
			}
			for (i=0;i<templist.length;i++) {
				listnames.push(templist[i][0]);
				data=data+templist[i][0]+": "+templist[i][1]+", ";
			}
			data=data.slice(0,-2);
			document.getElementById("Local").innerText=data;
			openhtml(code);
			comparedata();
		}
	}
	xhr.send();
}

function openhtml(arg) {
	for (i=0;i<listnames.length;i++) {
		if (arg.includes(listnames[i])) {
			var codepart=arg.split(">"+listnames[i]+"<")[1];
			if (codepart.length>1) {
				gettagline(codepart.split(tag+">")[0],listnames[i]);
			}
		}
	}
}

function comparedata() {
	var datatocheck=document.getElementById("HTMLelements").innerText;
	var datalocal=document.getElementById("Local").innerText;
	var dataserver=datalocal.split(", ");
	var totalsimilardata="";
	var totaldifferentdata="";
	for (var i=0;i<dataserver.length;i++) {
		if (datatocheck.indexOf(dataserver[i])!==-1) {
			totalsimilardata+=dataserver[i]+", ";
		} else {
			totaldifferentdata+=dataserver[i]+", ";
		}
	}
	totalsimilardata=totalsimilardata.slice(0,-2);
	totaldifferentdata=totaldifferentdata.slice(0,-2);
	document.getElementById("Similar").innerText=document.getElementById("Similar").innerText+totalsimilardata;
	document.getElementById("Different").innerText=document.getElementById("Different").innerText+totaldifferentdata;
}

document.addEventListener("DOMContentLoaded",function() {
	document.getElementById("save").addEventListener("click",function() {
		elementtolook=document.getElementById("tag").value;
		tag=elementtolook.split(" ")[0];
		localdataurl=document.getElementById("url").value;
		var elim=document.getElementById("save");
		elim.parentNode.removeChild(elim);
		chrome.tabs.query({active: true,currentWindow: true},function(tabs) {
     		chrome.tabs.executeScript(tabs[0].id,{file: "content_script.js"},function() {
         		chrome.tabs.sendMessage(tabs[0].id,{request: "code please"},function(response) {
	     			var htmlcode=response.html;
					readlocaldata(htmlcode);
         		});
     		});
		});
	});
});