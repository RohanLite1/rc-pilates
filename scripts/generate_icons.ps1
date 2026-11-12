Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(512, 512)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

# Background: Rich Serene Deep Emerald
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#163323'))
$g.FillRectangle($bgBrush, 0, 0, 512, 512)

# Subtle outer gold/linen ring
$goldPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#C4A97D'), 6)
$g.DrawEllipse($goldPen, 36, 36, 440, 440)

# Inner delicate thin ring
$innerPen = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml('#2D4C38'), 2)
$g.DrawEllipse($innerPen, 50, 50, 412, 412)

# Text format center
$format = New-Object System.Drawing.StringFormat
$format.Alignment = [System.Drawing.StringAlignment]::Center
$format.LineAlignment = [System.Drawing.StringAlignment]::Center

# Center letters RC
$font = New-Object System.Drawing.Font('Georgia', 140, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#FAF8F5'))
$g.DrawString('RC', $font, $textBrush, 256, 215, $format)

# Subtitle PILATES
$subFont = New-Object System.Drawing.Font('Arial', 32, [System.Drawing.FontStyle]::Bold)
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#C4A97D'))
$g.DrawString('PILATES', $subFont, $subBrush, 256, 365, $format)

# Small studio dot
$dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#C4A97D'))
$g.FillEllipse($dotBrush, 252, 400, 8, 8)

$g.Dispose()

# Save icons in public
if (!(Test-Path -Path 'public')) {
    New-Item -ItemType Directory -Path 'public'
}

$bmp.Save('public\apple-touch-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('public\pwa-icon-512.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('public\pwa-icon-192.png', [System.Drawing.Imaging.ImageFormat]::Png)

$bmp.Dispose()
Write-Host "Icons generated successfully in public directory!"

