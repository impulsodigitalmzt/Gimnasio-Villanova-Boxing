Add-Type -AssemblyName PresentationCore
$files = Get-ChildItem 'C:\Pagina Gimnasio Crow\crow-fitness-club\public\videos\hero' -Filter *.mp4
foreach ($f in $files) {
  $p = New-Object System.Windows.Media.MediaPlayer
  $p.Open([Uri]$f.FullName)
  $tries = 0
  while (-not $p.NaturalDuration.HasTimeSpan -and $tries -lt 20) {
    Start-Sleep -Milliseconds 250
    $tries++
  }
  Write-Output ('{0} => {1}x{2}, {3}s' -f $f.Name.Substring(0,10), $p.NaturalVideoWidth, $p.NaturalVideoHeight, [math]::Round($p.NaturalDuration.TimeSpan.TotalSeconds,1))
  $p.Close()
}
