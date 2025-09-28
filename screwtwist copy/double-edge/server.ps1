# Simple PowerShell HTTP Server
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8081/")
$listener.Start()

Write-Host "Server started at http://localhost:8081/"
Write-Host "Press Ctrl+C to stop the server"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $path = $request.Url.LocalPath
    if ($path -eq "/") { $path = "/main.html" }
    
    $filePath = Join-Path (Get-Location) ($path.TrimStart('/'))
    
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $content.Length
        
        # Set content type based on file extension
        $extension = [System.IO.Path]::GetExtension($filePath)
        switch ($extension) {
            ".html" { $response.ContentType = "text/html" }
            ".js" { $response.ContentType = "application/javascript" }
            ".css" { $response.ContentType = "text/css" }
            ".png" { $response.ContentType = "image/png" }
            default { $response.ContentType = "application/octet-stream" }
        }
        
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("File not found")
        $response.ContentLength64 = $notFound.Length
        $response.OutputStream.Write($notFound, 0, $notFound.Length)
    }
    
    $response.Close()
}

$listener.Stop()