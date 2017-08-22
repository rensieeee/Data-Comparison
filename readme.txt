The following project is an extension for Google Chrome, which allows you to search for values in an azure database, and compare them with values in a webpage.
Open the desired webpage, and enter as many details as possible in the "tag" tab. Then enter the URL to the Azure function running the serversidescript, and click "Search Data".
A content script will be injected into the desired page, sending the source code of the page back to the main popup.js. In popup.js the source code is analysed,
and the desired elements are extracted and put up for display on the popup.html page. In the meantime, an HTTP request is sent to the Azure server,
which will send query back to the popup.js. The values between datasources are compared, and similarities and differences are put up for display on the popup.html.

--------------------------------Building the Azure function--------------------------------
1. Make an HTTP triggered powershell function with both a req and a res.
2. Copy-pase the serverside script code into the function code.
3. If you haven't done already, create an Azure database.
4. In the Azure Function, edit the $uid and $pwd variable according to the admin credentials of the desired Azure database
5. Edit the $sqlcommand variable with the desired SQL query. NOTE: THE QUERY MUST REMAIN A SINGLE STRING
6. Edit the datasource with the url of the desired databaseserver, which is <servername>.database.windows.net
7. Edit the database with the name of the desired database
8. Save the script

PLEASE NOTE: I did not create lines 1-47 of the serverside script. It was originally created by Lee Holmes (http://www.leeholmes.com/guide) (thanks, Lee!!)