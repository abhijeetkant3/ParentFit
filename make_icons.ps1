Add-Type -AssemblyName System.Drawing
$sizes = @(192, 512)
foreach ($s in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap($s, $s)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::FromArgb(249, 250, 251))
    
    # Background rounded rect
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $r = 32 * ($s / 192)
    $p.AddArc(0, 0, $r*2, $r*2, 180, 90)
    $p.AddArc($s - $r*2, 0, $r*2, $r*2, 270, 90)
    $p.AddArc($s - $r*2, $s - $r*2, $r*2, $r*2, 0, 90)
    $p.AddArc(0, $s - $r*2, $r*2, $r*2, 90, 90)
    $p.CloseFigure()
    
    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(76, 175, 80))
    $g.FillPath($bgBrush, $p)
    
    # White Text "FitMom"
    $font = New-Object System.Drawing.Font('Arial', [float]($s * 0.22), [System.Drawing.FontStyle]::Bold)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, 0, $s, $s)
    $g.DrawString("FitMom", $font, $whiteBrush, $rect, $sf)
    
    $bmp.Save("assets/icons/icon-$s.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $g.Dispose()
}
Write-Host "Icons generated successfully!"
