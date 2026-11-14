Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\bigma\.gemini\antigravity\brain\da7435cf-cbcb-42a2-8a0f-7acde03939bf\.user_uploaded\media_1794638014467_0fb18c59.jpg"
if (!(Test-Path -Path $srcPath)) {
    Write-Error "Source image not found at $srcPath"
    exit 1
}

$srcImg = [System.Drawing.Image]::FromFile($srcPath)

function Resize-And-Save($targetWidth, $targetHeight, $outPath, $format) {
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetWidth, $targetHeight)
    $destImage = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $destImage.SetResolution($srcImg.HorizontalResolution, $srcImg.VerticalResolution)

    $graphics = [System.Drawing.Graphics]::FromImage($destImage)
    $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $wrapMode = New-Object System.Drawing.Imaging.ImageAttributes
    $wrapMode.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
    $graphics.DrawImage($srcImg, $destRect, 0, 0, $srcImg.Width, $srcImg.Height, [System.Drawing.GraphicsUnit]::Pixel, $wrapMode)

    $graphics.Dispose()
    $destImage.Save($outPath, $format)
    $destImage.Dispose()
    Write-Host "Saved: $outPath ($targetWidth x $targetHeight)"
}

# 1. Update public web assets
Resize-And-Save 512 512 "public\logo.png" ([System.Drawing.Imaging.ImageFormat]::Png)
Resize-And-Save 512 512 "public\logo-transparent.png" ([System.Drawing.Imaging.ImageFormat]::Png)
Resize-And-Save 512 512 "public\pwa-icon-512.png" ([System.Drawing.Imaging.ImageFormat]::Png)
Resize-And-Save 192 192 "public\pwa-icon-192.png" ([System.Drawing.Imaging.ImageFormat]::Png)
Resize-And-Save 180 180 "public\apple-touch-icon.png" ([System.Drawing.Imaging.ImageFormat]::Png)
Resize-And-Save 64 64 "public\favicon.png" ([System.Drawing.Imaging.ImageFormat]::Png)

# 2. Update Android launcher mipmap drawables
$androidMipmaps = @{
    "android\app\src\main\res\mipmap-mdpi" = 48
    "android\app\src\main\res\mipmap-hdpi" = 72
    "android\app\src\main\res\mipmap-xhdpi" = 96
    "android\app\src\main\res\mipmap-xxhdpi" = 144
    "android\app\src\main\res\mipmap-xxxhdpi" = 192
}

foreach ($folder in $androidMipmaps.Keys) {
    $size = $androidMipmaps[$folder]
    if (Test-Path -Path $folder) {
        Resize-And-Save $size $size "$folder\ic_launcher.png" ([System.Drawing.Imaging.ImageFormat]::Png)
        Resize-And-Save $size $size "$folder\ic_launcher_round.png" ([System.Drawing.Imaging.ImageFormat]::Png)
        Resize-And-Save $size $size "$folder\ic_launcher_foreground.png" ([System.Drawing.Imaging.ImageFormat]::Png)
    }
}

$srcImg.Dispose()
Write-Host "All app logos and Android icons successfully updated!"

