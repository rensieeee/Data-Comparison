function Invoke-Sql {
    
    param(
        [string] $dataSource,
        [string] $database,
        [string] $sqlCommand,
        [System.Management.Automation.PsCredential] $credential
    )

    $authentication = "Integrated Security=SSPI;"

    if ($credential) {
        $plainCred = $credential.GetNetworkCredential()
        $authentication = 
        ("uid={0};pwd={1};" -f $plainCred.Username, $plainCred.Password)
    }

    $connectionString = "Provider=sqloledb; " + 
    "Data Source=$dataSource; " + 
    "Initial Catalog=$database; " + 
    "$authentication; "

    $connection = New-Object System.Data.OleDb.OleDbConnection $connectionString
    $command = New-Object System.Data.OleDb.OleDbCommand $sqlCommand, $connection
    $connection.Open()

    $adapter = New-Object System.Data.OleDb.OleDbDataAdapter $command
    $dataset = New-Object System.Data.DataSet
    [void] $adapter.Fill($dataSet)
    $connection.Close()

    $dataSet.Tables | Select-Object -Expand Rows
}

$uid = 'Adminusername'
$pwd = 'AdminPassword'

$securePassword = $pwd | ConvertTo-SecureString -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential -ArgumentList $uid, $securePassword

$sqlcommand="Sqlquery"

$data=Invoke-Sql `
    -datasource "azureservername.database.windows.net" `
    -database "azuredatabasename" `
    -credential $cred `
    -sqlcommand $sqlcommand

$datanamelist=($data | gm | where {$_.MemberType -eq "Property"} | select -expandproperty Name) -split "  "
$endstr=""
ForEach ($item in $datanamelist) {
    $endstr=$endstr+$item+"-"
    $valuetoadd=($data | select -ExpandProperty $item)
    $endstr=$endstr+$valuetoadd+"_"
}

out-file -encoding Ascii -FilePath $res -Inputobject ($endstr)